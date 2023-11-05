import { NavigationMenu, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";

export const Navigation = () => {
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  return (
    <NavigationMenu>
      <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/" active={path === "/"}>
        Clients
      </NavigationMenuLink>
      <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/nodes" active={path === "/nodes"}>
        Nodes
      </NavigationMenuLink>
    </NavigationMenu>
  );
};
