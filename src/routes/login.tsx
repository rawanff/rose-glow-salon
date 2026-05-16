import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Flower2, Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — Rose Glow" },
      { name: "description", content: "سجلي الدخول إلى حسابك في Rose Glow لإدارة حجوزاتك." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        if (name.trim().length < 2) throw new Error("الرجاء إدخال اسم صحيح");
        if (password.length < 6) throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        await signUp(name.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      navigate({ to: "/my-bookings" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-pale via-background to-rose-soft" aria-hidden />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          العودة للرئيسية
        </Link>

        <div className="rounded-3xl border border-primary/10 bg-card/95 p-8 shadow-card backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-semibold text-primary">Rose Glow</span>
              <Flower2 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="mt-4 font-display text-3xl font-medium text-rose-deep">
              {mode === "signin" ? "أهلاً بعودتك" : "أنشئي حسابك"}
            </h1>
            <p className="mt-2 font-arabic text-sm text-muted-foreground">
              {mode === "signin"
                ? "سجلي الدخول لإدارة حجوزاتك"
                : "أنشئي حساب لحجز موعدك بسهولة"}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-rose-pale p-1">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(""); }}
              className={`rounded-lg py-2 text-sm font-medium transition-all ${
                mode === "signin" ? "bg-card text-rose-deep shadow-soft" : "text-muted-foreground"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); }}
              className={`rounded-lg py-2 text-sm font-medium transition-all ${
                mode === "signup" ? "bg-card text-rose-deep shadow-soft" : "text-muted-foreground"
              }`}
            >
              حساب جديد
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <InputField
                icon={UserIcon}
                label="الاسم"
                type="text"
                value={name}
                onChange={setName}
                placeholder="اسمك الكامل"
                required
              />
            )}
            <InputField
              icon={Mail}
              label="الإيميل"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
            />
            <InputField
              icon={Lock}
              label="كلمة المرور"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary px-6 py-3.5 font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              {submitting ? "جاري المعالجة..." : mode === "signin" ? "تسجيل الدخول" : "إنشاء الحساب"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Backend متصل — البيانات تُحفظ في السيرفر المحلي
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon: Icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  icon: typeof Mail;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-3 rounded-xl border border-input bg-background px-4 py-3 transition-colors focus-within:border-primary">
        <Icon className="h-4 w-4 shrink-0 text-primary" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
