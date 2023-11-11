import axios from "axios";

export async function getNodesData(): Promise<any> {
  const nodesData = await axios.get("http://api.0xsmit.com/nodes");
  return Promise.resolve(nodesData.data);
}
