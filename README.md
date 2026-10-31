# Mogappair Hair Landing Page (React + Vite + Tailwind + Lucide)

## Run
    npm install
    npm run dev        # local
    npm run build      # outputs dist/ (deploy contents to the /hair/ path)

## Fill in before going live (all in src/config.js)
1. CLINIC.phone / phoneDisplay  - verified number. Call buttons and the call popup stay hidden until set.
2. CLINIC.email, mapUrl, privacyUrl - hidden until set.
3. CLINIC.address - taken from the reference page's metadata; confirm the full address.
4. FORM.apiUrl, FORM.format, FORM.buildPayload - copy the endpoint, request format and field names from the existing site's form.
   Until apiUrl is set, submitting shows the error state.
5. FORM.thankYouPath - existing thank-you route (empty = inline success message).
6. GTM-PHT532JK is in index.html; gtmEvent in config.js should match the old site's event name.
7. vite.config.js `base` is '/hair/'; change if hosted elsewhere.
8. Add logo and gallery photos (see src/assets/images/README.md).

## Notes
- Fonts: Bricolage Grotesque (headings) + Manrope (body), chosen because the clinic's font could not be verified.
- Call popup: shows once per session after 12s, no time or offer text, closes with the X button or Escape.
- Appointment date field is kept in the hero form; no time-related text appears in the popup.
- Not built or tested here (no network to install packages). Run npm install && npm run build first.
