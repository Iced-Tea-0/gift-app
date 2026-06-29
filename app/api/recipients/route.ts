import { NextRequest, NextResponse } from "next/server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamodb";
import { getAuthUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipientId, name } = await req.json();

    if (!recipientId || !name) {
      return NextResponse.json(
        { error: "recipientId and name are required" },
        { status: 400 }
      );
    }

    await db.send(
      new UpdateCommand({
        TableName: "recipients",
        Key: {
          recipientId,
        },
        UpdateExpression: "SET #name = :name",
        ConditionExpression: "userId = :userId",
        ExpressionAttributeNames: {
          "#name": "name",
        },
        ExpressionAttributeValues: {
          ":name": name,
          ":userId": user.userId,
        },
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rename recipient error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, relationship, occasion, occasionDate, budget } = await req.json();

    if (!name || !occasionDate || !budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const recipientId = uuidv4();

    await db.send(
      new PutCommand({
        TableName: "recipients",
        Item: {
          recipientId,
          userId: user.userId,
          name,
          relationship: relationship || "",
          occasion: occasion || "",
          occasionDate,
          budget: Number(budget),
          chatHistory: [],
          savedGifts: [],
          createdAt: new Date().toISOString(),
        },
      })
    );

    return NextResponse.json({ success: true, recipientId }, { status: 201 });
  } catch (error) {
    console.error("Create recipient error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.send(
      new QueryCommand({
        TableName: "recipients",
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": user.userId,
        },
      })
    );

    return NextResponse.json({ recipients: result.Items || [] });
  } catch (error) {
    console.error("Fetch recipients error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}