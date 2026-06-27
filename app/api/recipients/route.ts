import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamodb";
import { getAuthUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      recipientName,
      relationship,
      occasionDate,
      giftTitle,
      giftPrice,
      giftUrl,
      giftImage,
    } = await req.json();

    if (!recipientName || !occasionDate || !giftTitle || !giftPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const recipientId = uuidv4();
    const savingsId = uuidv4();

    const today = new Date();
    const occasion = new Date(occasionDate);
    const daysRemaining = Math.ceil((occasion.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const dailyTarget = daysRemaining > 0 ? Math.ceil(giftPrice / daysRemaining) : giftPrice;

    // Save recipient
    await db.send(
      new PutCommand({
        TableName: "recipients",
        Item: {
          recipientId,
          userId: user.userId,
          name: recipientName,
          relationship: relationship || "",
          occasionDate,
          createdAt: new Date().toISOString(),
        },
      })
    );

    // Save savings goal
    await db.send(
      new PutCommand({
        TableName: "savings",
        Item: {
          savingsId,
          userId: user.userId,
          recipientId,
          giftTitle,
          giftPrice: Number(giftPrice),
          giftUrl: giftUrl || "",
          giftImage: giftImage || "",
          occasionDate,
          currentAmount: 0,
          dailyTarget,
          daysRemaining,
          milestones: [
            { percent: 25, unlocked: false },
            { percent: 50, unlocked: false },
            { percent: 75, unlocked: false },
            { percent: 100, unlocked: false },
          ],
          createdAt: new Date().toISOString(),
        },
      })
    );

    return NextResponse.json({ success: true, recipientId, savingsId }, { status: 201 });
  } catch (error) {
    console.error("Save recipient error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}