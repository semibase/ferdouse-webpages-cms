/**
 * ferdouse.com video player for YouTube chapters (client deck 12Oct26, slides
 * 4/14/23/24: play like salsapal.com, never send the visitor to YouTube).
 * Ported from the SalsaPal player (semibase/salsapal yt-lightbox.js).
 *
 * A [data-yt-id] thumbnail opens a full-screen overlay holding a
 * youtube-nocookie embed. A transparent shield sits over the embed so no tap
 * reaches YouTube's own title, logo or "watch on YouTube" links; our own
 * controls drive the player through the IFrame API's postMessage protocol:
 *   single tap   play / pause        double tap   full screen on/off
 *   Space / K    play / pause        M  sound     F  full screen   Esc  close
 *   swipe / arrows / wheel   next or previous chapter
 * Videos start muted with a "Tap to unmute" button (owner 2026-10-17, phone
 * and desktop); sound, once on, stays on for the next videos.
 * Next/previous move through the clips of the same .video-grid; a clip that
 * ends rolls on to the next. Closing (✕ / Esc) returns to the page, and so
 * does the phone's Back button: opening adds one history step that Back pops.
 */
'use strict';

window.FK = window.FK || {};
FK.ytLightbox = (() => {
    const ORIGIN = 'https://www.youtube-nocookie.com';
    let box = null; let frame = null; let shield = null; let ui = {};
    let state = { playing: false, muted: false, time: 0, duration: 0, opener: null, tapTimer: null, lastTap: 0, hideTimer: null };

    const icon = (d) => `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="${d}" fill="currentColor"/></svg>`;
    const I = {
        play: icon('M8 5v14l11-7z'),
        pause: icon('M6 5h4v14H6zM14 5h4v14h-4z'),
        sound: icon('M3 10v4h4l5 5V5L7 10H3zm13.5 2A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z'),
        muted: icon('M3 10v4h4l5 5V5L7 10H3zm18.7 2.3-1.4-1.4L18 13.2l-2.3-2.3-1.4 1.4 2.3 2.3-2.3 2.3 1.4 1.4L18 16l2.3 2.3 1.4-1.4L19.4 14z'),
        full: icon('M5 5h5v2H7v3H5zm9 0h5v5h-2V7h-3zM5 14h2v3h3v2H5zm12 3v-3h2v5h-5v-2z'),
        exit: icon('M8 5h2v5H5V8h3zm6 0h2v3h3v2h-5zM5 14h5v5H8v-3H5zm9 0h5v2h-3v3h-2z'),
        prev: icon('M7.4 15.4 12 10.8l4.6 4.6L18 14l-6-6-6 6z'),
        next: icon('M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z'),
        close: icon('M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z'),
    };

    const send = (func, args = []) => {
        if (frame && frame.contentWindow) frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), ORIGIN);
    };
    const fmt = (s) => { s = Math.max(0, Math.floor(s || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

    const build = () => {
        box = document.createElement('div');
        box.className = 'yt-box';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.hidden = true;
        box.innerHTML = `
            <div class="yt-box__stage">
                <div class="yt-box__video" data-yt-video></div>
                <div class="yt-box__shield" data-yt-shield></div>
                <div class="yt-box__bump" data-yt-bump aria-hidden="true"></div>
            </div>
            <div class="yt-box__bar">
                <button type="button" class="yt-box__btn" data-yt-play aria-label="Play">${I.play}</button>
                <span class="yt-box__time" data-yt-time>0:00</span>
                <input class="yt-box__seek" data-yt-seek type="range" min="0" max="1000" value="0" step="1" aria-label="Seek">
                <span class="yt-box__time" data-yt-dur>0:00</span>
                <button type="button" class="yt-box__btn" data-yt-mute aria-label="Sound off">${I.sound}</button>
                <button type="button" class="yt-box__btn" data-yt-full aria-label="Full screen">${I.full}</button>
            </div>
            <div class="yt-box__nav" data-yt-nav>
                <button type="button" class="yt-box__btn" data-yt-prev aria-label="Previous video">${I.prev}</button>
                <span class="yt-box__count" data-yt-count></span>
                <button type="button" class="yt-box__btn" data-yt-next aria-label="Next video">${I.next}</button>
            </div>
            <button type="button" class="yt-box__close" data-yt-close aria-label="Close video">${I.close}</button>
            <button type="button" class="yt-box__unmute" data-yt-unmute hidden>${I.muted}<span>Tap to unmute</span></button>
            <p class="yt-box__title" data-yt-title></p>`;
        document.body.appendChild(box);
        ui = {
            video: box.querySelector('[data-yt-video]'), play: box.querySelector('[data-yt-play]'), mute: box.querySelector('[data-yt-mute]'),
            full: box.querySelector('[data-yt-full]'), close: box.querySelector('[data-yt-close]'), seek: box.querySelector('[data-yt-seek]'),
            time: box.querySelector('[data-yt-time]'), dur: box.querySelector('[data-yt-dur]'), title: box.querySelector('[data-yt-title]'),
            bump: box.querySelector('[data-yt-bump]'), unmute: box.querySelector('[data-yt-unmute]'),
            nav: box.querySelector('[data-yt-nav]'), prev: box.querySelector('[data-yt-prev]'), next: box.querySelector('[data-yt-next]'),
            count: box.querySelector('[data-yt-count]'),
        };
        shield = box.querySelector('[data-yt-shield]');

        ui.play.addEventListener('click', () => togglePlay());
        ui.mute.addEventListener('click', () => toggleMute());
        ui.unmute.addEventListener('click', () => { send('unMute'); setMuted(false); state.soundOn = true; bump(I.sound); });
        ui.full.addEventListener('click', () => toggleFull());
        ui.close.addEventListener('click', () => close());
        ui.prev.addEventListener('click', () => step(-1));
        ui.next.addEventListener('click', () => step(1));
        // Swipe up = next, down = previous (like Shorts); sideways works too.
        let sx = 0; let sy = 0; let st = 0;
        shield.addEventListener('touchstart', (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
        shield.addEventListener('touchend', (e) => {
            const t = e.changedTouches[0]; const dx = t.clientX - sx; const dy = t.clientY - sy;
            if (Date.now() - st > 700) return;
            const big = Math.max(Math.abs(dx), Math.abs(dy));
            if (big < 60) return;
            state.swiped = Date.now();
            if (Math.abs(dy) >= Math.abs(dx)) step(dy < 0 ? 1 : -1); else step(dx < 0 ? 1 : -1);
        }, { passive: true });
        box.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) < 40 || Date.now() - (state.wheelAt || 0) < 700) return;
            state.wheelAt = Date.now(); step(e.deltaY > 0 ? 1 : -1);
        }, { passive: true });
        ui.seek.addEventListener('input', () => {
            if (state.duration > 0) send('seekTo', [(ui.seek.value / 1000) * state.duration, true]);
        });
        // The shield takes every tap: one tap plays/pauses, two tap full screen.
        shield.addEventListener('click', (e) => {
            e.preventDefault();
            if (Date.now() - (state.swiped || 0) < 400) return;
            const now = Date.now();
            if (now - state.lastTap < 300) {
                clearTimeout(state.tapTimer); state.lastTap = 0; toggleFull(); return;
            }
            state.lastTap = now;
            state.tapTimer = setTimeout(() => togglePlay(), 280);
        });
        shield.addEventListener('dblclick', (e) => e.preventDefault());
        shield.addEventListener('contextmenu', (e) => e.preventDefault());
        box.addEventListener('pointermove', wake);
        box.addEventListener('keydown', onKey);
        document.addEventListener('fullscreenchange', paintFull);
        document.addEventListener('webkitfullscreenchange', paintFull);
        window.addEventListener('message', onMessage);
    };

    const onMessage = (e) => {
        if (!frame || e.source !== frame.contentWindow) return;
        let data; try { data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch { return; }
        if (data.event === 'onReady') { send('playVideo'); return; }
        if (data.event === 'onStateChange') { if (data.info === 0) ended(); setPlaying(data.info === 1 || data.info === 3); return; }
        const info = data.info;
        if (data.event !== 'infoDelivery' || !info) return;
        if (typeof info.playerState === 'number') {
            if (info.playerState === 1) state.started = true;
            if (info.playerState === 0) ended();
            setPlaying(info.playerState === 1 || info.playerState === 3);
        }
        if (typeof info.muted === 'boolean') setMuted(info.muted);
        if (typeof info.duration === 'number' && info.duration > 0) { state.duration = info.duration; ui.dur.textContent = fmt(info.duration); }
        if (typeof info.currentTime === 'number') {
            state.time = info.currentTime; ui.time.textContent = fmt(info.currentTime);
            if (state.duration > 0 && document.activeElement !== ui.seek) ui.seek.value = String(Math.round((info.currentTime / state.duration) * 1000));
        }
    };

    const setPlaying = (on) => {
        state.playing = on;
        ui.play.innerHTML = on ? I.pause : I.play;
        ui.play.setAttribute('aria-label', on ? 'Pause' : 'Play');
        box.classList.toggle('yt-box--paused', !on);
    };
    const setMuted = (on) => {
        state.muted = on;
        // "Tap to unmute" shows whenever the video is muted (phone and desktop).
        if (ui.unmute) ui.unmute.hidden = !on;
        ui.mute.innerHTML = on ? I.muted : I.sound;
        ui.mute.setAttribute('aria-label', on ? 'Sound on' : 'Sound off');
    };
    const bump = (svg) => {
        ui.bump.innerHTML = svg;
        ui.bump.classList.remove('yt-box__bump--on'); void ui.bump.offsetWidth; ui.bump.classList.add('yt-box__bump--on');
    };
    const togglePlay = () => { send(state.playing ? 'pauseVideo' : 'playVideo'); bump(state.playing ? I.pause : I.play); setPlaying(!state.playing); wake(); };
    const toggleMute = () => { send(state.muted ? 'unMute' : 'mute'); setMuted(!state.muted); state.soundOn = !state.muted; bump(state.muted ? I.muted : I.sound); wake(); };

    const isFull = () => document.fullscreenElement === box || document.webkitFullscreenElement === box;
    const toggleFull = () => {
        if (isFull()) {
            (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        } else {
            const req = box.requestFullscreen || box.webkitRequestFullscreen;
            if (req) {
                Promise.resolve(req.call(box)).then(() => {
                    // Phones: lock to the clip's shape where the browser allows it.
                    const want = box.dataset.format === 'landscape' ? 'landscape' : 'portrait';
                    if (screen.orientation && screen.orientation.lock) screen.orientation.lock(want).catch(() => {});
                }).catch(() => {});
            }
        }
        wake();
    };
    const paintFull = () => {
        const on = isFull();
        ui.full.innerHTML = on ? I.exit : I.full;
        ui.full.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
    };

    const wake = () => {
        box.classList.remove('yt-box--idle');
        clearTimeout(state.hideTimer);
        state.hideTimer = setTimeout(() => { if (state.playing) box.classList.add('yt-box--idle'); }, 2800);
    };

    const onKey = (e) => {
        if (e.target === ui.seek && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
        const k = e.key.toLowerCase();
        if (k === 'escape') { if (!isFull()) { e.preventDefault(); close(); } return; }
        if (k === ' ' || k === 'k') { if (e.target.tagName !== 'BUTTON') { e.preventDefault(); togglePlay(); } return; }
        if (k === 'm') { e.preventDefault(); toggleMute(); return; }
        if (k === 'f') { e.preventDefault(); toggleFull(); return; }
        if (k === 'arrowdown' || k === 'arrowright' || k === 'n') { e.preventDefault(); step(1); return; }
        if (k === 'arrowup' || k === 'arrowleft' || k === 'p') { e.preventDefault(); step(-1); return; }
        if (k === 'tab') {
            const f = [...box.querySelectorAll('button, input')].filter((x) => !x.hidden);
            const i = f.indexOf(document.activeElement);
            if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        }
    };

    /** The videos to move through: the opened one's grid, in page order. */
    const listFor = (btn) => {
        const scope = btn.closest('.video-grid') || document;
        return [...scope.querySelectorAll('[data-yt-id]')];
    };

    const paintNav = () => {
        const n = state.list.length;
        ui.nav.hidden = n < 2;
        ui.count.textContent = `${state.index + 1} / ${n}`;
        ui.prev.disabled = state.index <= 0;
        ui.next.disabled = state.index >= n - 1;
    };

    /** Move to the next (+1) or previous (-1) video; full screen stays on. */
    const step = (dir) => {
        if (!box || box.hidden) return;
        const i = state.index + dir;
        if (i < 0 || i >= state.list.length) { bump(dir > 0 ? I.next : I.prev); return; }
        state.index = i;
        state.opener = state.list[i];
        load(state.list[i]);
        bump(dir > 0 ? I.next : I.prev);
    };

    /** When a clip finishes, roll on to the next one (stop after the last). */
    const ended = () => {
        if (state.endedAt && Date.now() - state.endedAt < 2000) return;
        state.endedAt = Date.now();
        if (state.index < state.list.length - 1) step(1);
    };

    /** Put one video in the player (the box is already open). */
    const load = (btn) => {
        const id = btn.dataset.ytId;
        if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
        clearTimeout(state.autoTimer);
        // Every video starts muted (autoplay always works, phone and desktop) with
        // a "Tap to unmute" button; once the visitor turns sound on, the next
        // videos keep their sound.
        const wantSound = state.soundOn === true;
        state = { ...state, playing: false, time: 0, duration: 0, lastTap: 0, started: false };
        box.dataset.format = btn.dataset.ytFormat || 'portrait';
        ui.title.textContent = btn.dataset.ytTitle || '';
        box.setAttribute('aria-label', btn.dataset.ytTitle || 'Video');
        ui.time.textContent = '0:00'; ui.dur.textContent = '0:00'; ui.seek.value = '0';
        const params = new URLSearchParams({
            autoplay: '1', playsinline: '1', enablejsapi: '1', controls: '0', fs: '0', rel: '0',
            modestbranding: '1', iv_load_policy: '3', disablekb: '1', origin: location.origin,
            mute: wantSound ? '0' : '1',
        });
        frame = document.createElement('iframe');
        frame.className = 'yt-box__frame';
        frame.src = `${ORIGIN}/embed/${id}?${params}`;
        frame.title = btn.dataset.ytTitle || 'Video';
        frame.allow = 'autoplay; encrypted-media; picture-in-picture';
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.tabIndex = -1;
        const me = frame;
        // Once loaded, ask the player to report its state to us.
        frame.addEventListener('load', () => {
            if (frame !== me) return;
            frame.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), ORIGIN);
            send('addEventListener', ['onStateChange']);
            send(wantSound ? 'unMute' : 'mute');
            // Phones block autoplay with sound in an embed: if it has not
            // started shortly after loading, start it muted and offer sound.
            let tries = 0;
            const kick = () => {
                if (frame !== me || state.started || tries++ > 8) return;
                if (tries > 1) { // sound was blocked: fall back to a muted start
                    setMuted(true);
                    send('mute');
                }
                send('playVideo');
                state.autoTimer = setTimeout(kick, 1000);
            };
            state.autoTimer = setTimeout(kick, 900);
        });
        ui.video.replaceChildren(frame);
        setPlaying(true); setMuted(!wantSound); paintNav();
        wake();
    };

    const open = (btn) => {
        if (!box) build();
        if (!/^[A-Za-z0-9_-]{11}$/.test(btn.dataset.ytId || '')) return;
        state.list = listFor(btn);
        state.index = Math.max(0, state.list.indexOf(btn));
        state.opener = btn;
        load(btn);
        paintFull();
        // One history step for the whole viewing session (next/previous add none).
        if (!state.pushed) {
            history.pushState({ ...(history.state || {}), ytBox: true }, '');
            state.pushed = true;
        }
        box.hidden = false;
        document.documentElement.classList.add('has-yt-box');
        requestAnimationFrame(() => box.classList.add('yt-box--open'));
        ui.close.focus({ preventScroll: true });
        // Open straight into full screen: the tap that opened us is the gesture browsers need.
        const req = box.requestFullscreen || box.webkitRequestFullscreen;
        if (req && window.matchMedia('(max-width: 900px), (pointer: coarse)').matches) {
            Promise.resolve(req.call(box)).catch(() => {});
        }
    };

    /** Hide the player and return to the page (no history change). */
    const shut = () => {
        if (!box || box.hidden) return;
        if (isFull()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        box.classList.remove('yt-box--open');
        clearTimeout(state.autoTimer);
        ui.video.replaceChildren();
        frame = null;
        box.hidden = true;
        document.documentElement.classList.remove('has-yt-box');
        state.pushed = false;
        if (state.opener) { state.opener.focus({ preventScroll: true }); state.opener.scrollIntoView({ block: 'nearest' }); }
    };

    /**
     * Close from ✕ / Esc. Opening added one history step (so the phone's
     * Back button closes the video instead of leaving the site); take that
     * step back off so the next Back behaves normally.
     */
    const close = () => {
        if (!box || box.hidden) return;
        if (state.pushed && history.state && history.state.ytBox) {
            history.back(); // popstate below does the closing
        } else {
            shut();
        }
    };

    const init = () => {
        // Back button / back swipe while a video is open: close the video, stay on the page.
        window.addEventListener('popstate', () => { if (box && !box.hidden) shut(); });
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-yt-id]');
            if (btn) { e.preventDefault(); open(btn); }
        });
    };

    return { init, open, close };
})();

document.addEventListener('DOMContentLoaded', () => FK.ytLightbox.init());
