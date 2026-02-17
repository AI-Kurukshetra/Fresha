import Link from "next/link";
import { SiteHeader } from "@/components/layouts/SiteHeader";
import { SiteFooter } from "@/components/layouts/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getUserContext } from "@/infrastructure/auth/getUser";

export default async function HomePage() {
  const user = await getUserContext();

  return (
    <div>
      <SiteHeader isAuthenticated={Boolean(user)} />
      <main className="mx-auto w-full max-w-6xl px-6">
        <section className="grid gap-10 py-12 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <Badge variant="mint">Find and book top-rated salons near you</Badge>
            <h1 className="font-display text-4xl text-ink-900 md:text-5xl">
              Beauty and wellness appointments, made effortless.
            </h1>
            <p className="text-base text-ink-600">
              Discover services, compare specialists, and book instantly with live availability.
            </p>
            <Card className="space-y-4 border border-charcoal-100 bg-white/85">
              <div className="grid gap-3 md:grid-cols-[1.1fr_1fr_0.8fr]">
                <Input label="Service" placeholder="Hair, nails, massage" />
                <Select label="Location" defaultValue="">
                  <option value="">New York, NY</option>
                  <option value="">San Francisco, CA</option>
                  <option value="">Chicago, IL</option>
                </Select>
                <Button size="lg" className="shadow-glow">Search</Button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-ink-600">
                <span>Popular:</span>
                {["Facial", "Blowout", "Manicure", "Massage", "Brows"].map((item) => (
                  <span key={item} className="rounded-full bg-beige-100 px-3 py-1 text-charcoal-700">
                    {item}
                  </span>
                ))}
              </div>
            </Card>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Average rating", value: "4.9/5" },
                { label: "Bookings monthly", value: "120K" },
                { label: "Teams onboarded", value: "8K" }
              ].map((item) => (
                <Card key={item.label} className="flex flex-col gap-1 border border-ink-100 bg-white/70">
                  <span className="text-xs uppercase tracking-[0.2em] text-ink-600">{item.label}</span>
                  <span className="font-display text-2xl text-ink-900">{item.value}</span>
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="shadow-glow">Book now</Button>
              <Link
                href="/book"
                className="rounded-xl border border-charcoal-100 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-all duration-300 hover:border-rose-600 hover:text-rose-700"
              >
                Explore services
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <Card className="border-none bg-transparent p-0 shadow-none">
              <div className="space-y-5 rounded-3xl border border-charcoal-100 bg-gradient-to-br from-charcoal-900 via-charcoal-900 to-black p-6 text-white shadow-card">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/80">Studio flow</p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
                    Live now
                  </span>
                </div>
                <h2 className="font-display text-3xl text-white">Live availability, polished experience</h2>
                <p className="text-sm text-white/90">
                  Clients book in seconds, teams stay aligned, and every appointment flows seamlessly.
                </p>
                <div className="grid gap-3">
                  {["Instant confirmations", "Smart staff matching", "Payments tracked"].map((item) => (
                    <div key={item} className="rounded-xl border border-white/15 bg-white/15 px-4 py-3 text-sm text-white">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-white/20 px-4 py-4 text-sm text-white">
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-[0.2em] text-[11px] text-white/85">Next open slot</span>
                    <span className="font-semibold text-white">Today · 2:30 PM</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="services" className="space-y-6 py-10">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl text-ink-900">Popular services</h2>
            <p className="text-sm text-ink-600">Book from the most loved categories today.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Hair", detail: "Cuts, color, styling" },
              { name: "Nails", detail: "Manicure, pedicure" },
              { name: "Massage", detail: "Therapeutic, deep tissue" },
              { name: "Facial", detail: "Glow, hydration, anti-age" },
              { name: "Brows & Lashes", detail: "Shape, tint, lift" },
              { name: "Spa", detail: "Full body rituals" }
            ].map((service) => (
              <Card key={service.name} className="space-y-3 border border-charcoal-100 bg-white/85">
                <h3 className="font-display text-xl text-ink-900">{service.name}</h3>
                <p className="text-sm text-ink-600">{service.detail}</p>
                <Link href="/book" className="text-sm font-semibold text-rose-700">
                  Book now
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <section id="experience" className="grid gap-6 py-10 md:grid-cols-[1fr_1.2fr]">
          <Card className="space-y-4 border border-charcoal-100 bg-white/85">
            <h2 className="font-display text-2xl text-ink-900">For salons & spas</h2>
            <p className="text-sm text-ink-600">
              Run your business end-to-end with online booking, staff management, and payment tracking.
            </p>
            <div className="space-y-2 text-sm text-ink-700">
              <p>- Online bookings with live availability.</p>
              <p>- Automated client reminders and payment status.</p>
              <p>- Dashboards for revenue and team performance.</p>
            </div>
            <Button>Get business demo</Button>
          </Card>
          <Card className="space-y-4 border border-charcoal-100 bg-gradient-to-br from-beige-50 via-white to-white">
            <h3 className="font-display text-2xl text-ink-900">Built for visibility</h3>
            <p className="text-sm text-ink-600">
              The Fresha Studio dashboard surfaces today's bookings, revenue, and status at a glance.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-beige-100 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-ink-600">Bookings</p>
                <p className="font-display text-2xl text-ink-900">18</p>
              </div>
              <div className="rounded-2xl bg-rose-100 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-rose-700">Revenue</p>
                <p className="font-display text-2xl text-rose-700">$2,680</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 py-10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="space-y-4 border border-charcoal-100 bg-white/85">
              <h2 className="font-display text-2xl text-ink-900">Loved by clients</h2>
              <p className="text-sm text-ink-600">
                "The booking experience is so smooth, and I always get a reminder. Highly recommend."
              </p>
              <div className="text-sm text-ink-600">- Priya S., regular client</div>
              <p className="text-sm text-ink-600">
                "I manage my team schedule without spreadsheets, and clients can book 24/7."
              </p>
              <div className="text-sm text-ink-600">- Luis M., salon owner</div>
            </Card>
            <Card className="space-y-4 border border-charcoal-100 bg-white/85">
              <h2 className="font-display text-2xl text-ink-900">Why they return</h2>
              <p className="text-sm text-ink-600">
                "I can see my specialist’s availability instantly and get in without waiting on a call."
              </p>
              <div className="text-sm text-ink-600">- Maya T., spa guest</div>
              <p className="text-sm text-ink-600">
                "Payments are easy, reminders are timely, and rescheduling takes seconds."
              </p>
              <div className="text-sm text-ink-600">- Omar K., member</div>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="space-y-4 border border-charcoal-100 bg-gradient-to-br from-rose-100 via-white to-beige-50 text-charcoal-900">
              <h3 className="font-display text-2xl text-charcoal-900">Get the app</h3>
              <p className="text-sm text-charcoal-600">
                Manage your bookings and reschedule on the go. Available on iOS and Android.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">App Store</Button>
                <Button variant="outline">Google Play</Button>
              </div>
            </Card>
            <Card className="space-y-4 border border-charcoal-100 bg-gradient-to-br from-rose-600 via-rose-600 to-rose-700 text-white">
              <h3 className="font-display text-2xl text-white">Invite your clients</h3>
              <p className="text-sm text-white/90">
                Share your booking page and let clients reserve instantly. No phone calls required.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">Copy booking link</Button>
                <Button variant="outline">Share via email</Button>
              </div>
            </Card>
          </div>
        </section>

        <section id="team" className="space-y-6 py-10">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl text-ink-900">Meet the team</h2>
            <p className="text-sm text-ink-600">Trusted specialists with structured hours and expertise.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Arielle Chen", role: "Facial artistry" },
              { name: "Diego Martins", role: "Holistic massage" },
              { name: "Imani Brooks", role: "Nail design" }
            ].map((member) => (
              <Card key={member.name} className="space-y-2 border border-charcoal-100 bg-white/85">
                <h3 className="font-display text-xl text-ink-900">{member.name}</h3>
                <p className="text-sm text-ink-600">{member.role}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
