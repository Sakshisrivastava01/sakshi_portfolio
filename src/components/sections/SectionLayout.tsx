import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}export default function SectionLayout({ id, title, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("relative py-12 px-6 md:px-12 lg:px-24 border-t border-white/5", className)}>
      <div className="max-w-7xl mx-auto w-full z-10 relative">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-8 tracking-tight">
          <span className="text-gradient">{title}</span>
        </h2>
        {children}
      </div>
    </section>
  );
}
