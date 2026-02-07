"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { DetailDrawer } from "@/components/detail-drawer";
import { ObjectTable } from "@/components/object-table";
import { Button } from "@/components/ui/button";
import { UploadDialog } from "@/components/upload-dialog";
import type { GcsObject } from "@/lib/types";

export function ObjectListView({
  bucket,
  prefixes,
  objects,
  currentPrefix,
}: {
  bucket: string;
  prefixes: string[];
  objects: GcsObject[];
  currentPrefix?: string;
}) {
  const [selectedObject, setSelectedObject] = useState<GcsObject | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end border-b px-6 py-2">
        <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
          <Upload className="mr-2 h-3.5 w-3.5" />
          Upload
        </Button>
      </div>
      <ObjectTable
        bucket={bucket}
        prefixes={prefixes}
        objects={objects}
        currentPrefix={currentPrefix}
        onObjectClick={setSelectedObject}
      />
      <DetailDrawer
        bucket={bucket}
        object={selectedObject}
        open={selectedObject !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedObject(null);
        }}
      />
      <UploadDialog
        bucket={bucket}
        prefix={currentPrefix}
        open={uploadOpen}
        onOpenChange={setUploadOpen}
      />
    </>
  );
}
