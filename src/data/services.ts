// Single source of truth for Cavotec Malaysia's 5 top-level services —
// extracted from what used to be hardcoded directly inside
// src/pages/services.astro's markup (one full-width section per service),
// so /services and /our-business can both render from this one place
// instead of drifting out of sync with separately hand-copied text.
//
// `description` is the exact copy already written for each service on
// /services — not rewritten or shortened for card use elsewhere.
export interface ServiceItem {
	id: string;
	href: string;
	title: string;
	description: string;
	// Raw inner SVG markup (viewBox 0 0 24 24), same convention as
	// ShowcaseCarousel/HowItWorksFlow's iconSvg prop — rendered via set:html.
	// Sized at 30x30 to match /services' existing .service-block-icon
	// circles; consuming pages using a smaller icon circle (e.g.
	// /our-business's summary cards) override the rendered size via CSS.
	iconSvg: string;
	comingSoon?: boolean;
}

export const services: ServiceItem[] = [
	{
		id: 'calibration',
		href: '/services/calibration-test-measurement/',
		title: 'Calibration',
		description:
			"Cavotec Malaysia has calibrated equipment from over 2,400 manufacturers. All laboratories, including the Mobile Calibration Laboratory, are NATA accredited and ISO certified, with calibration provided to manufacturers' specifications and NATA reporting available.",
		iconSvg:
			'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6" /><path d="M9 14.5L7 22l5-3 5 3-2-7.5" /><path d="M9.5 9l1.8 1.8L14.5 7.5" /></svg>',
	},
	{
		id: 'repair-work',
		href: '/services/repair-work/',
		title: 'Repair Work',
		description:
			'Cavotec Malaysia has been providing repair and service solutions since 2006, covering defense, manufacturing, and other high-tech sectors, with deep experience in Tektronix and Fluke equipment.',
		iconSvg:
			'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 4.6L4 16.2V20h3.8l5.3-5.3a4 4 0 0 0 4.6-5.4l-2.6 2.6-2-2 2.6-2.6z" /></svg>',
	},
	{
		id: 'equipment-rental',
		href: '/services/equipment-rental/',
		title: 'Equipment Rental',
		description:
			'Short-term and long-term rental of calibrated test and measurement equipment, so teams can scale up capacity without a capital purchase — full rental terms and available inventory will be published here soon.',
		iconSvg:
			'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /><path d="M12 14v3l2 1" /></svg>',
		comingSoon: true,
	},
	{
		id: 'training',
		href: '/services/training/',
		title: 'Training',
		description:
			'Hands-on and classroom training on test equipment operation, calibration procedures, and best practices for in-house maintenance teams — a detailed course catalog and schedule will be published here soon.',
		iconSvg:
			'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5-10-5z" /><path d="M6 11v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" /><path d="M22 9v6" /></svg>',
		comingSoon: true,
	},
	{
		id: 'customize-solution-provider',
		href: '/services/customize-solution-provider/',
		title: 'Customize Solution Provider',
		description:
			"For requirements that off-the-shelf equipment can't meet, our engineering team designs and builds custom solutions end-to-end — from electronics, through mechanical design, to new product development.",
		iconSvg:
			'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" /></svg>',
	},
];
