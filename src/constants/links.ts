import {
  Building2Icon,
  LayoutDashboardIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react";

export const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/managers", label: "Gerentes", icon: UsersIcon },
  {
    href: "/admin/organizations",
    label: "Organizaciones",
    icon: Building2Icon,
  },
];
