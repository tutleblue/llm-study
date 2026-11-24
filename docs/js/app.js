/* llm-study — 터미널형 학습 앱. 외부 요청 없음, 진도는 localStorage. */
(function () {
  "use strict";
  var C = window.COURSE, S = window.Store;
  var app = document.getElementById("app"), tabbar = document.getElementById("tabbar");
  S.load();

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) { return /^https:\/\//i.test(u) ? u : "#"; }
  function inline(s) { // 이미 escape된 문자열에 인라인 서식 적용
    return s
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, function (m, t, u) {
        return '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + t + "</a>";
      });
  }
  function md(src) { // 아주 작은 마크다운: ###, -, >, ``` , 문단
    var lines = String(src).split("\n"), out = [], i = 0;
    while (i < lines.length) {
      var l = lines[i];
      if (/^```/.test(l)) {
        var buf = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) { buf.push(esc(lines[i])); i++; }
        out.push("<pre><code>" + buf.join("\n") + "</code></pre>"); i++; continue;
      }
      if (/^###\s/.test(l)) { out.push("<h3>" + inline(esc(l.replace(/^###\s/, ""))) + "</h3>"); i++; continue; }
      if (/^-\s/.test(l)) {
        var items = [];
        while (i < lines.length && /^-\s/.test(lines[i])) { items.push("<li>" + inline(esc(lines[i].replace(/^-\s/, ""))) + "</li>"); i++; }
        out.push("<ul>" + items.join("") + "</ul>"); continue;
      }
      if (/^>\s?/.test(l)) {
        var q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(inline(esc(lines[i].replace(/^>\s?/, "")))); i++; }
        out.push("<blockquote>" + q.join("<br>") + "</blockquote>"); continue;
      }
      if (!l.trim()) { i++; continue; }
      var p = [];
      while (i < lines.length && lines[i].trim() && !/^(```|###\s|-\s|>)/.test(lines[i])) { p.push(inline(esc(lines[i]))); i++; }
      out.push("<p>" + p.join("<br>") + "</p>");
    }
    return out.join("");
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function toast(msg) {
    var t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200);
  }
  function bar(done, total, width) {
    width = width || 10;
    var n = total ? Math.round(done / total * width) : 0;
    return '<span class="meter"><span class="on">' + "█".repeat(n) + '</span><span class="off">' + "░".repeat(width - n) + "</span></span>";
  }
  function titlebar(path) {
    var st = S.streak();
    return '<div class="titlebar"><span class="dots"><i></i><i></i><i></i></span><span class="path">' + esc(path) +
      '</span><span class="chip">🔥 ' + st + "일</span></div>";
  }
  function cmd(c) { return '<div class="cmd"><span class="ps">$</span> ' + esc(c) + "</div>"; }

  /* ---------- course index ---------- */
  var LESSONS = [], BYID = {}, CARDS = [];
  C.weeks.forEach(function (w) {
    if (!w.days) return;
    w.days.forEach(function (d, di) {
      d.lessons.forEach(function (l, li) {
        var full = { lesson: l, week: w, day: d, dayNo: di + 1, no: li + 1, path: w.id + "/day" + (di + 1) + "/" + String(li + 1).padStart(2, "0") };
        LESSONS.push(full); BYID[l.id] = full;
        (l.cards || []).forEach(function (c) { CARDS.push({ card: c, from: full }); });
      });
    });
  });
  function isDone(id) { return !!S.get().done[id]; }
  function isUnlocked(idx) { return idx === 0 || isDone(LESSONS[idx - 1].lesson.id); }
  function nextLessonIdx() {
    for (var i = 0; i < LESSONS.length; i++) if (!isDone(LESSONS[i].lesson.id)) return i;
    return -1;
  }
  function stepKey(lessonId, idx) { return lessonId + "#" + idx; }
  function isQuestion(st) { return st.type !== "learn"; }

  /* ---------- tabbar ---------- */
  var TABS = [["", "⌂", "learn"], ["review", "↻", "review"], ["cards", "▤", "cards"], ["stats", "▥", "stats"]];
  function renderTabs(cur) {
    var due = S.dueReviews().length;
    tabbar.innerHTML = '<div class="in">' + TABS.map(function (t) {
      var badge = t[0] === "review" && due ? '<span class="badge">' + due + "</span>" : "";
      return '<button data-go="#/' + t[0] + '" class="' + (cur === t[0] ? "on" : "") + '" aria-label="' + t[2] + '"><span class="ic">' + t[1] + "</span><span>" + t[2] + badge + "</span></button>";
    }).join("") + "</div>";
  }
  tabbar.addEventListener("click", function (e) {
    var b = e.target.closest("[data-go]"); if (b) location.hash = b.getAttribute("data-go");
  });

  /* ---------- home ---------- */
  function renderHome() {
    var s = S.get(), td = S.todayStat(), due = S.dueReviews().length, ni = nextLessonIdx();
    var goal = S.DAILY_GOAL, goalHit = td.lessons >= goal;
    var h = titlebar("~/llm-study");
    h += cmd("status");
    h += '<div class="out kv">' +
      '<span class="k">streak</span><span><span class="orange">🔥 ' + S.streak() + "일</span> 연속</span>" +
      '<span class="k">today</span><span>' + bar(Math.min(td.lessons, goal), goal, goal * 3) + " " + td.lessons + "/" + goal + " 레슨 · " + td.min + "분" + (goalHit ? ' <span class="green">✔ 목표 달성</span>' : "") + "</span>" +
      '<span class="k">xp</span><span class="yellow">' + s.xp + "</span>" +
      '<span class="k">review</span><span>' + (due ? '<button class="blue mono" data-go="#/review">' + due + "문제 대기 →</button>" : '<span class="dim">대기 없음</span>') + "</span>" +
      "</div>";

    if (ni >= 0) {
      var n = LESSONS[ni];
      h += '<button class="run' + (goalHit ? " done" : "") + '" data-lesson="' + esc(n.lesson.id) + '">' +
        '<div class="l1">' + (goalHit ? "# 오늘 목표는 채웠어요 · 더 하기" : "▶ 다음 레슨") + "</div>" +
        '<div class="l2">' + esc(n.lesson.title) + "</div>" +
        '<div class="l3">$ run ' + esc(n.path) + " · 약 " + (n.lesson.minutes || 8) + "분</div></button>";
    } else if (LESSONS.length) {
      h += '<div class="box"><div class="green mono">✔ 열린 레슨을 모두 끝냈어요.</div><div class="dim">다음 주차가 올라오면 여기 나타납니다. 그동안 review 탭에서 복습하세요.</div></div>';
    }

    h += cmd("tree course/");
    h += '<div class="tree">';
    C.weeks.forEach(function (w, wi) {
      var last = wi === C.weeks.length - 1;
      if (!w.days) {
        h += '<div class="row soon"><span class="pre">' + (last ? "└── " : "├── ") + '</span><span class="st dim">   </span><span class="nm">' + esc(w.id) + "/ " + esc(w.title) + "<small>준비 중</small></span></div>";
        return;
      }
      var ls = LESSONS.filter(function (x) { return x.week === w; });
      var dn = ls.filter(function (x) { return isDone(x.lesson.id); }).length;
      var open = w.id in s.open ? s.open[w.id] : (ni >= 0 && LESSONS[ni].week === w); // 지금 공부할 주차는 기본으로 펼침
      h += '<button class="row week" data-week="' + w.id + '" aria-expanded="' + !!open + '"><span class="pre">' + (last ? "└── " : "├── ") + '</span><span class="st blue">' + (open ? "▾" : "▸") + '</span><span class="nm">' + esc(w.id) + "/ " + esc(w.title) +
        "<small>" + bar(dn, ls.length, 10) + " " + dn + "/" + ls.length + "</small></span></button>";
      if (!open) return;
      var bar1 = last ? "   " : "│  ";
      w.days.forEach(function (d, di) {
        var lastD = di === w.days.length - 1;
        h += '<div class="row day"><span class="pre">' + bar1 + (lastD ? "└─ " : "├─ ") + '</span><span class="nm">day' + (di + 1) + "/ " + esc(d.title) + "</span></div>";
        var bar2 = bar1 + (lastD ? "   " : "│  ");
        d.lessons.forEach(function (l, li) {
          var idx = LESSONS.indexOf(BYID[l.id]);
          var done = isDone(l.id), un = isUnlocked(idx), nxt = idx === ni;
          var st = done ? '<span class="green">[✓]</span>' : nxt ? '<span class="green">[&gt;]</span>' : un ? "[ ]" : '<span class="dimmer">[·]</span>';
          var cls = "row lsn" + (nxt ? " next" : "") + (!un ? " locked" : "");
          h += '<button class="' + cls + '" data-lesson="' + esc(l.id) + '"><span class="pre">' + bar2 + (li === d.lessons.length - 1 ? "└─ " : "├─ ") + '</span><span class="st">' + st + '</span><span class="nm">' + esc(l.title) +
            (done ? "<small>정답률 " + Math.round(s.done[l.id].best * 100) + "% · 다시 하기</small>" : "") + "</span></button>";
        });
      });
    });
    h += "</div>";
    h += '<div class="cmd dim"><span class="ps">$</span> <span class="cursor"></span></div>';
    app.innerHTML = h;
  }
  app.addEventListener("click", function (e) {
    var go = e.target.closest("[data-go]"); if (go) { location.hash = go.getAttribute("data-go"); return; }
    var wk = e.target.closest("[data-week]");
    if (wk) { var s = S.get(), id = wk.getAttribute("data-week"); s.open[id] = wk.getAttribute("aria-expanded") !== "true"; S.save(); renderHome(); return; }
    var ls = e.target.closest("[data-lesson]");
    if (ls && !document.body.classList.contains("in-lesson")) {
      var id2 = ls.getAttribute("data-lesson"), idx = LESSONS.indexOf(BYID[id2]);
      if (idx < 0) return;
      if (!isUnlocked(idx)) { toast("앞 레슨을 먼저 끝내면 열려요"); return; }
      location.hash = "#/lesson/" + id2;
    }
  });

  /* ---------- player (lesson & review 공용) ---------- */
  var P = null; // 현재 진행 중인 세션
  function startLesson(id) {
    var f = BYID[id]; if (!f) { location.hash = "#/"; return; }
    var steps = f.lesson.steps.map(function (st, i) { return { st: st, key: stepKey(id, i) }; });
    P = { mode: "lesson", f: f, items: steps, queue: steps.map(function (_, i) { return i; }), pos: 0, resolved: 0,
      firstTry: {}, wrong: {}, t0: Date.now(), title: f.path };
    renderPlayer();
  }
  function startReview(keys, practice) {
    var items = keys.map(function (k) {
      var p = k.split("#"), f = BYID[p[0]]; if (!f) return null;
      var st = f.lesson.steps[+p[1]]; if (!st || !isQuestion(st)) return null;
      return { st: st, key: k, from: f };
    }).filter(Boolean);
    if (!items.length) { toast("복습할 문제가 없어요"); location.hash = "#/review"; return; }
    items = shuffle(items);
    P = { mode: practice ? "practice" : "review", items: items, queue: items.map(function (_, i) { return i; }), pos: 0, resolved: 0,
      firstTry: {}, wrong: {}, t0: Date.now(), title: practice ? "practice" : "review --due" };
    renderPlayer();
  }

  function renderPlayer() {
    document.body.classList.add("in-lesson");
    var it = P.items[P.queue[P.pos]], st = it.st;
    P.sel = null; P.order = []; P.checked = false;
    var total = P.items.length;
    var h = '<div class="lesson"><div class="lhead"><button class="x" data-act="quit" aria-label="나가기">✕</button>' +
      '<div class="pbar"><i id="pb"></i></div><span class="cnt">' + Math.min(P.resolved + 1, total) + "/" + total + "</span></div>";
    h += '<div class="lbody pop">';
    var fname = P.mode === "lesson" ? P.f.path : (it.from ? it.from.path : "");
    if (st.type === "learn") {
      h += cmd((st.try ? "try " : "cat ") + fname + (st.try ? "" : ".md"));
      h += '<div class="doc">' + md(st.md) + "</div>";
      if (st.src) h += srcHtml(st.src);
    } else {
      var label = { mcq: "? 고르기", ox: "? 맞으면 O, 틀리면 X", order: "? 순서대로 누르기" }[st.type] || "?";
      if (P.wrong[it.key]) label = "↻ 다시 풀기 — " + label;
      h += '<div class="qhead">' + (P.mode !== "lesson" && it.from ? esc(it.from.lesson.title) + " · " : "") + esc(label) + "</div>";
      h += '<p class="qtext">' + inline(esc(st.q)) + "</p>";
      if (st.code) h += '<div class="doc"><pre><code>' + esc(st.code) + "</code></pre></div>";
      h += '<div id="qarea"></div>';
    }
    h += '</div><div class="lfoot" id="foot"></div></div>';
    app.innerHTML = h;
    document.getElementById("pb").style.width = (P.resolved / total * 100) + "%";
    window.scrollTo(0, 0);
    if (st.type === "learn") footer('<button class="btn" data-act="next">계속 →</button>');
    else { drawQuestion(it); footer('<button class="btn" data-act="check" disabled>확인</button>'); }
  }
  function srcHtml(src) {
    var list = Array.isArray(src) ? src : [src];
    return '<div class="src">// 출처: ' + list.map(function (s) {
      return '<a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(s.name) + "</a>";
    }).join(" · ") + "</div>";
  }
  function footer(inner, cls) { var f = document.getElementById("foot"); f.className = "lfoot" + (cls ? " " + cls : ""); f.innerHTML = inner; }

  function drawQuestion(it) {
    var st = it.st, area = document.getElementById("qarea"), h = "";
    if (st.type === "mcq") {
      if (!it.perm) it.perm = shuffle(st.choices.map(function (_, i) { return i; }));
      h = '<div class="choices">' + it.perm.map(function (ci, n) {
        return '<button class="choice" data-ch="' + ci + '"><span class="n">[' + (n + 1) + "]</span><span>" + inline(esc(st.choices[ci])) + "</span></button>";
      }).join("") + "</div>";
    } else if (st.type === "ox") {
      h = '<div class="ox"><button class="choice" data-ch="1" aria-label="O 맞다">O</button><button class="choice" data-ch="0" aria-label="X 틀리다">X</button></div>';
    } else if (st.type === "order") {
      if (!it.perm) it.perm = shuffle(st.items.map(function (_, i) { return i; }));
      h = '<div class="order-picked" id="picked">' + (P.order.length ? P.order.map(function (ci) {
        return '<button class="choice" data-unpick="' + ci + '"><span class="n">' + (P.order.indexOf(ci) + 1) + ".</span><span>" + inline(esc(st.items[ci])) + "</span></button>";
      }).join("") : '<div class="ph">아래 항목을 순서대로 누르세요</div>') + "</div>";
      h += '<div class="choices">' + it.perm.filter(function (ci) { return P.order.indexOf(ci) < 0; }).map(function (ci) {
        return '<button class="choice" data-pick="' + ci + '"><span class="n">+</span><span>' + inline(esc(st.items[ci])) + "</span></button>";
      }).join("") + "</div>";
    }
    area.innerHTML = h;
    if (P.sel != null) { var b = area.querySelector('[data-ch="' + P.sel + '"]'); if (b) b.classList.add("sel"); }
  }

  function check() {
    var it = P.items[P.queue[P.pos]], st = it.st, ok;
    if (st.type === "mcq") ok = P.sel === st.answer;
    else if (st.type === "ox") ok = (P.sel === 1) === !!st.answer;
    else if (st.type === "order") ok = P.order.every(function (v, i) { return v === i; });
    P.checked = true;
    if (!(it.key in P.firstTry)) P.firstTry[it.key] = ok;
    var area = document.getElementById("qarea");
    area.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
    if (st.type !== "order") {
      var selB = area.querySelector('[data-ch="' + P.sel + '"]');
      if (selB) selB.classList.add(ok ? "ok" : "bad");
      if (!ok && st.type === "mcq") { var r = area.querySelector('[data-ch="' + st.answer + '"]'); if (r) r.classList.add("ok"); }
    }
    var exp = st.explain ? '<div class="fb-body">' + inline(esc(st.explain)) + "</div>" : "";
    var right = "";
    if (!ok && st.type === "order") right = '<div class="fb-body">정답 순서: ' + st.items.map(function (x, i) { return (i + 1) + ". " + esc(x); }).join(" → ") + "</div>";
    if (!ok && st.type === "ox") right = '<div class="fb-body">정답: ' + (st.answer ? "O" : "X") + "</div>";
    if (ok) {
      P.resolved++;
      footer('<div class="fb-title green">✔ PASS</div>' + exp + '<button class="btn" data-act="next">계속 →</button>', "pass");
    } else {
      P.wrong[it.key] = true;
      P.queue.push(P.queue[P.pos]); // 끝에 다시 나온다
      footer('<div class="fb-title red">✘ FAIL — 뒤에서 한 번 더 나와요</div>' + right + exp + '<button class="btn red" data-act="next">계속 →</button>', "fail");
    }
  }

  function next() {
    var it = P.items[P.queue[P.pos]];
    if (it.st.type === "learn") P.resolved++;
    P.pos++;
    if (P.pos >= P.queue.length) finish(); else renderPlayer();
  }

  function finish() {
    var keys = Object.keys(P.firstTry), right = keys.filter(function (k) { return P.firstTry[k]; }).length;
    var acc = keys.length ? right / keys.length : 1;
    var minutes = Math.max(1, Math.min(20, Math.round((Date.now() - P.t0) / 60000)));
    var before = S.streak(), xp, newCards = [];
    if (P.mode === "lesson") {
      xp = 10 + (acc === 1 ? 5 : 0);
      var had = S.get().cards.slice();
      var cardIds = (P.f.lesson.cards || []).map(function (c) { return c.id; });
      newCards = (P.f.lesson.cards || []).filter(function (c) { return had.indexOf(c.id) < 0; });
      S.finishLesson(P.f.lesson.id, acc, xp, minutes, Object.keys(P.wrong), cardIds);
    } else {
      xp = right * 2;
      var res = {};
      if (P.mode === "review") keys.forEach(function (k) { res[k] = P.firstTry[k]; });
      S.finishReview(res, xp, minutes);
    }
    var after = S.streak(), td = S.todayStat();
    var h = '<div class="lesson"><div class="lbody pop">';
    h += cmd((P.mode === "lesson" ? "run " : "") + P.title);
    h += '<div class="out"><div class="green">✔ ' + (P.mode === "lesson" ? "lesson complete" : "review complete") + '</div><div class="dim">exit code 0</div></div>';
    h += '<div class="grid2">' +
      '<div class="box"><h4>xp</h4><div class="big yellow">+' + xp + "</div></div>" +
      '<div class="box"><h4>정답률(첫 시도)</h4><div class="big">' + Math.round(acc * 100) + "%</div></div>" +
      '<div class="box"><h4>streak</h4><div class="big orange">🔥 ' + after + "</div>" + (after > before ? '<div class="green mono">+1일!</div>' : "") + "</div>" +
      '<div class="box"><h4>오늘</h4><div class="big">' + td.lessons + "/" + S.DAILY_GOAL + '</div><div class="dim mono">' + td.min + "분</div></div></div>";
    if (Object.keys(P.wrong).length && P.mode === "lesson") h += '<div class="box"><span class="blue mono">↻</span> 틀린 ' + Object.keys(P.wrong).length + "문제는 내일 review에 다시 나옵니다.</div>";
    newCards.forEach(function (c) { h += cardHtml(c, true); });
    if (S.saveFailed()) h += '<div class="box red">⚠ 이 브라우저에 진도를 저장하지 못했습니다(비공개 모드이거나 저장 공간이 꽉 찼을 수 있음).</div>';
    h += "</div><div class=\"lfoot\">";
    var ni = nextLessonIdx();
    if (P.mode === "lesson" && ni >= 0 && td.lessons < S.DAILY_GOAL) h += '<button class="btn" data-lesson-go="' + esc(LESSONS[ni].lesson.id) + '">다음 레슨 →</button><button class="btn ghost" data-go="#/">홈으로</button>';
    else h += '<button class="btn" data-go="#/">홈으로</button>';
    h += "</div></div>";
    P = null;
    app.innerHTML = h; window.scrollTo(0, 0);
  }

  app.addEventListener("click", function (e) {
    if (!P) {
      var lg = e.target.closest("[data-lesson-go]");
      if (lg) location.hash = "#/lesson/" + lg.getAttribute("data-lesson-go");
      return;
    }
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = P.items[P.queue[P.pos]];
    var act = b.getAttribute("data-act");
    if (act === "quit") { if (confirm("레슨을 그만둘까요? 이번 진행은 저장되지 않아요.")) { P = null; location.hash = "#/"; } return; }
    if (act === "check") { check(); return; }
    if (act === "next") { next(); return; }
    if (P.checked) return;
    if (b.hasAttribute("data-ch")) {
      P.sel = +b.getAttribute("data-ch");
      document.querySelectorAll("#qarea [data-ch]").forEach(function (x) { x.classList.toggle("sel", x === b); });
      document.querySelector('[data-act="check"]').disabled = false;
    } else if (b.hasAttribute("data-pick")) {
      P.order.push(+b.getAttribute("data-pick")); drawQuestion(it);
      document.querySelector('[data-act="check"]').disabled = P.order.length !== it.st.items.length;
    } else if (b.hasAttribute("data-unpick")) {
      var v = +b.getAttribute("data-unpick"); P.order.splice(P.order.indexOf(v), 1); drawQuestion(it);
      document.querySelector('[data-act="check"]').disabled = true;
    }
  });

  /* ---------- review ---------- */
  function renderReview() {
    var due = S.dueReviews(), all = Object.keys(S.get().review);
    var h = titlebar("~/llm-study/review") + cmd("review --due");
    if (due.length) {
      var groups = {};
      due.forEach(function (k) { var id = k.split("#")[0]; groups[id] = (groups[id] || 0) + 1; });
      h += '<div class="out">' + Object.keys(groups).map(function (id) {
        return '<div><span class="blue">' + (BYID[id] ? esc(BYID[id].path) : esc(id)) + "</span> " + (BYID[id] ? esc(BYID[id].lesson.title) : "") + ' <span class="dim">×' + groups[id] + "</span></div>";
      }).join("") + "</div>";
      h += '<button class="run" data-act-review="due"><div class="l1">▶ 지금 복습</div><div class="l2">' + due.length + '문제</div><div class="l3">맞히면 다음 복습까지 간격이 1→2→4→7→15일로 늘어나요</div></button>';
    } else {
      h += '<div class="empty">오늘 복습할 문제가 없습니다. ✔</div>';
      if (all.length) h += '<div class="out dim">대기 중 ' + all.length + "문제 · 다음 복습일 " + all.map(function (k) { return S.get().review[k].due; }).sort()[0] + "</div>";
    }
    var doneQ = [];
    Object.keys(S.get().done).forEach(function (id) {
      var f = BYID[id]; if (!f) return;
      f.lesson.steps.forEach(function (st, i) { if (isQuestion(st)) doneQ.push(stepKey(id, i)); });
    });
    h += cmd("practice --random 5");
    if (doneQ.length) h += '<button class="run done" data-act-review="practice"><div class="l1"># 끝낸 레슨에서 무작위 연습</div><div class="l2">5문제 연습하기</div><div class="l3">복습 일정에는 영향 없음 · 맞힌 문제당 +2xp</div></button>';
    else h += '<div class="empty">레슨을 하나 끝내면 연습할 수 있어요.</div>';
    app.innerHTML = h;
    app.querySelectorAll("[data-act-review]").forEach(function (b) {
      b.addEventListener("click", function () {
        var m = b.getAttribute("data-act-review");
        if (m === "due") startReview(S.dueReviews(), false);
        else startReview(shuffle(doneQ).slice(0, 5), true);
      });
    });
  }

  /* ---------- cards ---------- */
  function cardHtml(c, isNew) {
    return '<div class="card' + (isNew ? " pop" : "") + '"><div class="tag' + (c.kind === "core" ? " core" : "") + '">' + (isNew ? "★ 새 카드 · " : "") + (c.kind === "core" ? "# 핵심" : "# 바이브코딩 잡지식") + '</div><div class="t">' + esc(c.title) + '</div><div class="b doc">' + md(c.body) + "</div></div>";
  }
  function renderCards() {
    var got = S.get().cards;
    var h = titlebar("~/llm-study/cards") + cmd("ls cards/ | wc -l");
    h += '<div class="out">' + got.length + " / " + CARDS.length + " 장 모음</div>";
    if (!CARDS.length) h += '<div class="empty">아직 카드가 없어요.</div>';
    CARDS.forEach(function (x) {
      if (got.indexOf(x.card.id) >= 0) h += cardHtml(x.card);
      else h += '<div class="card locked"><div class="tag">🔒 ' + esc(x.from.path) + '</div><div class="t">???</div><div class="b dim">「' + esc(x.from.lesson.title) + "」 레슨을 끝내면 열려요</div></div>";
    });
    app.innerHTML = h;
  }

  /* ---------- stats ---------- */
  function renderStats() {
    var s = S.get(), doneIds = Object.keys(s.done).filter(function (id) { return BYID[id]; });
    var avg = doneIds.length ? doneIds.reduce(function (a, id) { return a + s.done[id].best; }, 0) / doneIds.length : 0;
    var totalMin = Object.keys(s.days).reduce(function (a, d) { return a + s.days[d].min; }, 0);
    var h = titlebar("~/llm-study/stats") + cmd("stats");
    h += '<div class="grid2">' +
      '<div class="box"><h4>연속 학습</h4><div class="big orange">🔥 ' + S.streak() + "일</div></div>" +
      '<div class="box"><h4>총 xp</h4><div class="big yellow">' + s.xp + "</div></div>" +
      '<div class="box"><h4>완료 레슨</h4><div class="big">' + doneIds.length + '<span class="dim mono"> / ' + LESSONS.length + "</span></div></div>" +
      '<div class="box"><h4>최고 정답률 평균</h4><div class="big">' + Math.round(avg * 100) + "%</div></div></div>";
    h += '<div class="box"><h4>총 학습 시간</h4><div class="mono">' + totalMin + "분</div></div>";

    // 최근 28일 히트맵 (월요일 시작 정렬)
    h += cmd("log --last 28d");
    var t = S.today(), start = S.addDays(t, -27);
    var p = start.split("-").map(Number), dow = (new Date(p[0], p[1] - 1, p[2]).getDay() + 6) % 7;
    h += '<div class="heat">' + ["월", "화", "수", "목", "금", "토", "일"].map(function (d) { return '<div class="dimmer">' + d + "</div>"; }).join("");
    for (var k = 0; k < dow; k++) h += "<div></div>";
    for (var i = 0; i < 28; i++) {
      var d = S.addDays(start, i), n = s.days[d] ? s.days[d].lessons + (s.days[d].rev ? 1 : 0) : 0;
      var lv = n >= 3 ? "l3" : n === 2 ? "l2" : n === 1 ? "l1" : "";
      h += '<div class="' + lv + (d === t ? " today" : "") + '" title="' + d + " · " + n + '레슨">' + +d.slice(8) + "</div>";
    }
    h += "</div>";

    h += cmd("progress --by-week");
    h += '<div class="out">' + C.weeks.filter(function (w) { return w.days; }).map(function (w) {
      var ls = LESSONS.filter(function (x) { return x.week === w; }), dn = ls.filter(function (x) { return isDone(x.lesson.id); }).length;
      return "<div>" + esc(w.id) + " " + bar(dn, ls.length, 12) + " " + dn + "/" + ls.length + "</div>";
    }).join("") + "</div>";

    h += cmd("backup --help");
    h += '<div class="out dim">진도는 이 기기의 브라우저에만 저장됩니다. 다른 기기로 옮기거나 브라우저 데이터를 지우기 전에 백업 코드를 복사해 두세요.</div>';
    h += '<div class="box"><button class="btn ghost" id="bk-export">백업 코드 만들기</button><textarea class="code" id="bk-out" readonly hidden aria-label="백업 코드"></textarea>' +
      '<button class="btn ghost" id="bk-show-import">백업 코드 붙여넣기</button><div id="bk-imp" hidden><textarea class="code" id="bk-in" aria-label="붙여넣을 백업 코드"></textarea><button class="btn" id="bk-apply">이 코드로 진도 덮어쓰기</button></div></div>';
    h += '<div class="box"><button class="btn ghost red" id="bk-reset">진도 모두 지우기</button></div>';
    h += '<div class="out dimmer">llm-study v' + esc(C.version) + "</div>";
    app.innerHTML = h;

    document.getElementById("bk-export").onclick = function () {
      var ta = document.getElementById("bk-out"); ta.hidden = false; ta.value = S.exportCode(); ta.select();
      if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(function () { toast("백업 코드를 복사했어요"); }, function () { toast("코드를 길게 눌러 복사하세요"); });
    };
    document.getElementById("bk-show-import").onclick = function () { document.getElementById("bk-imp").hidden = false; };
    document.getElementById("bk-apply").onclick = function () {
      var v = document.getElementById("bk-in").value; if (!v.trim()) return;
      if (!confirm("지금 기기의 진도를 이 백업으로 덮어쓸까요?")) return;
      try { S.importCode(v); toast("백업을 불러왔어요"); route(); } catch (e) { toast("코드가 올바르지 않아요"); }
    };
    document.getElementById("bk-reset").onclick = function () {
      if (confirm("모든 진도·XP·복습·카드를 지웁니다. 되돌릴 수 없어요. 계속할까요?")) { S.reset(); toast("초기화했어요"); route(); }
    };
  }

  /* ---------- router ---------- */
  function route() {
    var h = location.hash.replace(/^#\/?/, ""), parts = h.split("/");
    if (parts[0] !== "lesson") { document.body.classList.remove("in-lesson"); P = null; }
    if (parts[0] === "lesson" && parts[1]) {
      var idx = LESSONS.indexOf(BYID[parts[1]]);
      if (idx < 0 || !isUnlocked(idx)) { location.hash = "#/"; return; }
      startLesson(parts[1]); return;
    }
    var tab = ["review", "cards", "stats"].indexOf(parts[0]) >= 0 ? parts[0] : "";
    renderTabs(tab);
    window.scrollTo(0, 0);
    if (tab === "review") renderReview();
    else if (tab === "cards") renderCards();
    else if (tab === "stats") renderStats();
    else renderHome();
  }
  window.addEventListener("hashchange", route);
  route();
})();
