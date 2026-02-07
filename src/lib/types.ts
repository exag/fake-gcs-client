import { z } from "zod/v4";

export const BucketSchema = z.object({
  kind: z.literal("storage#bucket"),
  id: z.string(),
  name: z.string(),
  location: z.string(),
  storageClass: z.string(),
  timeCreated: z.string(),
  updated: z.string(),
  projectNumber: z.string(),
  metageneration: z.string(),
  etag: z.string(),
  defaultEventBasedHold: z.boolean().optional(),
  versioning: z.object({ enabled: z.boolean() }).optional(),
  locationType: z.string().optional(),
});

export type Bucket = z.infer<typeof BucketSchema>;

export const BucketListSchema = z.object({
  kind: z.literal("storage#buckets"),
  items: z.array(BucketSchema).optional().default([]),
});

export type BucketList = z.infer<typeof BucketListSchema>;

export const GcsObjectSchema = z.object({
  kind: z.literal("storage#object"),
  id: z.string(),
  name: z.string(),
  bucket: z.string(),
  size: z.string(),
  contentType: z.string().optional(),
  crc32c: z.string().optional(),
  md5Hash: z.string().optional(),
  etag: z.string().optional(),
  storageClass: z.string().optional(),
  timeCreated: z.string().optional(),
  updated: z.string().optional(),
  generation: z.string().optional(),
  metageneration: z.string().optional(),
  selfLink: z.string().optional(),
  mediaLink: z.string().optional(),
});

export type GcsObject = z.infer<typeof GcsObjectSchema>;

export const ObjectListSchema = z.object({
  kind: z.literal("storage#objects"),
  items: z.array(GcsObjectSchema).optional().default([]),
  prefixes: z.array(z.string()).optional().default([]),
  nextPageToken: z.string().optional(),
});

export type ObjectList = z.infer<typeof ObjectListSchema>;
