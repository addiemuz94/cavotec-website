// Data for the homepage "Our Customers" logo wall.
//
// ============================================================================
// PLACEHOLDER DATA — DO NOT treat the entries below as real clients.
// ============================================================================
// None of the entries in this file are real or invented company names — that
// would risk reading as an unconfirmed real-client claim on a live site. Each
// entry is a generic, structural placeholder slot only (see CustomerLogoGrid,
// which renders a neutral "logo coming soon" card for any entry with no
// `logoSrc`), the same way HoloPreviewPanel falls back to its wireframe-glyph
// "concept" state for showcase items with no `image`.
//
// TO ADI — before this section goes live with real content, two things need
// to happen (flagging this back as a content/legal checklist item, not
// something to solve in code):
//   1. Get the real customer names + logo artwork.
//   2. Confirm each customer's sign-off to display their logo publicly on
//      this site — using another company's logo/mark as a public "customer
//      of ours" reference is typically something that needs their permission
//      first, not just having the artwork on hand.
// Once both are confirmed per customer, replace that entry's `name` with the
// real name and add `logoSrc` (a path into public/, e.g.
// '/images/customers/acme.png') — add `href` too if that customer has a case
// study to link to. Adding a real entry is a one-line change; nothing else
// in this file or CustomerLogoGrid.astro needs to change.
export interface Customer {
	name: string;
	// Public-relative path (e.g. '/images/customers/acme.png'), same
	// plain-string convention as ShowcaseItem's `image` and heroBackgrounds —
	// not an astro:assets import, since these files don't exist yet.
	// Omitted (as on every entry below) renders CustomerLogoGrid's neutral
	// placeholder card instead of an <img>.
	logoSrc?: string;
	// Optional future case-study link — most customers won't have one.
	href?: string;
}

export const customers: Customer[] = [
	{ name: 'Customer logo placeholder 1' },
	{ name: 'Customer logo placeholder 2' },
	{ name: 'Customer logo placeholder 3' },
	{ name: 'Customer logo placeholder 4' },
	{ name: 'Customer logo placeholder 5' },
	{ name: 'Customer logo placeholder 6' },
];
