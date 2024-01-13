import axios from "axios";

export async function getNodesData(): Promise<any> {
  const nodesData = await axios.get("http://37.27.33.51:3030/nodes");
  return Promise.resolve(nodesData.data);
}
