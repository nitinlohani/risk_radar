#!/usr/bin/env python3
"""
Rebuilds index.html from the editable content files. Run this any time you:
  - add/edit a file in sections/
  - edit content/modules.json, content/landing-cards.json, or content/releases.json

Usage:
    python3 build.py

See README.md ("Adding content") for the step-by-step for common changes.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

ICONS = {
    'dashboard': '<path d="M3 3h7v9H3zM12 3h7v5h-7zM12 10h7v9h-7zM3 14h7v5H3z"/>',
    'customer': '<circle cx="11" cy="7" r="3.2"/><path d="M4.5 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/>',
    'screening': '<path d="M11 2l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V5z"/><path d="M8 11l2.2 2.2L15 8.5"/>',
    'monitoring': '<path d="M2 12h3.5l2-6 3 12 2-9 1.5 3H20"/>',
    'alert': '<path d="M11 2a6 6 0 0 1 6 6v4l2 4H3l2-4V8a6 6 0 0 1 6-6z"/><path d="M8.5 19a2.5 2.5 0 0 0 5 0"/>',
    'case': '<path d="M2 8.5A1.5 1.5 0 0 1 3.5 7h15A1.5 1.5 0 0 1 20 8.5V17a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 2 17z"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h3A1.5 1.5 0 0 1 14 5.5V7"/>',
    'report': '<path d="M6 2h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M8 12h6M8 15.5h6M8 8.5h3"/>',
    'rules': '<path d="M4 6h6M4 11h14M4 16h10"/><circle cx="14" cy="6" r="1.6"/><circle cx="18" cy="16" r="1.6"/>',
    'ai': '<path d="M11 2v3M11 17v3M2 11h3M17 11h3M5.5 5.5l2 2M14.5 14.5l2 2M16.5 5.5l-2 2M7.5 14.5l-2 2"/><circle cx="11" cy="11" r="4"/>',
    'ingestion': '<path d="M11 3v11M7 10l4 4 4-4"/><path d="M4 17.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
    'user-mgmt': '<circle cx="8" cy="7" r="3"/><path d="M2.5 18c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><circle cx="17" cy="8" r="2.2"/><path d="M14.5 12.3c2.4.3 4 1.9 4 4.2"/>',
    'hierarchy': '<circle cx="11" cy="4" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M11 6v4M11 10L5 16M11 10l6 6"/>',
    'admin': '<circle cx="11" cy="11" r="2.8"/><path d="M11 3v2.4M11 16.6V19M3 11h2.4M16.6 11H19M5.6 5.6l1.7 1.7M13.7 13.7l1.7 1.7M16.4 5.6l-1.7 1.7M7.3 13.7l-1.7 1.7"/>',
    'faq': '<circle cx="11" cy="11" r="9"/><path d="M8.5 8.8a2.5 2.5 0 1 1 3.7 2.2c-.7.5-1.2.9-1.2 1.8"/><circle cx="11" cy="15.8" r="0.4"/>',
    'glossary': '<path d="M4 3.5h11.5A1.5 1.5 0 0 1 17 5v14a1.5 1.5 0 0 0-1.5-1.5H4z"/><path d="M4 3.5v14"/>',
    'support': '<path d="M11 3a7 7 0 0 0-7 7v3.5"/><path d="M18 13.5V10a7 7 0 0 0-7-7"/><rect x="2.5" y="13" width="3.5" height="5" rx="1"/><rect x="16" y="13" width="3.5" height="5" rx="1"/>',
    'automation': '<rect x="3" y="3" width="6" height="6" rx="1.2"/><rect x="13" y="3" width="6" height="6" rx="1.2"/><rect x="8" y="14" width="6" height="6" rx="1.2"/><path d="M6 9v2a2 2 0 0 0 2 2h1M16 9v2a2 2 0 0 1-2 2h-1"/>',
}

TAG_LABELS = {'new': 'New', 'improved': 'Improved', 'fix': 'Fixed'}


def load_json(name):
    path = os.path.join(ROOT, 'content', name)
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def icon_svg(name):
    path_data = ICONS.get(name)
    if not path_data:
        print(f"WARNING: unknown icon '{name}', using a blank square instead.", file=sys.stderr)
        path_data = '<rect x="4" y="4" width="14" height="14"/>'
    return (f'<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="white" '
            f'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">{path_data}</svg>')


def icon_svg_mono(name):
    """Smaller, currentColor version of the same icon set, for inline use
    next to sidebar text (rather than the white-on-filled-square version
    used on landing page cards)."""
    path_data = ICONS.get(name, '<rect x="4" y="4" width="14" height="14"/>')
    return (f'<svg width="15" height="15" viewBox="0 0 22 22" fill="none" stroke="currentColor" '
            f'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{path_data}</svg>')


def build_sidebar(modules):
    categories = []
    for m in modules:
        if not categories or categories[-1][0] != m['category']:
            categories.append((m['category'], []))
        categories[-1][1].append(m)

    parts = ['<aside class="sidebar" id="sidebar"><div class="sidebar-nav" id="sidebarNav">']
    for cat_label, mods in categories:
        parts.append(f'<div class="side-category-title">{cat_label}</div>')
        for m in mods:
            icon = m.get('icon')
            icon_html = f'<span class="side-link-icon">{icon_svg_mono(icon)}</span>' if icon else ''
            parts.append(
                f'<a href="#{m["id"]}" class="side-link side-link-plain" data-target="{m["id"]}" title="{m["title"]}">'
                f'{icon_html}<span>{m["title"]}</span></a>'
            )
    parts.append('</div>')
    parts.append('</aside>')
    return ''.join(parts)


def build_mod_grid(cards, modules):
    category_by_id = {m['id']: m['category'] for m in modules}
    groups = []
    for c in cards:
        target_id = c['href'].lstrip('#')
        category = category_by_id.get(target_id, '')
        if not groups or groups[-1][0] != category:
            groups.append((category, []))
        groups[-1][1].append(c)

    parts = ['<div class="mod-groups">']
    for category, group_cards in groups:
        count = len(group_cards)
        noun = 'module' if count == 1 else 'modules'
        # Cap the grid to only as many columns as this category actually
        # fills, so a short category (e.g. 1-2 modules) doesn't leave a row
        # of empty blank columns next to a lone narrow card.
        weight = min(4, sum(2 if c.get('large') else 1 for c in group_cards))
        grid_style = ''
        if weight < 4:
            max_w = f'calc({weight}*25% + {5 * weight - 20}px)'
            grid_style = f' style="grid-template-columns: repeat({weight}, 1fr); max-width: {max_w};"'
        parts.append(
            '<div class="mod-group">'
            f'<div class="mod-group-header"><h3 class="mod-group-title">{category}</h3>'
            f'<span class="mod-group-count">{count} {noun}</span></div>'
            f'<div class="mod-grid"{grid_style}>'
        )
        for c in group_cards:
            cls = 'mod-card mod-card--lg' if c.get('large') else 'mod-card'
            desc_plain = re.sub('<[^<]+?>', '', c['description']).lower().replace('"', '&quot;')
            parts.append(
                f'<a class="{cls}" href="{c["href"]}" data-title="{c["title"].lower()}" data-desc="{desc_plain}">'
                f'<div class="mod-card-top"><div class="mod-icon">{icon_svg(c["icon"])}</div></div>'
                f'<h3>{c["title"]}</h3><p>{c["description"]}</p>'
                f'<span class="mod-explore">Explore <svg width="14" height="14" viewBox="0 0 16 16" fill="none">'
                f'<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" '
                f'stroke-linecap="round" stroke-linejoin="round"/></svg></span></a>'
            )
        parts.append('</div></div>')
    parts.append('</div>')
    return ''.join(parts)


def _short_teaser(text, max_len=70):
    """Short version of a release description for the compact landing-page
    teaser — cut at the nearest word boundary, not mid-word. The full
    description is still used in full on the Release Notes module page."""
    if len(text) <= max_len:
        return text.rstrip('.') + '.'
    cut = text[:max_len].rsplit(' ', 1)[0]
    return cut.rstrip(',.;') + '…'


def build_release_teaser(releases):
    if not releases:
        return ''
    latest = releases[0]
    tag_label = TAG_LABELS.get(latest['tag'], latest['tag'].title())
    short_desc = _short_teaser(latest['description'])
    return (
        '<section class="section" id="updates">\n'
        '        <div class="release-light">\n'
        '            <div class="release-light-info">\n'
        f'                <span class="release-tag">{latest["version"]}</span>\n'
        f'                <span class="update-tag {latest["tag"]}">{tag_label}</span>\n'
        f'                <span class="release-light-text"><strong>{latest["title"]}</strong> &mdash; {short_desc}</span>\n'
        f'                <span class="release-date">{latest["date"]}</span>\n'
        '            </div>\n'
        '            <a href="#release-notes" class="btn-view-all-releases">Release notes &rarr;</a>\n'
        '        </div>\n'
        '    </section>'
    )


def build_release_notes_section(releases):
    rows = []
    for r in releases:
        tag_label = TAG_LABELS.get(r['tag'], r['tag'].title())
        rows.append(
            '<div class="release-row">\n'
            '    <div class="release-version">\n'
            f'        <span class="release-tag">{r["version"]}</span>\n'
            f'        <span class="release-date">{r["date"]}</span>\n'
            '    </div>\n'
            '    <div class="release-body">\n'
            f'        <div class="release-item"><span class="update-tag {r["tag"]}">{tag_label}</span>\n'
            f'            <h4>{r["title"]}</h4>\n'
            f'            <p>{r["description"]} See <a href="{r["moduleLink"]}">{r["moduleLinkText"]}</a>.</p>\n'
            '        </div>\n'
            '    </div>\n'
            '</div>'
        )
    rows_html = '\n'.join(rows)
    return (
        '<div class="sec-tag">Reference &amp; Support</div>\n'
        '<h2>Release Notes</h2>\n'
        '<p class="sec-intro">Version history for the FT AML platform, newest first. For what each module '
        'actually does, see its own page in this guide.</p>\n\n'
        f'<div class="release-list release-list--module">\n{rows_html}\n</div>\n\n'
        '<div class="note-box"><span class="box-label">Note</span>Versioning follows '
        '<code>major.minor.patch</code>: major releases introduce a new module, minor releases add '
        'capability to an existing module, and patch releases are fixes with no visible change to how '
        'a module works.</div>'
    )


def build_doc_section_placeholders(modules):
    return ''.join(
        f'<section class="doc-section" id="{m["id"]}" data-lazy="true">'
        f'<div class="section-loading">Loading&hellip;</div></section>'
        for m in modules
    )


def build_related_modules(current, modules):
    """A module's 'related' set = other modules in the same category.
    Falls back to nothing if it's the only module in its category."""
    same_category = [m for m in modules if m['category'] == current['category'] and m['id'] != current['id']]
    if not same_category:
        return ''
    cards = ''.join(
        f'<a href="#{m["id"]}" class="related-module-card">'
        f'<span class="related-module-icon">{icon_svg_mono(m.get("icon"))}</span>'
        f'<span class="related-module-name">{m["title"]}</span>'
        f'</a>'
        for m in same_category
    )
    return (
        '<div class="related-modules">'
        '<div class="related-modules-title">Related in ' + current['category'] + '</div>'
        f'<div class="related-modules-grid">{cards}</div>'
        '</div>'
    )


def build_templates(modules):
    parts = []
    missing = []
    for m in modules:
        section_path = os.path.join(ROOT, 'sections', f'{m["id"]}.html')
        if not os.path.exists(section_path):
            missing.append(m['id'])
            continue
        with open(section_path, encoding='utf-8') as f:
            html = f.read()
        html += build_related_modules(m, modules)
        parts.append(f'<template id="tpl-{m["id"]}">{html}</template>')
    if missing:
        print(f"WARNING: no sections/*.html file found for: {', '.join(missing)}", file=sys.stderr)
    return '\n'.join(parts)


def main():
    modules = load_json('modules.json')
    landing_cards = load_json('landing-cards.json')
    releases = load_json('releases.json')

    # Regenerate sections/release-notes.html from releases.json so the two
    # never drift out of sync with each other.
    release_notes_html = build_release_notes_section(releases)
    with open(os.path.join(ROOT, 'sections', 'release-notes.html'), 'w', encoding='utf-8') as f:
        f.write(release_notes_html)

    with open(os.path.join(ROOT, 'templates', 'shell.html'), encoding='utf-8') as f:
        shell = f.read()

    output = shell
    output = output.replace('{{MODULE_COUNT}}', str(len(modules)))
    output = output.replace('{{SIDEBAR}}', build_sidebar(modules))
    output = output.replace('{{DOC_SECTION_PLACEHOLDERS}}', build_doc_section_placeholders(modules))
    output = output.replace('{{MOD_GRID}}', build_mod_grid(landing_cards, modules))
    output = output.replace('{{RELEASE_TEASER}}', build_release_teaser(releases))
    output = output.replace('{{SECTION_TEMPLATES}}', build_templates(modules))

    out_path = os.path.join(ROOT, 'index.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(output)

    print(f"Built index.html ({len(output):,} bytes) from:")
    print(f"  - {len(modules)} modules (content/modules.json)")
    print(f"  - {len(landing_cards)} landing cards (content/landing-cards.json)")
    print(f"  - {len(releases)} release notes entries (content/releases.json)")


if __name__ == '__main__':
    main()
