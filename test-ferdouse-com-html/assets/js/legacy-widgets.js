/**
 * Our own start-up code for three widgets in the migrated Elementor page
 * content (found 2026-10-19). The copied Elementor scripts build these from
 * lazy-loaded chunks that were never in the repo; they were being fetched from
 * the old WordPress site, which has since updated its plugins, so the chunks
 * 404 and the widgets stayed empty. Plain JS, reading the widgets' own
 * data-settings; no WordPress code.
 *
 *   .elementor-widget-video            YouTube player (youtube-nocookie)
 *   [data-settings*=background_video]  muted looping YouTube background
 *   .elementor-widget-n-carousel       Swiper carousel (Swiper lib already
 *                                      on the page, assets/legacy/.../swiper)
 */
'use strict';

(() => {
    const ytId = (url) => {
        const m = String(url || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
        return m ? m[1] : null;
    };
    const settingsOf = (el) => {
        try { return JSON.parse(el.dataset.settings || '{}'); } catch { return {}; }
    };

    // 1. Video widget
    document.querySelectorAll('.elementor-widget-video').forEach((w) => {
        const s = settingsOf(w);
        const id = s.video_type === 'youtube' ? ytId(s.youtube_url) : null;
        const slot = w.querySelector('.elementor-video');
        if (!id || !slot || slot.querySelector('iframe')) return;
        const params = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1', controls: s.controls === 'yes' ? '1' : '0' });
        const f = document.createElement('iframe');
        f.className = 'elementor-video-iframe';
        f.src = `https://www.youtube${s.yt_privacy === 'yes' ? '-nocookie' : ''}.com/embed/${id}?${params}`;
        f.title = 'YouTube video';
        f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        f.loading = 'lazy';
        f.referrerPolicy = 'strict-origin-when-cross-origin';
        slot.appendChild(f);
    });

    // 2. Background video (home hero)
    document.querySelectorAll('[data-settings*="background_video_link"]').forEach((sec) => {
        const s = settingsOf(sec);
        const id = ytId(s.background_video_link);
        const embed = sec.querySelector(':scope > .elementor-background-video-container > .elementor-background-video-embed, .elementor-background-video-container .elementor-background-video-embed');
        if (!id || !embed || embed.querySelector('iframe')) return;
        if (window.matchMedia('(max-width: 767px)').matches && s.background_play_on_mobile !== 'yes') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const params = new URLSearchParams({
            autoplay: '1', mute: '1', controls: '0', playsinline: '1', rel: '0', modestbranding: '1',
            iv_load_policy: '3', disablekb: '1', cc_load_policy: '0', enablejsapi: '1',
            origin: location.origin, start: String(s.background_video_start || 0),
            ...(s.background_play_once === 'yes' ? {} : { loop: '1', playlist: id }),
        });
        const f = document.createElement('iframe');
        f.src = `https://www.youtube-nocookie.com/embed/${id}?${params}`;
        f.title = 'Background video';
        f.allow = 'autoplay; encrypted-media';
        f.tabIndex = -1;
        f.setAttribute('aria-hidden', 'true');
        f.className = 'fk-bg-video';
        embed.appendChild(f);
        // No captions on a decorative background (some videos have them on by
        // default): ask the player, via the IFrame API, to unload them.
        f.addEventListener('load', () => {
            const say = (func, args = []) => f.contentWindow && f.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func, args }), 'https://www.youtube-nocookie.com');
            f.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), 'https://www.youtube-nocookie.com');
            let n = 0;
            const t = setInterval(() => { say('unloadModule', ['captions']); say('unloadModule', ['cc']); if (++n > 8) clearInterval(t); }, 1000);
        });
        // cover the section at 16:9 whatever its shape
        const size = () => {
            const r = embed.parentElement.getBoundingClientRect();
            const w = Math.max(r.width, r.height * 16 / 9);
            f.style.width = `${w}px`;
            f.style.height = `${w * 9 / 16}px`;
        };
        size();
        window.addEventListener('resize', size);
    });

    // 3. Nested carousel
    const initCarousels = () => {
        if (typeof window.Swiper !== 'function') return;
        document.querySelectorAll('.elementor-widget-n-carousel').forEach((w) => {
            const el = w.querySelector('.e-n-carousel.swiper');
            if (!el || el.classList.contains('swiper-initialized')) return;
            const s = settingsOf(w);
            const num = (v, d) => (v === '' || v == null || isNaN(+v) ? d : +v);
            const desktop = num(s.slides_to_show, 3);
            const tablet = num(s.slides_to_show_tablet, Math.min(desktop, 2));
            const mobile = num(s.slides_to_show_mobile, 1);
            const gap = (o, d) => num(o && o.size, d);
            const gapD = gap(s.image_spacing_custom, 10);
            const gapT = gap(s.image_spacing_custom_tablet, gapD);
            const gapM = gap(s.image_spacing_custom_mobile, gapT);
            const opts = {
                speed: num(s.speed, 500),
                loop: s.infinite === 'yes',
                slidesPerView: mobile,
                spaceBetween: gapM,
                breakpoints: {
                    768: { slidesPerView: tablet, spaceBetween: gapT },
                    1025: { slidesPerView: desktop, spaceBetween: gapD },
                },
                navigation: s.arrows === 'yes' ? {
                    prevEl: w.querySelector('.elementor-swiper-button-prev'),
                    nextEl: w.querySelector('.elementor-swiper-button-next'),
                } : undefined,
                pagination: s.pagination ? {
                    el: w.querySelector('.swiper-pagination'),
                    type: s.pagination,
                    clickable: true,
                } : undefined,
                autoplay: s.autoplay === 'yes' ? {
                    delay: num(s.autoplay_speed, 5000),
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                } : false,
                a11y: { enabled: true },
            };
            try {
                // eslint-disable-next-line no-new
                new window.Swiper(el, opts);
            } catch (err) {
                console.warn('[legacy-widgets] carousel init failed', err);
            }
        });
    };
    if (document.readyState === 'complete') initCarousels();
    else window.addEventListener('load', initCarousels);
})();
