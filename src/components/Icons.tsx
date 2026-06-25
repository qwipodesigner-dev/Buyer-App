// Web icon registry — backed by lucide-react.
// Same surface as the old hand-rolled SVG set; screens import from here.

import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Home,
  RotateCcw,
  User,
  Bell,
  ChevronRight,
  ChevronDown,
  Check,
  Plus,
  Minus,
  Truck,
  MapPin,
  Gift,
  Tag,
  Filter,
  X,
  Zap,
  Settings,
  Star,
  Image as ImageIcon,
  Phone,
  ScanLine,
  Wifi,
  Signal,
  Battery,
  Copy,
  ArrowDownCircle,
} from 'lucide-react';

import type { ReactElement } from 'react';

type IconCmp = (props?: { size?: number; color?: string; className?: string }) => ReactElement;

const wrap =
  (LucideIcon: any): IconCmp =>
  (props = {}) => (
    <LucideIcon
      size={props.size ?? 18}
      color={props.color}
      strokeWidth={1.5}
      className={props.className}
    />
  );

export const Icon: Record<string, IconCmp> = {
  Back: wrap(ChevronLeft),
  Search: wrap(Search),
  Filter: wrap(Filter),
  Sliders: wrap(SlidersHorizontal),
  Cart: wrap(ShoppingCart),
  Home: wrap(Home),
  Reorder: wrap(RotateCcw),
  Profile: wrap(User),
  Bell: wrap(Bell),
  ChevronRight: wrap(ChevronRight),
  ChevronDown: wrap(ChevronDown),
  Check: wrap(Check),
  Plus: wrap(Plus),
  Minus: wrap(Minus),
  Truck: wrap(Truck),
  MapPin: wrap(MapPin),
  Gift: wrap(Gift),
  Tag: wrap(Tag),
  Close: wrap(X),
  Lightning: wrap(Zap),
  Settings: wrap(Settings),
  Star: wrap(Star),
  Image: wrap(ImageIcon),
  Copy: wrap(Copy),
  Phone: wrap(Phone),
  Scan: wrap(ScanLine),
  Wifi: wrap(Wifi),
  Signal: wrap(Signal),
  Battery: wrap(Battery),
  PriceDrop: wrap(ArrowDownCircle),
};

// Status bar primitives kept here for parity with the previous module.
export const StatusBar = () => (
  <div className="status-bar">
    <span>9:41</span>
    <div className="status-icons">
      <Signal size={16} />
      <Wifi size={16} />
      <Battery size={16} />
    </div>
  </div>
);

export const PhoneNotch = () => <div className="phone-notch" />;
