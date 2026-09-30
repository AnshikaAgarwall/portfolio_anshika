// Contact form: Name, Email, Subject (optional), Message (+ live counter).
// - Visible labels, inline errors (icon + "Error:" text, not colour alone),
//   aria-invalid + aria-describedby, polite error summary.
// - Validates on blur and on submit; a failed submit focuses the first
//   invalid field. Values are trimmed before validating and sending.
// - While sending, the whole fieldset is disabled (no double submit).
// - Success: toast + thank-you panel with "Send another message".
//   Error: toast + friendly message with the email as a fallback; the typed
//   values are kept. After a successful send, submits are blocked for 30s.
// - Honeypot field: if a bot fills it, fake success without calling the API.
import { useEffect, useRef, useState } from 'react';
import Button from './Button.jsx';
import { useToast } from './Toast.jsx';
import { sendContactMessage } from '../services/api.js';
import { CONTACT_LIMITS, validateContact, validateField } from '../utils/validateContact.js';
import { cn } from '../utils/cn.js';
import { pagesContent } from '../data/pagesContent.js';

const t = pagesContent.contact;
const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };
const FIELD_ORDER = ['name', 'email', 'message'];
const COOLDOWN_MS = 30_000;

// Module-level so the 30s cooldown survives leaving and re-opening the page.
let lastSentAt = 0;

const trimAll = (values) => Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]));

export default function ContactForm({ fallbackEmail }) {
  const toast = useToast();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [showSummary, setShowSummary] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const fieldRefs = useRef({});
  const thanksRef = useRef(null);

  const sending = status === 'sending';
  const cooldownLeft = Math.max(0, Math.ceil((lastSentAt + COOLDOWN_MS - now) / 1000));
  const coolingDown = cooldownLeft > 0;

  // Tick once a second while the cooldown runs.
  useEffect(() => {
    if (!coolingDown) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [coolingDown]);

  // Move focus to the thank-you heading so screen readers hear it.
  useEffect(() => {
    if (status === 'success') thanksRef.current?.focus();
  }, [status]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    // Once a field shows an error, re-check it live so it clears as soon as it's fixed.
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: validateField(name, value, t.errors) }));
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    if (FIELD_ORDER.includes(name)) setErrors((errs) => ({ ...errs, [name]: validateField(name, value, t.errors) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending || coolingDown) return;

    const data = trimAll(values);
    const found = validateContact(data, t.errors);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setShowSummary(true);
      fieldRefs.current[FIELD_ORDER.find((f) => found[f])]?.focus();
      return;
    }
    setShowSummary(false);

    const succeed = () => {
      lastSentAt = Date.now();
      setNow(lastSentAt);
      setStatus('success');
      toast.success(t.form.toastSuccess);
    };

    // Honeypot filled: almost certainly a bot. Pretend it worked.
    if (data.website) {
      succeed();
      return;
    }

    setStatus('sending');
    try {
      const { website, ...message } = data; // eslint-disable-line no-unused-vars
      await sendContactMessage(message);
      succeed();
    } catch {
      setStatus('error');
      toast.error(t.form.toastError);
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setShowSummary(false);
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="border-y border-rule py-12">
        <p className="label mb-4 text-muted">{t.form.thanks.label}</p>
        <h3
          ref={thanksRef}
          tabIndex={-1}
          className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-display"
        >
          {t.form.thanks.heading}
        </h3>
        <p className="mt-6 max-w-md text-base leading-relaxed">{t.form.thanks.body}</p>
        <Button onClick={reset} variant="outline" className="mt-10">
          {t.form.thanks.again}
        </Button>
      </div>
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;
  const f = t.form.fields;

  // Shared props for each input: value, handlers, a11y wiring.
  const fieldProps = (name, extraDescribedBy) => {
    const describedBy = [errors[name] && `${name}-error`, extraDescribedBy].filter(Boolean).join(' ') || undefined;
    return {
      id: name,
      name,
      value: values[name],
      onChange,
      onBlur,
      ref: (el) => (fieldRefs.current[name] = el),
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': describedBy,
      className: cn(
        'block w-full min-h-12 border border-ink bg-paper px-4 py-3 text-base text-ink disabled:opacity-60',
        errors[name] && 'shadow-[inset_0_0_0_1px_theme(colors.ink)]',
      ),
    };
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-label={t.form.name} aria-busy={sending}>
      {/* Error summary, announced when a submit fails */}
      <div aria-live="polite" className="empty:hidden">
        {showSummary && errorCount > 0 && (
          <p className="mb-8 border-l-4 border-ink bg-light px-4 py-3 text-sm font-medium">{t.form.summary(errorCount)}</p>
        )}
      </div>

      <fieldset disabled={sending} className="flex flex-col gap-7">
        <Field name="name" label={f.name.label} error={errors.name}>
          <input type="text" autoComplete="name" required maxLength={CONTACT_LIMITS.name.max} {...fieldProps('name')} />
        </Field>

        <Field name="email" label={f.email.label} error={errors.email}>
          <input type="email" autoComplete="email" inputMode="email" required {...fieldProps('email')} />
        </Field>

        <Field name="subject" label={f.subject.label} optional={f.subject.optional}>
          <input type="text" maxLength={120} {...fieldProps('subject')} />
        </Field>

        <Field name="message" label={f.message.label} error={errors.message}>
          <textarea
            rows={7}
            required
            maxLength={CONTACT_LIMITS.message.max}
            {...fieldProps('message', 'message-counter')}
            className={cn(fieldProps('message').className, 'resize-y')}
          />
          <p id="message-counter" className="mt-2 text-right text-xs text-muted">
            {t.form.counter(values.message.length, CONTACT_LIMITS.message.max)}
          </p>
        </Field>

        {/* Honeypot: off-screen (not display:none), skipped by keyboard and screen readers */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={onChange}
          />
        </div>

        {status === 'error' && (
          <div className="border-l-4 border-ink bg-light px-4 py-4 text-sm leading-relaxed">
            <p className="font-medium">{t.form.errorBox}</p>
            {fallbackEmail && (
              <a href={`mailto:${fallbackEmail}`} className="mt-2 inline-block border-b border-ink pb-0.5 font-medium">
                {fallbackEmail}
              </a>
            )}
          </div>
        )}

        <Button type="submit" disabled={sending || coolingDown} className="self-start disabled:cursor-not-allowed disabled:opacity-60">
          {sending ? t.form.sending : coolingDown ? t.form.cooldown(cooldownLeft) : t.form.submit}
        </Button>
      </fieldset>
    </form>
  );
}

// Label + control + inline error for one field.
function Field({ name, label, optional, error, children }) {
  return (
    <div>
      <label htmlFor={name} className="label mb-3 block">
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal text-muted">{optional}</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-2 flex items-start gap-2 text-sm font-medium text-ink">
          <span aria-hidden="true" className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center bg-ink text-micro font-bold text-paper">
            !
          </span>
          <span>
            <span className="sr-only">Error: </span>
            {error}
          </span>
        </p>
      )}
    </div>
  );
}
