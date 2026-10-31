import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronDown, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { FORM, SKIN_CONCERNS } from '../config.js';

const PHONE_RE = /^(?:\+?91)?[6-9]\d{9}$/;

function encode(payload, format) {
  if (format === 'form') {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
    return { body: fd, headers: {} };
  }
  if (format === 'urlencoded') {
    return {
      body: new URLSearchParams(payload).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
  }
  return { body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } };
}

/** variant="date": name, mobile, optional date. variant="concern": name, mobile, skin concern. */
export default function LeadForm({ variant = 'date', id, submitLabel, dark = false }) {
  const [values, setValues] = useState({ name: '', city: '', phone: '', concerns: [] });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const selectConcern = (c) => { setValues((v) => ({ ...v, concerns: [c] })); setMenuOpen(false); };
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = 'Enter your full name.';
    if (values.city.trim().length < 2) e.city = 'Enter your city.';
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid 10-digit mobile number.';
    if (variant === 'concern' && !values.concerns.length) e.concern = 'Select your skin concern.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (status === 'loading' || !validate()) return;
    setStatus('loading');
    try {
      if (!FORM.apiUrl) throw new Error('API endpoint not configured (src/config.js).');
      const payload = FORM.buildPayload({ ...values, name: values.name.trim(), city: values.city.trim(), phone: values.phone.replace(/[\s-]/g, '').slice(-10) });
      const { body, headers } = encode(payload, FORM.format);
      const res = await fetch(FORM.apiUrl, { method: 'POST', headers, body });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: FORM.gtmEvent });
      if (FORM.thankYouPath) { window.location.assign(FORM.thankYouPath); return; }
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const field = 'w-full rounded-xl border bg-white px-4 py-3 text-ink placeholder:text-ink/40 transition-colors focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20';
  const label = `mb-1.5 block text-sm font-medium ${dark ? 'text-blush-100' : 'text-ink-soft'}`;
  const err = (k) => errors[k] && (
    <p id={`${id}-${k}-err`} className="mt-1 flex items-center gap-1 text-sm text-red-600" role="alert">
      <AlertCircle size={14} aria-hidden /> {errors[k]}
    </p>
  );

  if (status === 'success') {
    return (
      <div role="status" className="rounded-xl bg-blush-50 p-6 text-crimson-800">
        <CheckCircle2 className="mb-3" size={28} aria-hidden />
        <p className="font-display text-xl font-medium">Enquiry received</p>
        <p className="mt-1 text-ink-soft">Our team will contact you regarding your enquiry and appointment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-describedby={`${id}-note`}>
      <div>
        <label htmlFor={`${id}-name`} className={label}>Full name</label>
        <input id={`${id}-name`} className={`${field} ${errors.name ? 'border-red-500' : 'border-ink/15'}`} autoComplete="name" placeholder="Enter your full name"
          value={values.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} />
        {err('name')}
      </div>
      <div>
        <label htmlFor={`${id}-city`} className={label}>City</label>
        <input id={`${id}-city`} autoComplete="address-level2" placeholder="Enter your city"
          className={`${field} ${errors.city ? 'border-red-500' : 'border-ink/15'}`}
          value={values.city} onChange={set('city')} aria-invalid={!!errors.city} aria-describedby={errors.city ? `${id}-city-err` : undefined} />
        {err('city')}
      </div>
      <div>
        <label htmlFor={`${id}-phone`} className={label}>Mobile number</label>
        <input id={`${id}-phone`} type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number"
          className={`${field} ${errors.phone ? 'border-red-500' : 'border-ink/15'}`}
          value={values.phone} onChange={set('phone')} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${id}-phone-err` : undefined} />
        {err('phone')}
      </div>
      <div ref={menuRef} className="relative">
        <label id={`${id}-concern-label`} className={label}>Skin concern</label>
        <button type="button" aria-haspopup="listbox" aria-expanded={menuOpen} aria-labelledby={`${id}-concern-label`} onClick={() => setMenuOpen((o) => !o)}
          className={`${field} flex items-center justify-between gap-2 text-left ${errors.concern ? 'border-red-500' : 'border-ink/15'}`}>
          <span className={`truncate ${values.concerns.length ? 'text-ink' : 'text-ink/40'}`}>{values.concerns[0] || 'Select your skin concern'}</span>
          <ChevronDown size={18} className={`shrink-0 text-ink-muted transition-transform ${menuOpen ? 'rotate-180' : ''}`} aria-hidden />
        </button>
        {menuOpen && (
          <ul role="listbox" aria-labelledby={`${id}-concern-label`} className="scroll-red absolute z-20 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border border-ink/15 bg-white py-1 shadow-soft">
            {SKIN_CONCERNS.map((c) => {
              const on = values.concerns[0] === c;
              return (
                <li key={c} role="option" aria-selected={on}>
                  <button type="button" onClick={() => selectConcern(c)} className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-blush-50 ${on ? 'font-medium text-crimson-700' : 'text-ink'}`}>
                    {c}{on && <Check size={16} aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {err('concern')}
      </div>
      <button type="submit" disabled={status === 'loading'}
        className={`group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-medium transition disabled:opacity-70 ${dark ? 'bg-white text-crimson-800 hover:bg-blush' : 'grad-crimson text-white shadow-glow hover:brightness-110'}`}>
        {status === 'loading' ? (<><Loader2 className="animate-spin" size={18} aria-hidden /> Sending…</>) : (<>{submitLabel}<ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden /></>)}
      </button>
      {status === 'error' && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
          We couldn't send your details. Check your connection and try again, or call the clinic.
        </p>
      )}
      <p id={`${id}-note`} className={`text-sm ${dark ? 'text-blush-200' : 'text-ink-muted'}`}>Our team will contact you regarding your enquiry and appointment.</p>
    </form>
  );
}
