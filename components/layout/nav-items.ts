import { LayoutDashboard, Users, Receipt, Settings } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Kept as named constants (rather than inline literals) so the Sidebar's
// animated highlight math (translateY(index * NAV_ROW_STRIDE)) stays correct
// if this list's row height/gap or item count ever changes.
export const NAV_ROW_HEIGHT = 42;
export const NAV_ROW_GAP = 3;
export const NAV_ROW_STRIDE = NAV_ROW_HEIGHT + NAV_ROW_GAP;
