import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, addBooking } from "@/hooks/use-auth";
import salonHero from "@/assets/salon-hero.jpg";
import specialist1 from "@/assets/specialist-1.jpg";
import specialist2 from "@/assets/specialist-2.jpg";
import specialist3 from "@/assets/specialist-3.jpg";
import {
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Bell,
  ChevronDown,
  Star,
  CreditCard,
  CheckCircle2,
  Scissors,
  Palette,
  Brush,
  Flower2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rose Glow — صالون التجميل الفاخر" },
      {
        name: "description",
        content: "احجزي موعدك في صالون Rose Glow للعناية بالشعر والمكياج والأظافر مع أفضل المتخصصات.",
      },
      { property: "og:title", content: "Rose Glow — صالون التجميل الفاخر" },
      {
        property: "og:description",
        content: "احجزي موعدك في صالون Rose Glow للعناية بالشعر والمكياج والأظافر.",
      },
    ],
  }),
  component: Index,
});

const services = [
  { value: "makeup", label: "مكياج", icon: Brush },
  { value: "hair", label: "تصفيف الشعر", icon: Scissors },
  { value: "nails", label: "العناية بالأظافر", icon: Palette },
];

// Each service is performed by exactly one specialist
const serviceSpecialistMap: Record<
  string,
  { id: string; name: string; arabicRole: string; roleEn: string; expertise: string; avatar: string }
> = {
  makeup: {
    id: "ragad",
    name: "رغد",
    arabicRole: "متخصصة في المكياج",
    roleEn: "Specialist in Makeup",
    expertise: "ميكب ناعم - ميكب سموكي - مناسبات",
    avatar: specialist2,
  },
  hair: {
    id: "razan",
    name: "رزان",
    arabicRole: "متخصصة في تصفيف الشعر",
    roleEn: "Specialist in Hair",
    expertise: "تصفيف - صبغة - تسريحات مناسبات",
    avatar: specialist1,
  },
  nails: {
    id: "rawan",
    name: "روان",
    arabicRole: "متخصصة في الأظافر",
    roleEn: "Specialist in Nails",
    expertise: "مانيكير - بديكير - تركيب أظافر",
    avatar: specialist3,
  },
};

const specialists = [
  {
    name: "رزان",
    role: "Hair Specialist",
    arabicRole: "متخصصة في الشعر",
    tag: "الشعر",
    image: specialist1,
    icon: Scissors,
  },
  {
    name: "رغد",
    role: "Makeup Artist",
    arabicRole: "متخصصة في المكياج",
    tag: "المكياج",
    image: specialist2,
    icon: Brush,
  },
  {
    name: "روان",
    role: "Nail Technician",
    arabicRole: "متخصصة في الأظافر",
    tag: "الأظافر",
    image: specialist3,
    icon: Palette,
  },
];

function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState("makeup");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("11:00 AM");
  const [payment, setPayment] = useState("online");
  const [confirmMsg, setConfirmMsg] = useState("");

  const assignedSpecialist = serviceSpecialistMap[service];

  async function handleConfirm() {
    setConfirmMsg("");
    if (!user) {
      navigate({ to: "/login" });
      return;
    }

    try {
      await addBooking({
        userEmail: user.email,
        service,
        date,
        time,
        payment,
      });
      setConfirmMsg("تم تأكيد الحجز بنجاح ✨");
      setTimeout(() => navigate({ to: "/my-bookings" }), 900);
    } catch (err) {
      setConfirmMsg(err instanceof Error ? err.message : "تعذر تأكيد الحجز");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero + Booking */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${salonHero})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rose-pale/85 via-rose-pale/70 to-rose-soft/95" aria-hidden />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-2 lg:py-24">
          {/* Left: Hero text */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold tracking-[0.25em] text-primary">
              BOOK AN APPOINTMENT
            </p>
            <h1 className="mt-6 font-display text-5xl font-medium leading-tight text-rose-deep lg:text-6xl">
              Book Your<br />Beauty Session
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-24 bg-primary/40" />
              <Flower2 className="h-5 w-5 text-primary" />
              <span className="h-px w-24 bg-primary/40" />
            </div>

            <p className="mt-6 max-w-md font-arabic text-base leading-relaxed text-foreground/80">
              اختاري الخدمة، المتخصصة، التاريخ والوقت
              <br />
              لحجز موعدك بكل سهولة.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <FeatureBadge icon={ShieldCheck} title="Trusted Specialists" subtitle="Professional care" />
              <FeatureBadge icon={Clock} title="On-Time Service" subtitle="Your time matters" />
            </div>

            <div className="mt-6 flex max-w-md items-center gap-3 rounded-2xl border border-primary/10 bg-card/80 px-5 py-3 shadow-soft backdrop-blur">
              <Bell className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">
                You will receive a reminder email before your appointment.
              </p>
            </div>
          </div>

          {/* Right: Booking card */}
          <div className="rounded-3xl border border-primary/10 bg-card/95 p-8 shadow-card backdrop-blur">
            <div className="flex items-center justify-center gap-3 border-b border-border/60 pb-5">
              <Calendar className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-semibold text-rose-deep">Book Appointment</h2>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Select Service">
                <SelectInput
                  icon={Brush}
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  options={services.map((s) => ({ value: s.value, label: s.label }))}
                />
              </Field>

              <Field label="Your Specialist">
                <div className="flex items-center gap-3 rounded-xl border border-input bg-background px-4 py-3">
                  <img
                    src={assignedSpecialist.avatar}
                    alt={assignedSpecialist.name}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <div className="font-arabic">
                    <p className="text-sm font-semibold text-rose-deep">{assignedSpecialist.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      {assignedSpecialist.roleEn}
                    </p>
                  </div>
                </div>
              </Field>

              <div className="rounded-xl bg-rose-pale px-4 py-3 sm:col-span-1">
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <div className="font-arabic">
                    <p className="text-sm font-semibold text-rose-deep">{assignedSpecialist.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">{assignedSpecialist.roleEn}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-rose-pale px-4 py-3 text-right sm:col-span-1" dir="rtl">
                <p className="font-arabic text-sm font-semibold text-rose-deep">تخصصها</p>
                <p className="font-arabic text-xs text-muted-foreground">
                  {assignedSpecialist.expertise}
                </p>
              </div>

              <Field label="Select Date">
                <div className="relative flex items-center gap-3 rounded-xl border border-input bg-background px-4 py-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground outline-none"
                  />
                </div>
              </Field>

              <Field label="Select Time">
                <SelectInput
                  icon={Clock}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  options={[
                    { value: "10:00 AM", label: "10:00 AM" },
                    { value: "11:00 AM", label: "11:00 AM" },
                    { value: "01:00 PM", label: "01:00 PM" },
                    { value: "03:00 PM", label: "03:00 PM" },
                    { value: "05:00 PM", label: "05:00 PM" },
                  ]}
                />
              </Field>

              <Field label="Payment Method">
                <SelectInput
                  icon={CreditCard}
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  options={[
                    { value: "online", label: "Pay Online" },
                    { value: "cash", label: "Cash at Salon" },
                  ]}
                />
              </Field>

              <div className="flex items-end">
                <div className="flex w-full items-center gap-2 rounded-xl border border-success/30 bg-success/5 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Secure Payment</span>
                </div>
              </div>
            </div>

            {/* Booking summary */}
            <div className="mt-6 rounded-2xl bg-rose-pale/70 p-5">
              <h3 className="font-display text-lg font-semibold text-rose-deep">Booking Summary</h3>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <SummaryRow label="Service" value={services.find((s) => s.value === service)?.label ?? service} arabic />
                <SummaryRow label="Date" value={date} />
                <SummaryRow
                  label="Specialist"
                  value={`${assignedSpecialist.name} — ${assignedSpecialist.roleEn}`}
                  arabic
                />
                <SummaryRow label="Time" value={time} />
              </div>
            </div>

            {confirmMsg && (
              <div className="mt-4 rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-center font-arabic text-sm font-medium text-success">
                {confirmMsg}
              </div>
            )}

            <button
              onClick={handleConfirm}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-primary px-6 py-4 font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Calendar className="h-5 w-5" />
              {user ? "Confirm Booking" : "Sign in to Book"}
            </button>
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section className="bg-rose-pale/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-4">
              <span className="h-px w-16 bg-primary/40" />
              <h2 className="font-display text-4xl font-medium text-rose-deep">Our Specialists</h2>
              <span className="h-px w-16 bg-primary/40" />
            </div>
            <Flower2 className="mt-3 h-6 w-6 text-primary" />
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {specialists.map((s) => (
              <SpecialistCard key={s.name} specialist={s} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-8 text-center text-sm text-muted-foreground">
        <p className="font-display text-lg text-primary">Rose Glow</p>
        <p className="mt-2 font-arabic">صالون التجميل الفاخر — جميع الحقوق محفوظة © 2025</p>
      </footer>
    </div>
  );
}

function Header() {
  const { user, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-3xl font-semibold text-primary">Rose Glow</span>
          <Flower2 className="h-6 w-6 text-primary" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/my-bookings" className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary">
            My Bookings
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/my-bookings"
                className="hidden items-center gap-2 rounded-full bg-rose-pale py-1.5 pl-3 pr-3 sm:flex"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-arabic text-sm font-medium">أهلاً، {user.name}</span>
              </Link>
              <button
                onClick={signOut}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-rose-pale"
              >
                خروج
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-gradient-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function FeatureBadge({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof ShieldCheck;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-card/80 px-5 py-3 shadow-soft backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-semibold text-rose-deep">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function SelectInput({
  icon: Icon,
  avatar,
  options,
  value,
  defaultValue,
  onChange,
}: {
  icon?: typeof Brush;
  avatar?: string;
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="relative flex items-center gap-3 rounded-xl border border-input bg-background px-4 py-3">
      {Icon && <Icon className="h-4 w-4 shrink-0 text-primary" />}
      {avatar && (
        <img src={avatar} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
      )}
      <select
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className="w-full appearance-none bg-transparent pr-6 text-sm text-foreground outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-muted-foreground" />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  arabic,
}: {
  label: string;
  value: string;
  arabic?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium text-foreground ${arabic ? "font-arabic" : ""}`}>{value}</span>
    </div>
  );
}

function SpecialistCard({
  specialist,
}: {
  specialist: (typeof specialists)[number];
}) {
  const Icon = specialist.icon;
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-center gap-5" dir="rtl">
        <img
          src={specialist.image}
          alt={specialist.name}
          loading="lazy"
          width={96}
          height={96}
          className="h-24 w-24 rounded-full border-4 border-rose-pale object-cover shadow-soft"
        />
        <div className="flex-1">
          <h3 className="font-arabic text-2xl font-bold text-rose-deep">{specialist.name}</h3>
          <p className="mt-1 text-sm font-medium text-foreground/80" dir="ltr">
            {specialist.role}
          </p>
          <p className="mt-1 font-arabic text-xs text-muted-foreground">{specialist.arabicRole}</p>
          <span className="mt-3 inline-block rounded-full bg-rose-pale px-3 py-1 font-arabic text-xs text-primary">
            {specialist.tag}
          </span>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-pale text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}
