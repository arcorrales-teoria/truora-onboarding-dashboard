import { Reveal } from "./reveal";

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <Reveal>
        <header className="max-w-2xl">
          <h2 className="text-[16px] font-semibold tracking-tight text-neutral-900">
            {title}
          </h2>
          <p className="mt-0.5 text-[13px] leading-relaxed text-neutral-500">
            {description}
          </p>
        </header>
      </Reveal>
      <Reveal delay={0.12}>{children}</Reveal>
    </section>
  );
}
