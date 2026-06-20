import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { occasion, budget, interests } = await req.json();

  const query = `${occasion} gift ${interests} under ${budget}`;

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

  const products = data.data?.products?.slice(0, 6).map((p: any) => ({
    title: p.product_title,
    price: p.product_price,
    image: p.product_photo,
    url: p.product_url,
    rating: p.product_star_rating,
  }));

  return NextResponse.json({ products });
}