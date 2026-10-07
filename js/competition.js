"use strict";

/* =========================================================
   داده‌های مسابقات — این بخش را برای تورنمنت خودتان ویرایش کنید
   =========================================================

   نکته مهم: جدول گروه‌ها دیگر دستی نیست.
   شما فقط باید:
     ۱) اسم تیم‌های هر گروه را در GROUPS وارد کنید (یک‌بار، در ابتدای کار)
     ۲) نتیجه هر بازی را در FIXTURES وارد کنید (status: "played" + score)
   جدول (تعداد بازی، برد، باخت، مساوی، گل‌زده، گل‌خورده، تفاضل، امتیاز)
   به‌طور کامل و خودکار از روی نتایج بازی‌ها محاسبه می‌شود.
   ========================================================= */

// هر گروه فقط شامل شناسه (id)، عنوان نمایشی (label) و اسم تیم‌هاست.
// اسم تیم‌ها باید دقیقاً همان چیزی باشد که در FIXTURES (home/away) استفاده می‌کنید.
const GROUPS = [
  {
    id: "g1",
    label: "گروه ۱",
    teams: ["سیمان فارس نو","آرتا تجارت","نظام مهندسی","صنایع شیمیایی فارس"]
  },
  {
    id: "g2",
    label: "گروه ۲",
    teams: ["رامک","پگاه فارس","پارس الکل اقلید","زنجیره سالیذ"]
  },
  {
    id: "g3",
    label: "گروه ۳",
    teams: ["یاسین پلاست","پتروشیمی شیراز","فولاد غدیر نی ریز","گاز استان"]
  },
  {
    id: "g4",
    label: "گروه ۴",
    teams: ["شهرداری شیراز","شام شام","فراسان"]
  }
];

// برنامه مسابقات — تنها جایی که باید نتایج را وارد کنید.
//
// برای یک بازی که هنوز برگزار نشده:
//   { group: "g1", home: "تیم A1", away: "تیم A3", status: "upcoming", date: "۱۴۰۵/۰۱/۱۷", time: "۱۷:۰۰" }
//
// همین که بازی تمام شد، فقط این دو مقدار را تغییر بدهید — همین! جدول خودش آپدیت می‌شود:
//   status: "upcoming"  →   status: "played"
//   و یک خط score اضافه کنید، مثلاً:   score: "2 - 1"
// (عدد اول "score" = گل تیم home، عدد دوم = گل تیم away، یعنی «گل home - گل away»)
const FIXTURES = [
  
  { group: "g3", home: "پتروشیمی شیراز", away: "فولاد غدیر نی ریز", status: "played", score: "2 - 3", date: "۱۴۰۵/۰۶/۲۴", time: "۱۴:۱۵" }, //
  { group: "g2", home: "پارس الکل اقلید", away: "زنجیره سالیذ", status: "played", score: "0 - 4", date: "۱۴۰۵/۰۶/۲۴", time: "۱۵:۱۵" },//
   
  { group: "g1", home: "آرتا تجارت", away: "نظام مهندسی", status: "played", score: "2 - 1", date: "۱۴۰۵/۰۶/۲۵", time: "۱۱:۰۰" },//
  { group: "g4", home: "شام شام", away: "فراسان", status: "played", score: "8 - 1", date: "۱۴۰۵/۰۶/۲۵", time: "۱۲:۰۰" },//
  { group: "g2", home: "پگاه فارس", away: "پارس الکل اقلید", status: "played", score: "4 - 1", date: "۱۴۰۵/۰۶/۲۵", time: "۱۳:۰۰" },//
   
  { group: "g3", home: "یاسین پلاست", away: "گاز استان", status: "played", score: "0 - 4", date: "1405/06/28", time: "12:30" },
  { group: "g1", home: "سیمان فارس نو", away: "صنایع شیمیایی فارس", status: "played", score: "1 - 6", date: "1405/06/28", time: "13:30" },
  { group: "g4", home: "شهرداری شیراز", away: "شام شام", status: "played", score:"3 - 1", date: "1405/06/28", time: "14:30" }, 
   
  { group: "g1", home: "سیمان فارس نو", away: "نظام مهندسی", status: "played", score: "3 - 3", date: "1405/07/01", time: "12:00" },
  { group: "g2", home: "رامک", away: "پارس الکل اقلید", status: "played", score: "3 - 0", date: "1405/07/01", time: "13:00" },
  { group: "g4", home: "شهرداری شیراز", away: "فراسان", status: "played", score: "11 - 2", date: "1405/07/01", time: "14:00" },
  { group: "g3", home: "یاسین پلاست", away: "فولاد غدیر نی ریز", status: "played", score: "0 - 0", date: "1405/07/01", time: "15:00" },
   
  { group: "g1", home: "آرتا تجارت", away: "صنایع شیمیایی فارس", status: "played", score: "2 - 4", date: "1405/07/04", time: "12:30" },
  { group: "g3", home: "پتروشیمی شیراز", away: "گاز استان", status: "played", score: "2 - 1", date: "1405/07/04", time: "13:30" }, 
  { group: "g2", home: "رامک", away: "زنجیره سالیذ", status: "played", score: "2 - 0", date: "1405/07/04", time: "14:30" },

  { group: "g3", home: "یاسین پلاست", away: "پتروشیمی شیراز", status: "played", score: "4 - 3", date: "1405/07/08", time: "12:30" },
  { group: "g3", home: "فولاد غدیر نی ریز", away: "گاز استان", status: "played", score: "4 - 0", date: "1405/07/08", time: "13:30" },
  { group: "g1", home: "نظام مهندسی", away: "صنایع شیمیایی فارس", status: "played", score: "7 - 9", date: "1405/07/08", time: "14:30" },
   
  { group: "g2", home: "پگاه فارس", away: "زنجیره سالیذ", status: "played", score: "2 - 4", date: "1405/07/12", time: "12:30" }, 
  { group: "g1", home: "سیمان فارس نو", away: "آرتا تجارت", status: "played", score: "3 - 8", date: "1405/07/12", time: "13:30" },
   
  { group: "g2", home: "رامک", away: "پگاه فارس", status: "played", score: "4 - 3", date: "1405/07/15", time: "13:45" }
  
];
//۰۱۲۳۴۵۶۷۸۹
/* =========================================================
   محاسبه خودکار جدول از روی نتایج بازی‌های "played"
   ========================================================= */
function parseScore(score) {
  // "3 - 1" یا "3-1" هر دو پشتیبانی می‌شود
  const parts = String(score).split("-").map(s => parseInt(s.trim(), 10));
  if (parts.length !== 2 || parts.some(n => Number.isNaN(n))) return null;
  return { home: parts[0], away: parts[1] };
}

function computeStandings(group) {
  // شروع هر تیم از صفر
  const table = {};
  group.teams.forEach(name => {
    table[name] = { name, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 };
  });

  FIXTURES
    .filter(f => f.group === group.label && f.status === "played")
    .forEach(f => {
      const goals = parseScore(f.score);
      const home = table[f.home];
      const away = table[f.away];
      if (!goals || !home || !away) {
        console.warn("بازی نامعتبر یا تیم ناشناس در FIXTURES:", f);
        return;
      }

      home.played++; away.played++;
      home.gf += goals.home; home.ga += goals.away;
      away.gf += goals.away; away.ga += goals.home;

      if (goals.home > goals.away) { home.w++; away.l++; }
      else if (goals.home < goals.away) { away.w++; home.l++; }
      else { home.d++; away.d++; }
    });

  return Object.values(table).map(t => ({
    ...t,
    gd: t.gf - t.ga,
    pts: t.w * 3 + t.d
  }));
}

/* =========================================================
   رندر جدول گروه‌بندی
   ========================================================= */
function renderGroupTable(group) {
  const rows = computeStandings(group)
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);

  const tbody = rows.map((t, i) => `
    <tr class="${i < 2 ? "is-qualified" : ""}">
      <td class="col-rank">${i + 1}</td>
      <td class="col-team">${t.name}</td>
      <td>${t.played}</td>
      <td>${t.w}</td>
      <td>${t.d}</td>
      <td>${t.l}</td>
      <td>${t.gf}</td>
      <td>${t.ga}</td>
      <td class="${t.gd > 0 ? "is-pos" : t.gd < 0 ? "is-neg" : ""}">${t.gd > 0 ? "+" + t.gd : t.gd}</td>
      <td class="col-pts">${t.pts}</td>
    </tr>
  `).join("");

  return `
    <div class="table-scroll">
      <table class="group-table">
        <thead>
          <tr>
            <th class="col-rank">#</th>
            <th class="col-team">تیم</th>
            <th title="تعداد بازی">بازی</th>
            <th title="برد">برد</th>
            <th title="مساوی">مساوی</th>
            <th title="باخت">باخت</th>
            <th title="گل زده">گل‌زده</th>
            <th title="گل خورده">گل‌خورده</th>
            <th title="تفاضل گل">تفاضل</th>
            <th class="col-pts" title="امتیاز">امتیاز</th>
          </tr>
        </thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>
    <p class="table-legend"><span class="legend-dot"></span> دو تیم برتر صعود می‌کنند · جدول به‌صورت خودکار از روی نتایج بازی‌ها محاسبه شده است</p>
  `;
}

function initGroupTabs() {
  const tabBar = document.getElementById("groupTabs");
  const tableHost = document.getElementById("groupTableHost");
  if (!tabBar || !tableHost) return;

  tabBar.innerHTML = GROUPS.map((g, i) => `
    <button class="tab-btn${i === 0 ? " active" : ""}" data-group="${g.id}" role="tab" aria-selected="${i === 0}">
      ${g.label}
    </button>
  `).join("");

  const showGroup = (id) => {
    const group = GROUPS.find(g => g.id === id) || GROUPS[0];
    tableHost.innerHTML = renderGroupTable(group);
    tabBar.querySelectorAll(".tab-btn").forEach(btn => {
      const isActive = btn.dataset.group === group.id;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });
  };

  tabBar.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => showGroup(btn.dataset.group));
  });

  showGroup(GROUPS[0].id);
}

/* =========================================================
   مرحله حذفی (یک‌چهارم نهایی → نیمه‌نهایی → فینال)
   =========================================================

   دو تیم برتر هر گروه خودکار صعود می‌کنند (از همان جدولی که
   از روی FIXTURES محاسبه شد) — شما فقط باید تعیین کنید کدام
   گروه مقابل کدام گروه در یک‌چهارم قرار می‌گیرد (BRACKET_SEEDING)،
   و بعد نتیجه هر بازی حذفی را همین‌جا وارد کنید.

   برای هر بازی حذفی:
     status: "upcoming"  →  "played"
     score: "2 - 1"
   اگر نتیجه مساوی شد و بازی با پنالتی تعیین تکلیف شد:
     penalties: "5 - 4"
   برنده خودکار به مرحله بعد (نیمه‌نهایی/فینال) می‌رود.
*/

// تعیین می‌کند در هر بازی یک‌چهارم، نفر اول/دوم کدام گروه روبه‌روی هم قرار می‌گیرند.
// rank: 1 = صدرنشین گروه, 2 = نفر دوم گروه

const BRACKET_SEEDING = {
  qf1: { home: { group: "g1", rank: 1 }, away: { group: "g2", rank: 2 } },
  qf2: { home: { group: "g3", rank: 1 }, away: { group: "g4", rank: 2 } },
  qf3: { home: { group: "g2", rank: 1 }, away: { group: "g1", rank: 2 } },
  qf4: { home: { group: "g4", rank: 1 }, away: { group: "g3", rank: 2 } }
};

// نتایج مرحله حذفی — فقط همین بخش را برای ثبت نتایج ویرایش کنید.
const KNOCKOUT_RESULTS = {
  qf1: { status: "upcoming", score: null, penalties: null, date: "۱۴۰۵/۰۲/۰۱", time: "۱۷:۰۰" },
  qf2: { status: "upcoming", score: null, penalties: null, date: "۱۴۰۵/۰۲/۰۱", time: "۱۹:۰۰" },
  qf3: { status: "upcoming", score: null, penalties: null, date: "۱۴۰۵/۰۲/۰۲", time: "۱۷:۰۰" },
  qf4: { status: "upcoming", score: null, penalties: null, date: "۱۴۰۵/۰۲/۰۲", time: "۱۹:۰۰" },
  sf1: { status: "upcoming", score: null, penalties: null, date: "۱۴۰۵/۰۲/۰۸", time: "۱۸:۰۰" }, // برنده qf1 vs برنده qf2
  sf2: { status: "upcoming", score: null, penalties: null, date: "۱۴۰۵/۰۲/۰۸", time: "۲۰:۰۰" }, // برنده qf3 vs برنده qf4
  final: { status: "upcoming", score: null, penalties: null, date: "۱۴۰۵/۰۲/۱۵", time: "۱۸:۰۰" } // برنده sf1 vs برنده sf2
};

// آیا همه بازی‌های یک گروه برگزار شده‌اند؟ (برای جلوگیری از صعود زودهنگام نادرست)
function isGroupComplete(groupId) {
  const group = GROUPS.find(g => g.id === groupId);
  if (!group) return false;
  const n = group.teams.length;
  const expectedMatches = (n * (n - 1)) / 2; // دور رفت ساده
  const playedCount = FIXTURES.filter(f => f.group === groupId && f.status === "played").length;
  return playedCount >= expectedMatches;
}


function qualifierName(groupId, rank) {
  if (!isGroupComplete(groupId)) return null; // هنوز گروه تمام نشده
  const group = GROUPS.find(g => g.id === groupId);
  const standings = computeStandings(group).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  const team = standings[rank - 1];
  return team ? team.name : null;
}

function knockoutWinner(matchId) {
  const result = KNOCKOUT_RESULTS[matchId];
  if (!result || result.status !== "played" || !result.score) return null;
  const goals = parseScore(result.score);
  if (!goals) return null;
  if (goals.home > goals.away) return "home";
  if (goals.away > goals.home) return "away";
  // مساوی -> پنالتی
  if (result.penalties) {
    const pens = parseScore(result.penalties);
    if (pens) {
      if (pens.home > pens.away) return "home";
      if (pens.away > pens.home) return "away";
    }
  }
  return null; // مساوی بدون پنالتی ثبت‌شده -> هنوز نامشخص
}

// تیم‌های هر بازی یک‌چهارم را از روی جدول گروه‌ها پیدا می‌کند.
// اگر گروه هنوز تمام نشده، نام واقعی null برمی‌گردد (نه یک متن جایگزین)
// تا تشخیص "آماده/ناآماده" درست باقی بماند.
function getQFSlot(seed) {
  const cfg = BRACKET_SEEDING[seed];
  return {
    home: qualifierName(cfg.home.group, cfg.home.rank),
    homeLabel: `نفر ${cfg.home.rank} ${groupLabel(cfg.home.group)}`,
    away: qualifierName(cfg.away.group, cfg.away.rank),
    awayLabel: `نفر ${cfg.away.rank} ${groupLabel(cfg.away.group)}`
  };
}

function resolveMatch(matchId, homeFeeder, awayFeeder, fallbackLabels) {
  const result = KNOCKOUT_RESULTS[matchId] || { status: "upcoming" };
  const homeName = typeof homeFeeder === "function" ? homeFeeder() : homeFeeder;
  const awayName = typeof awayFeeder === "function" ? awayFeeder() : awayFeeder;
  const labels = fallbackLabels || {};

  return {
    id: matchId,
    home: homeName || labels.home || "در انتظار",
    away: awayName || labels.away || "در انتظار",
    ready: Boolean(homeName && awayName),
    status: result.status,
    score: result.score,
    penalties: result.penalties,
    date: result.date,
    time: result.time
  };
}

function buildBracket() {
  const qf1 = getQFSlot("qf1");
  const qf2 = getQFSlot("qf2");
  const qf3 = getQFSlot("qf3");
  const qf4 = getQFSlot("qf4");

  const matches = {};
  matches.qf1 = resolveMatch("qf1", qf1.home, qf1.away, { home: qf1.homeLabel, away: qf1.awayLabel });
  matches.qf2 = resolveMatch("qf2", qf2.home, qf2.away, { home: qf2.homeLabel, away: qf2.awayLabel });
  matches.qf3 = resolveMatch("qf3", qf3.home, qf3.away, { home: qf3.homeLabel, away: qf3.awayLabel });
  matches.qf4 = resolveMatch("qf4", qf4.home, qf4.away, { home: qf4.homeLabel, away: qf4.awayLabel });

  const winnerName = (matchId) => {
    const m = matches[matchId];
    if (!m || !m.ready || m.status !== "played") return null;
    const side = knockoutWinner(matchId);
    return side ? m[side] : null;
  };

  matches.sf1 = resolveMatch("sf1", () => winnerName("qf1"), () => winnerName("qf2"),
    { home: "برنده یک‌چهارم ۱", away: "برنده یک‌چهارم ۲" });
  matches.sf2 = resolveMatch("sf2", () => winnerName("qf3"), () => winnerName("qf4"),
    { home: "برنده یک‌چهارم ۳", away: "برنده یک‌چهارم ۴" });
  matches.final = resolveMatch("final", () => winnerName("sf1"), () => winnerName("sf2"),
    { home: "برنده نیمه‌نهایی ۱", away: "برنده نیمه‌نهایی ۲" });

  const championSide = matches.final.status === "played" ? knockoutWinner("final") : null;
  const champion = championSide ? matches.final[championSide] : null;

  return { matches, champion };
}

/* ---------- رندر یک کارت بازی در برکت ---------- */
function renderBracketMatch(m) {
  const isPlayed = m.status === "played" && m.ready;
  let scoreLine = "";
  if (isPlayed) {
    scoreLine = m.score || "";
    if (m.penalties) scoreLine += ` <span class="bracket-pens">(پن ${m.penalties})</span>`;
  }

  const winnerSide = isPlayed ? knockoutWinner(m.id) : null;

  return `
    <div class="match ${m.ready ? "" : "is-tbd"}">
      <div class="match__row ${winnerSide === "home" ? "is-winner" : ""}">
        <span class="match__team">${m.home}</span>
        <span class="match__score">${isPlayed ? (m.score ? m.score.split("-")[0].trim() : "") : ""}</span>
      </div>
      <div class="match__row ${winnerSide === "away" ? "is-winner" : ""}">
        <span class="match__team">${m.away}</span>
        <span class="match__score">${isPlayed ? (m.score ? m.score.split("-")[1].trim() : "") : ""}</span>
      </div>
      <div class="match__meta">
        ${isPlayed
          ? `<span class="badge badge--played">پایان${m.penalties ? ` · پن ${m.penalties}` : ""}</span>`
          : m.ready
            ? `<span class="badge badge--upcoming">${m.date || ""} — ${m.time || ""}</span>`
            : `<span class="badge badge--tbd">در انتظار نتایج گروه</span>`}
      </div>
    </div>
  `;
}

function renderBracket() {
  const host = document.getElementById("knockoutBracket");
  if (!host) return;

  const { matches, champion } = buildBracket();

  host.innerHTML = `
    <div class="bracket">
      <div class="bracket-round bracket-round--qf">
        <p class="bracket-round__label">یک‌چهارم نهایی</p>
        <div class="bracket-round__matches">
          ${renderBracketMatch(matches.qf1)}
          ${renderBracketMatch(matches.qf2)}
          ${renderBracketMatch(matches.qf3)}
          ${renderBracketMatch(matches.qf4)}
        </div>
      </div>
      <div class="bracket-round bracket-round--sf">
        <p class="bracket-round__label">نیمه‌نهایی</p>
        <div class="bracket-round__matches">
          ${renderBracketMatch(matches.sf1)}
          ${renderBracketMatch(matches.sf2)}
        </div>
      </div>
      <div class="bracket-round bracket-round--final">
        <p class="bracket-round__label">فینال</p>
        <div class="bracket-round__matches">
          ${renderBracketMatch(matches.final)}
        </div>
      </div>
    </div>
    ${champion ? `
      <div class="champion-card">
        <svg viewBox="0 0 24 24" class="champion-card__icon"><path d="M8 4h8v5a4 4 0 01-8 0V4z"></path><path d="M8 5H4v2a4 4 0 004 4M16 5h4v2a4 4 0 01-4 4"></path><path d="M12 13v4M9 21h6M10 17h4v4h-4z"></path></svg>
        <div>
          <p class="champion-card__label">قهرمان مسابقات</p>
          <p class="champion-card__name">${champion}</p>
        </div>
      </div>` : ""}
  `;
}

/* =========================================================
   رندر برنامه مسابقات (اسکرول‌پذیر)
   ========================================================= */
function groupLabel(id) {
  const g = GROUPS.find(g => g.id === id);
  return g ? g.label : id;
}

function renderFixtureRow(f) {
  const isPlayed = f.status === "played";
  return `
    <li class="fixture-row ${isPlayed ? "is-played" : "is-upcoming"}">
      <span class="fixture-group">${groupLabel(f.group)}</span>
      <span class="fixture-teams">
        <span class="fixture-team">${f.home}</span>
        <span class="fixture-mid">${isPlayed ? f.score : "vs"}</span>
        <span class="fixture-team">${f.away}</span>
      </span>
      <span class="fixture-meta">
        ${isPlayed
          ? `<span class="badge badge--played">پایان یافته</span>`
          : `<span class="badge badge--upcoming">${f.date} — ${f.time}</span>`}
      </span>
    </li>
  `;
}

function initFixtures() {
  const list = document.getElementById("fixtureList");
  const filterBar = document.getElementById("fixtureFilters");
  if (!list || !filterBar) return;

  const render = (filter) => {
    let data = FIXTURES;
    if (filter === "played") data = FIXTURES.filter(f => f.status === "played");
    if (filter === "upcoming") data = FIXTURES.filter(f => f.status === "upcoming");
    list.innerHTML = data.map(renderFixtureRow).join("") ||
      `<li class="fixture-empty">بازی‌ای برای نمایش وجود ندارد.</li>`;
  };

  filterBar.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      filterBar.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.filter);
    });
  });

  render("all");
}

/* =========================================================
   شروع برنامه — همه‌چیز از FIXTURES رندر می‌شود، پس با تغییر
   یک نتیجه در بالا، هم جدول و هم لیست بازی‌ها خودکار به‌روز است.
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initGroupTabs();
  renderBracket();
  initFixtures();
  const yearEl = document.getElementById("compYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
