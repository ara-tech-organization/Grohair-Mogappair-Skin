import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import LeadForm from './LeadForm.jsx';

const KEY = 'formPopupDismissed';

/** Enquiry form modal, shown once per session shortly after the page loads. */
export default function FormPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    const t = setTimeout(() => setOpen(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const close = () => { sessionStorage.setItem(KEY, '1'); setOpen(false); window.dispatchEvent(new Event('formpopupclosed')); };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div data-popup className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/55 px-4 py-6" onClick={close}>
      <div role="dialog" aria-modal="true" aria-labelledby="popup-form-title" className="relative my-auto w-full max-w-[420px] rounded-3xl bg-cream p-6 text-ink shadow-soft" onClick={(e) => e.stopPropagation()}>
        <span className="grad-crimson absolute inset-x-10 top-0 h-1 rounded-b-full" aria-hidden />
        <button onClick={close} aria-label="Close" className="absolute -right-2 -top-3 grid h-10 w-10 place-items-center rounded-full bg-[#B5B5B5] text-white shadow-md transition active:scale-95">
          <X size={18} aria-hidden />
        </button>
        <h2 id="popup-form-title" className="text-2xl font-medium">Book Your Skin Consultation</h2>
        <p className="mb-5 mt-2 text-ink-body">Share your details to enquire about suitable skin treatment options.</p>
        <LeadForm id="popup" variant="date" submitLabel="Book my consultation" />
      </div>
    </div>
  );
}
