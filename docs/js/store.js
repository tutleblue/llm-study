/* 진도 저장소 — 이 기기의 localStorage에만 저장한다. 서버 전송 없음. */
(function () {
  "use strict";
  var KEY = "llmstudy.v1";
  var REVIEW_GAPS = [1, 2, 4, 7, 15]; // 복습 상자별 다음 복습까지 일수

  function blank() {
    return { v: 1, xp: 0, done: {}, days: {}, review: {}, cards: [], open: {} };
  }

  function today(d) {
    d = d || new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }
  function addDays(iso, n) {
    var p = iso.split("-").map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    d.setDate(d.getDate() + n);
    return today(d);
  }

  function isObj(x) { return x && typeof x === "object" && !Array.isArray(x); }

  // 저장된 값(또는 가져온 백업)을 검사해 안전한 형태로만 받아들인다.
  function sanitize(raw) {
    var s = blank();
    if (!isObj(raw)) return s;
    if (typeof raw.xp === "number" && isFinite(raw.xp) && raw.xp >= 0) s.xp = Math.floor(raw.xp);
    var idRe = /^[a-z0-9_-]{1,40}$/i, dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (isObj(raw.done)) Object.keys(raw.done).forEach(function (k) {
      var v = raw.done[k];
      if (idRe.test(k) && isObj(v)) s.done[k] = { at: String(v.at || "").slice(0, 10), acc: Number(v.acc) || 0, best: Number(v.best) || Number(v.acc) || 0 };
    });
    if (isObj(raw.days)) Object.keys(raw.days).forEach(function (k) {
      var v = raw.days[k];
      if (dateRe.test(k) && isObj(v)) s.days[k] = { xp: Math.max(0, Number(v.xp) || 0), lessons: Math.max(0, Number(v.lessons) || 0), rev: Math.max(0, Number(v.rev) || 0), min: Math.max(0, Number(v.min) || 0) };
    });
    if (isObj(raw.review)) Object.keys(raw.review).forEach(function (k) {
      var v = raw.review[k];
      if (/^[a-z0-9_-]{1,40}#\d{1,3}$/i.test(k) && isObj(v) && dateRe.test(v.due)) s.review[k] = { box: Math.min(REVIEW_GAPS.length, Math.max(0, v.box | 0)), due: v.due };
    });
    if (Array.isArray(raw.cards)) s.cards = raw.cards.filter(function (c) { return typeof c === "string" && idRe.test(c); }).slice(0, 2000);
    if (isObj(raw.open)) Object.keys(raw.open).forEach(function (k) { if (idRe.test(k)) s.open[k] = !!raw.open[k]; });
    return s;
  }

  var state;
  function load() {
    try { state = sanitize(JSON.parse(localStorage.getItem(KEY) || "null")); }
    catch (e) { state = blank(); }
    return state;
  }
  var saveFailed = false;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); saveFailed = false; return true; }
    catch (e) { saveFailed = true; return false; }
  }

  function streak() {
    var t = today(), n = 0, d = t;
    function active(x) { return state.days[x] && (state.days[x].lessons > 0 || state.days[x].rev > 0); } // 레슨이나 복습을 한 날
    if (!active(d)) d = addDays(t, -1); // 오늘 아직 안 했어도 어제까지 이어졌으면 유지
    while (active(d)) { n++; d = addDays(d, -1); }
    return n;
  }
  function todayStat() { return state.days[today()] || { xp: 0, lessons: 0, min: 0 }; }

  function dueReviews() {
    var t = today();
    return Object.keys(state.review).filter(function (k) { return state.review[k].due <= t; });
  }

  // 레슨 완료 기록. wrongKeys: 이번에 한 번이라도 틀린 문제들
  function finishLesson(lessonId, acc, xp, minutes, wrongKeys, cardIds) {
    var t = today();
    var prev = state.done[lessonId];
    state.done[lessonId] = { at: t, acc: acc, best: Math.max(acc, prev ? prev.best : 0) };
    state.xp += xp;
    var d = state.days[t] || { xp: 0, lessons: 0, min: 0 };
    d.xp += xp; d.lessons += 1; d.min += minutes;
    state.days[t] = d;
    wrongKeys.forEach(function (k) { state.review[k] = { box: 0, due: addDays(t, 1) }; });
    (cardIds || []).forEach(function (c) { if (state.cards.indexOf(c) < 0) state.cards.push(c); });
    save();
  }

  function finishReview(results, xp, minutes) { // results: {key: true/false}
    var t = today();
    Object.keys(results).forEach(function (k) {
      var r = state.review[k] || { box: 0, due: t };
      if (results[k]) {
        r.box += 1;
        if (r.box >= REVIEW_GAPS.length) { delete state.review[k]; return; } // 완전히 익힘
        r.due = addDays(t, REVIEW_GAPS[r.box]);
      } else { r.box = 0; r.due = addDays(t, 1); }
      state.review[k] = r;
    });
    state.xp += xp;
    var d = state.days[t] || { xp: 0, lessons: 0, min: 0 };
    d.xp += xp; d.min += minutes; d.rev = (d.rev || 0) + 1;
    state.days[t] = d;
    save();
  }

  function exportCode() {
    var json = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(json)));
  }
  function importCode(code) {
    var json = decodeURIComponent(escape(atob(String(code).trim())));
    var parsed = JSON.parse(json);
    if (!isObj(parsed) || parsed.v !== 1) throw new Error("형식이 맞지 않습니다");
    state = sanitize(parsed);
    save();
  }
  function reset() { state = blank(); save(); }

  window.Store = {
    load: load, save: save, get: function () { return state; }, today: today, addDays: addDays,
    streak: streak, todayStat: todayStat, dueReviews: dueReviews, finishLesson: finishLesson, finishReview: finishReview,
    exportCode: exportCode, importCode: importCode, reset: reset,
    saveFailed: function () { return saveFailed; }
  };
})();
