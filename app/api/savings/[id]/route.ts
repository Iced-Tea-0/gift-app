import { NextRequest, NextResponse } from "next/server";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamodb";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.send(
      new GetCommand({
        TableName: "savings",
        Key: { savingsId: id },
      })
    );

    if (!result.Item || result.Item.userId !== user.userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result.Item);
  } catch (error) {
    console.error("Get savings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amountToAdd } = await req.json();

    const existing = await db.send(
      new GetCommand({
        TableName: "savings",
        Key: { savingsId: id },
      })
    );

    if (!existing.Item || existing.Item.userId !== user.userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const newAmount = existing.Item.currentAmount + amountToAdd;
    const giftPrice = existing.Item.giftPrice;

    const milestones = existing.Item.milestones.map((m: any) => ({
      ...m,
      unlocked: (newAmount / giftPrice) * 100 >= m.percent,
    }));

    await db.send(
      new UpdateCommand({
        TableName: "savings",
        Key: { savingsId: id },
        UpdateExpression: "SET currentAmount = :amount, milestones = :milestones",
        ExpressionAttributeValues: {
          ":amount": newAmount,
          ":milestones": milestones,
        },
      })
    );

    return NextResponse.json({ success: true, currentAmount: newAmount, milestones });
  } catch (error) {
    console.error("Update savings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}