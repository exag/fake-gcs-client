import {
  BucketListSchema,
  BucketSchema,
  type GcsObject,
  GcsObjectSchema,
  ObjectListSchema,
} from "./types";

const GCS_ENDPOINT = process.env.GCS_ENDPOINT || "http://localhost:4443";

function url(path: string): string {
  return `${GCS_ENDPOINT}${path}`;
}

export async function listBuckets() {
  const res = await fetch(url("/storage/v1/b"), { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to list buckets: ${res.statusText}`);
  const data = await res.json();
  return BucketListSchema.parse(data);
}

export async function getBucket(bucketName: string) {
  const res = await fetch(url(`/storage/v1/b/${encodeURIComponent(bucketName)}`), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to get bucket: ${res.statusText}`);
  const data = await res.json();
  return BucketSchema.parse(data);
}

export async function createBucket(bucketName: string) {
  const res = await fetch(url("/storage/v1/b"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: bucketName }),
  });
  if (!res.ok) throw new Error(`Failed to create bucket: ${res.statusText}`);
  const data = await res.json();
  return BucketSchema.parse(data);
}

export async function deleteBucket(bucketName: string) {
  const res = await fetch(url(`/storage/v1/b/${encodeURIComponent(bucketName)}`), {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete bucket: ${res.statusText}`);
}

export async function listObjects(bucketName: string, prefix?: string, delimiter = "/") {
  const params = new URLSearchParams({ delimiter });
  if (prefix) params.set("prefix", prefix);

  const res = await fetch(
    url(`/storage/v1/b/${encodeURIComponent(bucketName)}/o?${params.toString()}`),
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Failed to list objects: ${res.statusText}`);
  const data = await res.json();
  return ObjectListSchema.parse(data);
}

export async function getObjectMetadata(bucketName: string, objectName: string) {
  const res = await fetch(
    url(`/storage/v1/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(objectName)}`),
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Failed to get object metadata: ${res.statusText}`);
  const data = await res.json();
  return GcsObjectSchema.parse(data);
}

export async function downloadObject(bucketName: string, objectName: string): Promise<Response> {
  const res = await fetch(
    url(
      `/download/storage/v1/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(objectName)}?alt=media`,
    ),
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Failed to download object: ${res.statusText}`);
  return res;
}

export async function uploadObject(
  bucketName: string,
  objectName: string,
  body: ArrayBuffer | Uint8Array | ReadableStream,
  contentType: string,
): Promise<GcsObject> {
  const params = new URLSearchParams({
    name: objectName,
    uploadType: "media",
  });
  const res = await fetch(
    url(`/upload/storage/v1/b/${encodeURIComponent(bucketName)}/o?${params.toString()}`),
    {
      method: "POST",
      headers: { "Content-Type": contentType },
      body,
    },
  );
  if (!res.ok) throw new Error(`Failed to upload object: ${res.statusText}`);
  const data = await res.json();
  return GcsObjectSchema.parse(data);
}

export async function deleteObject(bucketName: string, objectName: string) {
  const res = await fetch(
    url(`/storage/v1/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(objectName)}`),
    { method: "DELETE" },
  );
  if (!res.ok) throw new Error(`Failed to delete object: ${res.statusText}`);
}
