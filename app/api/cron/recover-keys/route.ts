import { NextResponse } from "next/server";
import { recoverUnhealthyKeys } from "@/lib/api-keys";

export async function GET() {
  try {
    const result = await recoverUnhealthyKeys(5); // 5 minutes cooldown

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Unhealthy keys recovery completed",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to recover unhealthy keys" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}

// For Vercel cron jobs, you might also want to support POST
export async function POST() {
  return GET();
}
