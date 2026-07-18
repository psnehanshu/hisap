import {
  Archive,
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Menu,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Settings as SettingsIcon,
  Tag as TagIcon,
  Trash2,
  Wallet,
  X,
} from 'lucide-react-native';
import React from 'react';
import { colors } from '../theme';

const REGISTRY = {
  menu: Menu,
  stats: BarChart3,
  plus: Plus,
  back: ArrowLeft,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  calendar: Calendar,
  clock: Clock,
  close: X,
  settings: SettingsIcon,
  wallet: Wallet,
  card: CreditCard,
  search: Search,
  check: CheckCircle2,
  trash: Trash2,
  edit: Pencil,
  tag: TagIcon,
  download: Download,
  more: MoreVertical,
  archive: Archive,
} as const;

export type IconName = keyof typeof REGISTRY;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** Lucide icon at the Organic default stroke-width of 2.75. */
export default function Icon({ name, size = 18, color = colors.text, strokeWidth = 2.75 }: Props) {
  const Cmp = REGISTRY[name];
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />;
}
