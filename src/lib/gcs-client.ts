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

async function parseJsonResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response: ${text.slice(0, 200)}`);
  }
}

async function throwResponseError(res: Response, message: string): Promise<never> {
  let detail = res.statusText;
  try {
    const body = await res.text();
    const json = JSON.parse(body);
    detail = json?.error?.message || json?.error || detail;
  } catch {
    // use statusText as fallback
  }
  throw new Error(`${message}: ${detail}`);
}

export async function listBuckets() {
  const res = await fetch(url("/storage/v1/b"), { cache: "no-store" });
  if (!res.ok) await throwResponseError(res, "Failed to list buckets");
  const data = await parseJsonResponse(res);
  return BucketListSchema.parse(data);
}

export async function getBucket(bucketName: string) {
  const res = await fetch(url(`/storage/v1/b/${encodeURIComponent(bucketName)}`), {
    cache: "no-store",
  });
  if (!res.ok) await throwResponseError(res, "Failed to get bucket");
  const data = await parseJsonResponse(res);
  return BucketSchema.parse(data);
}

export async function createBucket(bucketName: string) {
  const res = await fetch(url("/storage/v1/b"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: bucketName }),
  });
  if (!res.ok) await throwResponseError(res, "Failed to create bucket");
  const data = await parseJsonResponse(res);
  return BucketSchema.parse(data);
}

export async function deleteBucket(bucketName: string) {
  const res = await fetch(url(`/storage/v1/b/${encodeURIComponent(bucketName)}`), {
    method: "DELETE",
  });
  if (!res.ok) await throwResponseError(res, "Failed to delete bucket");
}

export async function listObjects(bucketName: string, prefix?: string, delimiter = "/") {
  const params = new URLSearchParams({ delimiter });
  if (prefix) params.set("prefix", prefix);

  const res = await fetch(
    url(`/storage/v1/b/${encodeURIComponent(bucketName)}/o?${params.toString()}`),
    { cache: "no-store" },
  );
  if (!res.ok) await throwResponseError(res, "Failed to list objects");
  const data = await parseJsonResponse(res);
  return ObjectListSchema.parse(data);
}

export async function getObjectMetadata(bucketName: string, objectName: string) {
  const res = await fetch(
    url(`/storage/v1/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(objectName)}`),
    { cache: "no-store" },
  );
  if (!res.ok) await throwResponseError(res, "Failed to get object metadata");
  const data = await parseJsonResponse(res);
  return GcsObjectSchema.parse(data);
}

export async function downloadObject(bucketName: string, objectName: string): Promise<Response> {
  const res = await fetch(
    url(
      `/download/storage/v1/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(objectName)}?alt=media`,
    ),
    { cache: "no-store" },
  );
  if (!res.ok) await throwResponseError(res, "Failed to download object");
  return res;
}

export async function uploadObject(
  bucketName: string,
  objectName: string,
  body: BodyInit,
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
  if (!res.ok) await throwResponseError(res, "Failed to upload object");
  const data = await parseJsonResponse(res);
  return GcsObjectSchema.parse(data);
}

export async function deleteObject(bucketName: string, objectName: string) {
  const res = await fetch(
    url(`/storage/v1/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(objectName)}`),
    { method: "DELETE" },
  );
  if (!res.ok) await throwResponseError(res, "Failed to delete object");
}
