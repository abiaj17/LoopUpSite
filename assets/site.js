(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower =
    (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) ||
    (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4);
  const enhancedMotion = !reducedMotion && !lowPower;
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.documentElement.classList.toggle('low-motion', !enhancedMotion);

  document.querySelectorAll('#year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const canVibrate = 'vibrate' in navigator && window.matchMedia('(pointer: coarse)').matches;
  const haptic = (pattern = [8]) => {
    if (canVibrate) navigator.vibrate(pattern);
  };

  document.querySelectorAll('button, .haptic-tap').forEach(el => {
    el.addEventListener('pointerup', () => haptic());
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') haptic([6]);
    });
  });

  const lenis = initLenis();
  initRevealFallback();
  initMobileNav();
  initShaderBackground();
  initGsapMotion();

  function initLenis() {
    if (!enhancedMotion || typeof window.Lenis === 'undefined') return null;

    const instance = new window.Lenis({
      duration: 1.05,
      easing: t => 1 - Math.pow(1 - t, 3),
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.15,
      syncTouch: false
    });

    if (typeof window.gsap !== 'undefined') {
      window.gsap.ticker.add(time => instance.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      let rafId = null;
      const raf = time => {
        instance.raf(time * 1000);
        rafId = window.requestAnimationFrame(raf);
      };
      rafId = window.requestAnimationFrame(raf);
      window.addEventListener('beforeunload', () => {
        if (rafId) window.cancelAnimationFrame(rafId);
      });
    }

    instance.on('scroll', () => {
      if (typeof window.ScrollTrigger !== 'undefined') window.ScrollTrigger.update();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) instance.stop();
      else instance.start();
    });

    return instance;
  }

  function initGsapMotion() {
    if (!enhancedMotion || typeof window.gsap === 'undefined') return;

    if (typeof window.ScrollTrigger !== 'undefined') {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    const hero = document.querySelector('.pastel-gradient-bg');
    if (!hero) return;

    const heroText = [
      hero.querySelector('.inline-flex'),
      hero.querySelector('h1'),
      hero.querySelector('p'),
      ...hero.querySelectorAll('button')
    ].filter(Boolean);

    window.gsap.from(heroText, {
      opacity: 0,
      y: 28,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.05
    });

    const heroShader = hero.querySelector('.hero-shader');
    if (heroShader) {
      window.gsap.to(heroShader, {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: enhancedMotion && typeof window.ScrollTrigger !== 'undefined'
          ? {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.65
            }
          : undefined
      });
    }

    const sections = Array.from(document.querySelectorAll('main > section')).filter(section => section !== hero);
    sections.forEach(section => {
      const title = section.querySelector('h2');
      const subtitle = section.querySelector('h3');
      const intro = section.querySelector('p');
      const cards = Array.from(section.querySelectorAll('.glass-card, .rounded-\\[40px\\], .rounded-\\[32px\\]'));
      const items = [title, subtitle, intro, ...cards].filter(Boolean);

      if (!items.length) return;

      window.gsap.from(items, {
        opacity: 0,
        y: 34,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: typeof window.ScrollTrigger !== 'undefined' ? {
          trigger: section,
          start: 'top 75%'
        } : undefined
      });
    });

    const motionTargets = Array.from(document.querySelectorAll('.glass-card, button, .playable-button'));
    motionTargets.forEach(target => {
      target.classList.add('js-motion-card');
      if (!hoverCapable) return;

      const hoverIn = () => {
        window.gsap.to(target, {
          y: -6,
          scale: 1.015,
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      const hoverOut = () => {
        window.gsap.to(target, {
          y: 0,
          scale: 1,
          duration: 0.26,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      target.addEventListener('mouseenter', hoverIn);
      target.addEventListener('mouseleave', hoverOut);
      target.addEventListener('focusin', hoverIn);
      target.addEventListener('focusout', hoverOut);
    });

    const accentButtons = document.querySelectorAll('.playable-button, header button, .glass-card button');
    accentButtons.forEach(button => {
      button.addEventListener('pointerdown', () => {
        window.gsap.to(button, { scale: 0.985, duration: 0.12, ease: 'power2.out' });
      });
      button.addEventListener('pointerup', () => {
        window.gsap.to(button, { scale: 1, duration: 0.18, ease: 'power2.out' });
      });
      button.addEventListener('pointerleave', () => {
        window.gsap.to(button, { scale: 1, duration: 0.18, ease: 'power2.out' });
      });
    });
  }

  function initShaderBackground() {
    const canvas = document.getElementById('shader-background');
    if (!canvas || reducedMotion) return;

    const hero = canvas.closest('section');
    if (!hero) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    });
    if (!gl) {
      canvas.style.display = 'none';
      return;
    }

    const vertexSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    const fragmentSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      const float overallSpeed = 0.17;
      const float gridSmoothWidth = 0.015;
      const float axisWidth = 0.05;
      const float majorLineWidth = 0.022;
      const float minorLineWidth = 0.011;
      const float majorLineFrequency = 5.0;
      const float minorLineFrequency = 1.0;
      const float scale = 5.0;
      const vec4 lineColor = vec4(0.76, 0.76, 0.93, 1.0);
      const float minLineWidth = 0.01;
      const float maxLineWidth = 0.17;
      const float lineSpeed = 1.0 * overallSpeed;
      const float lineAmplitude = 1.0;
      const float lineFrequency = 0.2;
      const float warpSpeed = 0.2 * overallSpeed;
      const float warpFrequency = 0.5;
      const float warpAmplitude = 1.0;
      const float offsetFrequency = 0.5;
      const float offsetSpeed = 1.33 * overallSpeed;
      const float minOffsetSpread = 0.55;
      const float maxOffsetSpread = 1.8;
      const int linesPerGroup = 12;

      #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
      #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
      #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
      #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

      float drawGridLines(float axis) {
        return drawCrispLine(0.0, axisWidth, axis)
              + drawPeriodicLine(majorLineFrequency, majorLineWidth, axis)
              + drawPeriodicLine(minorLineFrequency, minorLineWidth, axis);
      }

      float drawGrid(vec2 space) {
        return min(1.0, drawGridLines(space.x) + drawGridLines(space.y));
      }

      float random(float t) {
        return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
      }

      float getPlasmaY(float x, float horizontalFade, float offset) {
        return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
      }

      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec4 fragColor;
        vec2 uv = fragCoord.xy / iResolution.xy;
        vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

        float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
        float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

        space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
        space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

        vec4 lines = vec4(0.0);
        vec4 bgColor1 = vec4(0.03, 0.03, 0.08, 1.0);
        vec4 bgColor2 = vec4(0.12, 0.10, 0.22, 1.0);

        for(int l = 0; l < linesPerGroup; l++) {
          float normalizedLineIndex = float(l) / float(linesPerGroup);
          float offsetTime = iTime * offsetSpeed;
          float offsetPosition = float(l) + space.x * offsetFrequency;
          float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
          float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
          float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
          float linePosition = getPlasmaY(space.x, horizontalFade, offset);
          float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

          float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
          vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
          float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

          line = line + circle;
          lines += line * lineColor * rand;
        }

        fragColor = mix(bgColor1, bgColor2, uv.x);
        fragColor *= verticalFade;
        fragColor.a = 1.0;
        fragColor += lines;

        gl_FragColor = fragColor;
      }
    `;

    const program = createProgram(gl, vertexSource, fragmentSource);
    if (!program) {
      canvas.style.display = 'none';
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
         1.0,  1.0
      ]),
      gl.STATIC_DRAW
    );

    const programInfo = {
      program,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(program, 'aVertexPosition')
      },
      uniformLocations: {
        resolution: gl.getUniformLocation(program, 'iResolution'),
        time: gl.getUniformLocation(program, 'iTime')
      }
    };

    const state = {
      pixelRatio: Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.35),
      width: 0,
      height: 0,
      startTime: performance.now(),
      rafId: 0
    };

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.floor(rect.width * state.pixelRatio));
      const nextHeight = Math.max(1, Math.floor(rect.height * state.pixelRatio));
      if (nextWidth === state.width && nextHeight === state.height) return;

      state.width = nextWidth;
      state.height = nextHeight;
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      gl.viewport(0, 0, nextWidth, nextHeight);
    };

    const render = now => {
      state.rafId = window.requestAnimationFrame(render);

      if (document.hidden) return;

      const time = (now - state.startTime) / 1000;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(programInfo.program);
      gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
      gl.uniform1f(programInfo.uniformLocations.time, time);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', resize, { passive: true });

    resize();
    state.rafId = window.requestAnimationFrame(render);

    window.addEventListener('beforeunload', () => {
      if (state.rafId) window.cancelAnimationFrame(state.rafId);
      resizeObserver.disconnect();
    });
  }

  function initRevealFallback() {
    const reveals = document.querySelectorAll('.reveal, .reveal-stagger > *');
    if (!reveals.length) return;

    if (reducedMotion) {
      reveals.forEach(el => el.classList.add('in'));
      return;
    }

    if (typeof window.IntersectionObserver === 'undefined') {
      reveals.forEach(el => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => io.observe(el));
  }

  function initMobileNav() {
    const nav = document.getElementById('mobile-nav');
    const toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;

    const closeTargets = nav.querySelectorAll('[data-mobile-nav-close]');

    const open = () => {
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', open);
    closeTargets.forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) close();
    });
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
})();
