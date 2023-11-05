import { Card, CardContent } from "@/components/ui/card";
import type { LoaderFunction } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";
import PieChart from "../components/PieChart";
import Filters from "../components/Filters";
import {
  getBaseData,
  getClientVersionDistribution,
  getClientsData,
  getLanguageVersionDistribution,
  getOSDistribution,
} from "../data/clients";
import { useLoaderData } from "@remix-run/react";
import { Client, ClientsTable } from "~/components/ClientsTable";

function ChartWrapper() {
  const chartdivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartdiv = document.createElement("div");
    chartdiv.id = "chartdiv";
    chartdiv.style.width = "100%";
    chartdiv.style.height = "500px";
    chartdiv.style.paddingBottom = "100px";
    chartdivRef.current?.appendChild(chartdiv);

    return () => {
      if (chartdivRef.current && chartdivRef.current.contains(chartdiv)) {
        chartdivRef.current.removeChild(chartdiv);
      }
    };
  }, []);

  return <div ref={chartdivRef} />;
}

function App() {
  const { baseData, chartData: loaderChartData } = useLoaderData() as {
    baseData: string;
    chartData: Distribution[] | null;
  };
  const [isLoaded, setIsLoaded] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [secondaryFilter, setSecondaryFilter] = useState<SecondaryFilter>("clientVersion");

  const [chartData, setChartData] = useState<Distribution[] | null>(loaderChartData);
  const [clientsData, setClientsData] = useState<Client[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getClientsData(baseData);
      setClientsData(data);
      setChartData(data);
      setIsLoaded(true);
    };
    fetchData();
  }, []);

  const handleClientChartClick = (client: string) => {
    setClientFilter(client);
  };

  useEffect(() => {
    const updateChartData = async () => {
      let data: Distribution[] = await getClientsData(baseData); // Default to baseData

      if (baseData && clientFilter) {
        switch (secondaryFilter) {
          case "clientVersion":
            data = await getClientVersionDistribution(baseData, clientFilter);
            break;
          case "os":
            data = await getOSDistribution(baseData, clientFilter);
            break;
          case "languageVersion":
            data = await getLanguageVersionDistribution(baseData, clientFilter);
            break;
        }
      }
      setChartData(data);
    };
    updateChartData();
  }, [clientFilter, secondaryFilter, baseData]);

  if (!isLoaded || !chartData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-white p-4">
      <header className="container mx-auto">
        <Filters
          clientFilter={clientFilter}
          secondaryFilter={secondaryFilter}
          setClientFilter={setClientFilter}
          setSecondaryFilter={setSecondaryFilter}
        />
        <Card className="p-4 mt-8">
          <CardContent>
            <ChartWrapper />
          </CardContent>
        </Card>
        <PieChart
          key={`client-chart-${secondaryFilter}-${clientFilter}`} // Add clientFilter to the key
          data={chartData}
          id="chartdiv"
          onClick={!clientFilter ? handleClientChartClick : null}
          categoryField={!clientFilter ? "client" : secondaryFilter}
        />
        <ClientsTable data={clientsData as Client[]} />
      </header>
    </div>
  );
}

export default App;

export const loader: LoaderFunction = async () => {
  const baseData = await getBaseData();
  const clientData = await getClientsData(baseData);
  const chartData = clientData;
  const isLoaded = clientData;

  return { baseData: JSON.stringify(baseData), chartData, isLoaded };
};
