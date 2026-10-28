(function () {
  "use strict";

  var books = [
    {
      title: "The Sentient Tim",
      cover: "assets/images/sentient-tm.png",
      href: "https://www.amazon.com/dp/B0C2ZPTV1R",
      description: "The sentient being Tim was discovered and poses a greater threat man could imagine. We needed to find ways to disarm it."
    },
    {
      title: "Jupiter Earth",
      cover: "assets/images/jupiter-earth.png",
      href: "https://www.amazon.com/dp/B0C33VL347",
      description: "The JupiterSun project was a big success, we managed to turn Jupiter into a mighty gas fireball and colonize Europa before our sun draws its last breath."
    },
    {
      title: "The Dark WEB",
      cover: "assets/images/the-dark-web.png",
      href: "https://www.amazon.com/dp/B0C37JDWHM",
      description: "The Europa project to resettle humans from earth was crawling slowly to a halt, With only a few years before the sun extinguishes, the race against time is on again."
    },
    {
      title: "Blue the Rock",
      cover: "assets/images/blue-the-ancient-rock.png",
      href: "https://www.amazon.com/dp/B0BZNBNJR1",
      description: "It is the year 2186, and earth has detected a rock heading for earth. With 2 failed missions Dave has been assigned to deflect this rock and save earth from extinction."
    },
    {
      title: "Death of a Star",
      cover: "assets/images/death-of-a-star.png",
      href: "https://www.amazon.com/dp/B0BZNKGJT9",
      description: "All the rejoicing on earth was short lived, Blue had its sight on the magnetic sunspots of the Sun attaining light speed."
    },
    {
      title: "Nantolite",
      cover: "assets/images/nantolite.png",
      href: "https://www.amazon.com/dp/B0BZX15LTB",
      description: "Work on the Lightspeed project has led to many new discoveries including the much heralded discovery of the magical material called Nantolite"
    },
    {
      title: "Planet Seracuse",
      cover: "assets/images/planet-seracuse.png",
      href: "https://www.amazon.com/dp/B0BZT8J45F",
      description: "All the eyes of the world were on Dave Chalice. Earth had less than fifty years before the sun extinguishes its final breath"
    },
    {
      title: "Seracuse Island",
      cover: "assets/images/seracuse-island.png",
      href: "https://www.amazon.com/dp/B0C17M43ZQ",
      description: "It\u2019s a race against time to harness lightspeed and rehouse the people of the planet to one of the goldilocks planet"
    },
    {
      title: "Enlightenment",
      cover: "assets/images/enlightenment.png",
      href: "https://www.amazon.com/dp/B0C17RHYK1",
      description: "The planet Gideon has been asleep for over 200 million years. A rogue AI entity has evolved over centuries and poses a major threat to the human species"
    },
    {
      title: "Planet Blue",
      cover: "assets/images/planet-blue.png",
      href: "https://www.amazon.com/dp/B0C17PGWTL",
      description: "We had the answers to the origin of Blue the Rock. It holds a deep secret that nobody on earth could have imagined."
    },
    {
      title: "Singularity and Mindscape",
      cover: "assets/images/singularity.png",
      href: "https://www.amazon.com/dp/B0C18TMJKG",
      description: "Earth had twenty years before the great fireball extinguishes. We were desperate to find a solution to the continued existence of human evolution."
    },
    {
      title: "Multiverse Timeline",
      cover: "assets/images/multiverse.png",
      href: "https://www.amazon.com/dp/B0C18TMJKG",
      description: "Having met the originators of Blue, we were determined to work towards the demise of the human race."
    }
  ];

  var poems = [
    {
      title: "A woody heart",
      image: "assets/images/535.jpg",
      audio: "assets/audio/A-Woody-Heart-Original-Poem-Song-by-Ferdouse.mp3",
      href: "https://allpoetry.com/poem/17011535-A-woody-heart-by-Ferdouse",
      snippet: "I have a wooden heart For my lover knows this"
    },
    {
      title: "Awoken",
      image: "assets/images/237.jpg",
      audio: "assets/audio/Awoken-Original-Inspirational-Poem-Song-by-Ferdouse.mp3",
      href: "https://allpoetry.com/poem/16994237-Awoken-by-Ferdouse",
      snippet: "Who is to say it could not have worked out?"
    },
    {
      title: "A face covered",
      image: "assets/images/740.jpg",
      audio: "assets/audio/A-Face-Covered-Original-Poem-Song-by-Ferdouse.mp3",
      href: "https://allpoetry.com/poem/17008740-A-face-covered-by-Ferdouse",
      snippet: "I have a wooden heart For my lover knows"
    },
    {
      title: "Life takes a turn",
      image: "assets/images/754.jpg",
      audio: "assets/audio/Life-Takes-a-Turn.mp3",
      href: "https://allpoetry.com/poem/17443754-Life-takes-a-turn-by-Ferdouse",
      snippet: "Life churns and burns We choose not to turn"
    }
  ];

  var playlist = [
    {
      title: "Landscape Paint by Number | Paintology Time Lapse Art",
      id: "uK5Z--UKtsc"
    },
    {
      title: "32-Inch Sunset Landscape Painting | Acrylic Painting Time Lapse",
      id: "zK8PohmTjg8"
    },
    {
      title: "Blue, the Ancient Rock | Official Sci-Fi Book Trailer",
      id: "kj8yzkY1c98"
    },
    {
      title: "You Are So Near | Original Inspirational Poem & Song by Ferdouse",
      id: "F8v-a2iLH5I"
    },
    {
      title: "32-Inch Sunset Landscape Painting | Acrylic Painting Time Lapse",
      id: "zK8PohmTjg8"
    },
    {
      title: "Landscape Paint by Number | Paintology Time Lapse Art",
      id: "uK5Z--UKtsc"
    },
    {
      title: "Blue, the Ancient Rock | Official Sci-Fi Book Trailer",
      id: "kj8yzkY1c98"
    }
  ];

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setIcon(button, symbol) {
    var use = button.querySelector("use");
    if (use) use.setAttribute("href", "#icon-" + symbol);
  }

  /* ------------------------------------------------------------------------
     Header
     ------------------------------------------------------------------------ */

  var header = document.getElementById("site-header");
  var menuToggle = document.querySelector(".menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var navTrigger = document.querySelector(".nav-trigger");
  var navItem = document.querySelector(".has-dropdown");

  function updateHeader() {
    if (!header) return;
    var threshold = window.innerWidth <= 1023 ? 300 : 200;
    header.classList.toggle("is-sticky", window.scrollY > threshold);
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  }

  function openMenu() {
    document.body.classList.add("menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close menu");
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (document.body.classList.contains("menu-open")) closeMenu();
      else openMenu();
    });
  }

  if (mobileMenu) {
    mobileMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    closeMenu();
    if (navItem) {
      navItem.classList.remove("is-open");
      if (navTrigger) navTrigger.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("resize", function () {
    updateHeader();
    if (window.innerWidth > 1023) closeMenu();
  });

  updateHeader();

  let headerTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (headerTicking) return;
      headerTicking = true;
      window.requestAnimationFrame(function () {
        updateHeader();
        headerTicking = false;
      });
    },
    { passive: true }
  );

  if (navItem && navTrigger) {
    function setDropdown(open) {
      navItem.classList.toggle("is-open", open);
      navTrigger.setAttribute("aria-expanded", String(open));
    }

    navItem.addEventListener("mouseenter", function () {
      if (window.innerWidth > 1023) setDropdown(true);
    });
    navItem.addEventListener("mouseleave", function () {
      if (!navItem.contains(document.activeElement)) setDropdown(false);
    });
    navItem.addEventListener("focusin", function () {
      if (window.innerWidth > 1023) setDropdown(true);
    });
    navItem.addEventListener("focusout", function (event) {
      if (!navItem.contains(event.relatedTarget)) setDropdown(false);
    });
  }

  /* ------------------------------------------------------------------------
     Books carousel
     ------------------------------------------------------------------------ */

  var track = document.getElementById("book-track");
  var carousel = document.querySelector("[data-carousel]");
  var dotsWrap = carousel ? carousel.querySelector(".carousel-dots") : null;
  var prevButton = carousel ? carousel.querySelector(".carousel-prev") : null;
  var nextButton = carousel ? carousel.querySelector(".carousel-next") : null;

  if (track) {
    var slidesMarkup = books
      .map(function (book, index) {
        return (
          '<article class="book-slide" role="group" aria-roledescription="slide" aria-label="' +
          (index + 1) +
          " of " +
          books.length +
          '">' +
          '<a href="' +
          book.href +
          '" target="_blank" rel="noopener">' +
          '<span class="book-cover"><img src="' +
          book.cover +
          '" alt="' +
          book.title +
          ' book cover" width="720" height="1024" loading="' +
          (index < 3 ? "eager" : "lazy") +
          '" decoding="async"></span>' +
          '<h3 class="book-title">' +
          book.title +
          "</h3>" +
          '<p class="book-desc">' +
          book.description +
          "</p>" +
          "</a></article>"
        );
      })
      .join("");

    track.innerHTML = slidesMarkup;

    var slides = Array.prototype.slice.call(track.children);
    var currentIndex = 0;
    var perView = 3;
    var maxIndex = Math.max(0, slides.length - perView);
    var autoplayTimer = null;
    var isPaused = false;
    var isVisible = true;

    function measure() {
      if (!slides.length) return { step: 0, perView: 1 };
      var first = slides[0];
      var trackStyle = window.getComputedStyle(track);
      var gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 40;
      var step = first.getBoundingClientRect().width + gap;
      var viewportWidth = track.parentElement.getBoundingClientRect().width;
      var localPerView = Math.max(1, Math.round((viewportWidth + gap) / step));
      return { step: step, perView: localPerView };
    }

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      for (var i = 0; i <= maxIndex; i++) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Go to book slide " + (i + 1));
        dot.setAttribute("aria-selected", String(i === currentIndex));
        dot.dataset.index = String(i);
        dotsWrap.appendChild(dot);
      }
    }

    function updateAria() {
      slides.forEach(function (slide, index) {
        var visible = index >= currentIndex && index < currentIndex + perView;
        slide.setAttribute("aria-hidden", String(!visible));
        var link = slide.querySelector("a");
        if (link) link.tabIndex = visible ? 0 : -1;
      });
    }

    function apply(animate) {
      var metrics = measure();
      perView = metrics.perView;
      var newMax = Math.max(0, slides.length - perView);
      if (newMax !== maxIndex) {
        maxIndex = newMax;
        renderDots();
      }
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      track.style.transition = animate && !reduceMotion.matches ? "" : "none";
      track.style.transform = "translate3d(" + -(currentIndex * metrics.step) + "px, 0, 0)";
      if (!animate) {
        // Force the next transform change to animate again.
        void track.offsetWidth;
        track.style.transition = "";
      }
      updateAria();
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (dot, index) {
          dot.setAttribute("aria-selected", String(index === currentIndex));
        });
      }
    }

    function goTo(index, animate) {
      var metrics = measure();
      perView = metrics.perView;
      maxIndex = Math.max(0, slides.length - perView);
      currentIndex = ((index % (maxIndex + 1)) + maxIndex + 1) % (maxIndex + 1);
      apply(animate !== false);
    }

    function next() {
      goTo(currentIndex + 1);
    }

    function prev() {
      goTo(currentIndex - 1);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (reduceMotion.matches || isPaused || !isVisible) return;
      autoplayTimer = window.setInterval(next, 5000);
    }

    function pauseTemporarily() {
      isPaused = true;
      stopAutoplay();
    }

    function resume() {
      isPaused = false;
      startAutoplay();
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        prev();
        startAutoplay();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        next();
        startAutoplay();
      });
    }

    if (dotsWrap) {
      dotsWrap.addEventListener("click", function (event) {
        var dot = event.target.closest("button[data-index]");
        if (!dot) return;
        goTo(Number(dot.dataset.index));
        startAutoplay();
      });
    }

    if (carousel) {
      carousel.addEventListener("mouseenter", pauseTemporarily);
      carousel.addEventListener("mouseleave", resume);
      carousel.addEventListener("focusin", pauseTemporarily);
      carousel.addEventListener("focusout", function (event) {
        if (!carousel.contains(event.relatedTarget)) resume();
      });
    }

    var pointerStartX = null;

    track.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerStartX = event.clientX;
    });

    track.addEventListener("pointerup", function (event) {
      if (pointerStartX === null) return;
      var delta = event.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(delta) < 40) return;
      if (delta < 0) next();
      else prev();
      startAutoplay();
    });

    track.addEventListener("pointercancel", function () {
      pointerStartX = null;
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          isVisible = entries[0].isIntersecting;
          if (isVisible) startAutoplay();
          else stopAutoplay();
        },
        { threshold: 0.15 }
      ).observe(carousel);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    var resizeFrame = null;
    window.addEventListener("resize", function () {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(function () {
        perView = measure().perView;
        maxIndex = Math.max(0, slides.length - perView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        renderDots();
        apply(false);
        startAutoplay();
        resizeFrame = null;
      });
    });

    renderDots();
    apply(false);
    startAutoplay();
  }

  /* ------------------------------------------------------------------------
     Poetry audio players
     ------------------------------------------------------------------------ */

  var poetryGrid = document.getElementById("poetry-grid");
  var players = [];

  if (poetryGrid) {
    poetryGrid.innerHTML = poems
      .map(function (poem, index) {
        return (
          '<article class="poem-card">' +
          '<a class="poem-media" href="' +
          poem.href +
          '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">' +
          '<img src="' +
          poem.image +
          '" alt="" width="500" height="500" loading="lazy" decoding="async">' +
          "</a>" +
          '<div class="audio-player" data-audio-player data-index="' +
          index +
          '">' +
          '<img class="audio-poster" src="' +
          poem.image +
          '" alt="" width="50" height="50" loading="lazy">' +
          '<div class="audio-controls">' +
          '<button class="audio-btn audio-prev" type="button" aria-label="Previous poem song"><svg aria-hidden="true"><use href="#icon-prev"></use></svg></button>' +
          '<button class="audio-btn audio-toggle" type="button" aria-label="Play ' +
          poem.title +
          '"><svg aria-hidden="true"><use href="#icon-play"></use></svg></button>' +
          '<button class="audio-btn audio-next" type="button" aria-label="Next poem song"><svg aria-hidden="true"><use href="#icon-next"></use></svg></button>' +
          "</div>" +
          '<div class="audio-extras">' +
          '<button class="audio-btn audio-mute" type="button" aria-label="Mute" aria-pressed="false"><svg aria-hidden="true"><use href="#icon-volume"></use></svg></button>' +
          '<button class="audio-btn audio-repeat" type="button" aria-label="Repeat" aria-pressed="false"><svg aria-hidden="true"><use href="#icon-repeat"></use></svg></button>' +
          "</div>" +
          '<button class="audio-progress" type="button" aria-label="Seek through ' +
          poem.title +
          '"><span class="audio-progress-fill"></span></button>' +
          '<audio preload="metadata" src="' +
          poem.audio +
          '"></audio>' +
          "</div>" +
          '<h4 class="poem-title"><a href="' +
          poem.href +
          '" target="_blank" rel="noopener">' +
          poem.title +
          "</a></h4>" +
          '<p class="poem-snippet">' +
          poem.snippet +
          "</p>" +
          '<a class="poem-link" href="' +
          poem.href +
          '" target="_blank" rel="noopener">Read Poem <svg aria-hidden="true"><use href="#icon-arrow-right"></use></svg></a>' +
          "</article>"
        );
      })
      .join("");

    players = Array.prototype.slice.call(poetryGrid.querySelectorAll("[data-audio-player]"));

    function pauseOthers(activePlayer) {
      players.forEach(function (player) {
        if (player === activePlayer) return;
        var audio = player.querySelector("audio");
        var toggle = player.querySelector(".audio-toggle");
        if (!audio.paused) audio.pause();
        if (toggle) {
          setIcon(toggle, "play");
          toggle.setAttribute(
            "aria-label",
            "Play " + poems[Number(player.dataset.index)].title
          );
        }
      });
    }

    function loadTrack(player, index) {
      var poem = poems[index];
      var audio = player.querySelector("audio");
      var poster = player.querySelector(".audio-poster");
      var toggle = player.querySelector(".audio-toggle");
      var progress = player.querySelector(".audio-progress");

      player.dataset.index = String(index);
      audio.src = poem.audio;
      poster.src = poem.image;
      if (toggle) toggle.setAttribute("aria-label", "Play " + poem.title);
      if (progress) progress.setAttribute("aria-label", "Seek through " + poem.title);
      player.querySelector(".audio-progress-fill").style.width = "0%";
      return audio;
    }

    players.forEach(function (player) {
      var audio = player.querySelector("audio");
      var toggle = player.querySelector(".audio-toggle");
      var muteButton = player.querySelector(".audio-mute");
      var repeatButton = player.querySelector(".audio-repeat");
      var progress = player.querySelector(".audio-progress");
      var fill = player.querySelector(".audio-progress-fill");

      function syncToggle() {
        var playing = !audio.paused && !audio.ended;
        setIcon(toggle, playing ? "pause" : "play");
        toggle.setAttribute(
          "aria-label",
          (playing ? "Pause " : "Play ") + poems[Number(player.dataset.index)].title
        );
      }

      toggle.addEventListener("click", function () {
        if (audio.paused || audio.ended) {
          pauseOthers(player);
          var attempt = audio.play();
          if (attempt && typeof attempt.catch === "function") attempt.catch(function () {});
        } else {
          audio.pause();
        }
      });

      audio.addEventListener("play", function () {
        pauseOthers(player);
        syncToggle();
      });
      audio.addEventListener("pause", syncToggle);
      audio.addEventListener("ended", function () {
        syncToggle();
        fill.style.width = "0%";
      });

      player.querySelector(".audio-prev").addEventListener("click", function () {
        var nextIndex = (Number(player.dataset.index) - 1 + poems.length) % poems.length;
        var nextAudio = loadTrack(player, nextIndex);
        pauseOthers(player);
        var attempt = nextAudio.play();
        if (attempt && typeof attempt.catch === "function") attempt.catch(function () {});
      });

      player.querySelector(".audio-next").addEventListener("click", function () {
        var nextIndex = (Number(player.dataset.index) + 1) % poems.length;
        var nextAudio = loadTrack(player, nextIndex);
        pauseOthers(player);
        var attempt = nextAudio.play();
        if (attempt && typeof attempt.catch === "function") attempt.catch(function () {});
      });

      muteButton.addEventListener("click", function () {
        var muted = !audio.muted && audio.volume !== 0;
        audio.muted = muted;
        setIcon(muteButton, muted ? "muted" : "volume");
        muteButton.setAttribute("aria-pressed", String(muted));
        muteButton.setAttribute("aria-label", muted ? "Unmute" : "Mute");
      });

      repeatButton.addEventListener("click", function () {
        audio.loop = !audio.loop;
        repeatButton.classList.toggle("is-active", audio.loop);
        repeatButton.setAttribute("aria-pressed", String(audio.loop));
      });

      audio.addEventListener("timeupdate", function () {
        if (!audio.duration || !isFinite(audio.duration)) return;
        fill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
      });

      audio.addEventListener("loadedmetadata", function () {
        fill.style.width = "0%";
      });

      progress.addEventListener("click", function (event) {
        if (!audio.duration || !isFinite(audio.duration)) return;
        var rect = progress.getBoundingClientRect();
        var ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        audio.currentTime = ratio * audio.duration;
        fill.style.width = ratio * 100 + "%";
      });

      syncToggle();
    });
  }

  /* ------------------------------------------------------------------------
     Music playlist
     ------------------------------------------------------------------------ */

  var playlistList = document.getElementById("playlist-list");
  var playlistRoot = document.getElementById("playlist");
  var musicCard = document.querySelector(".music-card");
  var playlistToggle = document.querySelector(".playlist-toggle");
  var musicFrame = document.getElementById("music-frame");

  if (playlistList) {
    playlistList.innerHTML = playlist
      .map(function (item, index) {
        return (
          '<button class="playlist-item' +
          (index === 0 ? " is-active" : "") +
          '" type="button" role="listitem" data-video="' +
          item.id +
          '"' +
          (index === 0 ? ' aria-current="true"' : "") +
          ">" +
          '<svg aria-hidden="true"><use href="#icon-play"></use></svg>' +
          "<span>" +
          item.title +
          "</span></button>"
        );
      })
      .join("");

    playlistList.addEventListener("click", function (event) {
      var item = event.target.closest(".playlist-item");
      if (!item || !musicFrame) return;
      Array.prototype.forEach.call(playlistList.children, function (button) {
        button.classList.toggle("is-active", button === item);
        if (button === item) button.setAttribute("aria-current", "true");
        else button.removeAttribute("aria-current");
      });
      musicFrame.src =
        "https://www.youtube-nocookie.com/embed/" +
        item.dataset.video +
        "?rel=0&modestbranding=1&playsinline=1&controls=1&autoplay=1";
      musicFrame.title = item.querySelector("span").textContent;
    });
  }

  if (playlistToggle) {
    playlistToggle.addEventListener("click", function () {
      var collapsed = !playlistRoot.classList.contains("is-collapsed");
      playlistRoot.classList.toggle("is-collapsed", collapsed);
      if (musicCard) musicCard.classList.toggle("is-list-collapsed", collapsed);
      playlistToggle.setAttribute("aria-expanded", String(!collapsed));
      playlistToggle.setAttribute(
        "aria-label",
        collapsed ? "Expand playlist" : "Collapse playlist"
      );
    });
  }

  /* ------------------------------------------------------------------------
     Newsletter forms
     ------------------------------------------------------------------------ */

  var forms = document.querySelectorAll("[data-newsletter-form]");

  Array.prototype.forEach.call(forms, function (form) {
    var nameField = form.querySelector('input[name="name"]');
    var emailField = form.querySelector('input[name="email"]');
    var robotField = form.querySelector('input[name="not-a-robot"]');
    var status = form.querySelector(".form-status");
    var isFooterForm = form.classList.contains("footer-form");

    function robotRequired() {
      // Source hides the footer CAPTCHA on phones while still reserving its space.
      return Boolean(robotField) && !(isFooterForm && window.matchMedia("(max-width: 767px)").matches);
    }

    function setStatus(message, isError) {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("is-error", Boolean(isError));
    }

    [nameField, emailField].forEach(function (field) {
      if (!field) return;
      field.addEventListener("input", function () {
        field.removeAttribute("aria-invalid");
        if (status && status.classList.contains("is-error")) setStatus("", false);
      });
    });

    if (robotField) {
      robotField.addEventListener("change", function () {
        if (status && status.classList.contains("is-error")) setStatus("", false);
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var invalid = false;
      if (!nameField.value.trim()) {
        nameField.setAttribute("aria-invalid", "true");
        invalid = true;
      }
      if (!emailField.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
        emailField.setAttribute("aria-invalid", "true");
        invalid = true;
      }
      if (robotRequired() && !robotField.checked) {
        invalid = true;
        setStatus("Please confirm you are not a robot.", true);
      }

      if (invalid) {
        if (!robotRequired() || robotField.checked) {
          setStatus("Please check your name and email address.", true);
        }
        if (!nameField.value.trim()) nameField.focus();
        else if (!emailField.value.trim()) emailField.focus();
        return;
      }

      var firstName = nameField.value.trim().split(/\s+/)[0];
      setStatus(
        "Thanks, " +
          firstName +
          "! Your free book request has been received. This demo form does not send data.",
        false
      );
      form.reset();
      if (robotField) robotField.checked = false;
    });
  });
})();
