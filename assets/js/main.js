/* ==========================================================================
   季亦飞 · 服饰AIGC数据标注作品集  —  交互脚本（原生 JS，无依赖）
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. 顶部滚动进度 ---------- */
  var progress = $('#progress');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct.toFixed(2) + '%';

    var top = $('#totop');
    if (top) top.classList.toggle('is-on', h.scrollTop > 640);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 2. 移动端抽屉菜单 ---------- */
  var toggle = $('#navToggle'), drawer = $('#drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      drawer.classList.toggle('is-open', !open);
    });
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('is-open');
      });
    });
  }

  /* ---------- 3. 导航高亮（滚动监测） ---------- */
  var navLinks = $$('.nav__links a[href^="#"], .drawer a[href^="#"]');
  var sections = $$('main section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = null, bestVal = 0;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] > bestVal) { bestVal = visible[id]; best = id; }
      });
      navLinks.forEach(function (a) {
        a.classList.toggle('is-active', best !== null && a.getAttribute('href') === '#' + best);
      });
    }, { rootMargin: '-72px 0px -55% 0px', threshold: [0, .12, .3, .6, 1] });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 4. 滚动淡入 + 数字/进度条动效 ---------- */
  function animateNumber(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
    var start = null, dur = 1100;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function activate(el) {
    el.classList.add('is-in');
    $$('.kpi__num[data-count]').forEach(function (n) {
      if (el.contains(n)) animateNumber(n);
    });
    $$('.bar__fill[data-w]').forEach(function (b) {
      if (el.contains(b) || el === b) b.style.width = b.getAttribute('data-w');
    });
    if (el.matches('.kpi__num[data-count]')) animateNumber(el);
    if (el.matches('.bar__fill[data-w]')) el.style.width = el.getAttribute('data-w');
  }

  var revealables = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { activate(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    revealables.forEach(function (el) { io.observe(el); });
    // 兜底：任何原因未触发时 1.8s 后直接落位，避免元素停留在位移状态
    setTimeout(function () {
      revealables.forEach(function (el) {
        if (!el.classList.contains('is-in')) { activate(el); io.unobserve(el); }
      });
    }, 1800);
  } else {
    revealables.forEach(activate);
    $$('.kpi__num[data-count]').forEach(animateNumber);
    $$('.bar__fill[data-w]').forEach(function (b) { b.style.width = b.getAttribute('data-w'); });
  }

  /* ---------- 5. 案例切换（可访问 Tabs） ---------- */
  var tabs = $$('.tab');
  function selectTab(idx, focus) {
    tabs.forEach(function (t, i) {
      var on = i === idx;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
      if (on && focus) t.focus();
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(i); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); selectTab(n, true); }
    });
  });

  // 深链：支持 ?case=2 或 #case-2 直接打开指定案例
  (function () {
    if (!tabs.length) return;
    var m = /[?&]case=(\d+)/.exec(location.search);
    var h = /^#case-(\d+)$/.exec(location.hash);
    var idx = m ? parseInt(m[1], 10) - 1 : (h ? parseInt(h[1], 10) : -1);
    if (idx >= 0 && idx < tabs.length) {
      selectTab(idx);
      var known = /[?&]case=\d+/.test(location.search) || h;
      if (!known && window.history && history.replaceState) {
        history.replaceState(null, '', location.pathname + location.search);
      }
    }
  })();

  /* ---------- 6. 关键点图层显隐 ---------- */
  $$('[data-annot-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var layer = document.getElementById(btn.getAttribute('data-annot-toggle'));
      if (!layer) return;
      var off = layer.hasAttribute('hidden');
      if (off) layer.removeAttribute('hidden'); else layer.setAttribute('hidden', '');
      btn.setAttribute('aria-pressed', String(off));
      btn.textContent = off ? '隐藏关键点图层' : '显示关键点图层';
    });
  });

  /* ---------- 7. 判断题手风琴 ---------- */
  $$('.quiz__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.quiz__item');
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- 8. 复制联系方式 ---------- */
  $$('.contact__copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      var done = function () {
        var old = btn.textContent;
        btn.textContent = '已复制 ✓';
        btn.classList.add('is-done');
        setTimeout(function () { btn.textContent = old; btn.classList.remove('is-done'); }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext !== false) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else { fallback(text, done); }
    });
  });
  function fallback(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:absolute;left:-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* 忽略 */ }
    document.body.removeChild(ta);
  }

  /* ---------- 9. 回到顶部 / 打印 ---------- */
  var totop = $('#totop');
  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
  $$('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () { window.print(); });
  });

  /* ---------- 10. 页脚年份 ---------- */
  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
