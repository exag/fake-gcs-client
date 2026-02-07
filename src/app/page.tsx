import { Database } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Database className="mx-auto mb-4 h-12 w-12" />
        <p className="text-lg font-medium">Select a bucket</p>
        <p className="text-sm">Choose a bucket from the sidebar to browse its contents</p>
      </div>
    </div>
  );
}
