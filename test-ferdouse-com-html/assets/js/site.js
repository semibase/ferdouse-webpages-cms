
    $(function () {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if ('IntersectionObserver' in window && !reducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        $('[data-reveal]').each((_, element) => revealObserver.observe(element));
      } else {
        $('[data-reveal]').addClass('is-visible');
      }
      $('.to-top').on('click', function () { $('html, body').animate({ scrollTop: 0 }, reducedMotion ? 0 : 500); });
      $(window).on('scroll', function () {
        $('.to-top').toggleClass('is-visible', $(window).scrollTop() > 360);
      });
      $('.site-nav .nav-link:not(.dropdown-toggle)').on('click', function () {
        const nav = document.getElementById('site-navigation');
        if (nav && nav.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(nav).hide();
        }
      });
      $('#newsletter-form').on('submit', function (event) {
        event.preventDefault();
        $('#newsletter-status').text('This static export is preview-only and not connected to a live newsletter service yet.').addClass('is-visible');
      });
    });
