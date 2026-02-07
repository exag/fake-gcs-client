import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ObjectListView } from "@/components/object-list-view";
import { listObjects } from "@/lib/gcs-client";

export default async function BucketPage({ params }: { params: Promise<{ bucket: string }> }) {
  const { bucket } = await params;
  const bucketName = decodeURIComponent(bucket);
  const result = await listObjects(bucketName);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-3">
        <BreadcrumbNav bucket={bucketName} />
      </div>
      <div className="flex-1 overflow-auto">
        <ObjectListView bucket={bucketName} prefixes={result.prefixes} objects={result.items} />
      </div>
    </div>
  );
}
