/* =====================================================================
   COPS SKILLED SERVICES · site script (no libraries, no build step)
   Progressive enhancement: every page reads fine without JavaScript.
   ===================================================================== */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var NL = String.fromCharCode(10);

  /* ---------- SETTINGS (edit here) ----------
     Anything left empty simply stays hidden on the site. Until WHATSAPP, EMAIL or FORM_URL
     is set, requests can only be copied and the "Send" step says requests open soon.        */
  var WHATSAPP     = "919911777645";               /* digits only, country code first (91 for India). CONFIRM with Harpreet */
  var EMAIL        = "preeticops.banga@gmail.com"; /* switch to the domain email once the domain is bought */
  var PHONE        = "+91 99117 77645";            /* as it should be shown */
  var LINKEDIN     = "https://www.linkedin.com/in/harpreet-preeti-kaur-54785b107/";
  var FORM_URL     = "";   /* optional Google Form link: requests go there as well */
  var PAYMENT_URL  = "";   /* optional online payment link (Razorpay / PayU / Stripe payment page) — shows "Make a payment" on Contact */
  var BANK_DETAILS = "";   /* optional bank-transfer line, e.g. "HDFC Bank · COPS Skilled Services Pvt Ltd · A/c … · IFSC …" */
  var SITE = "https://drbankata.github.io/cops-skill/";

  /* ---------- helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function ref(prefix) { var d = new Date(); return prefix + "-" + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + Math.floor(100 + Math.random() * 900); }
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Contact details: show only what has been filled in ---------- */
  var LINKS = {
    email: EMAIL && "mailto:" + EMAIL,
    whatsapp: WHATSAPP && "https://wa.me/" + WHATSAPP,
    phone: PHONE && "tel:" + PHONE.replace(/[^+0-9]/g, ""),
    linkedin: LINKEDIN, payment: PAYMENT_URL, bank: BANK_DETAILS
  };
  var TEXT = { email: EMAIL, phone: PHONE, whatsapp: PHONE, bank: BANK_DETAILS };
  $$("[data-show]").forEach(function (el) {
    var k = el.getAttribute("data-show");
    if (!LINKS[k]) { el.hidden = true; return; }
    el.hidden = false;
    if (el.tagName === "A" && k !== "bank") { el.href = LINKS[k]; if (/^https?:/.test(LINKS[k])) { el.target = "_blank"; el.rel = "noopener"; } }
    $$("[data-fill]", el).forEach(function (f) { if (TEXT[k]) f.textContent = TEXT[k]; });
  });
  var anyChannel = !!(WHATSAPP || EMAIL || FORM_URL);
  $$("[data-when-none]").forEach(function (el) { el.hidden = !!PHONE; });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobile menu ---------- */
  var toggle = $(".menu-btn"), nav = $("#site-nav");
  var ICON_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg><span class="sr-only">Open menu</span>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="sr-only">Close menu</span>';
  if (toggle && nav) {
    var setOpen = function (open) { nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", open ? "true" : "false"); toggle.innerHTML = open ? ICON_CLOSE : ICON_OPEN; };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); toggle.focus(); } });
  }

  /* ---------- Header shadow, reading progress, back-to-top ---------- */
  var header = $(".site-header"), bar = $(".progress"), toTop = $(".to-top");
  function onScroll() {
    var y = window.scrollY, h = doc.scrollHeight - innerHeight;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", y > 900);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- Toast ---------- */
  var toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status"); toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  var tt;
  function say(html) { toast.innerHTML = html; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("show"); }, 3800); }

  /* ---------- Dialog helpers ---------- */
  function openDlg(d) { if (!d) return; if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", ""); }
  function closeDlg(d) { if (!d) return; if (d.close) d.close(); else d.removeAttribute("open"); }
  $$("dialog").forEach(function (d) {
    d.addEventListener("click", function (e) { if (e.target === d) closeDlg(d); });
    $$("[data-close]", d).forEach(function (b) { b.addEventListener("click", function () { closeDlg(d); }); });
  });

  /* ---------- Hero video: load only when motion is welcome and data is not scarce ---------- */
  var vid = $(".hero video"), vbtn = $("[data-vid]");
  var saveData = navigator.connection && navigator.connection.saveData;
  if (vid) {
    if (reduce || saveData) { vid.remove(); if (vbtn) vbtn.hidden = true; }
    else {
      vid.src = vid.getAttribute("data-src");
      vid.addEventListener("playing", function () { var p = $(".hero .poster"); if (p) p.style.opacity = "0"; });
      var pv = vid.play && vid.play(); if (pv && pv.catch) pv.catch(function () {});
      if (vbtn) vbtn.addEventListener("click", function () {
        var paused = vid.paused;
        if (paused) vid.play(); else vid.pause();
        vbtn.setAttribute("aria-pressed", paused ? "false" : "true");
        vbtn.querySelector("span").textContent = paused ? "Pause video" : "Play video";
        vbtn.querySelector("svg").innerHTML = paused ? '<path d="M9 6v12M15 6v12"/>' : '<path d="M8 5l11 7-11 7z"/>';
      });
    }
  }

  /* ---------- Gentle reveal ---------- */
  var rv = $$(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var ro = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { ro.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* ---------- Industries tabs (home) ---------- */
  var tabs = $$(".ind-tab");
  if (tabs.length) {
    var pick = function (t, focus) {
      tabs.forEach(function (x) {
        var on = x === t, p = document.getElementById(x.getAttribute("aria-controls"));
        x.setAttribute("aria-selected", on ? "true" : "false"); x.tabIndex = on ? 0 : -1;
        if (p) { p.hidden = !on; if (on) { p.classList.remove("anim"); void p.offsetWidth; p.classList.add("anim"); } }
      });
      if (focus) t.focus();
      if (innerWidth < 1000) t.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
    };
    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener("click", function () { pick(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowDown" || k === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (k === "ArrowUp" || k === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === "Home") n = tabs[0]; if (k === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); pick(n, true); }
      });
    });
  }

  /* ---------- Services sub-nav: highlight the section in view ---------- */
  var sublinks = $$(".subnav a");
  if (sublinks.length && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) sublinks.forEach(function (a) { var on = a.getAttribute("href") === "#" + en.target.id; a.classList.toggle("on", on); if (on && a.scrollIntoView && innerWidth < 900) a.parentNode.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" }); }); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$(".srow").forEach(function (s) { so.observe(s); });
  }

  /* =================================================================
     PROPOSAL BASKET — services the visitor has added. localStorage "cops-req".
     ================================================================= */
  var req = store("cops-req") || { svcs: [] };
  function saveReq() { store("cops-req", req); paintReq(); }
  function paintReq() {
    var n = req.svcs.length;
    $$("[data-req-count]").forEach(function (c) { c.textContent = n; c.setAttribute("data-n", n); });
    $$("[data-add-svc]").forEach(function (b) {
      var on = req.svcs.indexOf(b.getAttribute("data-add-svc")) > -1;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.querySelector("span").textContent = on ? "Added to proposal" : "Add to my proposal";
    });
  }
  $$("[data-add-svc]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-add-svc"), i = req.svcs.indexOf(k);
      if (i > -1) req.svcs.splice(i, 1); else req.svcs.push(k);
      saveReq();
      $$("[data-req-count]").forEach(function (c) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); });
      if (i < 0) say("Added to your proposal <a href=\"../proposal/\">Review &amp; send</a>");
    });
  });
  paintReq();

  /* =================================================================
     REQUIREMENT BUILDER (proposal page)
     ================================================================= */
  var rf = $("#req-form");
  if (rf) {
    var qs = new URLSearchParams(location.search), sec = qs.get("sector");
    if (sec) { var sr = $("#s-" + sec); if (sr) sr.checked = true; }
    req.svcs.forEach(function (k) { var c = $("#v-" + k); if (c) c.checked = true; });
    $$(".role").forEach(function (r) {
      var out = $("output", r);
      r.addEventListener("click", function (e) {
        var b = e.target.closest("[data-step]"); if (!b) return;
        out.textContent = Math.max(0, Math.min(999, (+out.textContent) + (+b.dataset.step)));
        renderReq();
      });
      $("select", r).addEventListener("change", renderReq);
    });
    rf.addEventListener("change", function (e) {
      if (e.target.name === "svc") { req.svcs = $$("input[name=svc]:checked", rf).map(function (c) { return c.value; }); saveReq(); }
      renderReq();
    });
    rf.addEventListener("input", renderReq);
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var collect = function () {
      var f = new FormData(rf), s = $("input[name=sector]:checked", rf);
      return {
        sector: s ? s.dataset.label : "",
        svcs: $$("input[name=svc]:checked", rf).map(function (c) { return c.dataset.label; }),
        roles: $$(".role").filter(function (r) { return +$("output", r).textContent > 0; }).map(function (r) { return { name: r.dataset.role, n: +$("output", r).textContent, shift: $("select", r).value }; }),
        f: f
      };
    };
    var renderReq = function () {
      var d = collect(), h = [];
      if (d.sector) h.push('<li><span>Facility</span><span>' + esc(d.sector) + '</span></li>');
      if (d.f.get("site")) h.push('<li><span>Location</span><span>' + esc(d.f.get("site")) + '</span></li>');
      if (d.svcs.length) { h.push('<li class="grp">Services</li>'); d.svcs.forEach(function (s) { h.push('<li><span>' + esc(s) + '</span><span>✓</span></li>'); }); }
      if (d.roles.length) { h.push('<li class="grp">Manpower</li>'); d.roles.forEach(function (r) { h.push('<li><span>' + esc(r.name) + '<br><small style="color:var(--on-dark-muted)">' + esc(r.shift) + '</small></span><span>× ' + r.n + '</span></li>'); }); }
      $("#req-lines").innerHTML = h.length ? h.join("") : '<li class="empty">Choose your facility type and services to begin.</li>';
    };
    renderReq();
    rf.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = collect();
      if (!d.svcs.length && !d.roles.length) { say("Choose at least one service first"); $("#v-security").focus(); return; }
      if (!validate(rf)) return;
      var f = d.f, id = ref("COPS-RQ");
      var L = ["Hello COPS team, I would like a proposal for our facility.", "", "Request " + id];
      if (d.sector) L.push("Facility type: " + d.sector);
      if (f.get("site")) L.push("Location: " + f.get("site"));
      if (f.get("area")) L.push("Approx. area: " + f.get("area") + " sq ft");
      if (d.svcs.length) { L.push("", "Services:"); d.svcs.forEach(function (s) { L.push("• " + s); }); }
      if (d.roles.length) { L.push("", "Manpower in mind:"); d.roles.forEach(function (r) { L.push("• " + r.name + " × " + r.n + " (" + r.shift + ")"); }); }
      if (f.get("start")) L.push("", "Preferred start: " + new Date(f.get("start") + "-01T12:00:00").toLocaleDateString("en-IN", { month: "long", year: "numeric" }));
      if (f.get("survey")) L.push("Best time for a survey: " + f.get("survey"));
      L.push("", "Name: " + f.get("name") + (f.get("role") ? ", " + f.get("role") : ""), "Organisation: " + f.get("company"), "Phone: " + f.get("phone"));
      if (f.get("email")) L.push("Email: " + f.get("email"));
      if (f.get("note")) L.push("Note: " + f.get("note"));
      sendFlow({ title: "Send your request to COPS", subject: "Proposal request " + id + " — " + f.get("company"), body: L.join(NL), after: "req" });
    });
  }

  /* ---------- Clients: filter + search ---------- */
  var list = $("#client-list");
  if (list) {
    var items = $$("li", list), chipsC = $$(".filters .chip"), q = $("#cl-q"), cur = "all", nOut = $("[data-cl-n]");
    var apply = function () {
      var t = (q.value || "").trim().toLowerCase(), n = 0;
      items.forEach(function (li) {
        var ok = (cur === "all" || (" " + li.dataset.tags + " ").indexOf(" " + cur + " ") > -1) && (!t || li.dataset.name.indexOf(t) > -1);
        li.hidden = !ok; if (ok) n++;
      });
      nOut.textContent = n;
    };
    chipsC.forEach(function (c) { c.addEventListener("click", function () { cur = c.dataset.filter; chipsC.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); }); apply(); }); });
    q.addEventListener("input", apply);
  }

  /* ---------- Contact form ---------- */
  var cf = $("#contact-form");
  if (cf) {
    var about = new URLSearchParams(location.search).get("about");
    if (about) { $("textarea", cf).value = "A question about " + about + ":" + NL + NL; }
    cf.addEventListener("submit", function (e) {
      e.preventDefault(); if (!validate(cf)) return;
      var f = new FormData(cf);
      var body = ["Hello COPS team,", "", f.get("message"), "", "— " + f.get("name") + (f.get("company") ? ", " + f.get("company") : ""), "Phone: " + f.get("phone"), "About: " + f.get("topic")].join(NL);
      sendFlow({ title: "Send your message", subject: "Website enquiry: " + f.get("topic") + " — " + f.get("name"), body: body });
    });
  }

  /* ---------- Validation (polite, inline) ---------- */
  function validate(form) {
    var ok = true;
    $$("[required]", form).forEach(function (inp) {
      var fld = inp.closest(".field"), good = inp.value.trim() !== "";
      if (inp.type === "tel" && good) good = inp.value.replace(/\D/g, "").length >= 8;
      if (fld) fld.classList.toggle("bad", !good);
      if (!good && ok) { inp.focus(); ok = false; }
    });
    return ok;
  }

  /* ---------- Send flow: WhatsApp / email / form / copy ---------- */
  var sd = $("#send");
  function sendFlow(o) {
    if (!sd) return;
    $("h2", sd).textContent = o.title;
    $(".msg-box", sd).textContent = o.body;
    var wa = $("[data-send=whatsapp]", sd), em = $("[data-send=email]", sd), fm = $("[data-send=form]", sd);
    wa.hidden = !WHATSAPP; em.hidden = !EMAIL; fm.hidden = !FORM_URL;
    if (WHATSAPP) { wa.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(o.body); wa.target = "_blank"; wa.rel = "noopener"; }
    if (EMAIL) em.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(o.subject) + "&body=" + encodeURIComponent(o.body);
    if (FORM_URL) { fm.href = FORM_URL; fm.target = "_blank"; fm.rel = "noopener"; }
    $("[data-soon]", sd).hidden = anyChannel;
    sd.dataset.after = o.after || "";
    openDlg(sd);
  }
  if (sd) {
    $("[data-copy]", sd).addEventListener("click", function () {
      var t = $(".msg-box", sd).textContent, b = this;
      var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy details"; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, function () {}); else { var r = document.createRange(); r.selectNodeContents($(".msg-box", sd)); getSelection().removeAllRanges(); getSelection().addRange(r); }
    });
    $$("[data-send]", sd).forEach(function (a) {
      a.addEventListener("click", function () {
        var after = sd.dataset.after;
        setTimeout(function () {
          closeDlg(sd);
          if (after === "req") { req = { svcs: [] }; saveReq(); }
          say("Thank you — COPS will be in touch shortly.");
        }, 600);
      });
    });
  }
})();
