import axios from "axios";

export async function getNodesData(): Promise<any> {
  const nodesData = await axios.get("http://5.161.121.99:3030/nodes");
  return Promise.resolve(nodesData.data);
}
