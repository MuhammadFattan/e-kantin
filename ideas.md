# Design direction — Kantin UIN Raden Fatah

## Theme: Rasa Kampus — confident, warm, quick to use

### Design movement
A contemporary campus marketplace that combines the clarity of a university service with the warmth of Indonesian food photography. It is an original design, not a clone of a food-delivery brand.

### Core principles
Make finding familiar food fast; show price, location and availability clearly; keep the shopper flow comfortable on a phone; use practical data density in owner/admin pages without turning the product into a CRUD dashboard; show action feedback immediately; keep all prototype functionality honest about its local-demo nature.

### Color philosophy
Use deep ink/navy (`#101C3A`) and a slightly lighter blue (`#1D3260`) for the primary brand and navigation, warm ivory (`#F8F7F3`) for the application canvas, white cards, and a lively but restrained chili/coral orange (`#EE7046`) for food/action accents. Use muted slate for secondary text, green for open/available states, amber for waiting, and red only for cancellation/destructive states. Ensure text contrast remains accessible.

### Layout paradigm
Responsive content-first storefront. On desktop, use a centered wide content grid with a spacious promotional hero, search/categories, then editorially grouped canteens and products. On mobile, keep the header compact, search easy to reach, cards in a naturally scrollable single/two-column rhythm, and cart access prominent. Owner/admin areas use a slim navy-accented sidebar on desktop and a collapsible/stacked navigation on narrow screens; tables become readable stacked cards on phones.

### Signature elements
An original simple campus-food mark combining a rounded serving cloche/plate silhouette with a small geometric roof/book accent, using navy and coral shapes with generous negative space. Pair it with the wordmark “Kantin Raden Fatah”. Product cards use image-first crops, a clear product name/price hierarchy, canteen metadata, small dummy-rating treatment, and an accessible compact add control. Use a light editorial label chip for categories and understated open/closed/status pills.

### Interaction philosophy
Search and category chips update results immediately. Adding to cart gives a visible toast and a persistent cart count. Quantity and order status actions update the shared demo state immediately. Forms validate inline; confirmation is required only for destructive demo actions. Empty states explain the next action. Avoid hidden critical controls, ambiguous payment affordances, or any implication of delivery or real authentication.

### Animation
Use brief color/border/shadow transitions on interactive cards and buttons, subtle fade/slide-in for drawers/dialogs and toasts, and restrained press feedback. Respect reduced-motion preferences; don't make motion necessary to understand status.

### Typography system
Use a modern humanist sans-serif stack with a clear display weight for the hero, high legibility for prices and controls, and compact readable labels for metadata. Prefer the framework/system font stack to avoid a remote-font dependency.

### Brand essence and voice
Warm, dependable, campus-local, straightforward. Indonesian UI microcopy should be friendly and concise; prices and order progress should be explicit. The site supports campus UMKM without pretending to process payment.

### Wordmark/logo and signature color
Use “Kantin Raden Fatah” as the wordmark and a simple plate/cloche-meets-campus mark as the symbol. Signature color is deep navy; coral highlights ordering actions and warm food cues.

### Planned assets
Create a distinct full-bleed square project icon and a matching standalone header/favicon mark in the same navy/coral identity. Create one wide, original hero image for the home feature, then curate locally stored dish imagery for the actual seed catalog: a pempek image may serve closely related pempek variants, while meals, noodles, snacks and drinks use appropriate distinct images. Keep each asset's usage tied to matching menu items; no unrelated image reuse or broken remote placeholders.
