"use client";

import { Database, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
            <Link
              key={bucket.name}
              href={`/${encodeURIComponent(bucket.name)}`}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                activeBucket === bucket.name && "bg-accent font-medium",
              )}
            >
              <Database className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{bucket.name}</span>
            </Link>
          ))}
          {buckets.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted-foreground">No buckets found</p>
          )}
        </nav>
      </ScrollArea>
    </aside>
  );
}
