import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, CopyIcon } from "@radix-ui/react-icons";
import { Link, useParams } from "@remix-run/react";
import { formatISO9075 } from "date-fns";
import { useEffect, useState } from "react";
import { getNodesData } from "~/data/nodes";
import copy from "copy-to-clipboard";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoaderData } from "@remix-run/react";
import { toast } from "@/components/ui/use-toast";

function Node() {
  const nodeData = useLoaderData<NodeRecord | null>();

  const PageSkeleton = () => {
    return (
      <div className="w-full overflow-auto break-words">
        <div className="flex justify-between items-center p-2 rounded-md mb-4 relative">
          <div className="container mx-auto p-2 static">
            <Skeleton className="w-full h-10" />
          </div>
        </div>
        <div className="container mx-auto px-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-6 w-12" />
        </div>
        <div className="container mx-auto px-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  };

  const Col = ({ label, value }: any) => {
    return (
      <div className="flex flex-col">
        <span className="font-bold flex items-center">
          {label}
          <Button
            variant="secondary"
            size="icon"
            className="ml-2 w-3 h-3"
            onClick={() => {
              copy(value);
              toast({
                title: `Copied ${label.slice(0, -1)} to clipboard`,
              });
            }}
          >
            <CopyIcon />
          </Button>
        </span>
        <span>{value}</span>
      </div>
    );
  };

  if (!nodeData) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full overflow-auto break-words">
      <div className="flex justify-between items-center bg-gray-200 p-2 rounded-md mb-4 relative">
        <div className="container mx-auto p-2 static">
          <h2 className="text-lg">
            <span className="font-bold">ID:</span> {nodeData.id}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1 2xl:top-1/2 transform 2xl:-translate-y-1/2"
            onClick={() => {
              const nodeDataStr = Object.entries(nodeData)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n");
              copy(nodeDataStr);
              toast({
                title: "Copied all node data to clipboard",
              });
            }}
          >
            <CopyIcon />
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-2 my-4">
        <Link to="/nodes" className="flex-grow-0 inline">
          <Button size="sm" variant="link" className="px-0">
            <ChevronLeftIcon />
            Back to Nodes
          </Button>
        </Link>
      </div>
      <div className="container mx-auto px-2 grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-12">
        <Col label="Enode URL:" value={nodeData.enode_url} />
        <Col label="Address:" value={nodeData.address} />
        <Col label="TCP Port:" value={nodeData.tcp_port} />
        <Col label="Client Version:" value={nodeData.client_version} />
        <Col label="Eth Version:" value={nodeData.eth_version} />
        <Col label="Capabilities:" value={nodeData.capabilities.join(", ")} />
        <Col label="Chain:" value={nodeData.chain} />
        <Col label="Total Difficulty:" value={nodeData.total_difficulty} />
        <Col label="Best Block:" value={nodeData.best_block} />
        <Col label="Genesis Block Hash:" value={nodeData.genesis_block_hash} />
        <Col label="Last Seen:" value={formatISO9075(new Date(nodeData.last_seen), { representation: "date" })} />
        <Col label="Country:" value={nodeData.country} />
        <Col label="City:" value={nodeData.city} />
      </div>
    </div>
  );
}

export default Node;

export const loader = async ({ params }: { params: { id: string } }) => {
  const nodesData = await getNodesData();
  const node = nodesData.find((node: NodeRecord) => node.id === params.id);
  return node;
};
