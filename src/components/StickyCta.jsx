import { CalendarCheck, Phone } from 'lucide-react';
import { CLINIC } from '../config.js';

/** Mobile-only sticky bar: call + book appointment. */
export default function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-white/95 px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] backdrop-blur md:hidden">
      {CLINIC.phone && (
        <a href={`tel:${CLINIC.phone}`} onClick={() => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'contact_click', channel: 'phone' }); }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-crimson-700 py-3 text-sm font-medium text-crimson-700 active:bg-crimson-700 active:text-white">
          <Phone size={18} aria-hidden />Call Now
        </a>
      )}
      <a href="#book" className="grad-crimson inline-flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-medium text-white shadow-glow">
        <CalendarCheck size={18} aria-hidden />Book Appointment
      </a>
    </div>
  );
}
