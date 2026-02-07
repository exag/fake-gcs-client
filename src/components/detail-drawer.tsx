"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { GcsObject } from "@/lib/types";

export function DetailDrawer({
  bucket: _bucket,
  object,
  open,
  onOpenChange,
}: {
  bucket: string;
  object: GcsObject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!object) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="truncate">{object.name.split("/").pop()}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 text-sm text-muted-foreground">
          Detail view — will be implemented in the next step.
        </div>
      </SheetContent>
    </Sheet>
  );
}
