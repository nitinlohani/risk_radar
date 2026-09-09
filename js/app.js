// ==== inline script block 1 of 7 ====
window.PORTAL_SEARCH_INDEX = [
            { title: 'Home', path: '#top', headings: ['Platform Overview', 'Modules Dashboard'] },
            { title: 'Getting Started', path: '#getting-started', headings: ['Purpose', 'Scope', 'System Requirements', 'Login', 'Module Overview'] },
            { title: 'Case Manager', path: '#case-manager', headings: ['Case Queues', 'Case Lifecycle', 'Case List Columns'] },
            { title: 'Alert Manager', path: '#alert-manager', headings: ['Alert Queues', 'Alert List Columns'] },
            { title: 'STR Listing', path: '#str-listing', headings: ['STR Listing Columns'] },
            { title: 'AI Manager', path: '#ai-manager', headings: ['What It Does', 'Human Review', 'Prompt Config', 'Model Config', 'Configured prompts', 'Registered agents', 'Temperature', 'Restore'] },
            { title: 'Automation', path: '#automation', headings: ['Case Creation', 'Active Configuration', 'Configuration History'] },
            { title: 'Name Screening', path: '#name-screening', headings: ['Watchlist Search', 'Manual Screening', 'Batch Screening', 'Delta Screening', 'Configuration'] },
            { title: 'Transaction Monitoring & Rule Engine', path: '#transaction-monitoring', headings: ['Typology', 'Variables', 'Trigger Conditions'] },
            { title: 'Data Ingestion', path: '#data-ingestion', headings: ['Watchlist Ingestion', 'TMS Ingestion'] },
            { title: 'Admin', path: '#admin', headings: ['Profile & Preferences', 'Roles & Permissions', 'Hierarchy Management', 'Organizational Units', 'Escalation Paths'] },
            { title: 'Help & Reference', path: '#faq', headings: ['FAQ', 'Cases', 'Alerts', 'Reports', 'Screening', 'Glossary', 'AML terms', 'Help & Support', 'Contact Support'] }
        ];

// ==== inline script block 2 of 7 ====
const sidebarEl = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        function openSidebar() { if (sidebarEl) sidebarEl.classList.add('open'); if (sidebarOverlay) sidebarOverlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
        function closeSidebar() { if (sidebarEl) sidebarEl.classList.remove('open'); if (sidebarOverlay) sidebarOverlay.classList.remove('show'); document.body.style.overflow = ''; }
        const mt = document.getElementById('menuToggle'); if (mt) mt.addEventListener('click', function () {
            if (sidebarEl.classList.contains('open')) { closeSidebar(); } else { openSidebar(); }
        });
        if (sidebarOverlay) if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });
        const links = document.querySelectorAll('.side-link');
        const sublinks = document.querySelectorAll('.side-sublink');
        const secs = document.querySelectorAll('.doc-section');
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    links.forEach(l => l.classList.remove('active'));
                    sublinks.forEach(l => l.classList.remove('active'));
                    const id = e.target.getAttribute('id');
                    const match = document.querySelector('.side-link[data-target="' + id + '"]') || document.querySelector('.side-sublink[data-target="' + id + '"]');
                    if (match) {
                        match.classList.add('active');
                        const group = match.closest('.side-group');
                        if (group) group.classList.add('expanded');
                    }
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px' });
        secs.forEach(s => io.observe(s));
        links.forEach(l => l.addEventListener('click', closeSidebar));
        sublinks.forEach(l => l.addEventListener('click', closeSidebar));

        /* --- Scroll progress bar --- */
        const progressBar = document.getElementById('scrollProgress');
        function updateProgress() {
            if (!progressBar) return;
            const h = document.documentElement;
            const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }
        document.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();

        /* --- Back to top button: only appears once the user has actually
           scrolled to (near) the bottom of the page, not just scrolled down
           some fixed amount — the page's real height changes a lot depending
           on which module is open, so this is computed live each time. --- */
        const backToTop = document.getElementById('backToTop');
        function checkNearBottom() {
            if (!backToTop) return;
            const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 120;
            backToTop.classList.toggle('show', nearBottom);
        }
        document.addEventListener('scroll', checkNearBottom, { passive: true });
        window.addEventListener('resize', checkNearBottom);
        checkNearBottom();
        if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        /* --- Reveal sections on scroll (with safe fallback so content is never stuck hidden) --- */
        const revealTargets = document.querySelectorAll('.doc-section');
        if ('IntersectionObserver' in window) {
            const revealIO = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) { e.target.classList.add('in-view'); revealIO.unobserve(e.target); }
                });
            }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
            revealTargets.forEach(s => revealIO.observe(s));
        } else {
            revealTargets.forEach(s => s.classList.add('in-view'));
        }
        // Failsafe: guarantee every section is visible shortly after load, even if the observer
        // never fires (older browsers, print/PDF rendering, etc.)
        window.addEventListener('load', () => {
            setTimeout(() => { revealTargets.forEach(s => s.classList.add('in-view')); }, 1200);
        });

        /* --- Image lightbox for figures --- */
        // Delegated on document (not bound per-image at load time): sections
        // are lazy-loaded from <template> tags and cloned in only when a
        // module is opened, so the actual documentation screenshots don't
        // exist in the DOM yet when this script first runs. Binding directly
        // to querySelectorAll('figure.shot-wide img') here would silently
        // find zero images and never open for any real content — verified
        // this was happening before switching to delegation.
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');

        function openLightbox(img) {
            if (!lightbox || !lightboxImg) return;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('open');
        }
        function closeLightbox() {
            if (!lightbox) return;
            lightbox.classList.remove('open');
            if (lightboxImg) lightboxImg.src = '';
        }

        document.addEventListener('click', (e) => {
            const img = e.target.closest('figure.shot-wide img');
            if (img) openLightbox(img);
        });
        const lc = document.getElementById('lightboxClose');
        if (lc) lc.addEventListener('click', closeLightbox);
        // Clicking the backdrop OR the zoomed image itself closes the lightbox —
        // "click to zoom in, click again to zoom back out" is the expected toggle
        // behavior; previously only the backdrop (not the image) closed it.
        if (lightbox) lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
        });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

        /* --- Copyable heading anchors --- */
        document.querySelectorAll('.doc-section > h2').forEach(h => {
            const sec = h.closest('.doc-section');
            if (!sec || !sec.id) return;
            const a = document.createElement('span');
            a.className = 'h2-anchor';
            a.textContent = '🔗';
            a.title = 'Copy link to this section';
            a.addEventListener('click', (ev) => {
                ev.stopPropagation();
                const url = window.location.origin + window.location.pathname + '#' + sec.id;
                navigator.clipboard.writeText(url).catch(() => { });
                a.textContent = '✓';
                setTimeout(() => { a.textContent = '🔗'; }, 1200);
            });
            h.appendChild(a);
        });

        /* --- Table horizontal-scroll hint (only shows when there is real overflow, clears once fully scrolled) --- */
        const SCROLL_END_SLOP = 6; // px tolerance for subpixel / zoom rounding across browsers
        function isAtScrollEnd(tw) {
            return Math.ceil(tw.scrollLeft) + tw.clientWidth >= tw.scrollWidth - SCROLL_END_SLOP;
        }
        function refreshTableScrollHints() {
            document.querySelectorAll('.table-wrap').forEach(tw => {
                const scrollable = tw.scrollWidth > tw.clientWidth + SCROLL_END_SLOP;
                tw.classList.toggle('scrollable', scrollable);
                tw.classList.toggle('at-end', !scrollable || isAtScrollEnd(tw));
            });
        }
        document.querySelectorAll('.table-wrap').forEach(tw => {
            tw.addEventListener('scroll', () => {
                tw.classList.toggle('at-end', isAtScrollEnd(tw));
            }, { passive: true });
        });
        refreshTableScrollHints();
        window.addEventListener('resize', refreshTableScrollHints);
        window.addEventListener('load', refreshTableScrollHints);
        window.addEventListener('load', () => setTimeout(refreshTableScrollHints, 500)); // re-check after web fonts settle

// ==== inline script block 3 of 7 ====
(function () {
            'use strict';

            // ---- Mobile nav toggle (simple show/hide of nav-links as a dropdown) ----
            var menuToggle = document.getElementById('menuToggle');
            var navLinks = document.querySelector('.nav-links');
            if (menuToggle && navLinks) {
                menuToggle.addEventListener('click', function () {
                    var isOpen = navLinks.style.display === 'flex';
                    navLinks.style.display = isOpen ? 'none' : 'flex';
                    navLinks.style.cssText += isOpen ? '' : 'position:absolute; top:64px; left:0; right:0; background:var(--paper-raised); flex-direction:column; padding:20px 24px; border-bottom:1px solid var(--border); align-items:flex-start; gap:16px;';
                });
            }

            // ---- Scroll-reveal for module cards ----
            var cards = document.querySelectorAll('.mod-card');
            if ('IntersectionObserver' in window) {
                var io = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('revealed');
                            io.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.15 });
                cards.forEach(function (c, i) {
                    c.style.transitionDelay = (i % 4) * 0.06 + 's';
                    io.observe(c);
                });
            } else {
                cards.forEach(function (c) { c.classList.add('revealed'); });
            }

            // ---- Hero search + module grid live filter ----
            function wireSearchFilter(inputEl) {
                if (!inputEl) return;
                inputEl.addEventListener('input', function () {
                    var q = inputEl.value.trim().toLowerCase();
                    cards.forEach(function (c) {
                        var match = !q || c.getAttribute('data-title').indexOf(q) !== -1 || c.getAttribute('data-desc').indexOf(q) !== -1;
                        c.setAttribute('data-hidden', match ? 'false' : 'true');
                    });
                    if (q) {
                        var grid = document.querySelector('.mod-grid');
                        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }
            wireSearchFilter(document.getElementById('heroSearchInput'));

            // ---- Command palette (Ctrl+K) ----
            var overlay = document.getElementById('cmdkOverlay');
            var cmdkInput = document.getElementById('cmdkInput');
            var cmdkResults = document.getElementById('cmdkResults');
            var triggers = document.querySelectorAll('[data-cmdk-trigger]');

            // Indexes every doc-section's title, subsection headings, and full body
            // text — regardless of whether that section's tab is currently open or
            // closed in the UI — so search always has the complete picture.
            //
            // The sidebar itself is now a flat list of top-level modules only
            // (sub-heading navigation lives in the "On this page" panel once
            // you're on a section), so title/sub-heading/body data for search
            // is read directly from each section's own <template> content —
            // already sitting inert in the DOM, no fetch needed — rather than
            // from the sidebar, which is the single source of truth anyway.
            var SECTION_INDEX = Array.prototype.map.call(document.querySelectorAll('.sidebar .side-link[data-target]'), function (link) {
                var sid = link.getAttribute('data-target');
                return { id: sid, title: link.textContent.trim(), text: '', subs: [] };
            });

            function indexSectionFragment(sectionId, html) {
                var temp = document.createElement('div');
                temp.innerHTML = html;
                var entry = SECTION_INDEX.find(function (s) { return s.id === sectionId; });
                if (!entry) return;
                // Whitespace is normalized (any run of spaces/tabs/newlines
                // collapsed to one space) before indexing — a phrase that's
                // word-wrapped across lines in the HTML source (purely for
                // editing readability) still renders as one continuous
                // phrase visually, but textContent preserves the raw
                // newline/indentation as-is. Without this, a search for an
                // exact multi-word phrase like "agent key" can silently miss
                // content where that phrase happened to wrap mid-string in
                // source, even though nothing looks different on the page.
                entry.text = (temp.textContent || '').replace(/\s+/g, ' ').toLowerCase();
                // Same exclusion as buildTOC: h4s inside .howto are all
                // titled "How to use" and aren't meaningfully distinct
                // sub-headings for search or navigation purposes.
                var subHeadings = Array.prototype.filter.call(
                    temp.querySelectorAll('h3, h4'),
                    function (h) { return !h.closest('.howto'); }
                );
                entry.subs = subHeadings.map(function (h, i) {
                    var id = h.id || ('heading-' + sectionId + '-' + i);
                    return { title: h.textContent.trim(), id: id };
                });
            }
            // Exposed globally: this file's script blocks run in separate
            // closures (some wrapped in their own IIFE, one in a distinct
            // DOMContentLoaded callback), so the real on-demand section
            // loader (in a different block) reaches this via window.
            window.indexSectionFragment = indexSectionFragment;
            window.SECTION_INDEX = SECTION_INDEX;

            // Every section's content is already sitting in a <template> tag
            // in the DOM (inert, unrendered) — no fetch needed to build a full
            // search index, so just read straight from each template right away.
            function indexAllSectionsFromTemplates() {
                SECTION_INDEX.forEach(function (entry) {
                    var template = document.getElementById('tpl-' + entry.id);
                    if (template) indexSectionFragment(entry.id, template.innerHTML);
                });
            }
            indexAllSectionsFromTemplates();

            function search(query) {
                var q = query.trim().toLowerCase();
                var titleHits = [], headingHits = [], textHits = [];
                SECTION_INDEX.forEach(function (sec) {
                    if (!q || sec.title.toLowerCase().indexOf(q) !== -1) {
                        titleHits.push({ label: sec.title, path: null, sectionId: sec.id, headingId: null });
                    }
                    var matchedHeading = false;
                    sec.subs.forEach(function (sub) {
                        if (q && sub.title.toLowerCase().indexOf(q) !== -1) {
                            headingHits.push({ label: sub.title, path: sec.title, sectionId: sec.id, headingId: sub.id });
                            matchedHeading = true;
                        }
                    });
                    if (q && !matchedHeading && sec.title.toLowerCase().indexOf(q) === -1 && sec.text.indexOf(q) !== -1) {
                        textHits.push({ label: sec.title, path: 'Mentioned in this section', sectionId: sec.id, headingId: null });
                    }
                });
                return titleHits.concat(headingHits).concat(textHits).slice(0, 8);
            }

            // Expose so the Ask AI assistant can answer from the same accurate,
            // DOM-derived index instead of a separately hand-maintained list.
            window.guideSearch = search;

            function openResult(item) {
                // activateTab is async (it may need to lazy-load the section's
                // content first) and already handles scrolling to a specific
                // sub-heading once that content is actually in the DOM, so we
                // just delegate to it directly rather than guessing a timeout.
                if (window.openDocSection) {
                    window.openDocSection(item.sectionId, item.headingId || undefined);
                }
                if (!item.headingId) {
                    setTimeout(function () {
                        var mainContent = document.getElementById('mainContent');
                        if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 30);
                }
            }

            function renderResults(query) {
                var matches = search(query);
                var trimmed = query.trim();
                var askRow = trimmed
                    ? '<div class="cmdk-ask-ai" id="cmdkAskAi"><span class="ai-spark">&#10022;</span> Ask AI: &ldquo;' + trimmed.replace(/</g, '&lt;') + '&rdquo;</div>'
                    : '';
                if (!matches.length) {
                    cmdkResults.innerHTML = '<div class="cmdk-empty">No matching module or section.</div>' + askRow;
                } else {
                    cmdkResults.innerHTML = matches.map(function (m, i) {
                        var pathLine = m.path ? '<div class="cmdk-item-path">' + m.path + '</div>' : '';
                        return '<div class="cmdk-item' + (i === 0 ? ' active' : '') + '" data-index="' + i + '">' +
                            '<div class="cmdk-item-title">' + m.label + '</div>' + pathLine +
                            '</div>';
                    }).join('') + askRow;
                }
                Array.prototype.forEach.call(cmdkResults.querySelectorAll('.cmdk-item'), function (el, i) {
                    el.addEventListener('click', function () {
                        openResult(matches[i]);
                        closeCmdk();
                    });
                });
                var askEl = document.getElementById('cmdkAskAi');
                if (askEl) {
                    askEl.addEventListener('click', function () {
                        closeCmdk();
                        if (window.openAiWithQuery) window.openAiWithQuery(trimmed);
                    });
                }
            }

            function openCmdk() {
                overlay.classList.add('open');
                cmdkInput.value = '';
                renderResults('');
                setTimeout(function () { cmdkInput.focus(); }, 30);
            }
            function closeCmdk() { overlay.classList.remove('open'); }

            if (overlay && cmdkInput && cmdkResults) {
                triggers.forEach(function (t) { t.addEventListener('click', openCmdk); });
                overlay.addEventListener('click', function (e) { if (e.target === overlay) closeCmdk(); });
                cmdkInput.addEventListener('input', function () { renderResults(cmdkInput.value); });
                document.addEventListener('keydown', function (e) {
                    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
                        e.preventDefault();
                        overlay.classList.contains('open') ? closeCmdk() : openCmdk();
                        return;
                    }
                    var tag = (e.target && e.target.tagName) || '';
                    var typing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable);
                    if (e.key === '/' && !typing && !overlay.classList.contains('open')) {
                        e.preventDefault();
                        openCmdk();
                        return;
                    }
                    if (e.key === 'Escape') closeCmdk();
                });
            }
        })();

// ==== inline script block 4 of 7 ====
/*!
         * Developer Guide Assistant
         * -------------------------
         * A self-contained, framework-free documentation navigator.
         * It indexes the page's own sections/headings/tables/code/FAQ at runtime,
         * answers natural-language questions with a short summary, and scrolls +
         * highlights the most relevant section instead of generating free-form text.
         *
         * INTEGRATION
         *   1. Include doc-assistant.css and this file before 
        .
         *   2. Wrap each documentation section like:
         *        <section class="doc-section" id="auth">
         *          <h2>Authentication</h2>
         *          <h3>API Keys</h3> ... tables ... <code>...</code> ... .faq-item ...
         *        </section>
         *   3. Call DocAssistant.init({ ... options }) once the DOM is ready, or just
         *      include the script with [data-auto-init] on its <script> tag (default
         *      in the snippet at the bottom of this file).
         *
         * No build step, no dependencies, no network calls. Everything — indexing,
         * search, ranking — runs client-side against the DOM that's already on the page.
         */

        (function (global) {
            'use strict';

            /* ============================================================
               1. CONFIG
               ============================================================ */

            var DEFAULTS = {
                // CSS selector for each indexable documentation section.
                sectionSelector: '.doc-section',
                // Root container to scroll within (defaults to window).
                scrollContainer: null,
                // Label shown in the launcher + panel header.
                title: 'Developer Assistant',
                // The name of the documentation itself, used only inside the
                // assistant's own copy (empty state, "couldn't find" message) — kept
                // separate from `title` (the panel header) so a site can say e.g.
                // "Guide Assistant" as the title but "User Guide" as the doc name.
                docLabel: 'Developer Guide',
                // Comma-separated example topics shown in the idle state before any
                // question is asked — keep these specific to what this guide actually
                // covers, not generic developer-docs language.
                exampleTopics: 'authentication, endpoints, webhooks, errors',
                // Quick-jump chips shown in the idle state, before any question is asked —
                // lets people go straight to a major topic instead of typing.
                // e.g. [{ label: 'Case Manager', id: 'case-manager' }, ...]
                suggestedTopics: [],
                // Short call-to-action shown on the floating launcher pill itself
                // (separate from `title`, which is the panel's own heading).
                launcherLabel: 'Ask me anything',
                // Position of the floating launcher, in case the host page already
                // has something else (a back-to-top button, a cookie banner) sitting
                // in the default bottom-right corner.
                launcherBottom: '24px',
                launcherRight: '24px',
                // Placeholder text for the input.
                placeholder: 'Ask a question…',
                // How long the destination highlight stays visible (ms).
                highlightDuration: 2600,
                // Max related-section suggestions shown alongside the best match.
                maxRelated: 3,
                // Optional synonym map merged on top of the built-in one — lets a site
                // add domain-specific terms without touching the core script.
                synonyms: {},
                // Called whenever the assistant navigates to a section (analytics hook).
                onNavigate: null,

                /* ---- Optional LLM-backed mode ----
                   If set, the assistant sends the question plus the top candidate
                   sections (already found by the local keyword/semantic search below)
                   to YOUR OWN backend endpoint, which calls an LLM server-side and
                   returns a JSON answer. The LLM never sees or invents content outside
                   the candidates it's given, and the widget never calls an LLM API
                   directly from the browser — an API key must never be embedded in
                   this file or shipped to the client. See the reference backend
                   (assistant-server example) for the expected request/response shape.
                   Leave this unset to keep the assistant fully client-side. */
                llmEndpoint: null,       // e.g. '/api/assistant'
                llmTimeoutMs: 9000,      // abort and fall back to local search past this
                llmCandidateCount: 5     // how many local matches to send as context
            };

            /* ============================================================
               2. BUILT-IN SYNONYM / CONCEPT MAP
               Generic developer-documentation vocabulary. Each key is a concept;
               each value is a list of terms that should all boost the same concept
               when they appear in a user's question. This is what makes search
               "semantic" without needing a model or network call — a query for
               "login" also matches sections about tokens, keys, and OAuth.
               ============================================================ */

            var BUILT_IN_SYNONYMS = {
                authentication: ['login', 'log in', 'sign in', 'auth', 'authenticate', 'authorize', 'authorization',
                    'api key', 'apikey', 'bearer token', 'bearer', 'oauth', 'token', 'credential', 'credentials',
                    'header', 'headers', 'expire', 'expiry', 'expiration'],
                webhooks: ['webhook', 'webhooks', 'callback', 'event', 'events', 'notification', 'push', 'listener'],
                errors: ['error', 'errors', 'error code', 'status code', 'fail', 'failure', 'failing', '400', '401',
                    '403', '404', '429', '500', 'rate limit', 'throttle', 'retry'],
                endpoints: ['endpoint', 'endpoints', 'route', 'url', 'uri', 'request', 'response', 'payload',
                    'body', 'method', 'get', 'post', 'put', 'patch', 'delete'],
                sdk: ['sdk', 'sdks', 'library', 'libraries', 'client', 'package', 'wrapper'],
                testing: ['sandbox', 'test', 'testing', 'staging', 'mock', 'dry run'],
                ingestion: ['ingest', 'ingestion', 'upload', 'import', 'csv', 'bulk', 'file', 'batch'],
                workflows: ['workflow', 'workflows', 'flow', 'integration', 'process', 'sequence', 'diagram'],
                faq: ['faq', 'question', 'questions', 'common issue', 'troubleshoot', 'troubleshooting', 'problem'],
                changelog: ['changelog', 'release', 'version', 'update', 'whats new', "what's new", 'history']
            };

            /* ============================================================
               3. SMALL DOM / STRING HELPERS
               ============================================================ */

            function qs(sel, root) { return (root || document).querySelector(sel); }
            function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

            function normalize(str) {
                return (str || '')
                    .toLowerCase()
                    .replace(/[^a-z0-9\s]/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
            }

            var STOPWORDS = {
                'a': 1, 'an': 1, 'the': 1, 'is': 1, 'are': 1, 'was': 1, 'were': 1, 'be': 1, 'been': 1,
                'do': 1, 'does': 1, 'did': 1, 'i': 1, 'we': 1, 'you': 1, 'it': 1, 'this': 1, 'that': 1,
                'to': 1, 'of': 1, 'in': 1, 'on': 1, 'for': 1, 'and': 1, 'or': 1, 'if': 1, 'not': 1,
                'what': 1, 'where': 1, 'when': 1, 'how': 1, 'why': 1, 'who': 1, 'which': 1,
                'can': 1, 'could': 1, 'should': 1, 'would': 1, 'will': 1, 'my': 1, 'me': 1, 'us': 1,
                'with': 1, 'at': 1, 'from': 1, 'by': 1, 'about': 1, 'as': 1, 'so': 1, 'there': 1, 'their': 1
            };

            function tokenize(str) {
                var norm = normalize(str);
                if (!norm) return [];
                return norm.split(' ').filter(function (w) { return w.length > 1 && !STOPWORDS[w]; });
            }

            // Very small, dependency-free stemmer: strips common suffixes so
            // "authenticating" / "authenticated" both collapse toward "authenticat".
            function stem(word) {
                return word.replace(/(ing|edly|ed|es|s)$/, function (m) {
                    // keep short words intact ("is", "as") from being mangled
                    return word.length - m.length >= 3 ? '' : m;
                });
            }

            function escapeHtml(str) {
                var div = document.createElement('div');
                div.textContent = str == null ? '' : String(str);
                return div.innerHTML;
            }

            /* ============================================================
               4. INDEXER
               Walks the DOM once and builds a lightweight search index:
               one record per <section class="doc-section">, each carrying
               weighted bags of words from its title, headings, body text,
               table content, code snippets, and FAQ items.
               ============================================================ */

            function buildIndex(selector) {
                var sections = qsa(selector);
                return sections.map(function (el) {
                    var id = el.id || '';
                    var h2 = qs('h2', el);
                    var title = h2 ? h2.textContent.trim() : (id || 'Untitled section');

                    var headings = qsa('h3, h4', el).map(function (h) { return h.textContent.trim(); });

                    var tableText = qsa('table', el).map(function (t) { return t.textContent; }).join(' ');
                    var codeText = qsa('code, pre').map(function (c) { return c.textContent; }).join(' ');
                    var faqText = qsa('.faq-item', el).map(function (f) { return f.textContent; }).join(' ');

                    // Whole-section text used as a fallback / lowest-weight bag.
                    var bodyText = el.textContent || '';

                    return {
                        id: id,
                        el: el,
                        title: title,
                        headings: headings,
                        summary: buildSummary(el, title),
                        // Pre-tokenized + stemmed bags, kept separate so each can carry
                        // its own weight at scoring time.
                        bags: {
                            title: tokensOf(title),
                            headings: tokensOf(headings.join(' ')),
                            faq: tokensOf(faqText),
                            code: tokensOf(codeText),
                            table: tokensOf(tableText),
                            body: tokensOf(bodyText)
                        }
                    };
                });
            }

            function tokensOf(str) {
                var counts = {};
                tokenize(str).forEach(function (w) {
                    var s = stem(w);
                    counts[s] = (counts[s] || 0) + 1;
                });
                return counts;
            }

            // First substantial <p> (or list) under the section heading, trimmed to
            // a short, scannable summary — this is what the assistant "says" back.
            function buildSummary(sectionEl, title) {
                var p = qs('p', sectionEl);
                var text = p ? p.textContent.trim() : '';
                if (!text) {
                    var li = qs('li', sectionEl);
                    text = li ? li.textContent.trim() : '';
                }
                if (!text) return title + ' is covered in this section.';
                if (text.length > 220) text = text.slice(0, 217).replace(/\s+\S*$/, '') + '…';
                return text;
            }

            /* ============================================================
               5. QUERY EXPANSION + SEMANTIC SCORING
               ============================================================ */

            function expandQuery(rawQuery, synonymMap) {
                var norm = normalize(rawQuery);
                var expanded = {};
                tokenize(rawQuery).forEach(function (w) { expanded[stem(w)] = (expanded[stem(w)] || 0) + 1; });

                // If the raw query text contains any synonym phrase for a concept,
                // add every term in that concept group (lightly weighted) so a query
                // like "login" also pulls in "token", "oauth", "api key", etc.
                Object.keys(synonymMap).forEach(function (concept) {
                    var group = synonymMap[concept];
                    var hit = group.concat([concept]).some(function (phrase) {
                        return norm.indexOf(normalize(phrase)) !== -1;
                    });
                    if (hit) {
                        tokenize(concept).forEach(function (w) { expanded[stem(w)] = Math.max(expanded[stem(w)] || 0, 1); });
                        group.forEach(function (phrase) {
                            tokenize(phrase).forEach(function (w) { expanded[stem(w)] = Math.max(expanded[stem(w)] || 0, 0.6); });
                        });
                    }
                });
                return expanded;
            }

            // Field weights: a hit in the title matters far more than a hit buried
            // in general body text — this is what keeps results feeling "on topic".
            var FIELD_WEIGHTS = { title: 6, headings: 4, faq: 2.4, code: 1.8, table: 1.6, body: 1 };

            function scoreSection(section, expandedQuery) {
                var score = 0;
                Object.keys(expandedQuery).forEach(function (term) {
                    var qWeight = expandedQuery[term];
                    Object.keys(FIELD_WEIGHTS).forEach(function (field) {
                        var count = section.bags[field][term];
                        if (count) score += count * qWeight * FIELD_WEIGHTS[field];
                    });
                });
                return score;
            }

            // Below this, a match is too weak (e.g. one incidental body-text word)
            // to confidently present — treat it the same as no match at all.
            var MIN_CONFIDENT_SCORE = 2.5;

            function rankAll(index, rawQuery, synonymMap) {
                var expanded = expandQuery(rawQuery, synonymMap);
                if (!Object.keys(expanded).length) return [];
                return index
                    .map(function (s) { return { section: s, score: scoreSection(s, expanded) }; })
                    .sort(function (a, b) { return b.score - a.score; });
            }

            function search(index, rawQuery, synonymMap, maxRelated) {
                var ranked = rankAll(index, rawQuery, synonymMap).filter(function (r) { return r.score >= MIN_CONFIDENT_SCORE; });
                if (!ranked.length) return { best: null, related: [] };
                return {
                    best: ranked[0].section,
                    related: ranked.slice(1, 1 + maxRelated).map(function (r) { return r.section; })
                };
            }

            /* ============================================================
               6. UI — panel, launcher, results, highlight + scroll
               ============================================================ */

            function DocAssistant(options) {
                this.opts = Object.assign({}, DEFAULTS, options || {});
                this.opts.synonyms = Object.assign({}, BUILT_IN_SYNONYMS, this.opts.synonyms || {});
                this.index = null;
                this.isOpen = false;
                this.lastFocused = null;
                this._build();
            }

            DocAssistant.prototype._ensureIndex = function () {
                if (!this.index) this.index = buildIndex(this.opts.sectionSelector);
                return this.index;
            };

            DocAssistant.prototype._build = function () {
                var self = this;

                // ---- Launcher button ----
                var launcher = document.createElement('button');
                launcher.className = 'da-launcher';
                launcher.type = 'button';
                launcher.setAttribute('aria-haspopup', 'dialog');
                launcher.setAttribute('aria-expanded', 'false');
                launcher.setAttribute('aria-label', this.opts.launcherLabel + ' — ' + this.opts.title);
                launcher.innerHTML =
                    // Rounded speech-bubble with a small tail — reads unambiguously as
                    // "chat / ask a question" at a glance, rather than an abstract mark.
                    '<svg class="da-launcher-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
                    '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.2 3.5c-.53.44-1.3.06-1.3-.62V16h-.5A2.5 2.5 0 0 1 1.5 13.5v-6A2.5 2.5 0 0 1 4 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" transform="translate(1.5 1.5)"/>' +
                    '<circle cx="8.5" cy="11" r="1.15" fill="currentColor"/><circle cx="12.5" cy="11" r="1.15" fill="currentColor"/><circle cx="16.5" cy="11" r="1.15" fill="currentColor"/>' +
                    '</svg>' +
                    '<span class="da-launcher-label">' + escapeHtml(this.opts.launcherLabel) + '</span>';
                launcher.style.setProperty('--da-launcher-bottom', this.opts.launcherBottom);
                launcher.style.setProperty('--da-launcher-right', this.opts.launcherRight);
                document.body.appendChild(launcher);
                this.launcher = launcher;

                // ---- Overlay (mobile bottom-sheet backdrop / click-outside close) ----
                var overlay = document.createElement('div');
                overlay.className = 'da-overlay';
                overlay.setAttribute('hidden', '');
                document.body.appendChild(overlay);
                this.overlay = overlay;

                // ---- Panel ----
                var panel = document.createElement('section');
                panel.className = 'da-panel';
                panel.setAttribute('role', 'dialog');
                panel.setAttribute('aria-modal', 'true');
                panel.setAttribute('aria-label', this.opts.title);
                panel.setAttribute('hidden', '');
                panel.innerHTML =
                    '<div class="da-resize-handle" aria-hidden="true"></div>' +
                    '<header class="da-header">' +
                    '  <div class="da-header-text">' +
                    '    <span class="da-eyebrow">Documentation</span>' +
                    '    <h2 class="da-title">' + escapeHtml(this.opts.title) + '</h2>' +
                    '  </div>' +
                    '  <button type="button" class="da-close" aria-label="Close assistant">' +
                    '    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
                    '  </button>' +
                    '</header>' +
                    '<form class="da-form" autocomplete="off">' +
                    '  <label class="da-sr-only" for="da-input">' + escapeHtml(this.opts.placeholder) + '</label>' +
                    '  <input id="da-input" class="da-input" type="text" placeholder="' + escapeHtml(this.opts.placeholder) + '" />' +
                    '  <button type="submit" class="da-submit" aria-label="Ask">' +
                    '    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                    '  </button>' +
                    '</form>' +
                    '<div class="da-body" aria-live="polite"></div>';
                document.body.appendChild(panel);
                this.panel = panel;

                this.body = qs('.da-body', panel);
                this.input = qs('.da-input', panel);
                this.form = qs('.da-form', panel);

                // ---- Events ----
                launcher.addEventListener('click', function () { self.toggle(); });
                qs('.da-close', panel).addEventListener('click', function () { self.close(); });
                overlay.addEventListener('click', function () { self.close(); });

                this.form.addEventListener('submit', function (e) {
                    e.preventDefault();
                    self.ask(self.input.value);
                });

                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape' && self.isOpen) self.close();
                });

                this._enableResize();
                this._renderIdle();
            };

            DocAssistant.prototype._renderIdle = function () {
                var self = this;
                var chipsHtml = '';
                if (this.opts.suggestedTopics && this.opts.suggestedTopics.length) {
                    chipsHtml =
                        '<div class="da-related" style="margin-top:16px; padding-top:0; border-top:none;">' +
                        '  <span class="da-related-label">Jump to a topic</span>' +
                        '  <div class="da-related-list">' +
                        this.opts.suggestedTopics.map(function (t) {
                            return '<button type="button" class="da-chip" data-id="' + escapeHtml(t.id) + '">' + escapeHtml(t.label) + '</button>';
                        }).join('') +
                        '  </div>' +
                        '</div>';
                }
                this.body.innerHTML =
                    '<div class="da-empty">' +
                    '  <p>Ask about anything covered in this guide — ' + escapeHtml(this.opts.exampleTopics) + ', and more.</p>' +
                    '  <p class="da-empty-sub">I only answer from this ' + escapeHtml(this.opts.docLabel) + ' and point you straight to the right section.</p>' +
                    '</div>' + chipsHtml;
                qsa('.da-chip', this.body).forEach(function (chip) {
                    chip.addEventListener('click', function () { self.navigateTo(chip.getAttribute('data-id')); });
                });
            };

            // ---- Open / close / toggle, with focus management ----

            DocAssistant.prototype.open = function () {
                if (this.isOpen) return;
                this.isOpen = true;
                this.lastFocused = document.activeElement;
                this.panel.removeAttribute('hidden');
                this.overlay.removeAttribute('hidden');
                this.launcher.setAttribute('aria-expanded', 'true');
                requestAnimationFrame(function () { }); // let hidden->visible paint before class toggle
                this.panel.classList.add('da-open');
                this.overlay.classList.add('da-open');
                this._ensureIndex();
                var self = this;
                setTimeout(function () { self.input.focus(); }, 150);
            };

            DocAssistant.prototype.close = function () {
                if (!this.isOpen) return;
                this.isOpen = false;
                this.panel.classList.remove('da-open');
                this.overlay.classList.remove('da-open');
                this.launcher.setAttribute('aria-expanded', 'false');
                var self = this;
                setTimeout(function () {
                    if (!self.isOpen) {
                        self.panel.setAttribute('hidden', '');
                        self.overlay.setAttribute('hidden', '');
                    }
                }, 260);
                if (this.lastFocused && this.lastFocused.focus) this.lastFocused.focus();
            };

            DocAssistant.prototype.toggle = function () { this.isOpen ? this.close() : this.open(); };

            // ---- Resizable panel (desktop only; drag the left edge) ----

            DocAssistant.prototype._enableResize = function () {
                var handle = qs('.da-resize-handle', this.panel);
                var panel = this.panel;
                var dragging = false;

                handle.addEventListener('mousedown', function (e) {
                    if (window.matchMedia('(max-width: 720px)').matches) return; // no-op on mobile sheet
                    dragging = true;
                    document.body.style.userSelect = 'none';
                    e.preventDefault();
                });
                document.addEventListener('mousemove', function (e) {
                    if (!dragging) return;
                    var newWidth = window.innerWidth - e.clientX;
                    newWidth = Math.max(320, Math.min(560, newWidth));
                    panel.style.setProperty('--da-panel-width', newWidth + 'px');
                });
                document.addEventListener('mouseup', function () {
                    dragging = false;
                    document.body.style.userSelect = '';
                });
            };

            // ---- Ask / render results ----

            DocAssistant.prototype.ask = function (rawQuery) {
                var self = this;
                var query = (rawQuery || '').trim();
                if (!query) return;

                this._ensureIndex();
                var localResult = search(this.index, query, this.opts.synonyms, this.opts.maxRelated);

                if (!this.opts.llmEndpoint) {
                    this._renderLocalOrEmpty(localResult);
                    return;
                }

                this._renderLoading();
                this._askLLM(query, localResult).then(function (llmResult) {
                    if (llmResult) {
                        self._renderResult(llmResult.answer, llmResult.best, llmResult.related, true);
                    } else {
                        // Backend unreachable, timed out, or returned something we can't
                        // trust — fall back to the local result rather than show an error.
                        self._renderLocalOrEmpty(localResult);
                    }
                });
            };

            DocAssistant.prototype._renderLocalOrEmpty = function (result) {
                var self = this;
                if (!result.best) {
                    this.body.innerHTML =
                        '<div class="da-result da-result-empty">' +
                        '  <p class="da-answer">I couldn\'t find this information in the current ' + escapeHtml(self.opts.docLabel) + '.</p>' +
                        '  <p class="da-empty-sub">Try different wording, or browse the sidebar for the closest topic.</p>' +
                        '</div>';
                    return;
                }
                this._renderResult(result.best.summary, result.best, result.related, false);
            };

            DocAssistant.prototype._renderLoading = function () {
                this.body.innerHTML =
                    '<div class="da-result da-loading">' +
                    '  <span class="da-dot"></span><span class="da-dot"></span><span class="da-dot"></span>' +
                    '</div>';
            };

            // Calls the host site's own backend (never the LLM API directly from the
            // browser). Resolves to null on any failure/timeout/malformed response so
            // the caller can cleanly fall back to the local result.
            DocAssistant.prototype._askLLM = function (query, localResult) {
                var self = this;
                var candidates = rankAll(this.index, query, this.opts.synonyms)
                    .slice(0, this.opts.llmCandidateCount)
                    .map(function (r) { return r.section; });
                if (!candidates.length) candidates = this.index.slice(0, this.opts.llmCandidateCount);

                var byId = {};
                candidates.forEach(function (s) { byId[s.id] = s; });

                var payload = {
                    question: query,
                    candidates: candidates.map(function (s) {
                        return { id: s.id, title: s.title, headings: s.headings, summary: s.summary };
                    })
                };

                var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
                var timer = setTimeout(function () { if (controller) controller.abort(); }, this.opts.llmTimeoutMs);

                return fetch(this.opts.llmEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller ? controller.signal : undefined
                })
                    .then(function (res) { if (!res.ok) throw new Error('Bad status ' + res.status); return res.json(); })
                    .then(function (data) {
                        clearTimeout(timer);
                        if (!data || typeof data.answer !== 'string') throw new Error('Malformed response');

                        // Never trust an arbitrary destination from the network — only
                        // navigate to a section id that was actually offered as a candidate.
                        var best = data.sectionId ? byId[data.sectionId] : null;
                        if (data.sectionId && !best) throw new Error('Unknown sectionId from backend');

                        var related = (Array.isArray(data.related) ? data.related : [])
                            .map(function (id) { return byId[id]; })
                            .filter(Boolean)
                            .slice(0, self.opts.maxRelated);

                        if (!best) return { answer: data.answer, best: null, related: [] };
                        return { answer: data.answer, best: best, related: related };
                    })
                    .catch(function (err) {
                        clearTimeout(timer);
                        if (global.console && console.warn) console.warn('DocAssistant: LLM backend unavailable, using local search.', err);
                        return null;
                    });
            };

            DocAssistant.prototype._renderResult = function (answerText, best, related, isLLM) {
                var self = this;

                if (!best) {
                    this.body.innerHTML =
                        '<div class="da-result da-result-empty">' +
                        '  <p class="da-answer">' + escapeHtml(answerText || "I couldn't find this information in the current " + this.opts.docLabel + ".") + '</p>' +
                        '</div>';
                    return;
                }

                var relatedHtml = '';
                if (related.length) {
                    relatedHtml =
                        '<div class="da-related">' +
                        '  <span class="da-related-label">Related sections</span>' +
                        '  <div class="da-related-list">' +
                        related.map(function (s) {
                            return '<button type="button" class="da-chip" data-id="' + escapeHtml(s.id) + '">' + escapeHtml(s.title) + '</button>';
                        }).join('') +
                        '  </div>' +
                        '</div>';
                }

                this.body.innerHTML =
                    '<div class="da-result">' +
                    '  <p class="da-answer-label">Answer summary' + (isLLM ? ' <span class="da-ai-tag">AI</span>' : '') + '</p>' +
                    '  <p class="da-answer">' + escapeHtml(answerText) + '</p>' +
                    '  <p class="da-doc-label">Relevant documentation</p>' +
                    '  <p class="da-doc-title">' + escapeHtml(best.title) + '</p>' +
                    '  <button type="button" class="da-goto" data-id="' + escapeHtml(best.id) + '">' +
                    '    Go to ' + escapeHtml(best.title) +
                    '    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                    '  </button>' +
                    relatedHtml +
                    '</div>';

                qs('.da-goto', this.body).addEventListener('click', function () {
                    self.navigateTo(best.id);
                });
                qsa('.da-chip', this.body).forEach(function (chip) {
                    chip.addEventListener('click', function () { self.navigateTo(chip.getAttribute('data-id')); });
                });
            };

            // ---- Navigate: smooth scroll, expand collapsed ancestors, highlight ----

            DocAssistant.prototype.navigateTo = function (id) {
                var target = document.getElementById(id);
                if (!target) return;

                // Expand any collapsed ancestor the host site uses (e.g. <details>,
                // or a custom [data-collapsed] pattern) so the destination is visible.
                var el = target;
                var tabSectionId = null;
                while (el) {
                    if (el.tagName === 'DETAILS') el.open = true;
                    if (el.hasAttribute && el.hasAttribute('data-collapsed')) el.removeAttribute('data-collapsed');
                    // This host page hides every .doc-section except the currently open
                    // one — if the match lives inside a closed section, that section
                    // must be opened first or scrollIntoView will silently do nothing.
                    if (el.classList && el.classList.contains('doc-section')) tabSectionId = el.id;
                    el = el.parentElement;
                }
                if (tabSectionId && typeof window.openDocSection === 'function') {
                    window.openDocSection(tabSectionId);
                }

                target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                target.classList.add('da-highlight');
                clearTimeout(target._daHighlightTimer);
                target._daHighlightTimer = setTimeout(function () {
                    target.classList.remove('da-highlight');
                }, this.opts.highlightDuration);

                if (typeof this.opts.onNavigate === 'function') this.opts.onNavigate(id, target);

                // On mobile, get the sheet out of the way once the user has a
                // destination so they can read the page underneath.
                if (window.matchMedia('(max-width: 720px)').matches) this.close();
            };

            /* ============================================================
               7. PUBLIC API
               ============================================================ */

            global.DocAssistant = {
                init: function (options) {
                    if (global.__docAssistantInstance) return global.__docAssistantInstance;
                    var instance = new DocAssistant(options);
                    global.__docAssistantInstance = instance;
                    return instance;
                }
            };

            // Auto-init if the including <script> tag carries [data-auto-init].
            document.addEventListener('DOMContentLoaded', function () {
                var scripts = qsa('script[src*="doc-assistant"]');
                var self = scripts[scripts.length - 1];
                if (self && self.hasAttribute('data-auto-init')) {
                    global.DocAssistant.init({
                        title: self.getAttribute('data-title') || undefined,
                        sectionSelector: self.getAttribute('data-section-selector') || undefined
                    });
                }
            });

        }(window));

// ==== inline script block 5 of 7 ====
document.addEventListener('DOMContentLoaded', () => {
            const sideLinks = document.querySelectorAll('.sidebar .side-link');
            const docSections = document.querySelectorAll('.content .doc-section');
            const tocList = document.getElementById('tocList');
            let tocObserver = null;

            // Builds the right-hand "On this page" panel for the active section,
            // and keeps it in sync with scroll position via IntersectionObserver.
            function buildTOC(section) {
                if (!tocList) return;
                if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
                tocList.innerHTML = '';

                // h4 elements inside .howto callout boxes are all
                // titled "How to use" — repeated, non-unique labels that
                // clutter this panel rather than helping navigation. Only
                // genuinely distinct sub-headings belong here.
                const headings = Array.prototype.filter.call(
                    section.querySelectorAll('h3, h4'),
                    h => !h.closest('.howto')
                );
                if (headings.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'toc-empty';
                    empty.textContent = 'No subsections';
                    tocList.appendChild(empty);
                    return;
                }

                const linkFor = new Map();

                headings.forEach((heading, index) => {
                    if (!heading.id) {
                        heading.id = `heading-${section.id}-${index}`;
                    }
                    const link = document.createElement('a');
                    link.className = 'toc-link';
                    link.href = `#${heading.id}`;

                    const clone = heading.cloneNode(true);
                    const num = clone.querySelector('.sub-num');
                    if (num) num.remove();
                    link.textContent = clone.textContent.trim();

                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });

                    tocList.appendChild(link);
                    linkFor.set(heading, link);
                });

                const setActive = (heading) => {
                    tocList.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                    const link = linkFor.get(heading);
                    if (link) link.classList.add('active');
                };
                setActive(headings[0]);

                // Picks whichever heading is the last one to have scrolled
                // past a fixed point near the top of the viewport — robust
                // to any gap in size between headings (a plain
                // IntersectionObserver watching a narrow band misses this:
                // if a long section pushes the next heading further away
                // than the band covers, nothing intersects it and the
                // previously-active heading incorrectly stays highlighted).
                const ACTIVE_LINE = 140;
                function updateActiveByPosition() {
                    let current = headings[0];
                    for (const h of headings) {
                        if (h.getBoundingClientRect().top <= ACTIVE_LINE) {
                            current = h;
                        } else {
                            break;
                        }
                    }
                    setActive(current);
                }

                let tocTicking = false;
                const onScroll = () => {
                    if (tocTicking) return;
                    tocTicking = true;
                    requestAnimationFrame(() => { updateActiveByPosition(); tocTicking = false; });
                };
                window.addEventListener('scroll', onScroll, { passive: true });
                updateActiveByPosition();

                tocObserver = { disconnect: () => window.removeEventListener('scroll', onScroll) };
            }

            // ---- Manual sticky simulation for the sidebar (native
            // position:sticky does not engage correctly for this element
            // given its nesting inside the grid layout). ----
            const STICKY_TOP_OFFSET = 76 + 28;

            function sizeSidebarNav() {
                const nav = document.getElementById('sidebarNav');
                const content = document.getElementById('mainContent');
                const sidebarEl = document.getElementById('sidebar');
                if (!nav || !content || !sidebarEl) return;
                const maxAvailable = window.innerHeight - STICKY_TOP_OFFSET - 20;
                const contentHeight = content.getBoundingClientRect().height;
                const navCapped = Math.max(120, Math.min(maxAvailable, contentHeight));
                nav.style.maxHeight = navCapped + 'px';
                sidebarEl.style.height = Math.max(navCapped, contentHeight) + 'px';
            }

            function updateManualSticky() {
                const sidebarEl = document.getElementById('sidebar');
                const nav = document.getElementById('sidebarNav');
                if (!sidebarEl || !nav) return;
                const rect = sidebarEl.getBoundingClientRect();
                const navHeight = nav.getBoundingClientRect().height;

                if (rect.top >= STICKY_TOP_OFFSET) {
                    nav.classList.remove('js-pinned', 'js-released');
                    nav.style.position = 'static';
                    nav.style.top = '';
                    nav.style.left = '';
                    nav.style.width = '';
                } else if (rect.bottom - navHeight >= STICKY_TOP_OFFSET) {
                    nav.classList.add('js-pinned');
                    nav.classList.remove('js-released');
                    nav.style.position = 'fixed';
                    nav.style.top = STICKY_TOP_OFFSET + 'px';
                    nav.style.left = rect.left + 'px';
                    nav.style.width = rect.width + 'px';
                } else {
                    nav.classList.add('js-released');
                    nav.classList.remove('js-pinned');
                    nav.style.position = 'absolute';
                    nav.style.top = Math.max(0, rect.height - navHeight) + 'px';
                    nav.style.left = '0px';
                    nav.style.width = '100%';
                }
            }

            let manualStickyTicking = false;
            function requestManualStickyUpdate() {
                if (manualStickyTicking) return;
                manualStickyTicking = true;
                requestAnimationFrame(() => { updateManualSticky(); manualStickyTicking = false; });
            }
            window.addEventListener('scroll', requestManualStickyUpdate, { passive: true });
            window.addEventListener('resize', () => { sizeSidebarNav(); updateManualSticky(); });

            function adjustSidebarStickyState() {
                sizeSidebarNav();
                updateManualSticky();
            }

            // ---- Lazy-loading: each section's real content lives in its own
            // sections/<id>.html fragment and is fetched on first visit only,
            // instead of every section being embedded in the initial page load. ----

            // Each section's real content is embedded in a <template> tag
            // (see the end of <body>), inert and unrendered until cloned into
            // the visible DOM. This keeps the same "don't pay layout/paint
            // cost for the other 12 sections" benefit as network-fetched
            // fragments, but works identically whether this page is opened
            // via a real server OR by simply double-clicking the file —
            // fetch() is blocked by every browser under the file:// protocol,
            // which made the previous fetch-based version fail entirely
            // for anyone who didn't run a local server first.
            function loadSectionContent(targetSection, targetId) {
                if (targetSection.dataset.lazy !== 'true') {
                    return Promise.resolve();
                }
                const template = document.getElementById('tpl-' + targetId);
                if (!template) {
                    console.error('No template found for section', targetId);
                    targetSection.innerHTML =
                        '<div class="section-load-error">' +
                        '<p>This section is unavailable right now.</p>' +
                        '</div>';
                    return Promise.resolve();
                }
                const html = template.innerHTML;
                targetSection.innerHTML = html;
                targetSection.removeAttribute('data-lazy');
                if (typeof window.indexSectionFragment === 'function') window.indexSectionFragment(targetId, html);
                return Promise.resolve();
            }

            async function activateTab(targetId, subAnchorId) {
                // Hide all sections
                docSections.forEach(sec => {
                    sec.classList.remove('active-tab');
                    sec.classList.remove('in-view'); // Prevent scroll animations from interfering
                });

                // Deactivate all groups and links
                document.querySelectorAll('.sidebar .side-group').forEach(group => group.classList.remove('expanded'));
                sideLinks.forEach(link => link.classList.remove('active'));

                // Show target section
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active-tab');

                    // Find corresponding link
                    const activeLink = document.querySelector(`.sidebar .side-link[data-target="${targetId}"]`) ||
                        document.querySelector(`.sidebar .side-link[href="#${targetId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                        const group = activeLink.closest('.side-group');
                        if (group) {
                            group.classList.add('expanded');
                        }
                    }

                    // Reveal the docs shell + breadcrumb/Copy Page bar now that something is open,
                    // and hide every landing-page section so only this module is on screen —
                    // otherwise they're just scrolled past, not actually hidden, and scrolling
                    // up reveals the whole marketing page sitting above the open module.
                    const docsShell = document.getElementById('docsShell');
                    if (docsShell) {
                        docsShell.hidden = false;
                        docsShell.classList.add('is-open');
                    }
                    document.body.classList.add('docs-open');
                    const topbar = document.getElementById('contentTopbar');
                    if (topbar) topbar.classList.add('visible');
                    // The sidebar is hidden (display:none) until a module is
                    // open, so any earlier attempt to position the collapse
                    // arrow from its rect would have measured all zeros.
                    // Reposition now that it's actually visible.
                    if (window.positionSidebarArrow) {
                        requestAnimationFrame(window.positionSidebarArrow);
                    }

                    try {
                        await loadSectionContent(targetSection, targetId);
                    } catch (err) {
                        return; // error UI already shown by loadSectionContent
                    }

                    buildTOC(targetSection);

                    // Update the breadcrumb to reflect the active section's title
                    const crumb = document.getElementById('breadcrumbCurrent');
                    if (crumb) {
                        const h2 = targetSection.querySelector('h2');
                        crumb.textContent = h2 ? h2.textContent.trim() : targetId;
                    }

                    if (typeof adjustSidebarStickyState === 'function') {
                        adjustSidebarStickyState();
                        setTimeout(adjustSidebarStickyState, 200);
                    }

                    if (subAnchorId) {
                        // Freshly-inserted content includes images that are still
                        // loading asynchronously; as they settle in, the layout
                        // shifts and can carry the page away from where we just
                        // scrolled. Scroll once immediately, then correct once
                        // more shortly after so the final resting position is
                        // accurate even if images were still loading in.
                        const scrollToHeading = () => {
                            const el = document.getElementById(subAnchorId);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        };
                        setTimeout(scrollToHeading, 60);
                        setTimeout(scrollToHeading, 500);
                    }
                }
            }

            function closeDocsToModules() {
                const docsShell = document.getElementById('docsShell');
                if (docsShell) {
                    docsShell.classList.remove('is-open');
                    docsShell.hidden = true;
                }
                document.body.classList.remove('docs-open');
                const topbar = document.getElementById('contentTopbar');
                if (topbar) topbar.classList.remove('visible');

                docSections.forEach(sec => {
                    sec.classList.remove('active-tab');
                    sec.classList.remove('in-view');
                });
                document.querySelectorAll('.sidebar .side-group').forEach(group => group.classList.remove('expanded'));
                sideLinks.forEach(link => link.classList.remove('active'));
                if (tocList) tocList.innerHTML = '<div class="toc-empty">Nothing open yet</div>';
                if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }

                const modules = document.getElementById('modules');
                if (modules) {
                    modules.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                if (history.replaceState) {
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                }
            }

            // Intercept default click behaviors for module cards to also switch tabs
            document.querySelectorAll('.mod-card, .btn-primary, .btn-view-all-releases').forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    link.addEventListener('click', (e) => {
                        const targetId = href.substring(1);
                        const section = document.getElementById(targetId);
                        if (section && section.classList.contains('doc-section')) {
                            e.preventDefault();
                            activateTab(targetId);
                            const mainContent = document.getElementById('mainContent');
                            if (mainContent) {
                                mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            } else {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }
                    });
                }
            });

            // Attach click events to side links
            sideLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    let target = link.getAttribute('data-target');
                    if (!target) {
                        const href = link.getAttribute('href');
                        if (href && href.startsWith('#')) {
                            target = href.substring(1);
                        }
                    }
                    if (target) {
                        activateTab(target);
                        const mainContent = document.getElementById('mainContent');
                        if (mainContent) {
                            mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }
                });
            });

            // Sidebar sub-topic links: open the parent section (lazy-loading
            // it if needed), then scroll to the specific heading within it.
            document.querySelectorAll('.sidebar .side-sublink').forEach(sublink => {
                sublink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const headingId = sublink.getAttribute('data-target');
                    const parentId = sublink.getAttribute('data-parent');
                    if (!headingId || !parentId) return;
                    document.querySelectorAll('.side-sublink.active-sublink').forEach(s => s.classList.remove('active-sublink'));
                    sublink.classList.add('active-sublink');
                    activateTab(parentId, headingId);
                    const mainContent = document.getElementById('mainContent');
                    if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });

            // Caret click toggles a topic's sub-list open/closed WITHOUT
            // navigating away, so a currently-active (auto-expanded) topic
            // can also be manually collapsed.
            document.querySelectorAll('.sidebar .side-caret').forEach(caret => {
                caret.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const group = caret.closest('.side-group');
                    if (group) group.classList.toggle('expanded');
                });
            });

            // Cross-reference links WITHIN section content (e.g. "See Alert
            // Manager for..." inside a note box) point at another section's
            // id, but that target is hidden until its own tab is activated.
            // Delegate clicks on any in-content #anchor link to the same
            // router the sidebar uses, so these links actually work — even
            // when the target section hasn't been lazy-loaded yet.
            const mainContentEl = document.getElementById('mainContent');
            if (mainContentEl) {
                mainContentEl.addEventListener('click', (e) => {
                    const link = e.target.closest('a');
                    if (!link) return;
                    const href = link.getAttribute('href') || '';
                    if (!href.startsWith('#') || href.length < 2) return;
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    if (targetSection && targetSection.classList.contains('doc-section')) {
                        e.preventDefault();
                        activateTab(targetId);
                        mainContentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        return;
                    }
                    // sub-heading id: it may live inside a section that hasn't
                    // been rendered into the live DOM yet, so we can't rely on
                    // the element existing right now. Look up which top-level
                    // section owns it via SECTION_INDEX (built from each
                    // section's own template — the sidebar no longer carries
                    // sub-heading data since that's the "On this page" panel's
                    // job now), and let activateTab's built-in sub-anchor
                    // handling scroll to it once rendered.
                    const owningEntry = (window.SECTION_INDEX || []).find(
                        entry => entry.subs.some(s => s.id === targetId)
                    );
                    if (owningEntry) {
                        const parentSection = document.getElementById(owningEntry.id);
                        if (parentSection && !parentSection.classList.contains('active-tab')) {
                            e.preventDefault();
                            activateTab(owningEntry.id, targetId);
                            mainContentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                });
            }

            // Copy Page button — copies the visible text of the currently active section
            const copyPageBtn = document.getElementById('copyPageBtn');
            if (copyPageBtn) {
                copyPageBtn.addEventListener('click', async () => {
                    const active = document.querySelector('.content .doc-section.active-tab');
                    if (!active) return;
                    const text = active.innerText.trim();
                    try {
                        await navigator.clipboard.writeText(text);
                    } catch (err) {
                        const ta = document.createElement('textarea');
                        ta.value = text;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                    }
                    const label = copyPageBtn.querySelector('.cp-label');
                    copyPageBtn.classList.add('copied');
                    if (label) label.textContent = 'Copied!';
                    setTimeout(() => {
                        copyPageBtn.classList.remove('copied');
                        if (label) label.textContent = 'Copy Page';
                    }, 1500);
                });
            }

            // Exposed so other scripts (e.g. the Ctrl+K search palette) can open any
            // module regardless of whether its tab is currently open or closed.
            window.openDocSection = activateTab;
            window.closeDocsToModules = closeDocsToModules;

            const backBtn = document.getElementById('backToModulesBtn');
            if (backBtn) {
                backBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeDocsToModules();
                });
            }

            // ---- Sidebar collapse toggle: gives the main content column
            // more width, remembered across visits via localStorage. ----
            const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
            const layoutEl = document.querySelector('.layout');
            const sidebarEl = document.querySelector('.sidebar');

            // The arrow uses position:fixed so it stays at a stable spot on
            // screen while scrolling (previously position:absolute relative
            // to .layout, which scrolls with the page like everything else
            // in it — the exact "why does this disappear when I scroll"
            // problem this fixes). Fixed positioning needs a real pixel
            // value for `left`, though, and .layout is centered with its own
            // max-width, so that pixel value isn't a constant — it depends
            // on viewport width. Computed here from the sidebar's actual
            // rendered edge instead of hardcoded, and recomputed on resize
            // and on every collapse/expand so it's never stale.
            function positionSidebarArrow() {
                if (!toggleSidebarBtn || !sidebarEl) return;
                // The sidebar always has a real, measurable width now — 52px
                // in its collapsed icon-only rail state, ~228px expanded —
                // so a single calculation covers both, no branching needed.
                const collapsed = layoutEl && layoutEl.classList.contains('sidebar-collapsed');
                const rect = sidebarEl.getBoundingClientRect();
                const inset = collapsed ? 22 : 36;
                toggleSidebarBtn.style.left = (rect.right - inset) + 'px';
            }

            function setSidebarCollapsed(collapsed) {
                if (!layoutEl) return;
                layoutEl.classList.toggle('sidebar-collapsed', collapsed);
                if (toggleSidebarBtn) {
                    toggleSidebarBtn.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
                    toggleSidebarBtn.title = collapsed ? 'Show sidebar' : 'Collapse sidebar';
                    toggleSidebarBtn.setAttribute('aria-label', collapsed ? 'Show sidebar' : 'Collapse sidebar');
                }
                try { localStorage.setItem('ftaml-sidebar-collapsed', collapsed ? '1' : '0'); } catch (e) { /* ignore */ }
                if (typeof adjustSidebarStickyState === 'function') {
                    setTimeout(adjustSidebarStickyState, 60);
                }
                // Position immediately (matches the collapse) and again after
                // the width transition finishes, since the sidebar's rect
                // doesn't reach its final size until the CSS transition ends.
                positionSidebarArrow();
                setTimeout(positionSidebarArrow, 260);
            }
            if (toggleSidebarBtn) {
                toggleSidebarBtn.addEventListener('click', () => {
                    const isCollapsed = layoutEl && layoutEl.classList.contains('sidebar-collapsed');
                    setSidebarCollapsed(!isCollapsed);
                });
                try {
                    if (localStorage.getItem('ftaml-sidebar-collapsed') === '1') {
                        setSidebarCollapsed(true);
                    }
                } catch (e) { /* ignore */ }
                positionSidebarArrow();
                window.addEventListener('resize', positionSidebarArrow);
                window.positionSidebarArrow = positionSidebarArrow;
            }

            // Nav / CTA links back to #modules should hide documentation again.
            document.querySelectorAll('a[href="#modules"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const shell = document.getElementById('docsShell');
                    if (shell && shell.classList.contains('is-open')) {
                        e.preventDefault();
                        closeDocsToModules();
                    }
                });
            });

            // Docs stay hidden until a module card, sidebar link, search hit, or
            // deep-link hash opens a section. No empty-state placeholder is shown.
            const hashId = (window.location.hash || '').replace(/^#/, '');
            if (hashId && document.getElementById(hashId) && document.getElementById(hashId).classList.contains('doc-section')) {
                activateTab(hashId);
            }
        });

// ==== inline script block 6 of 7 ====
(function () {
            // ---- Footer language control — drives Google Translate for real whole-page translation ----
            function openMenu(menu, control) {
                if (!menu || !control) return;
                menu.classList.add('open');
                control.setAttribute('aria-expanded', 'true');
            }
            function closeMenu(menu, control) {
                if (!menu || !control) return;
                menu.classList.remove('open');
                control.setAttribute('aria-expanded', 'false');
            }

            function flagUrl(code) { return 'https://flagcdn.com/24x18/' + code + '.png'; }

            // ---- Footer language control ----
            // Drives Google Translate's hidden widget for real whole-page translation
            // when that widget is available. IMPORTANT LIMITATION, confirmed directly
            // from Google's own Translate support forum: "this widget is only
            // functional on public websites on the Internet" — it cannot translate a
            // page opened locally via file://, because Google's translate backend has
            // no public URL to fetch the page from. That's an inherent limitation of
            // Google's widget, not a bug in this code (verified the selection logic
            // itself is correct by driving a mocked widget element directly).
            //
            // So this control does two things reliably regardless of environment:
            // updates its own displayed label immediately, and remembers the choice —
            // and additionally drives the real Google widget when one happens to be
            // present (e.g. if this guide is later hosted online).
            var langControl = document.getElementById('langControl');
            var langMenu = document.getElementById('langMenu');
            var langText = document.getElementById('langText');
            var LANG_META = {
                en: { label: 'English (United States)' },
                fil: { label: 'Filipino' },
                id: { label: 'Bahasa Indonesia' },
                th: { label: 'ไทย (Thai)' },
                vi: { label: 'Tiếng Việt (Vietnamese)' },
                ms: { label: 'Bahasa Melayu (Malay)' },
                my: { label: 'မြန်မာ (Burmese)' },
                km: { label: 'ខ្មែរ (Khmer)' },
                lo: { label: 'ລາວ (Lao)' },
                'zh-CN': { label: '中文 (Chinese)' },
                ja: { label: '日本語 (Japanese)' },
                ko: { label: '한국어 (Korean)' },
                hi: { label: 'हिन्दी (Hindi)' },
                es: { label: 'Español' },
                fr: { label: 'Français' },
                de: { label: 'Deutsch' },
                pt: { label: 'Português' },
                ar: { label: 'العربية (Arabic)' }
            };
            var LANG_ORDER = ['en', 'fil', 'id', 'th', 'vi', 'ms', 'my', 'km', 'lo', 'zh-CN', 'ja', 'ko', 'hi', 'es', 'fr', 'de', 'pt', 'ar'];

            // Representative country flag shown next to each language option —
            // this is what used to be a separate Country selector; it now lives
            // here instead of as its own control.
            var LANG_FLAG = {
                en: 'us', fil: 'ph', id: 'id', th: 'th', vi: 'vn', ms: 'my', my: 'mm',
                km: 'kh', lo: 'la', 'zh-CN': 'cn', ja: 'jp', ko: 'kr', hi: 'in',
                es: 'es', fr: 'fr', de: 'de', pt: 'pt', ar: 'sa'
            };

            // Our own code for Filipino is 'fil', but Google Translate's widget uses
            // the ISO-639-ish code 'tl' — without this mapping, selecting Filipino
            // would silently do nothing even when the widget IS available.
            var GOOGLE_CODE_MAP = { fil: 'tl' };
            function googleCode(code) { return GOOGLE_CODE_MAP[code] || code; }

            function applyGoogleTranslate(code, attemptsLeft) {
                attemptsLeft = attemptsLeft === undefined ? 15 : attemptsLeft;
                var combo = document.querySelector('select.goog-te-combo');
                if (combo) {
                    combo.value = googleCode(code);
                    combo.dispatchEvent(new Event('change'));
                    return true;
                }
                if (attemptsLeft > 0) setTimeout(function () { applyGoogleTranslate(code, attemptsLeft - 1); }, 300);
                return false;
            }

            var langFlag = document.getElementById('langFlag');

            function updateLangDisplay(code) {
                var meta = LANG_META[code];
                if (!meta) return;
                if (langText) langText.textContent = meta.label;
                if (langFlag) { langFlag.src = flagUrl(LANG_FLAG[code] || 'us'); langFlag.alt = ''; }
                Array.prototype.forEach.call(langMenu ? langMenu.querySelectorAll('li') : [], function (li) {
                    li.classList.toggle('active', li.getAttribute('data-code') === code);
                });
            }

            function selectLanguage(code) {
                // Always do this part — works regardless of whether Google's
                // widget is present, so the control never feels unresponsive.
                if (window.localStorage) window.localStorage.setItem('ftAmlLang', code);
                updateLangDisplay(code);
                closeMenu(langMenu, langControl);

                // Best-effort: also drives real translation if the widget loaded.
                applyGoogleTranslate(code);
            }

            if (langControl && langMenu) {
                langMenu.innerHTML = LANG_ORDER.map(function (code) {
                    var meta = LANG_META[code];
                    return '<li data-code="' + code + '" role="option"><img src="' + flagUrl(LANG_FLAG[code] || 'us') + '" width="18" height="13" alt=""> <span>' + meta.label + '</span></li>';
                }).join('');
                Array.prototype.forEach.call(langMenu.querySelectorAll('li'), function (li) {
                    li.addEventListener('click', function (e) {
                        e.stopPropagation();
                        selectLanguage(li.getAttribute('data-code'));
                    });
                });

                langControl.addEventListener('click', function (e) {
                    e.stopPropagation();
                    if (langMenu.classList.contains('open')) closeMenu(langMenu, langControl);
                    else openMenu(langMenu, langControl);
                });
                langControl.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (langMenu.classList.contains('open')) closeMenu(langMenu, langControl);
                        else openMenu(langMenu, langControl);
                    }
                    if (e.key === 'Escape') closeMenu(langMenu, langControl);
                });
                document.addEventListener('click', function (e) {
                    if (!langControl.contains(e.target)) closeMenu(langMenu, langControl);
                });

                var savedLang = window.localStorage ? window.localStorage.getItem('ftAmlLang') : null;
                if (savedLang && LANG_META[savedLang]) updateLangDisplay(savedLang);

                if (savedLang && savedLang !== 'en') {
                    setTimeout(function () { applyGoogleTranslate(savedLang); }, 1200);
                }
            }

            // ---- Ask AI assistant ----
            var aiOverlay = document.getElementById('aiOverlay');
            var aiMessages = document.getElementById('aiMessages');
            var aiInput = document.getElementById('aiInput');
            var aiSend = document.getElementById('aiSend');
            var aiClose = document.getElementById('aiClose');
            var aiTriggers = document.querySelectorAll('[data-ai-trigger]');
            var aiIndex = window.PORTAL_SEARCH_INDEX || [];

            function openAi() {
                aiOverlay.classList.add('open');
                setTimeout(function () { aiInput.focus(); }, 30);
            }
            function closeAi() { aiOverlay.classList.remove('open'); }

            function addMsg(text, who) {
                var div = document.createElement('div');
                div.className = 'ai-msg ' + who;
                div.innerHTML = text;
                aiMessages.appendChild(div);
                aiMessages.scrollTop = aiMessages.scrollHeight;
            }

            function findMatches(query) {
                if (window.guideSearch) return window.guideSearch(query).slice(0, 3);
                // Fallback (shouldn't normally run): older hand-maintained index, in case
                // the search script hasn't loaded for some reason.
                var q = query.toLowerCase();
                var hits = [];
                aiIndex.forEach(function (entry) {
                    var haystack = (entry.title + ' ' + (entry.headings || []).join(' ')).toLowerCase();
                    var score = 0;
                    q.split(/\s+/).forEach(function (word) {
                        if (word.length > 2 && haystack.indexOf(word) !== -1) score++;
                    });
                    if (score > 0) hits.push({ entry: entry, score: score });
                });
                hits.sort(function (a, b) { return b.score - a.score; });
                return hits.slice(0, 3).map(function (h) {
                    return { label: h.entry.title, path: null, sectionId: (h.entry.path || '').replace(/^#/, ''), headingId: null };
                });
            }

            function answer(query) {
                var matches = findMatches(query);
                if (!matches.length) {
                    addMsg("I couldn't find a section matching that in this guide. Try naming a module directly, e.g. \"Case Manager\" or \"Name Screening\", or use the Search (Ctrl K) to scan the full text.", 'bot');
                    return;
                }
                var lines = matches.map(function (m) {
                    var context = m.path ? '<br><span style="color:var(--grey-light);">' + m.path + '</span>' : '';
                    return '<strong><a href="#' + m.sectionId + '" data-ai-link data-heading-id="' + (m.headingId || '') + '">' + m.label + '</a></strong>' + context;
                });
                addMsg('Here\'s what covers that in the guide:<br><br>' + lines.join('<br><br>'), 'bot');
            }

            function ask(query) {
                query = (query || '').trim();
                if (!query) return;
                addMsg(query.replace(/</g, '&lt;'), 'user');
                aiInput.value = '';
                setTimeout(function () { answer(query); }, 250);
            }

            if (aiOverlay && aiMessages && aiInput && aiSend) {
                aiTriggers.forEach(function (t) { t.addEventListener('click', openAi); });
                if (aiClose) aiClose.addEventListener('click', closeAi);
                aiOverlay.addEventListener('click', function (e) { if (e.target === aiOverlay) closeAi(); });
                aiSend.addEventListener('click', function () { ask(aiInput.value); });
                aiInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') ask(aiInput.value); });
                Array.prototype.forEach.call(document.querySelectorAll('[data-ai-suggest]'), function (btn) {
                    btn.addEventListener('click', function () { ask(btn.getAttribute('data-ai-suggest')); });
                });
                aiMessages.addEventListener('click', function (e) {
                    var link = e.target.closest('[data-ai-link]');
                    if (!link) return;
                    e.preventDefault();
                    var targetId = link.getAttribute('href').replace(/^#/, '');
                    var headingId = link.getAttribute('data-heading-id');
                    // activateTab handles lazy-loading + scrolling to a specific
                    // sub-heading itself once content is ready, so pass headingId
                    // straight through instead of racing it with a fixed timeout.
                    if (window.openDocSection) window.openDocSection(targetId, headingId || undefined);
                    closeAi();
                    if (!headingId) {
                        setTimeout(function () {
                            var mainContent = document.getElementById('mainContent');
                            if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 30);
                    }
                });
                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape' && aiOverlay.classList.contains('open')) closeAi();
                });

                // Lets the search palette (Ctrl+K / "/") hand a typed query straight to
                // the assistant via its own "Ask AI: ..." row.
                window.openAiWithQuery = function (query) {
                    openAi();
                    setTimeout(function () { ask(query); }, 200);
                };
            }
        })();

// ==== inline script block 7 of 7 ====
function googleTranslateElementInit() {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'tl,id,th,vi,ms,my,km,lo,en,zh-CN,ja,ko,hi,es,fr,de,pt,ar',
                autoDisplay: false,
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
        }

