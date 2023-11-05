import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Navigation } from "~/components/Navigation";
import { NodesTable } from "~/components/NodesTable";
import { getNodesData } from "~/data/nodes";

function App() {
  const { baseData } = useLoaderData() as {
    baseData: string;
    chartData: Distribution[] | null;
  };
  const [isLoaded, setIsLoaded] = useState(false);

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
