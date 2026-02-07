"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UploadDialog({
  bucket,
  prefix,
  open,
  onOpenChange,
}: {
  bucket: string;
  prefix?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        if (prefix) formData.append("prefix", prefix);

        const res = await fetch(`/api/upload/${encodeURIComponent(bucket)}`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
      }
      toast.success(`Uploaded ${files.length} file(s)`);
      setFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>Select files to upload to this bucket.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {prefix && (
            <p className="text-sm text-muted-foreground">
              Uploading to: <span className="font-mono">{prefix}</span>
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={uploading || !files?.length}>
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
