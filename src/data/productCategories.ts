// Summary data for the Products branch of ourBusinessMenu (Layout.astro) —
// mirrors it exactly, in the same order: Test Equipment and Measurement
// Instrument (+ its 4 brand children), ATE System, Internet of Things (IoT)
// (+ its 3 product children). Used by index.astro's ShowcaseCarousel and
// /products; extend this (not those pages independently) if the nav
// changes again, so all consumers stay in sync automatically.
//
// ATE System's description is the same copy already written for it in
// index.astro's ShowcaseCarousel items (index.astro imports this file and
// reuses `description` there too, rather than keeping two copies of the
// same string). IoT's and Test Equipment's top-level descriptions are
// copied verbatim from their own category landing pages' hero taglines
// (product/iot/index.astro and product/test-equipment-measurement/index.astro) —
// this file doesn't replace those pages' own copies of the text, so if
// either tagline changes there, update it here too. The 4 brand children's
// descriptions are each brand's own positioning statement (from that
// brand's own page); the 3 IoT children's descriptions are the same copy
// already used for them in index.astro's ShowcaseCarousel items.
import type { ImageMetadata } from 'astro';
import LindosLogo from '../assets/brands/lindos.png';
import AstronicsLogo from '../assets/brands/astronics.png';
import RedwoodLogo from '../assets/brands/redwood.png';
import DoeweLogo from '../assets/brands/doewe.png';

export interface ProductChild {
	id: string;
	href: string;
	title: string;
	description: string;
	// Brand logo (Test Equipment's 4 children only) — rendered via
	// BrandLogoChip instead of a title/description card where present. IoT's
	// 3 children have no logo art, so they render as plain summary text.
	logo?: ImageMetadata;
	logoAlt?: string;
	logoChipVariant?: 'light' | 'dark';
}

export interface ProductCategory {
	id: string;
	href: string;
	title: string;
	description: string;
	// Raw inner SVG markup (viewBox 0 0 24 24), same convention as
	// ShowcaseCarousel/HowItWorksFlow's iconSvg prop — rendered via set:html.
	iconSvg: string;
	children?: ProductChild[];
}

export const productCategories: ProductCategory[] = [
	{
		id: 'test-equipment-measurement',
		href: '/product/test-equipment-measurement/',
		title: 'Test Equipment and Measurement Instrument',
		description:
			'A curated line of test equipment and measurement instrument brands, brought in by Cavotec Malaysia to support precise, reliable measurement across your operations.',
		// Same gauge icon already used for "Calibration and Test Measurement"
		// in index.astro's ShowcaseCarousel items — reused rather than
		// drawing a new one, since it already reads as "precision measurement".
		iconSvg:
			'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 0-9-9" /><path d="M12 21a9 9 0 0 0 9-9" /><path d="M12 12L16 8" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /></svg>',
		children: [
			{
				id: 'lindos',
				href: '/product/test-equipment-measurement/lindos/',
				title: 'LINDOS',
				description: 'Precision audio and broadcast test instruments.',
				logo: LindosLogo,
				logoAlt: 'LINDOS logo',
			},
			// Slug is "freedom-astronics" (no slash — not URL-safe as-is); the
			// display label keeps the brand's real "/" as given. Logo art
			// (astronics.png) only shows "ASTRONICS" branding, not "FREEDOM" —
			// see the flag on this in Layout.astro's nav data and
			// freedom-astronics.astro's own frontmatter comment.
			{
				id: 'freedom-astronics',
				href: '/product/test-equipment-measurement/freedom-astronics/',
				title: 'FREEDOM/ASTRONICS',
				description: 'Rugged test and measurement solutions for demanding environments.',
				logo: AstronicsLogo,
				logoAlt: 'ASTRONICS logo',
			},
			{
				id: 'redwood',
				href: '/product/test-equipment-measurement/redwood/',
				title: 'REDWOOD',
				description: 'General-purpose test and measurement instrumentation.',
				logo: RedwoodLogo,
				logoAlt: 'REDWOOD logo',
			},
			// DOEWE's logo is white/light-colored art with a teal accent — needs
			// the dark chip variant, or it disappears against the default light
			// chip (see BrandLogoChip.astro).
			{
				id: 'doewe',
				href: '/product/test-equipment-measurement/doewe/',
				title: 'DOEWE',
				description: 'Specialist broadcast and RF measurement systems.',
				logo: DoeweLogo,
				logoAlt: 'DOEWE logo',
				logoChipVariant: 'dark',
			},
		],
	},
	{
		id: 'ate-system',
		href: '/product/calibration-test-measurement/',
		title: 'ATE System',
		description:
			'Automated Test Equipment built for fast, repeatable functional and parametric testing across production lines. Modular hardware and software adapt to a wide range of DUTs without re-engineering the whole rig, cutting test time while holding tight to measurement accuracy.',
		iconSvg:
			'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></svg>',
	},
	{
		id: 'iot',
		href: '/product/iot/',
		title: 'Internet of Things (IoT)',
		description:
			"Connected hardware and IoT development — bringing Cavotec Malaysia's test and measurement expertise into the connected world.",
		// No existing "IoT-as-a-category" icon anywhere in the codebase to
		// reuse (the carousel only has per-sub-item icons: key/alarm/
		// building) — this is a plain signal/connectivity glyph in the same
		// stroke style as every other icon here, not a new design language.
		iconSvg:
			'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 16 0" /><path d="M7.5 12a4.5 4.5 0 0 1 9 0" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /><path d="M12 13.3V19" /></svg>',
		children: [
			{
				id: 'smart-key-management-system',
				href: '/product/iot/smart-key-management-system',
				title: 'Smart Key Management System (eKMS)',
				description:
					'A secure, trackable system for managing physical key access across facilities and fleets. Every checkout and return is logged automatically, removing the guesswork over who holds what and when.',
			},
			{
				id: 'integrated-alarm-system',
				href: '/product/iot/integrated-alarm-system',
				title: 'Integrated Alarm System',
				description:
					'Centralized monitoring that pulls alerts from across a site into a single, actionable view. Instant notifications flag issues the moment they are detected, cutting response time.',
			},
			{
				id: 'bms',
				href: '/product/iot/bms',
				title: 'Smart Building Management and Monitoring System (BMS)',
				description:
					'Monitor and manage HVAC, power, lighting, and security from one connected dashboard. Real-time data surfaces inefficiencies before they become costly problems.',
			},
		],
	},
];
