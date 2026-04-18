import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import { ArrowRight, Check, Quote } from "lucide-react";
import { Button, Input } from "./components/ui";
import { ThankYouForm } from "./ThankYouForm";
import { MESSAGES, type Lang, type Messages } from "./messages";
import { fetchWaitlistCount, signupToWaitlist } from "./lib/api";
import { isValidEmail } from "./lib/utils";

const CALENDLY_URL: string =
  import.meta.env.VITE_CALENDLY_URL ??
  "https://calendly.com/manuela-orozco/biosync-feedback";

// ------------------------------------------------------------------
// Router
// ------------------------------------------------------------------

export function App() {
  return (
    <Switch>
      <Route path="/" component={RedirectToDefault} />
      <Route path="/es" component={() => <Home lang="es" />} />
      <Route path="/es/" component={() => <Home lang="es" />} />
      <Route path="/en" component={() => <Home lang="en" />} />
      <Route path="/en/" component={() => <Home lang="en" />} />
      <Route
        path="/es/gracias"
        component={() => <ThankYouPage lang="es" />}
      />
      <Route
        path="/en/thank-you"
        component={() => <ThankYouPage lang="en" />}
      />
      <Route component={RedirectToDefault} />
    </Switch>
  );
}

function RedirectToDefault() {
  const preferred: Lang = detectDefaultLang();
  return <Redirect to={`/${preferred}`} replace />;
}

function detectDefaultLang(): Lang {
  if (typeof navigator === "undefined") return "es";
  const nav = navigator.language.toLowerCase();
  return nav.startsWith("en") ? "en" : "es";
}

// ------------------------------------------------------------------
// Home — full landing
// ------------------------------------------------------------------

function Home({ lang }: { lang: Lang }) {
  const t = MESSAGES[lang];
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    let alive = true;
    void fetchWaitlistCount().then((n) => {
      if (alive) setCounter(n);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "es"
        ? "BioSync Studio — El cerebro digital de tu biorreactor"
        : "BioSync Studio — The digital brain for your bioreactor";
  }, [lang]);

  return (
    <div className="min-h-screen">
      <Nav lang={lang} t={t} />
      <Hero lang={lang} t={t} counter={counter} onSignup={setCounter} />
      <SocialProof t={t} counter={counter} />
      <Problem t={t} />
      <Dream t={t} />
      <How t={t} />
      <What t={t} />
      <Founder t={t} />
      <BuildInPublic t={t} />
      <FinalCta lang={lang} t={t} onSignup={setCounter} />
      <Footer t={t} />
    </div>
  );
}

// ------------------------------------------------------------------
// Nav
// ------------------------------------------------------------------

function Nav({ lang, t }: { lang: Lang; t: Messages }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-brand-border bg-brand-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href={`/${lang}`} className="flex items-center gap-2">
          <LogoMark />
          <span className="font-semibold tracking-tight">BioSync Studio</span>
        </a>
        <div className="flex items-center gap-4">
          <LangToggle lang={lang} />
          <a href="#final-cta">
            <Button variant="ghost" className="hidden sm:inline-flex">
              {t.nav.cta}
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-accent text-brand-bg font-bold"
    >
      B
    </span>
  );
}

function LangToggle({ lang }: { lang: Lang }) {
  const [, setLocation] = useLocation();
  const other: Lang = lang === "es" ? "en" : "es";
  const label = other.toUpperCase();
  return (
    <button
      type="button"
      className="rounded-md border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-text hover:border-brand-accent hover:text-brand-accent"
      onClick={() => setLocation(`/${other}`)}
      aria-label={`Switch to ${other}`}
    >
      {label}
    </button>
  );
}

// ------------------------------------------------------------------
// Hero + FinalCta share email form
// ------------------------------------------------------------------

function EmailForm({
  lang,
  t,
  onSignup,
  id,
  autoFocus,
}: {
  lang: Lang;
  t: Messages["hero"] | Messages["finalCta"];
  onSignup: (newCount: number) => void;
  id?: string;
  autoFocus?: boolean;
}) {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isValidEmail(email)) {
        setError((t as Messages["hero"]).errorInvalid ?? "Invalid email");
        return;
      }
      setSubmitting(true);
      setError(null);
      try {
        const res = await signupToWaitlist({ email, lang });
        onSignup(res.count);
        const thanksPath = lang === "es" ? "/es/gracias" : "/en/thank-you";
        setLocation(`${thanksPath}?email=${encodeURIComponent(email)}`);
      } catch {
        setError("Network error. Retry.");
        setSubmitting(false);
      }
    },
    [email, lang, onSignup, setLocation, t],
  );

  return (
    <form
      id={id}
      onSubmit={submit}
      className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
      noValidate
    >
      <div className="flex-1">
        <label htmlFor={`${id ?? "hero"}-email`} className="sr-only">
          Email
        </label>
        <Input
          id={`${id ?? "hero"}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          autoFocus={autoFocus}
          placeholder={
            (t as Messages["hero"]).emailPlaceholder ??
            (t as Messages["finalCta"]).emailPlaceholder
          }
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          aria-invalid={!!error}
        />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting
          ? (t as Messages["hero"]).submitting ?? "…"
          : t.button}
        <ArrowRight size={16} />
      </Button>
      {error && (
        <p className="text-sm text-brand-danger sm:absolute sm:-bottom-6">
          {error}
        </p>
      )}
    </form>
  );
}

function Hero({
  lang,
  t,
  counter,
  onSignup,
}: {
  lang: Lang;
  t: Messages;
  counter: number;
  onSignup: (n: number) => void;
}) {
  return (
    <section className="dot-grid relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            {t.hero.h1}
          </h1>
          <p className="mt-6 text-lg text-brand-muted sm:text-xl">
            {t.hero.sub}
          </p>
          <div className="mt-10 relative">
            <EmailForm
              lang={lang}
              t={t.hero}
              onSignup={onSignup}
              id="hero"
              autoFocus
            />
          </div>
          {counter > 0 && (
            <p className="mt-10 text-sm text-brand-muted">
              <span className="text-brand-accent font-semibold">
                {t.hero.counterBefore} {counter}
              </span>{" "}
              {t.hero.counterAfter}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// SocialProof
// ------------------------------------------------------------------

function SocialProof({ t, counter }: { t: Messages; counter: number }) {
  return (
    <section className="border-y border-brand-border bg-brand-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm uppercase tracking-wider text-brand-muted">
          {t.social.intro}
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {t.social.quotes.map((q, i) => (
            <figure
              key={i}
              className="rounded-xl border border-brand-border bg-brand-surface-2 p-6"
            >
              <Quote size={20} className="text-brand-accent" />
              <blockquote className="mt-3 text-base leading-relaxed text-brand-text">
                {q.text}
              </blockquote>
              <figcaption className="mt-4 text-sm text-brand-muted">
                — {q.who}
              </figcaption>
            </figure>
          ))}
        </div>
        {counter > 0 && (
          <p className="mt-8 text-sm text-brand-muted">
            {t.hero.counterBefore}{" "}
            <span className="font-semibold text-brand-accent">{counter}</span>{" "}
            {t.hero.counterAfter}
          </p>
        )}
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Problem
// ------------------------------------------------------------------

function Problem({ t }: { t: Messages }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
        {t.problem.h2}
      </h2>
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {t.problem.bullets.map((b, i) => (
          <li
            key={i}
            className="rounded-xl border border-brand-border bg-brand-surface p-6 text-base leading-relaxed text-brand-text"
          >
            {b}
          </li>
        ))}
      </ul>
      <p className="mt-10 text-lg text-brand-accent">{t.problem.closing}</p>
    </section>
  );
}

// ------------------------------------------------------------------
// Dream
// ------------------------------------------------------------------

function Dream({ t }: { t: Messages }) {
  return (
    <section className="border-y border-brand-border bg-brand-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          {t.dream.h2}
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-brand-text">
          {t.dream.body}
        </p>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// How
// ------------------------------------------------------------------

function How({ t }: { t: Messages }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t.how.h2}
      </h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {t.how.steps.map((step) => (
          <li
            key={step.n}
            className="rounded-xl border border-brand-border bg-brand-surface p-6"
          >
            <span className="inline-block font-mono text-xs text-brand-accent">
              {step.n}
            </span>
            <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
            <p className="mt-3 text-base text-brand-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ------------------------------------------------------------------
// What / Moat
// ------------------------------------------------------------------

function What({ t }: { t: Messages }) {
  return (
    <section className="border-y border-brand-border bg-brand-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t.what.h2}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {t.what.bullets.map((b) => (
            <article
              key={b.title}
              className="rounded-xl border border-brand-border bg-brand-surface-2 p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                  <Check size={16} />
                </span>
                <h3 className="text-xl font-semibold">{b.title}</h3>
              </div>
              <p className="mt-3 text-base leading-relaxed text-brand-muted">
                {b.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Founder
// ------------------------------------------------------------------

function Founder({ t }: { t: Messages }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
        <div
          aria-hidden="true"
          className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-surface text-xs text-brand-muted"
          title="founder photo placeholder"
        >
          foto · placeholder
        </div>
        <div className="max-w-2xl">
          <Quote size={24} className="text-brand-accent" />
          <blockquote className="mt-3 text-xl leading-relaxed text-brand-text">
            {t.founder.quote}
          </blockquote>
          <p className="mt-6 text-base font-semibold">{t.founder.name}</p>
          <p className="text-sm text-brand-muted">{t.founder.title}</p>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// BuildInPublic
// ------------------------------------------------------------------

function BuildInPublic({ t }: { t: Messages }) {
  return (
    <section className="dot-grid border-y border-brand-border bg-brand-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          {t.buildInPublic.h2}
        </h2>
        <p className="mt-6 max-w-3xl text-lg text-brand-muted">
          {t.buildInPublic.body}
        </p>
        <a
          href="https://www.linkedin.com/in/manuela-orozco"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 text-brand-accent hover:underline underline-offset-4"
        >
          {t.buildInPublic.cta}
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Final CTA
// ------------------------------------------------------------------

function FinalCta({
  lang,
  t,
  onSignup,
}: {
  lang: Lang;
  t: Messages;
  onSignup: (n: number) => void;
}) {
  return (
    <section id="final-cta" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
        {t.finalCta.h2}
      </h2>
      <p className="mt-6 max-w-3xl text-lg text-brand-muted">
        {t.finalCta.body}
      </p>
      <div className="mt-10 relative">
        <EmailForm lang={lang} t={t.finalCta} onSignup={onSignup} id="final" />
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Footer
// ------------------------------------------------------------------

function Footer({ t }: { t: Messages }) {
  return (
    <footer className="border-t border-brand-border bg-brand-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-brand-muted">{t.footer.tagline}</p>
        <ul className="flex flex-wrap items-center gap-5 text-sm">
          {t.footer.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-brand-muted hover:text-brand-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${t.footer.contact}`}
              className="text-brand-muted hover:text-brand-accent"
            >
              {t.footer.contact}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

// ------------------------------------------------------------------
// ThankYou page wrapper
// ------------------------------------------------------------------

function ThankYouPage({ lang }: { lang: Lang }) {
  const t = MESSAGES[lang];
  const [emailParam, setEmailParam] = useState("");

  useEffect(() => {
    document.documentElement.lang = lang;
    const qs = new URLSearchParams(window.location.search);
    setEmailParam(qs.get("email") ?? "");
  }, [lang]);

  return (
    <div className="min-h-screen">
      <Nav lang={lang} t={t} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t.thankYou.h1}
        </h1>
        <p className="mt-4 text-base text-brand-muted">{t.thankYou.sub}</p>
        <div className="mt-10">
          <ThankYouForm
            lang={lang}
            t={t}
            initialEmail={emailParam}
            calendlyUrl={CALENDLY_URL}
          />
        </div>
      </main>
      <Footer t={t} />
    </div>
  );
}

