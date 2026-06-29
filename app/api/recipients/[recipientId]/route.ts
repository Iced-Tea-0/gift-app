import { NextRequest, NextResponse } from "next/server";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamodb";
import { getAuthUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ recipientId: string }> }
) {
  try {
    const { recipientId } = await params;
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.send(
      new GetCommand({
        TableName: "recipients",
        Key: { recipientId },
      })
    );

    if (!result.Item || result.Item.userId !== user.userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ recipient: result.Item });
  } catch (error) {
    console.error("Fetch recipient error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ recipientId: string }> }
) {
  try {
    const { recipientId } = await params;
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, price, image, url, rating, interest } = await req.json();

    const gift = {
      giftId: uuidv4(),
      title,
      price,
      image,
      url,
      rating,
      interest,
      savedAt: new Date().toISOString(),
    };

    await db.send(
      new UpdateCommand({
        TableName: "recipients",
        Key: { recipientId },
        UpdateExpression:
          "SET savedGifts = list_append(if_not_exists(savedGifts, :empty), :gift)",
        ExpressionAttributeValues: {
          ":gift": [gift],
          ":empty": [],
        },
      })
    );

    return NextResponse.json({ success: true, gift });
  } catch (error) {
    console.error("Save gift error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ recipientId: string }> }
) {
  try {
    const { recipientId } = await params;
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { chatHistory, currentAmount, milestones } = body;

    const updates: string[] = [];
    const values: Record<string, any> = {};

    if (chatHistory !== undefined) { updates.push("chatHistory = :chatHistory"); values[":chatHistory"] = chatHistory; }
    if (currentAmount !== undefined) { updates.push("currentAmount = :currentAmount"); values[":currentAmount"] = currentAmount; }
    if (milestones !== undefined) { updates.push("milestones = :milestones"); values[":milestones"] = milestones; }

    await db.send(
    new UpdateCommand({
        TableName: "recipients",
        Key: { recipientId },
        UpdateExpression: `SET ${updates.join(", ")}`,
        ExpressionAttributeValues: values,
    })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update chat history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}