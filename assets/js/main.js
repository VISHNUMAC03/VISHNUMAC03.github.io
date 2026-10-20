(function () {
  "use strict";

  var D = window.PORTFOLIO;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 2200);
  }
  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve) {
      var ta = el("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      ta.remove(); resolve();
    });
  }
  function copyEmail() { copyText(D.email).then(function () { toast("Email copied: " + D.email); }); }
  function onVisible(target, cb, opts) {
    if (!("IntersectionObserver" in window)) { cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } });
    }, opts || { threshold: 0.25 });
    io.observe(target);
  }

  /* ---------------- theme ---------------- */
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    store("theme", t);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", t === "light" ? "#f5f7fb" : "#0a0e17");
    document.dispatchEvent(new Event("themechange"));
  }
  function toggleTheme() { setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light"); }
  $("#theme-btn").addEventListener("click", toggleTheme);

  /* ---------------- nav ---------------- */
  var nav = $("#nav"), bar = $("#progress-bar"), burger = $("#burger"), links = $("#nav-links");
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle("is-scrolled", y > 10);
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  function closeMenu() { links.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("#nav-links a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  if ("IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          $$("#nav-links a").forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { navIO.observe(s); });
  }

  /* ---------------- typed roles ---------------- */
  (function typed() {
    var out = $("#typed");
    if (reduceMotion) { out.textContent = D.roles[0]; return; }
    var i = 0, j = 0, deleting = false;
    function tick() {
      var word = D.roles[i];
      j += deleting ? -1 : 1;
      out.textContent = word.slice(0, j);
      var delay = deleting ? 38 : 75;
      if (!deleting && j === word.length) { deleting = true; delay = 1700; }
      else if (deleting && j === 0) { deleting = false; i = (i + 1) % D.roles.length; delay = 300; }
      setTimeout(tick, delay);
    }
    out.textContent = "";
    setTimeout(tick, 500);
  })();

  /* ---------------- hero canvas: a living data pipeline ---------------- */
  (function heroCanvas() {
    var c = $("#hero-canvas"), ctx = c.getContext("2d");
    var cols = [
      ["orders.csv", "customers.csv", "fx_rates API"],
      ["ingest.py", "s3://raw"],
      ["validate", "spark job", "rejects"],
      ["staging", "marts.fct_sales"],
      ["sql tests ✓", "dashboard"]
    ];
    var W, H, nodes = [], edges = [], parts = [], mouse = { x: -999, y: -999 }, colors = {}, visible = true, raf;
    function readColors() {
      var cs = getComputedStyle(document.documentElement);
      ["--accent", "--accent-2", "--accent-3", "--border", "--muted", "--surface"].forEach(function (k) { colors[k] = cs.getPropertyValue(k).trim(); });
    }
    function layout() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = c.clientWidth; H = c.clientHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = []; edges = [];
      var n = cols.length;
      cols.forEach(function (col, i) {
        col.forEach(function (label, j) {
          nodes.push({
            x: W * (0.05 + 0.9 * i / (n - 1)),
            y: H * (0.16 + 0.68 * (j + 0.5) / col.length) + (i % 2 ? 26 : -14),
            label: label, col: i, glow: 0
          });
        });
      });
      nodes.forEach(function (a) {
        var next = nodes.filter(function (b) { return b.col === a.col + 1; });
        if (!next.length) return;
        var k = nodes.filter(function (b) { return b.col === a.col; }).indexOf(a);
        edges.push([a, next[k % next.length]]);
        if (next.length > 1) edges.push([a, next[(k + 1) % next.length]]);
      });
      parts = [];
    }
    function pt(e, t) {
      var a = e[0], b = e[1], mx = (a.x + b.x) / 2;
      var u = 1 - t;
      return {
        x: u * u * u * a.x + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * b.x,
        y: u * u * u * a.y + 3 * u * u * t * a.y + 3 * u * t * t * b.y + t * t * t * b.y
      };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = colors["--border"];
      ctx.globalAlpha = 0.9;
      edges.forEach(function (e) {
        var a = e[0], b = e[1], mx = (a.x + b.x) / 2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.bezierCurveTo(mx, a.y, mx, b.y, b.x, b.y); ctx.stroke();
      });
      if (parts.length < (W < 700 ? 18 : 40) && Math.random() < 0.25) {
        parts.push({ e: edges[(Math.random() * edges.length) | 0], t: 0, s: 0.003 + Math.random() * 0.005, c: Math.random() < 0.7 ? "--accent" : (Math.random() < 0.5 ? "--accent-2" : "--accent-3") });
      }
      parts = parts.filter(function (p) {
        p.t += p.s;
        if (p.t >= 1) { p.e[1].glow = 1; return false; }
        var q = pt(p.e, p.t);
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = colors[p.c];
        ctx.shadowColor = colors[p.c]; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(q.x, q.y, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        return true;
      });
      ctx.font = "500 11px JetBrains Mono, monospace";
      nodes.forEach(function (nd) {
        var d = Math.hypot(nd.x - mouse.x, nd.y - mouse.y);
        nd.glow = Math.max(nd.glow * 0.94, d < 140 ? 1 - d / 140 : 0);
        var r = 6 + nd.glow * 3;
        ctx.globalAlpha = 0.55 + nd.glow * 0.45;
        ctx.fillStyle = colors["--surface"];
        ctx.strokeStyle = nd.glow > 0.05 ? colors["--accent"] : colors["--border"];
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (W >= 700) {
          ctx.globalAlpha = (nd.x < W * 0.5 ? 0.14 : 0.26) + nd.glow * 0.6;
          ctx.fillStyle = colors["--muted"];
          ctx.fillText(nd.label, nd.x + 12, nd.y + 4);
        }
      });
      ctx.globalAlpha = 1;
    }
    function loop() { draw(); if (visible && !document.hidden) raf = requestAnimationFrame(loop); }
    function restart() { cancelAnimationFrame(raf); if (reduceMotion) draw(); else loop(); }
    readColors(); layout();
    window.addEventListener("resize", function () { layout(); if (reduceMotion) draw(); });
    document.addEventListener("themechange", function () { readColors(); if (reduceMotion) draw(); });
    document.addEventListener("visibilitychange", restart);
    $(".hero").addEventListener("pointermove", function (e) { var r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    $(".hero").addEventListener("pointerleave", function () { mouse.x = mouse.y = -999; });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; restart(); }).observe(c);
    }
    restart();
  })();

  /* ---------------- marquee ---------------- */
  (function marquee() {
    var items = ["Python", "SQL", "Apache Spark", "AWS S3", "AWS Glue", "Athena", "Azure Data Factory", "Docker",
      "GitHub Actions", "pandas", "Star schema", "Data quality", "REST APIs", "Airflow", "Kafka", "Databricks"];
    var html = items.concat(items).map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("");
    $("#marquee").innerHTML = html;
  })();

  /* ---------------- about + stats ---------------- */
  $("#about-summary").textContent = D.summary;
  $("#looking-for").innerHTML = D.lookingFor.map(function (r) { return '<li class="chip">' + esc(r) + "</li>"; }).join("");
  $("#stats").innerHTML = D.stats.map(function (s) {
    return '<div class="card card--glow stat"><p class="stat__num grad" data-to="' + s.value + '" data-suffix="' + esc(s.suffix) + '">0' + esc(s.suffix) +
      '</p><p class="stat__label">' + esc(s.label) + "</p></div>";
  }).join("");
  onVisible($("#stats"), function () {
    $$(".stat__num").forEach(function (n) {
      var to = +n.dataset.to, suf = n.dataset.suffix, t0 = performance.now(), dur = reduceMotion ? 1 : 1400;
      (function step(now) {
        var k = Math.min(1, (now - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
        n.textContent = v + suf;
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  });

  /* ---------------- pipeline explorer ---------------- */
  (function pipeline() {
    var stagesEl = $("#pipe-stages"), panel = $("#pipe-panel"), cur = 0, timer = null, userTook = false;
    stagesEl.innerHTML = '<div class="pipe__flow" aria-hidden="true"><i></i><i style="animation-delay:-1.3s"></i><i style="animation-delay:-2.6s"></i></div>' +
      D.pipeline.map(function (s, i) {
        return '<button class="stage" role="tab" type="button" id="stage-' + s.id + '" aria-selected="false" data-i="' + i + '">' +
          '<span class="stage__icon" aria-hidden="true">' + s.icon + '</span><span class="stage__label">' + (i + 1) + ". " + esc(s.label) + "</span></button>";
      }).join("");
    function show(i) {
      cur = i;
      var s = D.pipeline[i];
      $$(".stage", stagesEl).forEach(function (b, k) { b.setAttribute("aria-selected", String(k === i)); });
      panel.setAttribute("aria-labelledby", "stage-" + s.id);
      panel.innerHTML = '<div class="fade-in"><p class="eyebrow">Stage ' + (i + 1) + " of " + D.pipeline.length + "</p><h3>" + esc(s.label) + "</h3><p>" + esc(s.text) + "</p></div>" +
        '<div class="fade-in"><p class="tools-title">Tools I use</p><ul class="chips">' + s.tools.map(function (t) { return '<li class="chip">' + esc(t) + "</li>"; }).join("") +
        '</ul><p class="tools-title" style="margin-top:18px">From my work</p><p class="example">' + esc(s.example) + "</p></div>";
    }
    function stop() { userTook = true; clearInterval(timer); }
    stagesEl.addEventListener("click", function (e) {
      var b = e.target.closest(".stage"); if (!b) return;
      stop(); show(+b.dataset.i);
    });
    stagesEl.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      stop();
      var n = (cur + (e.key === "ArrowRight" ? 1 : -1) + D.pipeline.length) % D.pipeline.length;
      show(n); $("#stage-" + D.pipeline[n].id).focus();
    });
    show(0);
    if (!reduceMotion) {
      onVisible(stagesEl, function () {
        if (userTook) return;
        timer = setInterval(function () { show((cur + 1) % D.pipeline.length); }, 4200);
      }, { threshold: 0.6 });
    }
  })();

  /* ---------------- skills ---------------- */
  (function skills() {
    var state = { cat: "all", q: "", levels: { production: true, projects: true, learning: true } };
    var grid = $("#skills-grid"), filters = $("#skill-filters"), legend = $("#skill-legend");
    legend.innerHTML = Object.keys(D.skillLevels).map(function (k) {
      var l = D.skillLevels[k];
      return '<button type="button" class="level-toggle lv-' + k + '" aria-pressed="true" data-level="' + k + '" title="' + esc(l.hint) + '"><span class="level-dot"></span>' + esc(l.label) + "</button>";
    }).join("");
    function matches(s) {
      if (!state.levels[s.level]) return false;
      if (!state.q) return true;
      var q = state.q.toLowerCase();
      return (s.name + " " + s.note + " " + D.skillCategories[s.cat]).toLowerCase().indexOf(q) !== -1;
    }
    function renderFilters() {
      var cats = ["all"].concat(Object.keys(D.skillCategories));
      filters.innerHTML = cats.map(function (c) {
        var n = D.skills.filter(function (s) { return (c === "all" || s.cat === c) && matches(s); }).length;
        var label = c === "all" ? "All" : D.skillCategories[c];
        return '<button type="button" class="filter' + (state.cat === c ? " is-active" : "") + '" data-cat="' + c + '" aria-pressed="' + (state.cat === c) + '">' + esc(label) + '<span class="count">' + n + "</span></button>";
      }).join("");
    }
    function render() {
      var list = D.skills.filter(function (s) { return (state.cat === "all" || s.cat === state.cat) && matches(s); });
      grid.innerHTML = list.map(function (s, i) {
        return '<div class="skill lv-' + s.level + '" style="animation-delay:' + Math.min(i * 18, 400) + 'ms"><div class="skill__top"><span class="skill__name">' + esc(s.name) +
          '</span><span class="skill__lvl">' + esc(D.skillLevels[s.level].label) + '</span></div><span class="skill__cat">' + esc(D.skillCategories[s.cat]) +
          '</span><p class="skill__note">' + esc(s.note) + "</p></div>";
      }).join("");
      $("#skills-empty").hidden = list.length > 0;
      renderFilters();
    }
    filters.addEventListener("click", function (e) { var b = e.target.closest(".filter"); if (!b) return; state.cat = b.dataset.cat; render(); });
    legend.addEventListener("click", function (e) {
      var b = e.target.closest(".level-toggle"); if (!b) return;
      var k = b.dataset.level;
      state.levels[k] = !state.levels[k];
      if (!Object.keys(state.levels).some(function (x) { return state.levels[x]; })) state.levels[k] = true;
      b.setAttribute("aria-pressed", String(state.levels[k]));
      render();
    });
    $("#skill-search").addEventListener("input", function (e) { state.q = e.target.value.trim(); render(); });
    render();
  })();

  /* ---------------- timeline ---------------- */
  (function timeline() {
    var tl = $("#timeline");
    function render(tab) {
      if (tab === "work") {
        tl.innerHTML = D.experience.map(function (x, i) {
          return '<li class="tl" style="animation-delay:' + i * 90 + 'ms"><div class="card card--glow"><div class="tl__head"><h3 class="tl__role">' + esc(x.role) + '</h3><span class="tl__date">' + esc(x.start) + " – " + esc(x.end) +
            '</span></div><p class="tl__org">' + esc(x.company) + " · " + esc(x.location) + '</p><ul class="bullets">' + x.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") +
            '</ul><ul class="chips">' + x.tags.map(function (t) { return '<li class="chip">' + esc(t) + "</li>"; }).join("") + "</ul></div></li>";
        }).join("");
      } else {
        tl.innerHTML = D.education.map(function (x, i) {
          return '<li class="tl" style="animation-delay:' + i * 90 + 'ms"><div class="card card--glow"><div class="tl__head"><h3 class="tl__role">' + esc(x.degree) + '</h3><span class="tl__date">' + esc(x.start) + " – " + esc(x.end) +
            '</span></div><p class="tl__org">' + esc(x.school) + " · " + esc(x.location) + '</p><p class="muted" style="margin:0">' + esc(x.detail) + "</p></div></li>";
        }).join("");
      }
    }
    $$(".tab").forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".tab").forEach(function (o) { o.classList.toggle("is-active", o === b); o.setAttribute("aria-selected", String(o === b)); });
        render(b.dataset.tab);
      });
    });
    render("work");
  })();

  /* ---------------- projects ---------------- */
  var modal = $("#project-modal");
  function openProject(id) {
    var p = D.projects.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var badge = p.status === "In progress" ? "badge--progress" : "badge--done";
    $("#modal-body").innerHTML =
      '<button class="icon-btn modal__close" type="button" aria-label="Close" data-close>✕</button>' +
      '<span class="badge ' + badge + '">' + esc(p.status) + "</span> <span class=\"badge\">" + esc(p.year) + "</span>" +
      '<h3 id="modal-title">' + esc(p.title) + '</h3><p class="muted">' + esc(p.summary) + "</p>" +
      '<h4>Data flow</h4><div class="flow">' + p.flow.map(function (f) { return "<span>" + esc(f) + "</span>"; }).join("<b>→</b>") + "</div>" +
      "<h4>The problem</h4><p class=\"muted\">" + esc(p.problem) + "</p>" +
      "<h4>What I built</h4><ul>" + p.built.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" +
      "<h4>Outcome</h4><p class=\"muted\">" + esc(p.outcome) + "</p>" +
      '<h4>Stack</h4><ul class="chips">' + p.stack.map(function (s) { return '<li class="chip">' + esc(s) + "</li>"; }).join("") + "</ul>" +
      (p.links.length ? '<div class="links">' + p.links.map(function (l) { return '<a class="btn btn--primary btn--small" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " ↗</a>"; }).join("") + "</div>" : "");
    if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
  }
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.closest("[data-close]")) modal.close();
  });
  (function projects() {
    var grid = $("#projects-grid"), filters = $("#project-filters"), cat = "all";
    function render() {
      filters.innerHTML = Object.keys(D.projectFilters).map(function (k) {
        var n = D.projects.filter(function (p) { return k === "all" || p.cats.indexOf(k) !== -1; }).length;
        return '<button type="button" class="filter' + (cat === k ? " is-active" : "") + '" data-cat="' + k + '" aria-pressed="' + (cat === k) + '">' + esc(D.projectFilters[k]) + '<span class="count">' + n + "</span></button>";
      }).join("");
      var list = D.projects.filter(function (p) { return cat === "all" || p.cats.indexOf(cat) !== -1; });
      grid.innerHTML = list.map(function (p, i) {
        var badge = p.status === "In progress" ? "badge--progress" : "badge--done";
        return '<article class="card card--glow project' + (p.featured ? " project--featured" : "") + '" data-id="' + p.id + '" style="animation-delay:' + i * 70 + 'ms">' +
          '<div class="project__top"><span class="badge ' + badge + '">' + esc(p.status) + "</span>" + (p.featured ? '<span class="badge badge--star">★ Featured</span>' : '<span class="badge">' + esc(p.year) + "</span>") + "</div>" +
          "<h3>" + esc(p.title) + "</h3><p>" + esc(p.summary) + "</p>" +
          '<div class="flow">' + p.flow.map(function (f) { return "<span>" + esc(f) + "</span>"; }).join("<b>→</b>") + "</div>" +
          '<button type="button" class="project__more" data-id="' + p.id + '" aria-label="Open case study: ' + esc(p.title) + '">Open case study →</button></article>';
      }).join("");
    }
    filters.addEventListener("click", function (e) { var b = e.target.closest(".filter"); if (!b) return; cat = b.dataset.cat; render(); });
    grid.addEventListener("click", function (e) { var b = e.target.closest(".project"); if (b) openProject(b.dataset.id); });
    render();
  })();

  /* ---------------- SQL playground ---------------- */
  (function playground() {
    var levelKey = { production: "work", projects: "projects", learning: "learning" };
    var TABLES = {
      skills: D.skills.map(function (s) { return { name: s.name, category: D.skillCategories[s.cat], level: levelKey[s.level], note: s.note }; }),
      projects: D.projects.map(function (p) { return { title: p.title, year: p.year, status: p.status, stack: p.stack.join(", ") }; }),
      experience: D.experience.map(function (x) { return { company: x.company, role: x.role, location: x.location, start: x.start, end: x.end }; }),
      education: D.education.map(function (x) { return { degree: x.degree, school: x.school, location: x.location, start: x.start, end: x.end }; }),
      awards: D.awards.map(function (a) { return { title: a.title, place: a.place, date: a.date }; }),
      languages: D.languages.map(function (l) { return { name: l.name, level: l.level }; })
    };
    var EXAMPLES = [
      "SELECT name, level FROM skills WHERE category = 'Cloud'",
      "SELECT level, COUNT(*) FROM skills GROUP BY level ORDER BY count DESC",
      "SELECT title, year, status FROM projects ORDER BY year DESC",
      "SELECT company, role, start, end FROM experience",
      "SELECT name, category FROM skills WHERE name LIKE '%spark%'",
      "hire"
    ];
    var out = $("#console-out"), input = $("#console-input"), hist = [], hi = 0;
    $("#sql-examples").innerHTML = EXAMPLES.map(function (q) { return '<button type="button" class="ex">' + esc(q) + "</button>"; }).join("");
    $("#sql-examples").addEventListener("click", function (e) {
      var b = e.target.closest(".ex"); if (!b) return;
      input.value = b.textContent; run(b.textContent);
    });

    function print(html, cls) { var p = el("div", "line " + (cls || ""), html); out.appendChild(p); out.scrollTop = out.scrollHeight; }
    function table(rows, cols) {
      if (!rows.length) { print("(0 rows)", "dim"); return; }
      var h = '<div class="table-wrap"><table><thead><tr>' + cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        rows.map(function (r) { return "<tr>" + cols.map(function (c) { return "<td>" + esc(r[c]) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
      print(h);
      print("(" + rows.length + " row" + (rows.length === 1 ? "" : "s") + ")", "dim");
    }
    function cmp(a, b) {
      var na = parseFloat(a), nb = parseFloat(b);
      if (!isNaN(na) && !isNaN(nb) && String(na) === String(a).trim() && String(nb) === String(b).trim()) return na - nb;
      return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
    }
    function sql(q) {
      var m = q.trim().replace(/;\s*$/, "").match(/^select\s+(distinct\s+)?(.+?)\s+from\s+([a-z_]+)(?:\s+where\s+(.+?))?(?:\s+group\s+by\s+([a-z_]+))?(?:\s+order\s+by\s+([a-z_]+)(?:\s+(asc|desc))?)?(?:\s+limit\s+(\d+))?$/i);
      if (!m) throw new Error("Couldn't parse that. Supported: SELECT [DISTINCT] cols FROM table [WHERE ...] [GROUP BY col] [ORDER BY col [DESC]] [LIMIT n]");
      var tname = m[3].toLowerCase(), rows = TABLES[tname];
      if (!rows) throw new Error("Unknown table '" + m[3] + "'. Tables: " + Object.keys(TABLES).join(", "));
      var allCols = Object.keys(rows[0]);
      function checkCol(c) { if (allCols.indexOf(c) === -1) throw new Error("Unknown column '" + c + "' in " + tname + ". Columns: " + allCols.join(", ")); }
      if (m[4]) {
        m[4].split(/\s+and\s+/i).forEach(function (cond) {
          var c = cond.trim().match(/^([a-z_]+)\s*(=|!=|<>|>=|<=|>|<|\blike\b|\bilike\b)\s*(?:'([^']*)'|"([^"]*)"|(\S+))$/i);
          if (!c) throw new Error("Couldn't read condition: " + cond);
          var col = c[1].toLowerCase(), op = c[2].toLowerCase(), val = c[3] != null ? c[3] : c[4] != null ? c[4] : c[5];
          checkCol(col);
          rows = rows.filter(function (r) {
            var v = r[col];
            if (op === "like" || op === "ilike") {
              var re = new RegExp("^" + val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*").replace(/_/g, ".") + "$", "i");
              return re.test(String(v));
            }
            var d = cmp(v, val);
            return op === "=" ? d === 0 : op === "!=" || op === "<>" ? d !== 0 : op === ">" ? d > 0 : op === "<" ? d < 0 : op === ">=" ? d >= 0 : d <= 0;
          });
        });
      }
      var items = m[2].split(",").map(function (s) { return s.trim(); });
      var isCount = function (s) { return /^count\(\s*\*\s*\)$/i.test(s); };
      var cols, result;
      if (m[5]) {
        var g = m[5].toLowerCase(); checkCol(g);
        var groups = {};
        rows.forEach(function (r) { (groups[r[g]] = groups[r[g]] || []).push(r); });
        cols = items.map(function (s) { if (isCount(s)) return "count"; var c = s.toLowerCase(); if (c !== g) throw new Error("With GROUP BY you can select '" + g + "' and COUNT(*)"); return c; });
        result = Object.keys(groups).map(function (k) { var o = {}; o[g] = k; o.count = groups[k].length; return o; });
      } else if (items.length === 1 && isCount(items[0])) {
        cols = ["count"]; result = [{ count: rows.length }];
      } else {
        cols = items[0] === "*" ? allCols : items.map(function (s) { var c = s.toLowerCase(); checkCol(c); return c; });
        result = rows.map(function (r) { var o = {}; cols.forEach(function (c) { o[c] = r[c]; }); return o; });
        if (m[1]) {
          var seen = {};
          result = result.filter(function (r) { var k = JSON.stringify(r); if (seen[k]) return false; seen[k] = 1; return true; });
        }
      }
      if (m[6]) {
        var oc = m[6].toLowerCase();
        if (cols.indexOf(oc) === -1 && allCols.indexOf(oc) === -1) throw new Error("Unknown ORDER BY column '" + oc + "'");
        var dir = (m[7] || "asc").toLowerCase() === "desc" ? -1 : 1;
        result.sort(function (a, b) { return cmp(a[oc], b[oc]) * dir; });
      }
      if (m[8]) result = result.slice(0, +m[8]);
      return { rows: result, cols: cols };
    }
    var COMMANDS = {
      help: function () {
        print("Commands: <span class=\"ok\">help</span>, <span class=\"ok\">tables</span>, <span class=\"ok\">describe &lt;table&gt;</span>, <span class=\"ok\">whoami</span>, <span class=\"ok\">hire</span>, <span class=\"ok\">contact</span>, <span class=\"ok\">resume</span>, <span class=\"ok\">theme</span>, <span class=\"ok\">clear</span>");
        print("Or write SQL: SELECT [DISTINCT] cols FROM table [WHERE col = 'x' AND col LIKE '%y%'] [GROUP BY col] [ORDER BY col DESC] [LIMIT n]", "dim");
      },
      tables: function () { table(Object.keys(TABLES).map(function (t) { return { table: t, rows: TABLES[t].length, columns: Object.keys(TABLES[t][0]).join(", ") }; }), ["table", "rows", "columns"]); },
      whoami: function () { print(esc(D.name) + " · " + esc(D.title) + " · " + esc(D.location)); print(esc(D.summary), "dim"); },
      hire: function () {
        print('<span class="ok">✓ Great choice.</span> ' + esc(D.availability) + ".");
        print("Email " + esc(D.email) + " (copied to your clipboard) or use the contact form below.", "dim");
        copyEmail();
      },
      contact: function () { print("Email: " + esc(D.email)); print("GitHub: " + esc(D.links.github)); if (D.links.linkedin) print("LinkedIn: " + esc(D.links.linkedin)); },
      resume: function () { print("Opening a print-ready résumé…", "dim"); setTimeout(printResume, 300); },
      theme: function () { toggleTheme(); print("Theme switched.", "dim"); },
      clear: function () { out.innerHTML = ""; }
    };
    function run(q) {
      q = q.trim(); if (!q) return;
      hist.push(q); hi = hist.length;
      print("sql&gt; " + esc(q), "cmd");
      var word = q.toLowerCase().replace(/;$/, "");
      try {
        if (COMMANDS[word]) return COMMANDS[word]();
        var dm = word.match(/^(?:describe|desc|\\d)\s+([a-z_]+)$/);
        if (dm) {
          var t = TABLES[dm[1]];
          if (!t) throw new Error("Unknown table '" + dm[1] + "'");
          return table(Object.keys(t[0]).map(function (c) { return { column: c, example: t[0][c] }; }), ["column", "example"]);
        }
        var r = sql(q);
        table(r.rows, r.cols);
      } catch (err) {
        print(esc(err.message), "err");
      }
    }
    $("#console-form").addEventListener("submit", function (e) { e.preventDefault(); run(input.value); input.value = ""; });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp" && hi > 0) { hi--; input.value = hist[hi]; e.preventDefault(); }
      if (e.key === "ArrowDown") { if (hi < hist.length - 1) { hi++; input.value = hist[hi]; } else { hi = hist.length; input.value = ""; } e.preventDefault(); }
    });
    print("Welcome to <span class=\"ok\">resume.db</span>, a tiny SQL engine running in your browser.");
    print("Tables: " + Object.keys(TABLES).join(", ") + ". Click an example above or type <span class=\"ok\">help</span>.", "dim");
  })();

  /* ---------------- beyond ---------------- */
  $("#lead-title").textContent = D.leadership.title;
  $("#lead-dates").textContent = D.leadership.dates;
  $("#lead-text").textContent = D.leadership.text;
  var medals = { "1st": "🥇", "2nd": "🥈", "3rd": "🥉" };
  $("#awards").innerHTML = D.awards.map(function (a) {
    var m = medals[a.title.slice(0, 3)] || "🏆";
    return '<li class="award"><span class="award__medal" aria-hidden="true">' + m + "</span><span><strong>" + esc(a.title) + "</strong><small>" + esc(a.place) + " · " + esc(a.date) + "</small></span></li>";
  }).join("");
  $("#langs").innerHTML = D.languages.map(function (l) {
    return '<li><div class="lang__top"><span>' + esc(l.name) + "</span><span>" + esc(l.level) + '</span></div><div class="bar" role="img" aria-label="' + esc(l.name + ": " + l.level) + '"><i data-w="' + l.pct + '"></i></div></li>';
  }).join("");
  onVisible($("#langs"), function () { $$("#langs .bar i").forEach(function (b) { b.style.width = b.dataset.w + "%"; }); });

  /* ---------------- contact ---------------- */
  $("#email-text").textContent = D.email;
  $("#copy-email").addEventListener("click", copyEmail);
  var gh = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.3 4.9 18.3 5.2 18.3 5.2c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z"/></svg>';
  var li = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.75Z"/></svg>';
  $("#socials").innerHTML = '<a class="social" href="' + esc(D.links.github) + '" target="_blank" rel="noopener">' + gh + "GitHub</a>" +
    (D.links.linkedin ? '<a class="social" href="' + esc(D.links.linkedin) + '" target="_blank" rel="noopener">' + li + "LinkedIn</a>" : "");
  $("#contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(e.target);
    var subject = "Full-time data role" + (f.get("company") ? " at " + f.get("company") : "");
    var body = f.get("message") + "\n\n— " + f.get("name") + (f.get("company") ? ", " + f.get("company") : "");
    window.location.href = "mailto:" + D.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    toast("Opening your email app…");
  });

  /* ---------------- print résumé ---------------- */
  function buildResume() {
    var r = $("#print-resume");
    var byCat = {};
    D.skills.forEach(function (s) { if (s.level !== "learning") (byCat[s.cat] = byCat[s.cat] || []).push(s.name); });
    var learning = D.skills.filter(function (s) { return s.level === "learning"; }).map(function (s) { return s.name; });
    r.innerHTML =
      "<h1>" + esc(D.name) + '</h1><p class="pr-sub">' + esc(D.title) + " · " + esc(D.availability) + '</p><p class="pr-contact">' +
      esc(D.email) + " · " + esc(D.location) + " · " + esc(D.links.github.replace("https://", "")) + (D.links.linkedin ? " · " + esc(D.links.linkedin.replace("https://", "")) : "") + "</p>" +
      "<p>" + esc(D.summary) + "</p>" +
      "<h2>Experience</h2>" + D.experience.map(function (x) {
        return "<h3>" + esc(x.role) + " · " + esc(x.company) + '</h3><p class="pr-meta">' + esc(x.location) + " · " + esc(x.start) + " – " + esc(x.end) + "</p><ul>" + x.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>";
      }).join("") +
      "<h2>Projects</h2>" + D.projects.map(function (p) {
        return "<h3>" + esc(p.title) + " (" + esc(p.year) + (p.status === "In progress" ? ", in progress" : "") + ")</h3><p>" + esc(p.summary) + '</p><p class="pr-meta">' + esc(p.stack.join(", ")) + "</p>";
      }).join("") +
      "<h2>Skills</h2><ul>" + Object.keys(byCat).map(function (c) { return "<li><strong>" + esc(D.skillCategories[c]) + ":</strong> " + esc(byCat[c].join(", ")) + "</li>"; }).join("") +
      "<li><strong>Currently learning:</strong> " + esc(learning.join(", ")) + "</li></ul>" +
      "<h2>Education</h2>" + D.education.map(function (x) { return "<h3>" + esc(x.degree) + '</h3><p class="pr-meta">' + esc(x.school) + ", " + esc(x.location) + " · " + esc(x.start) + " – " + esc(x.end) + "</p>"; }).join("") +
      "<h2>Languages &amp; Activities</h2><p>" + D.languages.map(function (l) { return esc(l.name) + " (" + esc(l.level) + ")"; }).join(" · ") + "</p><p>" + esc(D.leadership.title) + " (" + esc(D.leadership.dates) + "). " +
      D.awards.map(function (a) { return esc(a.title) + " (" + esc(a.date) + ")"; }).join("; ") + ".</p>";
  }
  function printResume() { buildResume(); window.print(); }
  $$('[data-action="print"]').forEach(function (b) { b.addEventListener("click", printResume); });
  window.addEventListener("beforeprint", buildResume);

  /* ---------------- command palette ---------------- */
  (function palette() {
    var dlg = $("#palette"), inp = $("#palette-input"), list = $("#palette-list"), sel = 0, shown = [];
    function go(id) { return function () { var t = document.getElementById(id); if (t) t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }; }
    var actions = [
      { label: "Go to About", hint: "section", run: go("about") },
      { label: "Go to Pipeline", hint: "section", run: go("pipeline") },
      { label: "Go to Skills", hint: "section", run: go("skills") },
      { label: "Go to Experience", hint: "section", run: go("experience") },
      { label: "Go to Projects", hint: "section", run: go("projects") },
      { label: "Open SQL playground", hint: "section", run: function () { go("playground")(); setTimeout(function () { $("#console-input").focus({ preventScroll: true }); }, 500); } },
      { label: "Go to Contact", hint: "section", run: go("contact") },
      { label: "Copy email address", hint: "action", run: copyEmail },
      { label: "Toggle light / dark theme", hint: "action", run: toggleTheme },
      { label: "Download résumé as PDF", hint: "action", run: printResume },
      { label: "Open GitHub profile", hint: "link", run: function () { window.open(D.links.github, "_blank", "noopener"); } },
      { label: "Open LinkedIn profile", hint: "link", run: function () { if (D.links.linkedin) window.open(D.links.linkedin, "_blank", "noopener"); } }
    ].concat(D.projects.map(function (p) { return { label: "Project: " + p.title, hint: "case study", run: function () { openProject(p.id); } }; }));
    function render() {
      var q = inp.value.trim().toLowerCase();
      shown = actions.filter(function (a) { return !q || a.label.toLowerCase().indexOf(q) !== -1; });
      sel = Math.min(sel, Math.max(0, shown.length - 1));
      list.innerHTML = shown.map(function (a, i) {
        return '<li role="option" data-i="' + i + '" aria-selected="' + (i === sel) + '" class="' + (i === sel ? "is-sel" : "") + '"><span>' + esc(a.label) + "</span><small>" + esc(a.hint) + "</small></li>";
      }).join("") || '<li class="muted">No matches</li>';
    }
    function open() { inp.value = ""; sel = 0; render(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); inp.focus(); }
    function exec(i) { var a = shown[i]; if (!a) return; dlg.close(); closeMenu(); setTimeout(a.run, 60); }
    $("#palette-btn").addEventListener("click", open);
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); dlg.open ? dlg.close() : open(); }
    });
    inp.addEventListener("input", function () { sel = 0; render(); });
    inp.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { sel = Math.min(sel + 1, shown.length - 1); render(); e.preventDefault(); }
      if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
      if (e.key === "Enter") { exec(sel); e.preventDefault(); }
    });
    list.addEventListener("click", function (e) { var li = e.target.closest("li[data-i]"); if (li) exec(+li.dataset.i); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  })();

  /* ---------------- reveal + spotlight ---------------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); rio.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (r) { rio.observe(r); });
  } else {
    $$(".reveal").forEach(function (r) { r.classList.add("is-visible"); });
  }
  document.addEventListener("pointermove", function (e) {
    var card = e.target.closest && e.target.closest(".card--glow");
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });

  $("#year").textContent = new Date().getFullYear();
})();
