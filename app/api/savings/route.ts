import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamodb";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.send(
      new ScanCommand({
        TableName: "savings",
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": user.userId,
        },
      })
    );

    return NextResponse.json(result.Items || []);
  } catch (error) {
    console.error("Get all savings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}