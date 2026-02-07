import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ObjectListView } from "@/components/object-list-view";
import { listObjects } from "@/lib/gcs-client";

export default async function SubdirectoryPage({
  params,
}: {
  params: Promise<{ bucket: string; path: string[] }>;
}) {
  const { bucket, path } = await params;
  const bucketName = decodeURIComponent(bucket);
  const prefix = `${path.map(decodeURIComponent).join("/")}/`;
  const result = await listObjects(bucketName, prefix);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-3">
        <BreadcrumbNav bucket={bucketName} prefix={prefix} />
      </div>
      <div className="flex-1 overflow-auto">
        <ObjectListView
          bucket={bucketName}
          prefixes={result.prefixes}
          objects={result.items}
          currentPrefix={prefix}
        />
      </div>
    </div>
  );
}
