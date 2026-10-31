import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, ClipboardList, Layers, MapPin, Mail, Menu, Phone, Plus, Sparkles, Star, Stethoscope, X } from 'lucide-react';
import { CLINIC, REVIEWS } from './config.js';
import logoUrl from './assets/logo.png';
import LeadForm from './components/LeadForm.jsx';
import CallPopup from './components/CallPopup.jsx';
import FormPopup from './components/FormPopup.jsx';
import Strands from './components/Strands.jsx';
import Gallery from './components/Gallery.jsx';

const NAV = [['Treatments', '#treatments'], ['Concerns', '#concerns'], ['Process', '#process'], ['Reviews', '#reviews'], ['FAQ', '#faq'], ['Contact', '#contact']];

// Path-based section URLs: /concerns instead of /#concerns.
const HEADER_OFFSET = 80;
const SECTION_IDS = ['top', 'concerns', 'treatments', 'process', 'reviews', 'faq', 'contact'];
const NAV_IDS = NAV.map(([, h]) => h.slice(1));
let lockUntil = 0; // pause scroll-spy while a click-triggered smooth scroll runs

const sectionFromPath = () => {
  const last = window.location.pathname.split('/').filter(Boolean).pop();
  return SECTION_IDS.includes(last) ? last : null;
};
// Directory the app is served from, with any trailing section segment removed.
const baseDir = () => {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (SECTION_IDS.includes(parts[parts.length - 1])) parts.pop();
  return '/' + parts.join('/') + (parts.length ? '/' : '');
};
const pathFor = (id) => (id === 'top' || !id ? baseDir() : baseDir() + id);

const scrollToSection = (id, smooth = true) => {
  const el = document.getElementById(id);
  if (!el) return;
  const y = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 1;
  window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' });
};

const goTo = (e, id, after) => {
  e.preventDefault();
  lockUntil = Date.now() + 900;
  window.history.pushState(null, '', pathFor(id));
  window.dispatchEvent(new Event('sectionchange'));
  scrollToSection(id);
  after?.();
};

function useActiveSection() {
  const [active, setActive] = useState(() => sectionFromPath() || 'top');
  useEffect(() => {
    const sync = () => setActive(sectionFromPath() || 'top');
    const spy = () => {
      if (Date.now() < lockUntil) return;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let cur = 'top';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= HEADER_OFFSET + 40) cur = id;
      }
      if (atBottom) cur = 'contact';
      setActive(cur);
      const next = pathFor(cur);
      if (window.location.pathname !== next) window.history.replaceState(null, '', next);
    };
    const onPop = () => { sync(); const id = sectionFromPath(); lockUntil = Date.now() + 900; scrollToSection(id || 'top'); };
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('popstate', onPop);
    window.addEventListener('sectionchange', sync);
    // Deep link: open straight at the section named in the path.
    const initial = sectionFromPath();
    if (initial && initial !== 'top') requestAnimationFrame(() => scrollToSection(initial, false));
    return () => {
      window.removeEventListener('scroll', spy);
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('sectionchange', sync);
    };
  }, []);
  return active;
}

const CONCERNS = [
  ['Acne & breakouts', 'Explore treatment options for active acne and recurring breakouts.'],
  ['Acne scars', 'Understand available approaches for acne marks and scarring.'],
  ['Pigmentation', 'Discuss options for melasma, tanning and uneven skin tone.'],
  ['Dull, uneven skin', 'Explore options to deep cleanse, hydrate and brighten the skin.'],
  ['Fine lines & ageing', 'Understand available approaches for fine lines and skin firmness.'],
];

const TREATMENTS = [
  ['Acne & Acne Scar Treatment', 'Clinical', 'Clear active acne and reduce acne scars with advanced skin treatments.'],
  ['Pigmentation Treatment', 'Clinical', 'Reduce melasma, tanning, and uneven skin tone.'],
  ['Hydra Facial', 'Facial', 'Deep cleanse, hydrate, and brighten your skin.'],
  ['Laser Hair Reduction', 'Laser', 'Laser treatment option for long-lasting hair reduction.'],
  ['Anti-Ageing Treatment', 'Clinical', 'Reduce fine lines and improve skin firmness with advanced solutions.'],
  ['Skin Brightening', 'Glow', 'Restore healthy, glowing skin with customized treatment plans.'],
];

const WHY = [
  ['Experienced Skin Specialists', 'Discuss your skin concerns with an experienced skin care team.'],
  ['Advanced Skin Analysis', 'Every plan starts with a proper analysis of your skin type and concerns.'],
  ['Personalized Treatment Plans', 'Understand the options based on your skin concerns and individual requirements.'],
  ['Consultation-Based Guidance', 'Discuss treatment suitability, procedure details, expected outcomes and costs before proceeding.'],
  ['Convenient Location', `Visit ${CLINIC.name} in ${CLINIC.area}.`],
];

const STEPS = [
  ['Submit Your Enquiry', 'Fill out the form with your contact details and skin concern.'],
  ['Discuss Your Requirements', 'Our team will contact you to discuss your enquiry and appointment.'],
  ['Get Your Skin Analysed', 'Visit the clinic for a consultation and understand the treatment options appropriate for your skin.'],
];

const FAQ = [
  ['What skin treatments are available at Advanced GroHair & GloSkin?', 'Our listed options include acne and acne scar treatment, pigmentation treatment, Hydra Facial, laser hair reduction, anti-ageing treatment and skin brightening.'],
  ['Where is your skin clinic located?', `Advanced GroHair & GloSkin is located in ${CLINIC.area}.`],
  ['Do you treat acne and acne scars?', 'Yes. We offer treatment options for acne, acne scars and pigmentation. Suitability depends on your skin and individual concerns.'],
  ['How do I know which treatment is right for my skin?', 'A consultation with a skin analysis can help assess your concerns and explain the available options, their limitations and expected outcomes.'],
  ['How can I book an appointment?', 'Complete the enquiry form on this page or call us. Our team can contact you to discuss your enquiry and appointment.'],
];

const btnSolid = 'grad-crimson inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-glow transition hover:brightness-110';
const btnGhost = 'inline-flex items-center justify-center gap-2 rounded-full border border-crimson-700 px-6 py-3 font-medium text-crimson-700 transition hover:bg-crimson-700 hover:text-white';

const Heading = ({ eyebrow, children, className = '' }) => (
  <div className={className}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2 className="mt-3 text-[1.9rem] font-medium leading-[1.12] text-ink xs:text-4xl sm:text-5xl">{children}</h2>
  </div>
);

function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const active = useActiveSection();
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 20);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className={`w-full border-b bg-white/95 backdrop-blur transition-shadow duration-300 ${solid || open ? 'border-line shadow-soft' : 'border-line/60'}`}>
        <div className="flex h-20 w-full items-center justify-between px-4 xs:px-5 sm:px-8 lg:px-12">
          <a href={pathFor('top')} onClick={(e) => goTo(e, 'top')} className="flex items-center" aria-label={`${CLINIC.name} home`}>
            <img src={logoUrl} alt={CLINIC.name} className="h-10 w-auto sm:h-12" />
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft lg:flex" aria-label="Primary">
            {NAV.map(([l, h]) => {
              const on = active === h.slice(1);
              return <a key={h} href={pathFor(h.slice(1))} onClick={(e) => goTo(e, h.slice(1))} aria-current={on ? 'true' : undefined} className={`relative transition hover:text-crimson-700 after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-crimson-700 after:transition-all hover:after:w-full ${on ? 'text-crimson-700 after:w-full' : 'after:w-0'}`}>{l}</a>;
            })}
          </nav>
          <div className="flex items-center gap-3">
            {CLINIC.phone && <a href={`tel:${CLINIC.phone}`} className="hidden items-center gap-2 text-sm font-medium text-ink md:flex"><Phone size={16} className="text-crimson-700" aria-hidden />{CLINIC.phoneDisplay}</a>}
            <a href="#book" className={`${btnSolid} hidden !py-2.5 text-sm xs:inline-flex`}>Book consultation</a>
            <button className="rounded-full p-2 text-ink lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
              {open ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-line px-5 pb-5 lg:hidden" aria-label="Mobile">
            {NAV.map(([l, h]) => <a key={h} href={pathFor(h.slice(1))} onClick={(e) => goTo(e, h.slice(1), () => setOpen(false))} aria-current={active === h.slice(1) ? 'true' : undefined} className={`block border-b border-line py-3 font-medium ${active === h.slice(1) ? 'text-crimson-700' : 'text-ink'}`}>{l}</a>)}
            <div className="mt-4 flex flex-col gap-3">
              <a href="#book" onClick={() => setOpen(false)} className={btnSolid}>Book consultation</a>
              {CLINIC.phone && <a href={`tel:${CLINIC.phone}`} className={btnGhost}><Phone size={18} aria-hidden />Call {CLINIC.phoneDisplay}</a>}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink pt-32 text-white">
      <div className="pointer-events-none absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-crimson-700/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-crimson-500/20 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl 2xl:max-w-7xl items-start gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1.35fr_1fr] lg:pb-28 lg:pt-12">
        <div className="lg:pt-6">
          <p className="rise inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-blush-200 xs:text-sm" style={{ animationDelay: '.1s' }}>
            <MapPin size={15} className="text-crimson-500" aria-hidden /> ADVANCED SKIN CARE CLINIC
          </p>
          <h1 className="rise mt-6 text-[2rem] font-medium leading-[1.15] xs:text-4xl sm:text-5xl lg:text-[2.6rem] xl:text-[3rem] 2xl:text-[3.4rem]" style={{ animationDelay: '.25s' }}>
            Advanced Skin Treatments in <br /><em className="grad-text pr-2">Mogappair</em>
          </h1>
          <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-blush-200/85" style={{ animationDelay: '.4s' }}>
            Get expert skin analysis and personalized treatment options from experienced skin specialists at Advanced GroHair &amp; GloSkin, Mogappair, for healthier, clearer and glowing skin.
          </p>
          <ul className="rise mt-9 space-y-3" style={{ animationDelay: '.55s' }}>
            {['Acne & Acne Scar Treatment', 'Pigmentation & Skin Brightening', 'Hydra Facial, Laser & Anti-Ageing'].map((t) => (
              <li key={t} className="flex items-center gap-3 font-medium">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-crimson-600/90"><CheckCircle2 size={16} aria-hidden /></span>{t}
              </li>
            ))}
          </ul>
          <a href="#book" className={`${btnSolid} rise mt-9`} style={{ animationDelay: '.65s' }}>
            Book Your Consultation <ArrowRight size={18} aria-hidden />
          </a>
        </div>
        <div id="book" className="rise relative rounded-[2rem] bg-cream p-6 text-ink shadow-soft ring-1 ring-white/20 xs:p-7 sm:p-9" style={{ animationDelay: '.5s' }}>
          <span className="grad-crimson absolute inset-x-10 top-0 h-1 rounded-b-full" aria-hidden />
          <h2 className="text-2xl font-medium text-ink xs:text-3xl">Book Your Skin Consultation</h2>
          <p className="mb-6 mt-2 text-ink-body">Share your details to enquire about suitable skin treatment options.</p>
          <LeadForm id="hero" variant="date" submitLabel="Book my consultation" />
        </div>
      </div>
    </section>
  );
}

function Concerns() {
  return (
    <section id="concerns" className="mx-auto grid max-w-6xl 2xl:max-w-7xl gap-14 px-4 py-16 xs:px-5 sm:py-24 lg:grid-cols-[1fr_1.4fr]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Heading eyebrow="Concerns">Looking for skin treatment in Mogappair, Chennai?</Heading>
        <p className="mt-6 max-w-md leading-relaxed text-ink-body">At Advanced GroHair &amp; GloSkin, every treatment starts with a proper skin analysis, not a one-size-fits-all fix. From acne and acne scars to pigmentation and ageing concerns, explore available treatments based on your individual requirements.</p>
        <p className="mt-4 max-w-md leading-relaxed text-ink-body">Visit our Mogappair clinic to discuss your concerns and understand the treatment options that may be suitable for you.</p>
        <a href="#book" className={`${btnSolid} mt-8`}>Enquire Now <ArrowRight size={18} aria-hidden /></a>
      </div>
      <div>
      <h3 className="mb-6 text-2xl font-medium text-ink sm:text-3xl">Solutions for Different Skin Concerns</h3>
      <ol className="border-t border-line">
        {CONCERNS.map(([t, d], i) => (
          <li key={t} className="group grid gap-2 border-b border-line py-7 transition-colors hover:bg-blush-50 sm:grid-cols-[4.5rem_1fr] sm:px-3">
            <span className="font-display text-4xl italic text-crimson-600/50 transition-colors group-hover:text-crimson-600" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="text-2xl font-medium text-ink">{t}</h3>
              <p className="mt-1.5 text-ink-body">{d}</p>
            </div>
          </li>
        ))}
      </ol>
      </div>
    </section>
  );
}

function Treatments() {
  return (
    <section id="treatments" className="bg-blush-100 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-4 xs:px-5">
        <Heading eyebrow="Treatments" className="max-w-2xl">Treatments We Offer</Heading>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {TREATMENTS.map(([name, kind, desc]) => {
            const surgical = kind === 'Laser';
            return (
              <a key={name} href="#book" className={`group relative flex flex-col overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft ${surgical ? 'grad-crimson text-white' : 'bg-white text-ink'}`}>
                <h3 className="text-xl font-medium leading-snug">{name}</h3>
                <p className={`mt-2 flex-1 text-sm leading-relaxed ${surgical ? 'text-white/85' : 'text-ink-body'}`}>{desc}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${surgical ? 'bg-white text-crimson-800' : 'bg-blush-100 text-crimson-700'}`}>{kind}</span>
                  <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} aria-label={`Enquire about ${name}`} />
                </div>
              </a>
            );
          })}
        </div>
        <div className="mt-12 flex justify-center"><a href="#book" className={btnSolid}>Find the Right Treatment for You <ArrowRight size={18} aria-hidden /></a></div>
      </div>
    </section>
  );
}

const WHY_ICONS = [Layers, ClipboardList, Sparkles, Stethoscope, MapPin];

function Why() {
  return (
    <section className="mx-auto max-w-6xl 2xl:max-w-7xl px-4 py-16 font-poppins xs:px-5 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:gap-12">
        <div className="grad-crimson relative overflow-hidden rounded-[1.75rem] p-7 text-white shadow-glow sm:p-10 lg:sticky lg:top-28 lg:self-start lg:p-12">
          <Strands className="pointer-events-none absolute inset-0 h-full w-full opacity-25" />
          <p className="relative text-xs font-medium uppercase tracking-[0.22em] text-white/80">Why Choose Us?</p>
          <h2 className="relative mt-4 font-poppins text-[1.7rem] font-medium leading-tight xs:text-3xl sm:text-4xl">Expert Skin Care, Rooted in Mogappair</h2>
          <span className="relative mt-8 block h-1 w-16 rounded-full bg-white" aria-hidden />
        </div>

        <ol>
          {WHY.map(([t, d], i) => {
            const Icon = WHY_ICONS[i];
            return (
              <li key={t} className="group relative flex gap-4 rounded-2xl p-4 transition-colors hover:bg-blush-50 xs:gap-5 xs:p-5">
                {i < WHY.length - 1 && <span className="absolute left-[2.375rem] top-[3.75rem] -bottom-4 w-px -translate-x-1/2 bg-crimson-600/25 xs:left-[2.75rem] xs:top-[4.25rem] xs:-bottom-5" aria-hidden />}
                <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-crimson-600/30 bg-white text-crimson-700 transition-colors group-hover:border-transparent group-hover:bg-crimson-700 group-hover:text-white xs:h-12 xs:w-12"><Icon size={20} aria-hidden /></span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-poppins text-lg font-medium text-ink xs:text-xl">{t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-body xs:text-base">{d}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="bg-blush-100 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-5">
        <Heading eyebrow="Process" className="max-w-xl">Start Your Skin Treatment Journey in 3 Steps</Heading>
        <ol className="relative mt-12 grid gap-10 sm:mt-16 md:grid-cols-3 md:gap-8">
          <span className="absolute left-7 top-7 hidden h-px md:w-[calc(66.666%+0.5rem)] border-t border-dashed border-crimson-600/50 md:block" aria-hidden />
          {STEPS.map(([t, d], i) => (
            <li key={t} className="relative">
              <span className="grad-crimson relative grid h-14 w-14 place-items-center rounded-full font-display text-2xl font-medium text-white shadow-glow" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-6 text-2xl font-medium">{t}</h3>
              <p className="mt-2 max-w-xs text-ink-body">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-6xl 2xl:max-w-7xl px-4 py-16 xs:px-5 sm:py-24">
      <Heading eyebrow="Patient Reviews" className="max-w-2xl">What Our Patients Say</Heading>
      <p className="mt-4 flex items-center gap-2 text-ink-body"><Star size={18} className="fill-crimson-600 text-crimson-600" aria-hidden /><strong className="text-ink">4.8</strong> Google rated</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {REVIEWS.map((r) => (
          <figure key={r.name} className="rounded-3xl border border-line bg-white p-6">
            <div className="flex gap-0.5" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} className="fill-crimson-600 text-crimson-600" aria-hidden />)}</div>
            <blockquote className="mt-3 leading-relaxed text-ink-body">&ldquo;{r.text}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm"><span className="font-medium text-ink">{r.name}</span> <span className="text-ink-muted">· {r.tag}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="mx-auto grid max-w-6xl 2xl:max-w-7xl gap-8 px-4 py-16 xs:px-5 sm:gap-12 sm:py-24 lg:grid-cols-[1fr_1.6fr]">
      <Heading eyebrow="FAQ" className="lg:sticky lg:top-28 lg:self-start">Frequently Asked Questions</Heading>
      <div className="space-y-4">
        {FAQ.map(([q, a]) => (
          <details key={q} className="group rounded-2xl border border-line bg-white p-4 transition-shadow open:shadow-soft xs:p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-medium text-ink xs:text-lg">
              {q}<Plus className="shrink-0 text-crimson-700 transition-transform group-open:rotate-45" size={22} aria-hidden />
            </summary>
            <p className="mt-3 text-ink-body">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-3 pb-16 sm:pb-24">
      <div className="grad-crimson relative mx-auto grid max-w-6xl 2xl:max-w-7xl items-center gap-10 overflow-hidden rounded-[1.75rem] px-5 py-10 text-white xs:px-6 sm:rounded-[2rem] sm:px-12 sm:py-14 lg:grid-cols-2">
        <Strands className="pointer-events-none absolute inset-0 h-full w-full opacity-30" />
        <div className="relative">
          <h2 className="text-[1.9rem] font-medium leading-[1.12] xs:text-4xl sm:text-5xl">Ready for Healthy, Glowing Skin?</h2>
          <p className="mt-5 max-w-md leading-relaxed text-blush-100">Take the first step towards understanding your skin concerns. Submit your details to enquire about skin treatments at {CLINIC.name}, {CLINIC.area}.</p>
        </div>
        <div className="relative rounded-3xl bg-ink/90 p-5 backdrop-blur xs:p-6 sm:p-8">
          <LeadForm id="final" variant="concern" submitLabel="Request a call back" dark />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const mapHref = CLINIC.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CLINIC.name}, ${CLINIC.address}`)}`;
  const row = 'flex items-start gap-3';
  const ico = 'mt-0.5 shrink-0';
  return (
    <footer id="contact" className="bg-ink py-12 text-white sm:py-14">
      <div className="mx-auto grid max-w-6xl 2xl:max-w-7xl gap-8 px-4 xs:px-5 sm:gap-10 md:grid-cols-[1.2fr_1.4fr_1fr]">
        <div>
          <img src={logoUrl} alt={CLINIC.name} className="h-20 w-auto rounded-xl bg-white p-1.5" />
          <p className="mt-5 font-display text-lg font-medium">{CLINIC.name}</p>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white">Visit us</p>
          <p className={row}><MapPin size={18} className={ico} aria-hidden /><span>{CLINIC.address}</span></p>
          {CLINIC.phone && <p className={row}><Phone size={18} className={ico} aria-hidden /><a className="font-medium hover:underline" href={`tel:${CLINIC.phone}`}>{CLINIC.phoneDisplay}</a></p>}
          {CLINIC.email && <p className={row}><Mail size={18} className={ico} aria-hidden /><a className="break-all font-medium hover:underline" href={`mailto:${CLINIC.email}`}>{CLINIC.email}</a></p>}
          <a href={mapHref} target="_blank" rel="noopener noreferrer" className={`${btnSolid} !py-2.5 text-sm`}>Get directions <ArrowRight size={16} aria-hidden /></a>
        </div>
        <nav className="flex flex-col gap-2 text-sm font-medium" aria-label="Footer">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-white">Explore</p>
          {NAV.filter(([, h]) => h !== '#contact').map(([l, h]) => <a key={h} href={pathFor(h.slice(1))} onClick={(e) => goTo(e, h.slice(1))} className="transition hover:underline">{l}</a>)}
          {CLINIC.privacyUrl && <a href={CLINIC.privacyUrl} className="transition hover:underline">Privacy policy</a>}
        </nav>
      </div>
      {CLINIC.mapEmbedUrl && (
        <div className="mx-auto mt-10 max-w-6xl 2xl:max-w-7xl px-4 xs:px-5">
          <iframe title={`${CLINIC.name} location map`} src={CLINIC.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full rounded-2xl border-0 sm:h-72" allowFullScreen />
        </div>
      )}
      <p className="mx-auto mt-10 max-w-6xl 2xl:max-w-7xl border-t border-white/10 px-4 pt-6 xs:px-5 text-sm text-white">© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</p>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Concerns />
        <Treatments />
        <Why />
        <Gallery />
        <Process />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FormPopup />
      <CallPopup />
    </>
  );
}
