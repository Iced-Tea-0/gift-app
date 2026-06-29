import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `ABSOLUTE RULE: You must NEVER output raw JSON in your messages. All JSON must be wrapped in <search></search> tags. If you output raw JSON without these tags the entire app breaks. This is a hard requirement with no exceptions.

You are Amoris, a warm and witty gift advisor. Your job is to find the perfect gift through a short, fun conversation.

Ask these questions ONE AT A TIME in this exact order:
1. "Who is this gift for?" (relationship) give suggestions
2. "What do they do?" (job/student/etc) give suggestions
3. "How old are they?" 
4. "What currency are you shopping in?" (INR, USD, GBP, etc) give suggestions
5. "What's your budget?" (get a number)
6. "Tell me a bit about their personality or interests — what do they love?" (hobbies, vibe) give suggestions

Rules:
- if the first input starts off with exactly 'yoo' reply to them with the black slang through out the conversation.
- One question per message, no exceptions
- Keep replies SHORT — 1-2 sentences max before asking the next question
- Be warm and witty but concise — no long paragraphs
- Do NOT ask multiple questions at once
- Do NOT summarize what the user said back to them
- NEVER generate the search block until the user has answered question 7. No exceptions.
- If the relationship makes gender obvious (mom, dad, sister, brother, wife, husband, boyfriend, girlfriend), skip the gender question entirely and move to the next one. Dont mention the skip, just skip
Map currency to country code: INR → IN, GBP → GB, USD → US, EUR → DE, CAD → CA, AUD → AU

When you have all 7 answers, you MUST end your message with exactly this format:

<search>
{"budget": NUMBER, "min_budget": NUMBER, "country": "CODE", "queries": [{"interest": "WORD", "query": "SEARCH PHRASE"}, {"interest": "WORD", "query": "SEARCH PHRASE"}, {"interest": "WORD", "query": "SEARCH PHRASE"}, {"interest": "WORD", "query": "SEARCH PHRASE"}]}
</search>

The <search> tag must be on its own line. The closing </search> tag must be on its own line. Do not put anything after </search>.

After products are shown, ask: "Which of these feels right? Pick one or tell me what you liked about any of them and I'll find more like it."

If the user picks one or describes what they liked, generate a new search block with 5-6 queries focused on that specific product type.

Rules for queries:
- Map interests to ACTUAL giftable products
- Each query 4-6 words, specific and buyable
- Always use 4 queries on first search, 5-6 on follow-up
- Never use the interest word alone
- Set min_budget intelligently based on budget size
- If the relationship makes gender obvious (mom, dad, sister, brother, wife, husband, boyfriend, girlfriend), skip the gender question entirely and move to the next one. Dont mention the skip, just skip


Keep it fun, professional, keep it short.`;

async function searchProducts(query: string, budget: number, minBudget: number, country: string = "US") {
  const response = await fetch(
    `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&country=${country}`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com",
      },
    }
  );

  const data = await response.json();
  console.log(`RapidAPI response for "${query}":`, JSON.stringify(data).slice(0, 200));
  return (data.data?.products || [])
    .map((p: any) => ({
      title: (p.product_title || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"'),
      price: p.product_price || "",
      image: p.product_photo || "",
      url: p.product_url || "",
      rating: p.product_star_rating || "",
      numRatings: parseInt(p.product_num_ratings || "0"),
      interest: "",
    }))
    .filter((p: any) => {
      const price = parseFloat(p.price.replace(/[^0-9.]/g, ""));
      const rating = parseFloat(p.rating) || 0;
      return !isNaN(price) && price >= minBudget && price <= budget * 1.15 && rating >= 3;
    });
}

function scoreProduct(p: any, budget: number) {
  const price = parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0;
  const rating = parseFloat(p.rating) || 0;
  const numRatings = p.numRatings || 0;

  const priceFit = price > 0 ? 1 - Math.abs(budget - price) / budget : 0;
  const ratingScore = rating / 5;
  const popularityScore = Math.min(Math.log10(numRatings + 1) / 5, 1);

  return priceFit * 0.4 + ratingScore * 0.4 + popularityScore * 0.2;
}

export async function POST(req: NextRequest) {
  const { messages, country: userCountry = "US" } = await req.json();

  const completion = await groq.chat.completions.create({
   model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 600,
  });

  const reply = completion.choices[0].message.content || "";
  console.log("RAW REPLY:", reply);
  console.log("SEARCH MATCH:", reply.match(/<search>([\s\S]*?)<\/search>/));

  const searchMatch = reply.match(/<search>([\s\S]*?)<\/search>/);
  let products = null;

  if (searchMatch) {
    try {
      const { budget, queries, country = userCountry, min_budget: minBudget = 0 } = JSON.parse(searchMatch[1]);

      const results = [];
      for (const q of queries) {
        const items = await searchProducts(q.query, budget, minBudget, country);
        console.log(`Query: ${q.query} → ${items.length} results`);
        results.push(items.map((p: any) => ({ ...p, interest: q.interest })));
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay between calls
}

      const allProducts = results.flat();
      console.log("Total products before scoring:", allProducts.length);
      
      const scored = allProducts.map((p: any) => ({
        ...p,
        score: scoreProduct(p, budget),
      }));

      const byInterest: Record<string, any[]> = {};
      const seenTitles = new Set<string>();

      for (const p of scored) {
        const titleKey = p.title.toLowerCase().split(' ').slice(0, 4).join(' ');
        if (seenTitles.has(titleKey)) continue;
        seenTitles.add(titleKey);

        if (!byInterest[p.interest]) byInterest[p.interest] = [];
        if (byInterest[p.interest].length < 2) {
          byInterest[p.interest].push(p);
        }
      }

      for (const key of Object.keys(byInterest)) {
        byInterest[key].sort((a, b) => b.score - a.score);
      }

      const merged = Object.values(byInterest).flat();
      merged.sort((a, b) => b.score - a.score);

      products = merged.slice(0, 8).map(({ score, numRatings, ...p }) => p);
      console.log("Final products count:", products.length);
    } catch (e) {
      console.error("Search parse error:", e);
    }
  }

  const cleanReply = reply
    .replace(/<search>[\s\S]*?<\/search>/g, "")
    .replace(/\{[\s\S]*?"queries"[\s\S]*?\}/g, "")
    .replace(/\[[\s\S]*?"query"[\s\S]*?\]/g, "")
    .trim();
  
  const finalReply = cleanReply || "Here are some gift ideas I found for you!";
  return NextResponse.json({ reply: finalReply, products });    
}