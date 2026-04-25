import { Footer }        from "@/components/Footer";
import { ServicesHero, ServicesStats } from "@/components/services/ServicesHero";
import { ServiceCard }   from "@/components/services/ServiceCard";
import { ServicesCTA }   from "@/components/services/ServicesCTA";
import { PlanCard }      from "@/components/services/PlanCard";
import { ServicesFAQ }   from "@/components/services/ServicesFAQ";
import { SERVICES, PLANS } from "@/components/services/ServicesData";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-[1100px] mx-auto space-y-20 animate-in fade-in duration-700 py-12 px-6">

        <ServicesHero />

        <ServicesStats />

        {/* Services list */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-foreground mb-2">Our Services</h2>
            <p className="text-muted-foreground text-sm font-medium">Click any service to see what's included.</p>
          </div>
          <div className="space-y-4">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </section>

        <ServicesCTA />

        {/* Pricing */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif text-foreground mb-2">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-sm font-medium">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>
        </section>

        <ServicesFAQ />

      </div>
      <Footer />
    </div>
  );
}