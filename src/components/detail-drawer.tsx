"use client";

import { Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { FilePreview } from "@/components/file-preview";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { encodePath, formatBytes } from "@/lib/format";
import type { GcsObject } from "@/lib/types";

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
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!object) return null;

  const fileName = object.name.split("/").pop() || object.name;
  const downloadUrl = `/api/download/${encodeURIComponent(bucket)}/${encodePath(object.name)}`;

  async function handleDelete() {
    if (!object) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/objects/${encodeURIComponent(bucket)}/${encodePath(object.name)}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Object deleted");
      setConfirmOpen(false);
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete object");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-[540px] max-w-[640px] flex-col overflow-hidden sm:max-w-[640px]">
          <SheetHeader>
            <SheetTitle className="truncate">{fileName}</SheetTitle>
            <SheetDescription className="truncate">{object.name}</SheetDescription>
          </SheetHeader>

          <div className="shrink-0 space-y-4 px-6">
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <a href={downloadUrl} download={fileName}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>

            <Separator />

            <h3 className="text-sm font-semibold">Metadata</h3>
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
          </div>

          <Separator />

          <div className="flex min-h-0 flex-1 flex-col px-6 pb-6">
            <h3 className="mb-2 shrink-0 text-sm font-semibold">Preview</h3>
            <div className="min-h-0 flex-1">
              <FilePreview
                bucket={bucket}
                objectName={object.name}
                contentType={object.contentType}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete object"
        description={`Are you sure you want to delete "${fileName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
