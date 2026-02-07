"use client";

import { Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FilePreview } from "@/components/file-preview";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { GcsObject } from "@/lib/types";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

function MetadataRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="truncate text-right font-mono text-xs">{value}</span>
    </div>
  );
}

export function DetailDrawer({
  bucket,
  object,
  open,
  onOpenChange,
}: {
  bucket: string;
  object: GcsObject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (!object) return null;

  const fileName = object.name.split("/").pop() || object.name;
  const downloadUrl = `/api/download/${encodeURIComponent(bucket)}/${object.name.split("/").map(encodeURIComponent).join("/")}`;

  async function handleDelete() {
    if (!object) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/objects/${encodeURIComponent(bucket)}/${object.name.split("/").map(encodeURIComponent).join("/")}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Object deleted");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete object");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] overflow-y-auto sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="truncate">{fileName}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <FilePreview bucket={bucket} objectName={object.name} contentType={object.contentType} />

          <Separator />

          <div className="space-y-1 text-sm">
            <MetadataRow label="Name" value={object.name} />
            <MetadataRow label="Size" value={formatBytes(Number(object.size))} />
            <MetadataRow label="Content Type" value={object.contentType} />
            <MetadataRow label="Created" value={object.timeCreated} />
            <MetadataRow label="Updated" value={object.updated} />
            <MetadataRow label="Storage Class" value={object.storageClass} />
            <MetadataRow label="MD5" value={object.md5Hash} />
            <MetadataRow label="CRC32C" value={object.crc32c} />
            <MetadataRow label="ETag" value={object.etag} />
            <MetadataRow label="Generation" value={object.generation} />
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <a href={downloadUrl} download={fileName}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
