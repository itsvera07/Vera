import { TopicIcon } from "@/lib/icons";
import { TiltLink } from "./motion/TiltLink";
import { ScrollReveal } from "./motion/ScrollReveal";

const CARD_COLOR_CLASSES: Record<string, string> = {
  peach: "bg-pastel-peach",
  mint: "bg-pastel-mint",
  pink: "bg-pastel-pink",
  blue: "bg-pastel-blue",
  lavender: "bg-pastel-lavender",
  butter: "bg-pastel-butter",
};

export function TopicCard({
  href,
  icon,
  title,
  meta,
  cardColor,
  index = 0,
  featured = false,
}: {
  href: string;
  icon: string;
  title: string;
  meta: string;
  cardColor: string;
  index?: number;
  /** Larger "bento" tile — used for the first card in a desktop grid */
  featured?: boolean;
}) {
  return (
    <ScrollReveal delay={index * 0.05} variant="flip" className={featured ? "lg:row-span-2" : ""}>
      <TiltLink href={href} className={`group rounded-card p-4 ${featured ? "lg:p-7 lg:h-full lg:flex lg:flex-col lg:justify-end" : ""} transition-shadow duration-300 hover:shadow-lift ${CARD_COLOR_CLASSES[cardColor] ?? "bg-pastel-peach"}`}>
        <span className={`inline-flex w-10 h-10 ${featured ? "lg:w-16 lg:h-16" : ""} rounded-xl bg-white/70 items-center justify-center mb-6 transition-transform duration-300 ease-smooth group-hover:scale-110 group-hover:rotate-3`}>
          <TopicIcon iconKey={icon} className={`w-5 h-5 ${featured ? "lg:w-7 lg:h-7" : ""} text-ink`} />
        </span>
        <p className={`font-display font-bold leading-snug ${featured ? "lg:text-2xl" : ""}`}>{title}</p>
        <p className="text-sm text-brand-green font-medium mt-1">{meta}</p>
      </TiltLink>
    </ScrollReveal>
  );
}
