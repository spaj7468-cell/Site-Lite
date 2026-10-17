/* Site-Lite — демо таймлайна: те же 7 каналов, что печатает экспортер */
(function () {
  "use strict";
  var box = document.getElementById("playBox");
  var scrub = document.getElementById("playScrub");
  var timeEl = document.getElementById("playTime");
  var btn = document.getElementById("playBtn");
  var ico = document.getElementById("playIco");
  if (!box || !scrub) return;

  var DUR = 4.0; // секунд
  /* ключи: t, x(0..1 по ширине сцены), scale, rot(град), opacity */
  var KEYS = [
    { t: 0.00, x: 0.04, s: 0.60, r: -12, o: 0.15 },
    { t: 0.25, x: 0.30, s: 1.00, r:   0, o: 1.00 },
    { t: 0.50, x: 0.52, s: 0.82, r:  24, o: 0.65 },
    { t: 0.75, x: 0.74, s: 1.12, r: -8, o: 1.00 },
    { t: 1.00, x: 0.96, s: 0.70, r:   0, o: 0.20 }
  ];

  /* easing out-quint — тот же, что "ease: out" в формате проекта */
  function easeOut(u) { return 1 - Math.pow(1 - u, 5); }
  function lerp(a, b, u) { return a + (b - a) * u; }

  function sample(t) {
    var i = 0;
    while (i < KEYS.length - 2 && t > KEYS[i + 1].t) i++;
    var a = KEYS[i], b = KEYS[i + 1];
    var u = (t - a.t) / (b.t - a.t || 1);
    u = easeOut(Math.min(1, Math.max(0, u)));
    return { x: lerp(a.x, b.x, u), s: lerp(a.s, b.s, u), r: lerp(a.r, b.r, u), o: lerp(a.o, b.o, u) };
  }

  function paint(t) {
    var stage = box.parentElement;
    var w = stage.clientWidth, bw = box.offsetWidth;
    var k = sample(t);
    var px = k.x * (w - bw);
    box.style.transform = "translateX(" + px.toFixed(1) + "px) scale(" + k.s.toFixed(3) + ") rotate(" + k.r.toFixed(1) + "deg)";
    box.style.opacity = k.o.toFixed(3);
    scrub.value = String(Math.round(t * 1000));
    if (timeEl) timeEl.textContent = (t * DUR).toFixed(2) + "s";
  }

  var playing = false, raf = 0, t0 = 0, tCur = 0;
  function setIcon() {
    if (ico) ico.setAttribute("d", playing ? "M6 5h4v14H6zM14 5h4v14h-4z" : "M8 5v14l11-7z");
    if (btn) btn.setAttribute("aria-pressed", playing ? "true" : "false");
  }
  function stop() { playing = false; cancelAnimationFrame(raf); setIcon(); }
  function tick(now) {
    if (!playing) return;
    var t = tCur + (now - t0) / 1000 / DUR;
    if (t >= 1) { t = 1; paint(t); tCur = 0; stop(); return; }
    paint(t);
    raf = requestAnimationFrame(tick);
  }
  if (btn) {
    btn.addEventListener("click", function () {
      var reduce = window.OuRiCore && window.OuRiCore.reduceMotion && window.OuRiCore.reduceMotion.matches;
      if (reduce) { paint(0.5); return; }
      if (playing) { tCur = Number(scrub.value) / 1000; stop(); return; }
      playing = true; t0 = performance.now(); tCur = Number(scrub.value) / 1000;
      if (tCur >= 0.999) tCur = 0;
      setIcon();
      raf = requestAnimationFrame(tick);
    });
  }
  scrub.addEventListener("input", function () { stop(); tCur = Number(scrub.value) / 1000; paint(tCur); });
  window.addEventListener("resize", function () { paint(Number(scrub.value) / 1000); });
  paint(0);
})();

/* сервис-воркер регистрируем отсюда, чтобы не плодить файлов */
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  });
}
