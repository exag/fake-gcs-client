"use client";

import { Database, MoreHorizontal, Plus, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Bucket } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Sidebar({
  buckets,
  onCreateBucket,
}: {
  buckets: Bucket[];
  onCreateBucket: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activeBucket = decodeURIComponent(pathname.split("/")[1] || "");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteBucket() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/buckets?name=${encodeURIComponent(deleteTarget)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete bucket");
      toast.success(`Bucket "${deleteTarget}" deleted`);
      if (activeBucket === deleteTarget) router.push("/");
      router.refresh();
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete bucket. Make sure it is empty.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-muted/30">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Buckets</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => router.refresh()}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCreateBucket}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {buckets.map((bucket) => (
            <div
              key={bucket.name}
              className={cn(
                "group flex items-center rounded-md transition-colors hover:bg-accent",
                activeBucket === bucket.name && "bg-accent font-medium",
              )}
            >
              <Link
                href={`/${encodeURIComponent(bucket.name)}`}
                className="flex flex-1 items-center gap-2 px-3 py-2 text-sm"
              >
                <Database className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{bucket.name}</span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setDeleteTarget(bucket.name)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete bucket
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
          {buckets.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted-foreground">No buckets found</p>
          )}
        </nav>
      </ScrollArea>
      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete bucket"
        description={`Are you sure you want to delete "${deleteTarget}"? The bucket must be empty.`}
        onConfirm={handleDeleteBucket}
        loading={deleting}
      />
    </aside>
  );
}
