interface Distribution {
  count: number;
}

interface ClientDistribution extends Distribution {
  client: string;
}

interface CountryDistribution extends Distribution {
  country: string
}

interface ClientVersionDistribution extends Distribution {
  clientVersion: string;
}

interface VersionDistribution extends Distribution {
  version: string;
}

interface OperatingSystemDistribution extends Distribution {
  os: string;
}

interface LanguageVersionDistribution extends Distribution {
  languageVersion: string;
}

type SecondaryFilter = "clientVersion" | "os" | "languageVersion";

type NodeRecord = {
  enode_url: string;
  id: string;
  address: string;
  tcp_port: number;
  client_version: string;
  eth_version: number;
  capabilities: string[];
  chain: string;
  total_difficulty: string;
  best_block: string;
  genesis_block_hash: string;
  last_seen: string;
  country: string;
  city: string;
  isp: string;
  synced: boolean;
};
