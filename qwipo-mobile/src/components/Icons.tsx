// React Native icon set — ported from the web app to react-native-svg.
// Same Feather/Lucide stroke style as the web side.

import React from 'react';
import Svg, { Path, Circle, Line, Polyline, Rect, Polygon } from 'react-native-svg';
import { colors } from '../theme/tokens';

type IconProps = { size?: number; color?: string };

const stroke = (props: IconProps) => ({
  width: props.size ?? 18,
  height: props.size ?? 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: props.color ?? colors.foreground,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const Icon = {
  Back: (p: IconProps) => (
    <Svg {...stroke({ ...p })} strokeWidth={2.2}>
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  ),
  Search: (p: IconProps) => (
    <Svg {...stroke({ ...p })} strokeWidth={2.2}>
      <Circle cx="11" cy="11" r="7" />
      <Path d="M21 21l-4.3-4.3" />
    </Svg>
  ),
  Filter: (p: IconProps) => (
    <Svg {...stroke(p)}>
      <Line x1="4" y1="6" x2="20" y2="6" />
      <Line x1="7" y1="12" x2="17" y2="12" />
      <Line x1="10" y1="18" x2="14" y2="18" />
    </Svg>
  ),
  Sliders: (p: IconProps) => (
    <Svg {...stroke(p)}>
      <Line x1="4" y1="7" x2="20" y2="7" />
      <Line x1="4" y1="17" x2="20" y2="17" />
      <Circle cx="9" cy="7" r="2.5" fill={p.color ?? colors.foreground} stroke="none" />
      <Circle cx="15" cy="17" r="2.5" fill={p.color ?? colors.foreground} stroke="none" />
    </Svg>
  ),
  Cart: (p: IconProps) => (
    <Svg {...stroke(p)}>
      <Circle cx="9" cy="21" r="1" />
      <Circle cx="20" cy="21" r="1" />
      <Path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </Svg>
  ),
  Home: (p: IconProps) => (
    <Svg {...stroke(p)}>
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
  ),
  Reorder: (p: IconProps) => (
    <Svg {...stroke(p)}>
      <Path d="M3 12a9 9 0 0 1 9-9 9.7 9.7 0 0 1 6.7 2.7L21 8" />
      <Path d="M21 3v5h-5" />
      <Path d="M21 12a9 9 0 0 1-9 9 9.7 9.7 0 0 1-6.7-2.7L3 16" />
      <Path d="M3 21v-5h5" />
    </Svg>
  ),
  Profile: (p: IconProps) => (
    <Svg {...stroke(p)}>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
    </Svg>
  ),
  Bell: (p: IconProps) => (
    <Svg {...stroke(p)}>
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  ),
  ChevronRight: (p: IconProps) => (
    <Svg {...stroke(p)}>
      <Polyline points="9 18 15 12 9 6" />
    </Svg>
  ),
  ChevronDown: (p: IconProps) => (
    <Svg {...stroke({ ...p })} strokeWidth={2.2}>
      <Polyline points="6 9 12 15 18 9" />
    </Svg>
  ),
  Check: (p: IconProps) => (
    <Svg {...stroke({ ...p })} strokeWidth={3}>
      <Polyline points="20 6 9 17 4 12" />
    </Svg>
  ),
  Plus: (p: IconProps) => (
    <Svg {...stroke({ ...p })} strokeWidth={2.5}>
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  ),
  Minus: (p: IconProps) => (
    <Svg {...stroke({ ...p })} strokeWidth={2.5}>
      <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  ),
  Truck: (p: IconProps) => (
    <Svg {...stroke(p)}>
      <Rect x="1" y="3" width="15" height="13" />
      <Polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <Circle cx="5.5" cy="18.5" r="2.5" />
      <Circle cx="18.5" cy="18.5" r="2.5" />
    </Svg>
  ),
  MapPin: (p: IconProps) => (
    <Svg {...stroke(p)}>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <Circle cx="12" cy="10" r="3" />
    </Svg>
  ),
};
