import { FAQS } from "./ServicesData";

export function ServicesFAQ() {
  return (
    <section className="pb-12">
      <h2 className="text-2xl font-serif text-foreground mb-8 text-center">Common Questions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FAQS.map((faq) => (
          <div key={faq.q} className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-xl p-5 hover:border-amber-500/30 transition-all shadow-sm dark:shadow-none">
            <p className="text-sm font-semibold text-foreground mb-2">{faq.q}</p>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}