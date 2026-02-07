"use client";

import { FileText, Folder } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBytes } from "@/lib/format";
import type { GcsObject } from "@/lib/types";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ObjectTable({
  bucket,
  prefixes,
  objects,
  currentPrefix,
  onObjectClick,
}: {
  bucket: string;
  prefixes: string[];
  objects: GcsObject[];
  currentPrefix?: string;
  onObjectClick: (obj: GcsObject) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50%]">Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Content Type</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prefixes.map((prefix) => {
          const displayName = currentPrefix ? prefix.replace(currentPrefix, "") : prefix;
          const linkPath = prefix.replace(/\/$/, "");
          return (
            <TableRow key={prefix}>
              <TableCell>
                <Link
                  href={`/${encodeURIComponent(bucket)}/${linkPath}`}
                  className="flex items-center gap-2 text-sm hover:underline"
                >
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  {displayName}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">-</TableCell>
              <TableCell className="text-muted-foreground">-</TableCell>
              <TableCell className="text-muted-foreground">-</TableCell>
            </TableRow>
          );
        })}
        {objects.map((obj) => {
          const displayName = currentPrefix ? obj.name.replace(currentPrefix, "") : obj.name;
          return (
            <TableRow
              key={obj.name}
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              onClick={() => onObjectClick(obj)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onObjectClick(obj);
                }
              }}
            >
              <TableCell>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {displayName}
                </div>
              </TableCell>
              <TableCell className="text-sm">{formatBytes(Number(obj.size))}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {obj.contentType || "-"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(obj.updated)}
              </TableCell>
            </TableRow>
          );
        })}
        {prefixes.length === 0 && objects.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
              No objects in this location
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
