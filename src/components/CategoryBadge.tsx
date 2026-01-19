import type { Category } from '../types/categories';
import type { LucideIcon } from 'lucide-react';
import {
  BadgeDollarSign,
  Briefcase,
  Building2,
  Car,
  Coffee,
  Dumbbell,
  Film,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  LineChart,
  Music,
  PawPrint,
  PiggyBank,
  Plane,
  ReceiptText,
  ShoppingBag,
  Tag,
  Utensils,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  food: Utensils,
  groceries: ShoppingBag,
  shopping: ShoppingBag,
  transport: Car,
  transportation: Car,
  home: Home,
  rent: Building2,
  bills: ReceiptText,
  utilities: ReceiptText,
  health: HeartPulse,
  education: GraduationCap,
  salary: Briefcase,
  income: BadgeDollarSign,
  travel: Plane,
  entertainment: Film,
  leisure: Gamepad2,
  gaming: Gamepad2,
  coffee: Coffee,
  fitness: Dumbbell,
  gym: Dumbbell,
  gifts: Gift,
  music: Music,
  pets: PawPrint,
  investment: LineChart,
  investments: LineChart,
  savings: PiggyBank,
};

const resolveIcon = (iconKey?: string): LucideIcon => {
  if (!iconKey) return Tag;
  return iconMap[iconKey] ?? Tag;
};

type CategoryBadgeProps = {
  category?: Category | null;
  label: string;
  className?: string;
};

export default function CategoryBadge({ category, label, className = '' }: CategoryBadgeProps) {
  const color = category?.color || '#9CA3AF';
  const Icon = resolveIcon(category?.icon);

  return (
    <span className={`inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 ${className}`}>
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      <Icon className="h-3.5 w-3.5" style={{ color }} aria-hidden="true" />
      <span className="truncate">{label}</span>
    </span>
  );
}
