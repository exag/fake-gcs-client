"use client";

import { useEffect, useState } from "react";

function isImageType(contentType?: string): boolean {
  return !!contentType?.startsWith("image/");
}

function isTextType(contentType?: string): boolean {
  if (!contentType) return false;
  return (
    contentType.startsWith("text/") ||
    contentType === "application/json" ||
    contentType === "application/xml" ||
    contentType === "application/javascript"
  );
}

export function FilePreview({
  bucket,
  objectName,
  contentType,
}: {
  bucket: string;
  objectName: string;
  contentType?: string;
}) {
  const downloadUrl = `/api/download/${encodeURIComponent(bucket)}/${objectName.split("/").map(encodeURIComponent).join("/")}`;

  if (isImageType(contentType)) {
    return (
      <div className="rounded-md border bg-muted/30 p-2">
        {/* biome-ignore lint/performance/noImgElement: dynamic URL from GCS, not optimizable by next/image */}
        <img src={downloadUrl} alt={objectName} className="max-h-64 w-full object-contain" />
      </div>
    );
  }

  if (isTextType(contentType)) {
    return <TextPreview url={downloadUrl} />;
  }

  if (contentType === "application/pdf") {
    return (
      <div className="rounded-md border">
        <iframe title="PDF preview" src={downloadUrl} className="h-64 w-full" />
      </div>
    );
  }

  return <p className="text-sm text-muted-foreground">Preview not available for this file type</p>;
}

function TextPreview({ url }: { url: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.text())
      .then((text) => setContent(text.slice(0, 10000)))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading preview...</p>;
  if (content === null) return <p className="text-sm text-muted-foreground">Failed to load</p>;

  return (
    <pre className="max-h-64 overflow-auto rounded-md border bg-muted/30 p-3 text-xs">
      <code>{content}</code>
    </pre>
  );
}
