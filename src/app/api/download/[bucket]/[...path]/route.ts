import { downloadObject, getObjectMetadata } from "@/lib/gcs-client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bucket: string; path: string[] }> },
) {
  const { bucket, path } = await params;
  const bucketName = decodeURIComponent(bucket);
  const objectName = path.map(decodeURIComponent).join("/");

  try {
    const [metadata, objectRes] = await Promise.all([
      getObjectMetadata(bucketName, objectName),
      downloadObject(bucketName, objectName),
    ]);

    const headers = new Headers();
    if (metadata.contentType) {
      headers.set("Content-Type", metadata.contentType);
    }
    headers.set("Content-Length", metadata.size);

    return new Response(objectRes.body, { headers });
  } catch (e) {
    return new Response(e instanceof Error ? e.message : "Download failed", { status: 500 });
  }
}
