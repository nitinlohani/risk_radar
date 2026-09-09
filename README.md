# FT AML User Guide

## Opening it
Just double-click `index.html`. No server, no install.

## Adding content — the easy way

**`index.html` is generated. Don't edit it directly** — your changes will
be overwritten the next time the build script runs. Instead, edit one of
the files below, then run:

```bash
python3 build.py
```

That's the whole workflow: edit content → run one command → `index.html`
is regenerated with everything wired up correctly (sidebar link, search
index, "On this page" panel, landing page card — all automatic).

---

### Adding an icon to a module
Set the "icon" field in that module's \ entry.
Available names: \, \, \, \,
\, \, \, \, \, \, \,
\, \, \, \, \. This same icon
shows in the sidebar and on any "Related Modules" card pointing to it.

### Add a new module

1. **Write the content.** Create `sections/your-module-id.html` with the
   module's body HTML. Copy the top of any existing file in `sections/`
   for the pattern — a `.sec-tag` category label, an `<h2>` title, then
   whatever content the module needs (paragraphs, `<h3>` sub-headings,
   `.howto` callout boxes, tables, images).

2. **Register it.** Add one entry to `content/modules.json`:
   ```json
   { "id": "your-module-id", "title": "Your Module Name", "category": "Core Workflow" }
   ```
   - `id` must exactly match the filename in `sections/` (without `.html`).
   - `category` must exactly match one of the existing category names
     (Get Started, Core Workflow, AI & Screening, Monitoring & Data,
     Administration, Reference & Support) — it'll be grouped under that
     heading in the sidebar. Using a new category name creates a new
     sidebar section automatically.
   - Position in the list = position in the sidebar. Insert it wherever
     you want it to appear.

3. *(Optional)* **Add a landing page card.** If you also want it featured
   on the front page's module grid, add an entry to
   `content/landing-cards.json`:
   ```json
   { "icon": "case", "title": "Your Module Name", "href": "#your-module-id",
     "large": false, "description": "One or two sentences on what it does." }
   ```
   Available `icon` names: `dashboard`, `customer`, `screening`,
   `monitoring`, `alert`, `case`, `report`, `rules`, `ai`, `ingestion`,
   `user-mgmt`, `hierarchy`, `admin`, `faq`, `glossary`, `support`. Set
   `"large": true` for a featured (wider) card.

4. **Run the build:**
   ```bash
   python3 build.py
   ```

Search, the "On this page" panel, and the breadcrumb all pick up the new
module automatically — nothing else to configure.

### Edit an existing module
Just edit its file in `sections/`, then run `python3 build.py`.

### Add a sub-heading to a module
Add an `<h3 id="some-id">Your Heading</h3>` inside that module's file in
`sections/`. It'll show up in "On this page" and become searchable
automatically. (h4 headings inside a `.howto` box are intentionally
excluded from "On this page" — see "Design notes" below.)

### Add a release note
Add one entry to the **top** of `content/releases.json` (newest first):
```json
{
  "version": "v2.5.0",
  "date": "15 Aug 2026",
  "tag": "new",
  "title": "Your Feature",
  "description": "What changed, in one sentence.",
  "moduleLink": "#your-module-id",
  "moduleLinkText": "Your Module Name"
}
```
`tag` must be `new`, `improved`, or `fix`. Run `python3 build.py` —
this updates both the full Release Notes module *and* the short landing-
page teaser (which always shows whichever entry is first in the list).

### Reorder the sidebar or change categories
Reorder entries in `content/modules.json`, or edit the `category` field.
Run the build. That's it — no HTML to touch.

---

## Project structure

```
├── build.py                    ← run this after any content change
├── content/
│   ├── modules.json            ← sidebar structure (single source of truth)
│   ├── landing-cards.json      ← front-page module grid cards
│   └── releases.json           ← release history
├── sections/*.html             ← each module's actual content
├── templates/shell.html        ← static page shell (rarely needs editing)
├── index.html                  ← GENERATED — don't hand-edit
├── css/styles.css
├── js/app.js
└── images/*.png
```

If you ever do need to change the overall page chrome (the hero banner,
Quick Start block, footer, topbar nav links) rather than module content,
that lives in `templates/shell.html` — edit it there, then re-run
`python3 build.py` so the change carries into `index.html`.

## Design notes

- **Sharp rectangles throughout** — no rounded corners on cards, buttons,
  badges, or the checkmark icons in "How to use" lists. True circles
  (dots, avatar-style icons) and the sidebar's scrollbar thumb are the
  only intentional exceptions.
- **Sidebar** shows top-level modules only, flat (no expand/collapse) —
  sub-topic navigation is the "On this page" panel's job.
- **"On this page"** and search both skip `<h4>` headings inside
  `.howto` boxes, since every one of those is titled "How to use" and
  isn't a meaningfully distinct heading to navigate to.
- **Opening any module hides the landing page** (hero, capabilities,
  module grid, Quick Start, release teaser) so only that module is on
  screen — it's restored when you click "← Modules."
- Each module's content lives in an inert `<template>` tag and is cloned
  into view only when opened — this is what keeps the page from paying
  the rendering cost of all 14+ modules at once, while still working
  with a simple double-click (no server, unlike a fetch-based approach).

## Design refresh

- **Sidebar icons** — each module now shows a small icon next to its
  name (set via the `icon` field in `content/modules.json`), turning
  grey-to-blue on hover/active, matching the icon used on its landing
  page card.
- **Landing cards now show their category** as a small blue label
  (top-right of each card), and lift with a branded blue-tinted shadow
  on hover.
- **"Related Modules" — auto-generated, at the end of every module.**
  Shows the other modules in the same category, as clickable cards with
  their icon. This updates itself automatically as you add/reorder
  modules in `modules.json` — nothing to maintain by hand.

### Adding an icon to a module
Set the `icon` field in that module's `content/modules.json` entry.
Available names: `dashboard`, `customer`, `screening`, `monitoring`,
`alert`, `case`, `report`, `rules`, `ai`, `ingestion`, `user-mgmt`,
`hierarchy`, `admin`, `faq`, `glossary`, `support`. This same icon shows
in the sidebar and on any "Related Modules" card pointing to it.


## Latest visual adjustments

- **Sidebar narrowed** (280px → 228px), giving the main content column
  more width.
- **Module names in the sidebar are now normal weight**, not bold —
  category headers stay bold+blue for contrast, module names read lighter.
- **Collapse/expand button** added next to "← Modules"/"Copy Page" —
  click to hide the sidebar entirely and give the main content the full
  width. Choice is remembered (localStorage) across page loads.
- **Fixed a real bug found while building this**: opening a module could
  leave its top action bar (breadcrumb, Modules/Copy Page buttons, and
  now the new toggle) mostly hidden behind the fixed top nav due to a
  missing scroll offset. Added `scroll-margin-top` so it now always
  lands cleanly below the nav.


## New: Filing an STR (Case Manager)

Added a full walkthrough of the STR filing workflow as a new sub-section
in Case Manager (`s-2-4`), using 21 real screenshots from an actual case
(Pooja Sharma, CASE-2026-0034617), 7 of them annotated with the same
blue-box/numbered-badge style used elsewhere in the guide. Structured as
three stages: dispose every alert on the case, close the case with a
True Match disposition, then the 6-step STR wizard itself (Select Alerts
through Narratives).

**A real scroll-spy bug found and fixed while adding this**: the "On
this page" panel's active-heading highlight used a narrow
IntersectionObserver band that could go stale during any long gap
between headings (exactly what a section this size introduces) — it
would freeze on whatever heading was last inside that band rather than
correctly reflecting the current section. Replaced it with a
position-based approach (last heading scrolled past a fixed line from
the top) that has no such gap. Verified by tracking the active heading
through a full continuous scroll and confirming it progresses through
every heading in the correct order.


## Latest interaction improvements

- **Sidebar spacing tightened** — category headers now sit closer to
  their topics (reduced from ~36px to ~20px of vertical breathing room),
  without cramping individual links (those were already tightly packed).
- **Copy Page shrunk to an icon-only button**, matching the sidebar
  toggle's compact size, with a floating "Copied!" confirmation that
  appears below it briefly rather than permanently taking up header space.
- **Back to Modules is now genuinely interactive** — fills solid blue on
  hover with a subtle shadow and a slight leftward nudge (echoing the
  back-arrow direction), plus a press-down effect on click.
- **Image lightbox: found and fixed a real bug.** Clicking a screenshot to
  zoom it was supposed to already work, but the click handler was being
  attached to images at page-load time — before any documentation section
  had been opened. Since content loads from `<template>` tags on demand,
  no screenshot existed in the DOM yet at that point, so the handler
  silently attached to nothing. Fixed by delegating the click listener to
  `document` instead, which catches clicks on images regardless of when
  they're inserted. Verified working across freshly-opened sections.
- **Sidebar collapse** button (next to Back to Modules) was already built
  in an earlier pass — confirmed still working, now sitting alongside the
  redesigned action buttons.


## Sidebar collapse redesigned as a plain arrow

Moved the collapse control out of the content-topbar button row entirely
and into the sidebar's own top edge, as a small arrow with no button
chrome (no border, no background box) — just the icon, with a subtle
blue-tinted circle on hover for click-target feedback.

Technically this couldn't just be dropped inside `.sidebar` itself: when
collapsed, the sidebar shrinks to `width: 0` with `overflow: hidden`, so
anything positioned inside it would disappear along with it, leaving no
way to re-expand. The arrow is a sibling of `.sidebar` instead, absolutely
positioned at the sidebar/content boundary, and its `left` offset
animates between the sidebar's width and `0` — so it stays reachable and
correctly positioned in both states, flipping direction (`‹` / `›`) to
match.


## Fixed a duplicate sidebar-collapse control

Found and removed a leftover second collapse button (`#sidebarEdgeTab`)
that `build.py` was still generating from an earlier, unfinished pass —
its CSS had already been cleaned up in an earlier session, but the HTML
generation code itself was never removed, so it kept rendering as a
boxed arrow at the sidebar's top alongside the newer plain-arrow toggle.
Removed the leftover generation entirely, and repositioned the one
remaining arrow to sit inside the sidebar's own column, near its
scrollbar edge, rather than at the outer boundary with the content area.


## Language switcher: real root cause found, plus new Country selector

**The language switcher genuinely wasn't working, and here's exactly
why** — confirmed directly from Google's own Translate support forum:
*"this widget is only functional on public websites on the Internet."*
Google's translate widget needs to fetch the page from a real, public
URL to build its translation — it cannot translate a page opened locally
via `file://`, which is how this guide is designed to be opened (double-
click, no server). That's a hard limitation of Google's widget itself,
not a bug in the code — verified the selection logic was already correct
by driving a mocked version of Google's widget directly and confirming it
correctly sets the value and fires the change event.

Given that constraint, the control now does everything that's actually
achievable reliably regardless of environment:
- Clicking a language immediately updates the displayed label and
  remembers the choice (works every time, in every environment)
- It still drives the real Google Translate widget when one happens to
  be present (e.g. if this guide is ever hosted on a real server) — nothing
  was removed, just made honest about what it can guarantee locally

**New: a Country selector**, stacked above the language control, with a
proper colored flag per country (the flag was removed from the language
control and now lives here instead, per your request). Selecting a
country updates the display and is remembered across visits.

Both controls were also shrunk down — smaller text, smaller flag, tighter
spacing — sitting compactly in the bottom-left corner of the footer.

## Lightbox: click the zoomed image to close it

Previously, clicking the backdrop around a zoomed screenshot closed it,
but clicking the image itself did nothing. Fixed so clicking the zoomed
image also closes it — click to zoom in, click again to zoom back out.


## Country/Language moved to bottom-right, sized down further

Repositioned both controls from bottom-left to bottom-right of the
footer, reduced to a smaller, normal (non-bold) font weight, and the
dropdown menus now open right-aligned to stay fully on-screen from that
position.


## New: Batch Ingestion (Data Ingestion module)

Added a new sub-section, positioned first — before Watchlist Ingestion
and TMS Ingestion — covering the scheduled bulk-import screen for
Customers, Accounts, and Transactions. Built from 4 real screenshots
(sequenced by filename: overview → change schedule step 1 → review step
→ job detail drawer), each annotated with the same corner-bracket/arrow/
caption-bar style used throughout the guide: Change Schedule, Review
Changes, Confirm, and Download Errors CSV.

Existing Watchlist Ingestion and TMS Ingestion figures were renumbered
(8.1/8.2 → 8.5/8.6) to make room — verified no duplicate or skipped
figure numbers afterward.


## New module: Customers

Added as a full module (not just a sub-section), positioned in Core
Workflow between Alert Manager and STR Listing — confirmed against the
actual app's own sidebar visible in the uploaded screenshots, which
shows this exact order. Built from 8 real screenshots, sequenced by the
number in each filename (customers_1, customers_kyc_level_2,
customer_profile_3 through 8), covering:

- Browsing and filtering the customer list (search, KYC Level filter)
- The full Customer Profile (summary header + the "More" expansion
  showing complete KYC detail: Profile, Risk & Compliance, Location,
  Business & Employment, Financial Information)
- All 5 profile tabs — Analytics, Transactions, Prior Cases / Alerts,
  Screening History, STR History

Each screenshot annotated with the same corner-bracket/arrow/caption-bar
style used throughout the guide, coordinates measured directly rather
than estimated.

Also found and fixed a stale reference: the landing page already had a
"Customer Management" card, but it pointed to `#name-screening` as a
placeholder (there was no real Customers module yet). Repointed it to
the new `#customers` module.

Verified: full 15-module regression passes, all 8 images load, sidebar
order matches the real app, "Related Modules" auto-links to Case
Manager/Alert Manager/STR Listing, and search correctly surfaces the new
content.


## New modules: Agent Configuration and Prompt Configuration

Both added under AI & Screening, positioned right after AI Agent Manager
and before Name Screening — confirmed against the real app's own sidebar
visible in the uploaded screenshots. Built from 5 real screenshots; the
"Add Prompt Config" screenshot was reordered ahead of its filename number
to fit the actual logical flow (list view → add flow → viewing an
existing entry's full detail), since presenting it in raw upload order
would have shown the creation dialog before the list it belongs to.

- **Agent Configuration**: registers the AI model identity (name,
  version, API key) that AI Agent Manager actually calls — annotated the
  Add button and the write-only Agent Key field.
- **Prompt Configuration**: defines the Role/Task/Description instructions
  paired with that model — annotated the Add button, the Purpose field,
  and a real multi-phase Role framework shown in an existing prompt's
  detail view.

Added landing-page cards for both (there were none before), and both
cross-link correctly via "Related Modules."

## Found and fixed a real search-indexing bug

Testing search for "agent key" — a phrase clearly present in the new
content — returned nothing. Traced it down rather than dismissing it:
`<strong>Agent Key</strong>` had word-wrapped across two lines in the
HTML source purely for editing readability, and the search indexer reads
raw `textContent`, which preserves that literal newline and indentation
instead of the single space a browser visually renders it as. So "agent
key" as a typed phrase silently failed to match "agent\n     key" in the
index — a latent bug that could affect any wrapped phrase anywhere in
the guide, not just this new content, with nothing visibly different on
the page to hint at it.

Fixed at the root: search indexing now normalizes whitespace (collapses
any run of spaces/tabs/newlines to one space) before storing. Verified
the fix directly — "agent key" now correctly finds Agent Configuration —
and re-confirmed existing multi-word phrase searches ("case lifecycle",
"true match", "filing an str") still work exactly as before.


## Three issues fixed

**1. "On this page" empty for Agent Configuration and Prompt
Configuration.** Root cause: both modules were written as a single flat
block (H2 + paragraphs + a "How to use" box) with no H3 sub-headings —
since "On this page" builds itself automatically from a module's H3s,
there was nothing for it to show. Restructured both into proper
sub-sections (Agent Configuration: "Registered agents" / "Adding a new
agent"; Prompt Configuration: "Configured prompts" / "Adding a new
prompt" / "Reviewing an existing prompt"), matching the pattern every
other module already follows. Verified both now populate correctly.

**2. Sidebar collapse arrow scrolled away instead of staying put.** It
was `position: absolute` relative to `.layout`, which scrolls with the
page like everything else in it — so scrolling down any long module made
it disappear, with no way to re-collapse/expand without scrolling back
to the top. Switched to `position: fixed` so it's now pinned at a
stable spot on screen regardless of scroll position. Fixed positioning
needs a real pixel value for its horizontal offset, though, and `.layout`
is centered with its own max-width — so that value isn't a constant, it
depends on viewport width. Computed from the sidebar's actual rendered
edge via JS instead of hardcoded, recalculated on window resize and every
collapse/expand toggle (and once more after the collapse CSS transition
finishes, since the sidebar's width doesn't reach its final size
immediately). Also made it more interactive per your request: filled
white circle with a shadow at rest, fills solid blue with a scale-up on
hover, scales down slightly on click. Verified the arrow's position is
now bit-for-bit identical before and after scrolling 2000px down a page.

**3. Release Notes hadn't been updated for any of the recent additions.**
Added three new entries — v2.7.0 (Agent Configuration & Prompt
Configuration), v2.6.0 (Customers), v2.5.0 (Batch Ingestion) — each with
a working link back to its module. This automatically updated both the
full Release Notes module and the landing page's compact teaser (which
always shows whichever entry is listed first).

Full 17-module regression re-run after all three fixes — passes.


## Sidebar collapse button restyled, Back to Top button redesigned

**Sidebar collapse button** now matches the requested reference look —
a rounded-rectangle panel icon (frame + divider + arrow) instead of a
plain circle with a chevron, and repositioned to sit fully inside the
sidebar's own bounds, its right edge landing just inside the sidebar's
scrollbar track (6px padding) rather than straddling the boundary with
the content area. The icon mirrors correctly when collapsed (divider and
arrow flip to the other side, indicating "expand").

**Back to Top button**:
- Now only appears once the user has actually scrolled to (near) the
  bottom of the page — computed live as `scrollY + innerHeight >=
  scrollHeight - 120`, not a fixed "scrolled past 480px" threshold as
  before. This recalculates correctly regardless of how tall the current
  module's content is.
- Repositioned from bottom-right to bottom-center.
- Restyled to a semi-transparent frosted-glass circle (light background
  with blur, thin blue-tinted border) with a blue arrow, instead of a
  solid opaque blue fill.

Verified the visibility fix by testing at scrollY=600 (correctly hidden)
and at the true bottom of a long module's content (correctly shown) —
also caught and worked around a testing artifact of my own along the
way: `scroll-behavior: smooth` was causing an animated `scrollTo` call to
get cut off by my test's wait time, making it look like the button
wasn't appearing at the bottom when the page just hadn't finished
scrolling there yet. Confirmed with an instant scroll instead.


## Sidebar collapse button simplified further

Removed the button's background, border, and shadow entirely — it's now
just the arrow icon floating with no box around it at all. Simplified
back to a plain chevron (dropped the panel-frame-and-divider icon from
the previous pass, since the request was specifically for just an
arrow). Color-coded by state: gray at rest, blue on hover, and blue
whenever the sidebar is actually collapsed (not just on hover) — so at a
glance, blue means "sidebar is collapsed, click to bring it back."


## Collapsed sidebar now shows an icon-only rail, not fully hidden

Previously, collapsing the sidebar hid it entirely (width: 0) — now it
narrows to a 52px vertical rail showing just the icons, stacked
vertically, with no horizontal space wasted on now-hidden text labels.
Category headers are hidden too (no room for them at this width).

- Icons remain fully clickable and still navigate correctly in this
  mode — tested clicking straight through to a module while collapsed.
- Each icon now has a native `title` tooltip (the module's name), so
  hovering in icon-only mode still tells you what everything is.
- The active module's icon still shows the same blue left-border
  indicator used in the expanded sidebar.
- The collapse toggle arrow's position updates automatically for the
  new 52px width — simplified its positioning logic in the process,
  since the sidebar now always reports a real, measurable width in both
  states (52px or ~228px) rather than 0 needing special-cased handling.

Verified: clicking a module icon while collapsed navigates correctly and
stays collapsed afterward, the collapsed state still survives a page
reload, and the full 17-module regression passes with the sidebar in
this new mode.
