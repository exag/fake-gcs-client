import { NextResponse } from "next/server";
import { deleteObject } from "@/lib/gcs-client";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ bucket: string; path: string[] }> },
) {
  const { bucket, path } = await params;
  const bucketName = decodeURIComponent(bucket);
  const objectName = path.map(decodeURIComponent).join("/");

  try {
    await deleteObject(bucketName, objectName);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete object" },
      { status: 500 },
    );
  }
}
