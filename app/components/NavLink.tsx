import { Link } from "@remix-run/react";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

interface NavLinkProps {
  to: string;
  [key: string]: any;
}

export const NavLink = ({ to, ...props }: NavLinkProps) => {
  return (
    <Link to={to}>
      <NavigationMenuLink {...props} />
    </Link>
  );
};
