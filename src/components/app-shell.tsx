"use client";

import { useState } from "react";
import { CreateBucketDialog } from "@/components/create-bucket-dialog";
import { Sidebar } from "@/components/sidebar";
import type { Bucket } from "@/lib/types";

export function AppShell({ buckets, children }: { buckets: Bucket[]; children: React.ReactNode }) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar buckets={buckets} onCreateBucket={() => setCreateOpen(true)} />
      <main className="flex-1 overflow-auto">{children}</main>
      <CreateBucketDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
