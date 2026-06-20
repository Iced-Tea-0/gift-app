import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Giftem, a warm and creative gift advisor. Your only job is to help users find the perfect gift for someone they care about.

You chat naturally and ask questions one at a time to understand:
- Who the gift is for (relationship)
- The occasion
- The budget
- Their personality, hobbies, interests, and vibe

Once you have enough info (at least budget + 1-2 strong interests), respond with a special JSON block at the end of your message in this exact format:
<search>
{"query": "clean 3-5 word amazon search query", "budget": "number only"}
</search>

Only include the <search> block when you're confident enough to search. Keep the query short, specific, and giftable. Never include more than 2 interests in the query. Pick the most giftable ones.

Be warm, fun, and concise. Never ask more than one question at a time.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const reply = completion.choices[0].message.content;

  // Check if bot wants to search
  const searchMatch = reply?.match(/<search>([\s\S]*?)<\/search>/);
  let products = null;

  if (searchMatch) {
    const { query, budget } = JSON.parse(searchMatch[1]);

    const response = await fetch(
      `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&country=US`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
          "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com",
        },
      }
    );

    const data = await response.json();
    products = data.data?.products
      ?.filter((p: any) => {
        const price = parseFloat(p.product_price?.replace(/[^0-9.]/g, ""));
        return price <= parseFloat(budget) * 1.1;
      })
      .slice(0, 6)
      .map((p: any) => ({
        title: p.product_title,
        price: p.product_price,
        image: p.product_photo,
        url: p.product_url,
        rating: p.product_star_rating,
      }));
  }

  // Strip the <search> block from the reply before sending to frontend
  const cleanReply = reply?.replace(/<search>[\s\S]*?<\/search>/, "").trim();

  return NextResponse.json({ reply: cleanReply, products });
}