// React Native icon registry — backed by lucide-react-native.
// Single import path so screens never know which library is used underneath.

import React from 'react';
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
  Image as ImageIcon,
} from 'lucide-react-native';

import { colors } from '../theme/tokens';

type IconProps = { size?: number; color?: string };

const wrap =
  (LucideIcon: React.ComponentType<any>) =>
  ({ size = 18, color = colors.foreground }: IconProps) => (
    <LucideIcon size={size} color={color} strokeWidth={1.5} />
  );

// Same surface area as before — screens keep working unchanged.
export const Icon = {
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
  Image: wrap(ImageIcon),
};
