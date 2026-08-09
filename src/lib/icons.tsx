import { Users, GraduationCap, Heart, Briefcase, Mic, MessageCircle, BookOpen, Sparkles, Menu, Search, ArrowLeft, ArrowRight, ChevronRight, Pencil, Home, Compass, Library, User, Lock, Check, Flame, Wallet, Settings, Bell, CreditCard, HelpCircle, LogOut, Bookmark, Hourglass, Receipt, Target, Play, Volume2, Gift, Clock, X, type LucideIcon } from "lucide-react";

// Topic / category icon keys — set via a CMS <select>, never free text, so
// this map always has a match. Add a new option in both places to extend.
export const TOPIC_ICONS: Record<string, LucideIcon> = {
  users: Users,
  "graduation-cap": GraduationCap,
  heart: Heart,
  briefcase: Briefcase,
  mic: Mic,
  "message-circle": MessageCircle,
  book: BookOpen,
  sparkles: Sparkles,
};

export const CHAT_THEME_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  "graduation-cap": GraduationCap,
  users: Users,
  "message-circle": MessageCircle,
  briefcase: Briefcase,
  home: Home,
};

export function TopicIcon({ iconKey, className }: { iconKey: string; className?: string }) {
  const Icon = TOPIC_ICONS[iconKey] ?? Sparkles;
  return <Icon className={className} strokeWidth={2} />;
}

export function ChatThemeIcon({ iconKey, className }: { iconKey: string; className?: string }) {
  const Icon = CHAT_THEME_ICONS[iconKey] ?? MessageCircle;
  return <Icon className={className} strokeWidth={2} />;
}

export { Menu, Search, ArrowLeft, ChevronRight, ArrowRight, Pencil, Home, Compass, Library, User, Lock, Check, Flame, Wallet, Settings, Bell, CreditCard, HelpCircle, LogOut, Bookmark, Hourglass, Receipt, Target, Play, Volume2, Gift, Clock, X, BookOpen, MessageCircle };
