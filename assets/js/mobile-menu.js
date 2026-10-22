/**
 * Mobile menu (offcanvas) for the rebuild — replaces the legacy Blocksy theme
 * script for this one job. The copied Blocksy main.js lazy-loads its panel code
 * from a chunk that was never copied into the repo (and points at the old
 * WordPress host), so the ☰ button did nothing (found 2026-10-19).
 *
 * Uses the existing legacy markup + CSS as-is:
 *   button[data-toggle-panel="#offcanvas"]  opens the panel
 *   #offcanvas.ct-panel.active + <body data-panel="in">   shown (legacy CSS)
 *   .ct-toggle-close / backdrop / Esc / a link inside    closes it
 *   Books ▾ inside the panel                              toggles the submenu
 *     (legacy CSS: [class*=children]:not(.dropdown-active) > ul is hidden)
 *
 * The home page has its own header (an Elementor nav-menu widget inside the
 * page content) whose ☰ handler is also a missing lazy chunk. Same approach:
 *   .elementor-menu-toggle.elementor-active  shows the dropdown (legacy CSS)
 *   .sub-arrow inside the dropdown           shows/hides that item's sub-menu
 */
'use strict';

(() => {
    const panel = document.getElementById('offcanvas');
    if (!panel) return;
    const html = document.documentElement;
    const body = document.body; // legacy CSS keys on body[data-panel]
    const TRIGGER = '[data-toggle-panel="#offcanvas"], a[href="#offcanvas"]';
    const SUB_TOGGLE = '.ct-toggle-dropdown-desktop, .ct-toggle-dropdown-desktop-ghost, .ct-toggle-dropdown-mobile';
    let opener = null;
    let closeTimer = null;

    const isOpen = () => panel.classList.contains('active');

    const open = (trigger) => {
        clearTimeout(closeTimer);
        opener = trigger;
        panel.removeAttribute('inert');
        panel.classList.add('active');
        body.dataset.panel = 'in';
        html.style.overflow = 'hidden';
        document.querySelectorAll(TRIGGER).forEach((t) => t.setAttribute('aria-expanded', 'true'));
        const closeBtn = panel.querySelector('.ct-toggle-close');
        if (closeBtn) closeBtn.focus({ preventScroll: true });
    };

    const close = () => {
        if (!isOpen()) return;
        body.dataset.panel = 'out'; // legacy CSS plays the slide-out animation
        document.querySelectorAll(TRIGGER).forEach((t) => t.setAttribute('aria-expanded', 'false'));
        closeTimer = setTimeout(() => {
            panel.classList.remove('active');
            panel.setAttribute('inert', '');
            delete body.dataset.panel;
            html.style.overflow = '';
            if (opener) opener.focus({ preventScroll: true });
        }, 250);
    };

    // Capture phase: runs before (and stops) the legacy theme handlers, whose
    // lazy-loaded code is missing.
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest(TRIGGER);
        if (trigger) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (isOpen()) close(); else open(trigger);
            return;
        }
        if (!isOpen() || !panel.contains(e.target)) return;

        const subToggle = e.target.closest(SUB_TOGGLE);
        if (subToggle) {
            e.preventDefault();
            e.stopImmediatePropagation();
            const item = subToggle.closest('li');
            if (item) {
                const on = item.classList.toggle('dropdown-active');
                item.querySelectorAll(':scope > .ct-toggle-dropdown-desktop-ghost, :scope > a > .ct-toggle-dropdown-desktop')
                    .forEach((b) => b.setAttribute('aria-expanded', on ? 'true' : 'false'));
            }
            return;
        }
        if (e.target.closest('.ct-toggle-close')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            close();
            return;
        }
        if (e.target === panel) { // tap on the dark backdrop
            close();
            return;
        }
        if (e.target.closest('a[href]')) close(); // navigating away (also same-page #anchors)
    }, true);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) close();
    });

    // Rotating to / resizing into the desktop header: never leave it open.
    window.matchMedia('(min-width: 1000px)').addEventListener('change', (m) => {
        if (m.matches) close();
    });
})();

(() => {
    const toggles = document.querySelectorAll('.elementor-widget-nav-menu .elementor-menu-toggle');
    if (!toggles.length) return;

    // The widget is set to a full-width ("stretch") dropdown, which Elementor
    // sizes from script: span the viewport, start at its left edge, sit just
    // under the ☰ button.
    const stretch = (toggle, dropdown) => {
        const parent = dropdown.offsetParent || toggle.parentElement;
        const p = parent.getBoundingClientRect();
        const t = toggle.getBoundingClientRect();
        dropdown.style.width = document.documentElement.clientWidth + 'px';
        dropdown.style.left = (-p.left) + 'px';
        dropdown.style.top = (t.bottom - p.top + 12) + 'px';
    };

    const setOpen = (toggle, on) => {
        toggle.classList.toggle('elementor-active', on);
        toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
        const dropdown = toggle.nextElementSibling;
        if (!dropdown) return;
        dropdown.setAttribute('aria-hidden', on ? 'false' : 'true');
        if (on) stretch(toggle, dropdown);
    };
    window.addEventListener('resize', () => toggles.forEach((t) => {
        if (t.classList.contains('elementor-active') && t.nextElementSibling) stretch(t, t.nextElementSibling);
    }));
    const closeAll = (except) => toggles.forEach((t) => { if (t !== except) setOpen(t, false); });

    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('.elementor-widget-nav-menu .elementor-menu-toggle');
        if (toggle) {
            e.preventDefault();
            e.stopImmediatePropagation();
            const on = !toggle.classList.contains('elementor-active');
            closeAll(toggle);
            setOpen(toggle, on);
            return;
        }
        const arrow = e.target.closest('.elementor-nav-menu--dropdown .sub-arrow');
        if (arrow) { // ▾ next to "Books": open its sub-menu instead of following the link
            e.preventDefault();
            e.stopImmediatePropagation();
            const link = arrow.closest('a');
            const sub = link && link.parentElement.querySelector(':scope > .sub-menu');
            if (sub) {
                const on = sub.style.display !== 'block';
                sub.style.display = on ? 'block' : 'none';
                link.classList.toggle('highlighted', on);
                link.setAttribute('aria-expanded', on ? 'true' : 'false');
            }
            return;
        }
        if (!e.target.closest('.elementor-nav-menu--dropdown')) closeAll(null); // tap outside
    }, true);

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(null); });
})();
