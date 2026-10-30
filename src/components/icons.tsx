import {
  Binoculars,
  CalendarClock,
  Clapperboard,
  Compass,
  Film,
  Image as ImageIcon,
  LayoutDashboard,
  Map,
  Mic,
  ScrollText,
  Search,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Binoculars,
  CalendarClock,
  Clapperboard,
  Compass,
  Film,
  Image: ImageIcon,
  LayoutDashboard,
  Map,
  Mic,
  ScrollText,
  Search,
  Smartphone,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Clapperboard;
  return <Icon className={className} aria-hidden="true" />;
}
