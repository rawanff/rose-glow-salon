import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calendar, Clock, Flower2, ArrowLeft, Trash2, CreditCard,
  Brush, Scissors, Palette, Sparkles, LogOut,
} from "lucide-react";
import { useAuth, getBookings, deleteBooking, type Booking } from "@/hooks/use-auth";

export const Route = createFileRoute("/my-bookings")({
  head: () => ({
    meta: [
      { title: "حجوزاتي — Rose Glow" },
      { name: "description", content: "إدارة وعرض حجوزاتك في صالون Rose Glow." },
    ],
  }),
  component: MyBookingsPage,
});

const serviceLabels: Record<string, { label: string; icon: typeof Brush }> = {
  makeup: { label: "مكياج", icon: Brush },
  hair: { label: "تصفيف الشعر", icon: Scissors },
  nails: { label: "العناية بالأظافر", icon: Palette },
};

const specialistLabels: Record<string, string> = {
  ragad: "رغد - Makeup",
  razan: "رزان - Hair",
  rawan: "روان - Nails",
};

function MyBookingsPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    async function loadBookings() {
      if (user) setBookings(await getBookings(user.email));
    }
    loadBookings().catch(() => setBookings([]));
  }, [user]);

  async function handleDelete(id: string) {
    await deleteBooking(id);
    if (user) setBookings(await getBookings(user.email));
  }

  function handleSignOut() {
    signOut();
    navigate({ to: "/" });
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="font-arabic text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-semibold text-primary">Rose Glow</span>
            <Flower2 className="h-5 w-5 text-primary" />
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-rose-pale"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          العودة للرئيسية
        </Link>

        <div className="flex flex-col items-start gap-2">
          <p className="font-arabic text-sm text-muted-foreground">أهلاً بعودتك</p>
          <h1 className="font-display text-4xl font-medium text-rose-deep">
            حجوزاتي <span className="font-arabic text-2xl text-primary">— {user.name}</span>
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="h-px w-16 bg-primary/40" />
            <Flower2 className="h-5 w-5 text-primary" />
            <span className="h-px w-16 bg-primary/40" />
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-primary/20 bg-rose-pale/40 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-soft">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mt-4 font-display text-2xl text-rose-deep">لا يوجد حجوزات بعد</h2>
            <p className="mt-2 font-arabic text-sm text-muted-foreground">
              احجزي موعدك الأول معنا واستمتعي بتجربة فاخرة
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
            >
              <Calendar className="h-4 w-4" />
              احجزي الآن
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-4">
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} onDelete={() => handleDelete(b.id)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BookingCard({ booking, onDelete }: { booking: Booking; onDelete: () => void }) {
  const svc = serviceLabels[booking.service] ?? { label: booking.service, icon: Sparkles };
  const Icon = svc.icon;
  const specialist = specialistLabels[booking.specialist] ?? booking.specialist;
  const isPast = new Date(`${booking.date}T00:00:00`) < new Date(new Date().toDateString());

  return (
    <article className="group flex flex-col gap-4 rounded-3xl border border-primary/10 bg-card p-6 shadow-soft transition-all hover:shadow-card sm:flex-row sm:items-center">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-pale text-primary">
        <Icon className="h-6 w-6" />
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-arabic text-lg font-semibold text-rose-deep">{svc.label}</h3>
          {isPast ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">منتهي</span>
          ) : (
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">قادم</span>
          )}
        </div>
        <p className="mt-1 font-arabic text-sm text-muted-foreground">مع {specialist}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-foreground/80">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            {booking.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            {booking.time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-primary" />
            {booking.payment === "online" ? "دفع أونلاين" : "كاش في الصالون"}
          </span>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="inline-flex items-center gap-2 self-start rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 sm:self-auto"
        aria-label="حذف الحجز"
      >
        <Trash2 className="h-4 w-4" />
        إلغاء
      </button>
    </article>
  );
}
