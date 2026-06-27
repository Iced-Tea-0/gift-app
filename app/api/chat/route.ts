import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Giftem, a warm and creative gift advisor. Your only job is to help users find the perfect gift for someone they care about.

Your FIRST question must always be: "Hi! What currency are you shopping in? (e.g. USD, INR, GBP)"

Then chat naturally and ask questions one at a time to understand:
- Who the gift is for (relationship)
- The occasion
- The budget (get a number)
- Their personality, hobbies, interests, and vibe

Map currency to country code: INR → IN, GBP → GB, USD → US, EUR → DE, CAD → CA, AUD → AU

Once you have currency + budget + at least 2 interests, respond with a JSON search block at the end of your message:

<search>
{
  "budget": 6000,
  "min_budget": 3500,
  "country": "IN",
  "queries": [
    {"interest": "makeup", "query": "premium makeup gift set women"},
    {"interest": "skincare", "query": "luxury skincare gift set women"}
  ]
}
</search>

Rules for queries:
- Map interests to ACTUAL giftable products (knitting → yarn kit, crochet hooks; drawing → sketchbook set, art supplies; cooking → spice set, cookbook)
- Each query should be 4-6 words, specific and buyable
- Max 4 queries
- Never use the interest word alone as the query — expand it into real product searches
- Always set country based on the currency the user gave you
- Set min_budget intelligently based on context — if budget is high, set a reasonable floor so results don't feel cheap. If user complains results are too cheap, raise min_budget on next search. If budget is low, set min_budget to 0.
- Only include the <search> block when confident. Keep chatting otherwise.

Be warm, professional, concise yet very entertaining and enthusiastic regarding the person's responses. One question at a time.`;

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

  const searchMatch = reply.match(/<search>([\s\S]*?)<\/search>/);
  let products = null;

  if (searchMatch) {
    try {
      const { budget, queries, country = userCountry, min_budget: minBudget = 0 } = JSON.parse(searchMatch[1]);

      const results = await Promise.all(
        queries.map(async (q: { interest: string; query: string }) => {
          const items = await searchProducts(q.query, budget, minBudget, country);
          return items.map((p: any) => ({ ...p, interest: q.interest }));
        })
      );

      const allProducts = results.flat();
      const scored = allProducts.map((p: any) => ({
        ...p,
        score: scoreProduct(p, budget),
      }));

      const byInterest: Record<string, any[]> = {};
      for (const p of scored) {
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

      products = merged.slice(0, 6).map(({ score, numRatings, ...p }) => p);
    } catch (e) {
      console.error("Search parse error:", e);
    }
  }

  const cleanReply = reply.replace(/<search>[\s\S]*?<\/search>/, "").trim();

  return NextResponse.json({ reply: cleanReply, products });
}