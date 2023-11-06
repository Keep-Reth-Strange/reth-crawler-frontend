import { Skeleton } from "@/components/ui/skeleton";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Navigation } from "~/components/Navigation";
import { NodesTable } from "~/components/NodesTable";
import { getNodesData } from "~/data/nodes";

function App() {
  const { baseData } = useLoaderData() as {
    baseData: string;
    chartData: Distribution[] | null;
  };

  const PageSkeleton = () => {
    return (
      <div className="min-h-screen bg-white p-4">
        <Skeleton className="w-full h-10 mb-4" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-10" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, subIndex) => (
                <Skeleton key={subIndex} className="w-full h-10" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!baseData) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-white p-4">
      <header className="container mx-auto">
        <Navigation />
        <NodesTable data={JSON.parse(baseData) as NodeRecord[]} />
      </header>
    </div>
  );
}

export default App;

export const loader: LoaderFunction = async () => {
  const baseData = await getNodesData();

  return { baseData: JSON.stringify(baseData) };
};
