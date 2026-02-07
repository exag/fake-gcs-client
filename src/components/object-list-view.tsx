"use client";

import { useState } from "react";
import { DetailDrawer } from "@/components/detail-drawer";
import { ObjectTable } from "@/components/object-table";
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

  return (
    <>
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
    </>
  );
}
