import { useState, type FormEvent } from "react";
import { COUNTRIES } from "./lib/countries";
import {
  submitWaitlistResponses,
  type WaitlistResponseResult,
} from "./lib/api";
import type {
  CallIntent,
  Role,
  Sector,
  Solution,
  Timeline,
} from "./lib/scoring";
import type { Lang, Messages } from "./messages";
import { Button, Label, Progress, Select, Textarea } from "./components/ui";
import { interpolate } from "./lib/utils";

interface Props {
  lang: Lang;
  t: Messages;
  initialEmail: string;
  calendlyUrl: string;
}

interface State {
  role: Role | "";
  country: string;
  sector: Sector | "";
  painText: string;
  solutions: Solution[];
  timeline: Timeline | "";
  callIntent: CallIntent | "";
}

const TOTAL_STEPS = 6;

export function ThankYouForm({ lang, t, initialEmail, calendlyUrl }: Props) {
  const [step, setStep] = useState<number>(1);
  const [state, setState] = useState<State>({
    role: "",
    country: "",
    sector: "",
    painText: "",
    solutions: [],
    timeline: "",
    callIntent: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<WaitlistResponseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const q = t.thankYou.q;

  const canGoNext = (): boolean => {
    switch (step) {
      case 1:
        return state.role !== "";
      case 2:
        return state.country !== "" && state.sector !== "";
      case 3:
        return state.painText.trim().length >= 10;
      case 4:
        return state.solutions.length > 0;
      case 5:
        return state.timeline !== "";
      case 6:
        return state.callIntent !== "";
      default:
        return false;
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canGoNext()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitWaitlistResponses({
        email: initialEmail,
        lang,
        role: state.role as Role,
        country: state.country,
        sector: state.sector as Sector,
        painText: state.painText,
        solutions: state.solutions,
        timeline: state.timeline as Timeline,
        callIntent: state.callIntent as CallIntent,
      });
      setResult(res);
    } catch {
      setError(t.thankYou.errorGeneric);
      setSubmitting(false);
    }
  };

  if (result) return <ResultPanel t={t} result={result} calendlyUrl={calendlyUrl} />;

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      <Progress value={step} max={TOTAL_STEPS} />
      <p className="text-xs uppercase tracking-wider text-brand-muted">
        {interpolate(t.thankYou.progress, { current: step, total: TOTAL_STEPS })}
      </p>

      {step === 1 && (
        <Fieldset label={q.role.label}>
          {q.role.options.map((o) => (
            <RadioCard
              key={o.id}
              name="role"
              value={o.id}
              checked={state.role === o.id}
              onChange={() => setState((s) => ({ ...s, role: o.id as Role }))}
              label={o.label}
            />
          ))}
        </Fieldset>
      )}

      {step === 2 && (
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="country" className="mb-2">
              {q.country.label}
            </Label>
            <Select
              id="country"
              value={state.country}
              onChange={(e) => setState((s) => ({ ...s, country: e.currentTarget.value }))}
            >
              <option value="" disabled>
                —
              </option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {lang === "es" ? c.es : c.en}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="sector" className="mb-2">
              {q.sector.label}
            </Label>
            <Select
              id="sector"
              value={state.sector}
              onChange={(e) =>
                setState((s) => ({ ...s, sector: e.currentTarget.value as Sector }))
              }
            >
              <option value="" disabled>
                —
              </option>
              {q.sector.options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <Label htmlFor="pain" className="mb-2">
            {q.pain.label}
          </Label>
          <Textarea
            id="pain"
            rows={4}
            maxLength={200}
            placeholder={q.pain.placeholder}
            value={state.painText}
            onChange={(e) => setState((s) => ({ ...s, painText: e.currentTarget.value }))}
          />
          <p className="mt-2 text-xs text-brand-muted">{q.pain.hint}</p>
          <p className="mt-1 text-xs text-brand-muted">
            {state.painText.length}/200
          </p>
        </div>
      )}

      {step === 4 && (
        <Fieldset label={q.solutions.label} hint={q.solutions.hint}>
          {q.solutions.options.map((o) => (
            <CheckCard
              key={o.id}
              value={o.id}
              checked={state.solutions.includes(o.id as Solution)}
              onChange={(checked) =>
                setState((s) => {
                  const next = new Set(s.solutions);
                  if (checked) next.add(o.id as Solution);
                  else next.delete(o.id as Solution);
                  return { ...s, solutions: Array.from(next) };
                })
              }
              label={o.label}
            />
          ))}
        </Fieldset>
      )}

      {step === 5 && (
        <Fieldset label={q.timeline.label}>
          {q.timeline.options.map((o) => (
            <RadioCard
              key={o.id}
              name="timeline"
              value={o.id}
              checked={state.timeline === o.id}
              onChange={() =>
                setState((s) => ({ ...s, timeline: o.id as Timeline }))
              }
              label={o.label}
            />
          ))}
        </Fieldset>
      )}

      {step === 6 && (
        <Fieldset label={q.callIntent.label}>
          {q.callIntent.options.map((o) => (
            <RadioCard
              key={o.id}
              name="call"
              value={o.id}
              checked={state.callIntent === o.id}
              onChange={() =>
                setState((s) => ({ ...s, callIntent: o.id as CallIntent }))
              }
              label={o.label}
            />
          ))}
        </Fieldset>
      )}

      {error && <p className="text-sm text-brand-danger">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1 || submitting}
        >
          {t.thankYou.back}
        </Button>
        {step < TOTAL_STEPS ? (
          <Button
            type="button"
            onClick={() => canGoNext() && setStep((s) => s + 1)}
            disabled={!canGoNext()}
          >
            {t.thankYou.next}
          </Button>
        ) : (
          <Button type="submit" disabled={!canGoNext() || submitting}>
            {submitting ? t.thankYou.submitting : t.thankYou.submit}
          </Button>
        )}
      </div>
    </form>
  );
}

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function Fieldset({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-medium text-brand-text">{label}</legend>
      {hint && <p className="text-xs text-brand-muted">{hint}</p>}
      <div className="grid gap-2">{children}</div>
    </fieldset>
  );
}

function RadioCard({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      className={
        "flex cursor-pointer items-center gap-3 rounded-lg border bg-brand-surface px-4 py-3 transition-colors " +
        (checked
          ? "border-brand-accent"
          : "border-brand-border hover:border-brand-accent-dim")
      }
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="accent-brand-accent"
      />
      <span className="text-sm text-brand-text">{label}</span>
    </label>
  );
}

function CheckCard({
  value,
  checked,
  onChange,
  label,
}: {
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label
      className={
        "flex cursor-pointer items-center gap-3 rounded-lg border bg-brand-surface px-4 py-3 transition-colors " +
        (checked
          ? "border-brand-accent"
          : "border-brand-border hover:border-brand-accent-dim")
      }
    >
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
        className="accent-brand-accent"
      />
      <span className="text-sm text-brand-text">{label}</span>
    </label>
  );
}

function ResultPanel({
  t,
  result,
  calendlyUrl,
}: {
  t: Messages;
  result: WaitlistResponseResult;
  calendlyUrl: string;
}) {
  if (result.tier === "green") {
    const g = t.thankYou.resultGreen;
    return (
      <div className="rounded-xl border border-brand-accent bg-brand-surface p-6">
        <h2 className="text-2xl font-bold text-brand-text">{g.h2}</h2>
        <p className="mt-3 text-base text-brand-muted">{g.body}</p>
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-3 text-sm font-semibold text-brand-bg hover:bg-brand-accent-dim"
        >
          {g.calendlyLabel}
        </a>
        <p className="mt-4 text-xs text-brand-muted">{g.note}</p>
      </div>
    );
  }
  if (result.tier === "yellow") {
    const y = t.thankYou.resultYellow;
    return (
      <div className="rounded-xl border border-brand-border bg-brand-surface p-6">
        <h2 className="text-2xl font-bold text-brand-text">{y.h2}</h2>
        <p className="mt-3 text-base text-brand-muted">{y.body}</p>
      </div>
    );
  }
  const r = t.thankYou.resultRed;
  return (
    <div className="rounded-xl border border-brand-border bg-brand-surface p-6">
      <h2 className="text-2xl font-bold text-brand-text">{r.h2}</h2>
      <p className="mt-3 text-base text-brand-muted">{r.body}</p>
    </div>
  );
}
