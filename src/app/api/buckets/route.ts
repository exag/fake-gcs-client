import { NextResponse } from "next/server";
import { createBucket, deleteBucket } from "@/lib/gcs-client";

export async function POST(request: Request) {
  const { name } = await request.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Bucket name is required" }, { status: 400 });
  }
  try {
    const bucket = await createBucket(name);
    return NextResponse.json(bucket);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create bucket" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "Bucket name is required" }, { status: 400 });
  }
  try {
    await deleteBucket(name);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete bucket" },
      { status: 500 },
    );
  }
}
