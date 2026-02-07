import { NextResponse } from "next/server";
import { uploadObject } from "@/lib/gcs-client";

export async function POST(request: Request, { params }: { params: Promise<{ bucket: string }> }) {
  const { bucket } = await params;
  const bucketName = decodeURIComponent(bucket);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const prefix = formData.get("prefix") as string | null;

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File size exceeds 100 MB limit" }, { status: 413 });
  }

  if (prefix && (prefix.includes("..") || prefix.startsWith("/"))) {
    return NextResponse.json({ error: "Invalid prefix" }, { status: 400 });
  }

  const objectName = prefix ? `${prefix}${file.name}` : file.name;
  const buffer = await file.arrayBuffer();

  try {
    const obj = await uploadObject(
      bucketName,
      objectName,
      buffer,
      file.type || "application/octet-stream",
    );
    return NextResponse.json(obj);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to upload" },
      { status: 500 },
    );
  }
}
