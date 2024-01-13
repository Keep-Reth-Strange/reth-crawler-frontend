import axios from "axios";

export async function getBaseData(): Promise<any> {
  const baseData = await axios.get("http://37.27.33.51:3030/clients");
  return Promise.resolve(baseData.data);
}

export async function getClientsData(clientResult: any): Promise<ClientDistribution[]> {
  if (!clientResult) {
    return Promise.resolve([]);
  }
  if (typeof clientResult === "string") {
    clientResult = JSON.parse(clientResult);
  }
  const reducedData = clientResult.reduce((acc: any, data: { client_version: string }) => {
    const client = data.client_version.split("/")[0];
    acc[client] = (acc[client] || 0) + 1;
    return acc;
  }, {});
  return Promise.resolve(
    Object.entries(reducedData).map(([client, count]) => ({
      client,
      count: count as number,
    })).sort((a, b) => b.count - a.count)
  );
}

export function getClientVersionDistribution(clientResult: any, clientFilter: string): Promise<ClientVersionDistribution[]> {
  if (!clientFilter) {
    return Promise.resolve([]);
  }
  if (typeof clientResult === "string") {
    clientResult = JSON.parse(clientResult);
  }
  const filteredData = clientResult.filter((data: { client_version: string }) => {
    const client = data.client_version.split("/")[0];
    return client === clientFilter;
  });
  const reducedData = filteredData.reduce((acc: any, data: { client_version: string }) => {
    const version = data.client_version.split("/")[1];
    acc[version] = (acc[version] || 0) + 1;
    return acc;
  }, {});
  return Promise.resolve(
    Object.entries(reducedData).map(([version, count]) => ({
      clientVersion: version,
      count: count as number,
    }))
  );
}

export function getOSDistribution(clientResult: any, clientFilter: string): Promise<OperatingSystemDistribution[]> {
  if (typeof clientResult === "string") {
    clientResult = JSON.parse(clientResult);
  }
  const filteredData = clientResult.filter((data: { client_version: string }) => {
    const client = data.client_version.split("/")[0];
    return client === clientFilter;
  });
  const reducedData = filteredData.reduce((acc: any, data: { client_version: string }) => {
    const os = data.client_version.split("/")[2];
    acc[os] = (acc[os] || 0) + 1;
    return acc;
  }, {});
  return Promise.resolve(
    Object.entries(reducedData).map(([os, count]) => ({
      os,
      count: count as number,
    }))
  );
}

export function getLanguageVersionDistribution(clientResult: any, clientFilter: string): Promise<LanguageVersionDistribution[]> {
  if (typeof clientResult === "string") {
    clientResult = JSON.parse(clientResult);
  }
  const filteredData = clientResult.filter((data: { client_version: string }) => {
    const client = data.client_version.split("/")[0];
    return client === clientFilter;
  });
  const reducedData = filteredData.reduce((acc: any, data: { client_version: string }) => {
    const languageVersion = data.client_version.split("/")[3];
    acc[languageVersion] = (acc[languageVersion] || 0) + 1;
    return acc;
  }, {});
  return Promise.resolve(
    Object.entries(reducedData).map(([languageVersion, count]) => ({
      languageVersion,
      count: count as number,
    }))
  );
}
