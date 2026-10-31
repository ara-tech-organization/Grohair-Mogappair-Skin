export const CLINIC = {
  name: 'Advanced GroHair & GloSkin',
  shortName: 'AdGro Hair & GloSkin',
  area: 'Mogappair, Chennai',
  address: 'No.8, 2nd Floor, Bharathi Salai, above Polar Bear Ice Cream, Mogappair West, Ambattur Industrial Estate, Chennai, Tamil Nadu 600037',
  phone: '+918270956789',
  phoneDisplay: '+91 82709 56789',
  email: 'mogappair@adgrohair.com',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Advanced%20GroHair%20%26%20GloSkin%20Clinic%20-%20Mogappair',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Advanced%20GroHair%20%26%20GloSkin%20Clinic%20-%20Mogappair&t=m&z=15&output=embed&iwloc=near',
  privacyUrl: '',   // TODO existing privacy policy URL (hidden while empty)
  siteUrl: 'https://adgrohairclinicmogappair.com',
};

// Skin concerns offered in the multi-select (forms + call popup).
export const SKIN_CONCERNS = [
  'Acne',
  'Pigmentation or dark spots',
  'Dullness',
  'Open pores',
  'Anti-aging or wrinkles',
  'Dark circles',
  'Scars',
];

// Patient reviews shown on the reference Mogappair page.
export const REVIEWS = [
  { name: 'Vidhu Priya', tag: 'GloSkin client', text: "I've been getting treatments for my dry skin (HydraFacial and Q-switch) here for the past 4 months, and my skin has improved so much it's now plump and glowing. The doctors are highly professional and explain every procedure in detail." },
  { name: 'Sai Sathish Rosh', tag: 'GloSkin client', text: "I'm absolutely delighted with the Glutathione treatment I received at the Mogappair branch! It has beautifully lightened my skin tone to a fair and radiant complexion. I wholeheartedly recommend this place." },
  { name: 'Jaya Kummar', tag: 'HydraFacial client', text: "Treatments are good, 100% safe. I had a HydraFacial and was stunned with the result. Staff and doctors are very respectful, and I'm planning to have a medi facial next week." },
  { name: 'Sruti Shivam', tag: 'HydraFacial client', text: 'The staff was knowledgeable and attentive, and the atmosphere was relaxing. I went for a HydraFacial and my skin feels amazing. I highly recommend them!' },
];

export const FORM = {
  // Same endpoint the reference Mogappair page posts to.
  apiUrl: 'https://adgrohairclinicmogappair.com/api/mail.php',
  format: 'json',
  // Where to go after success. Empty = show inline success message.
  thankYouPath: '',
  treatment: 'Skin',
  // Reference page payload: { name, phone, city, treatment, source }.
  buildPayload: (v) => {
    const concerns = v.concerns && v.concerns.length ? v.concerns.join(', ') : (v.concern && v.concern.trim()) || FORM.treatment;
    return {
      name: v.name,
      phone: v.phone,
      city: v.city,
      treatment: concerns,
      source: 'Grohair Mogappair Skin Clinic Landing Page',
    };
  },
  // GTM event pushed to dataLayer after a successful submit.
  gtmEvent: 'lead_form_submitted',
};
