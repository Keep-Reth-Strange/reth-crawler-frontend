interface Distribution {
  count: number;
}

interface ClientDistribution extends Distribution {
  client: string;
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
