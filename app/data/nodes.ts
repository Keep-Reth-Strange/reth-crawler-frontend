import axios from "axios";

interface NodeDistribution {
  id: string;
  count: number;
}

interface NodeVersionDistribution {
  version: string;
  count: number;
}

export async function getNodesData(): Promise<any> {
  const nodesData = await axios.get("http://api.0xsmit.com/nodes");
  return Promise.resolve(nodesData.data);
}

export async function getNodesDistribution(nodesResult: any): Promise<NodeDistribution[]> {
  if (!nodesResult) {
    return Promise.resolve([]);
  }
  if (typeof nodesResult === "string") {
    nodesResult = JSON.parse(nodesResult);
  }
  const reducedData = nodesResult.reduce((acc: any, data: { id: string }) => {
    const nodeId = data.id;
    acc[nodeId] = (acc[nodeId] || 0) + 1;
    return acc;
  }, {});
  return Promise.resolve(
    Object.entries(reducedData).map(([id, count]) => ({
      id,
      count: count as number,
    }))
  );
}

export function getNodeVersionDistribution(nodesResult: any, nodeFilter: string): Promise<NodeVersionDistribution[]> {
  if (!nodeFilter) {
    return Promise.resolve([]);
  }
  if (typeof nodesResult === "string") {
    nodesResult = JSON.parse(nodesResult);
  }
  const filteredData = nodesResult.filter((data: { id: string }) => {
    const nodeId = data.id;
    return nodeId === nodeFilter;
  });
  const reducedData = filteredData.reduce((acc: any, data: { client_version: string }) => {
    const version = data.client_version.split("/")[1];
    acc[version] = (acc[version] || 0) + 1;
    return acc;
  }, {});
  return Promise.resolve(
    Object.entries(reducedData).map(([version, count]) => ({
      version,
      count: count as number,
    }))
  );
}
