"use strict";

/* =========================================================
   داده‌های مسابقات — این بخش را برای تورنمنت خودتان ویرایش کنید
   ========================================================= */

// هر گروه: نام گروه + لیست تیم‌ها
// برای هر تیم فقط برد(w)، مساوی(d)، باخت(l)، گل‌زده(gf)، گل‌خورده(ga) را وارد کنید؛
// تعداد بازی، تفاضل گل و امتیاز به‌صورت خودکار محاسبه می‌شود.
const GROUPS = [
  {
    id: "g1",
    label: "گروه ۱",
    teams: [
      { name: "سیمان فارس نو", w: 0, d: 0, l: 0, gf: 0, ga: 0 },
      { name: "آرتا تجارت", w: 1, d: 0, l: 0, gf: 2, ga: 1 },
      { name: "نظام مهندسی", w: 0, d: 0, l: 1, gf: 1, ga: 2 },
      { name: "صنایع شیمیایی فارس", w: 0, d: 0, l: 0, gf: 0, ga: 0 }
    ]
  },
  {
    id: "g2",
    label: "گروه ۲",
    teams: [
      { name: "رامک", w: 0, d: 0, l: 0, gf: 0, ga: 0 },
      { name: "پگاه فارس", w: 1, d: 0, l: 0, gf: 4, ga: 1 },
      { name: "پارس الکل اقلید", w: 0, d: 0, l: 2, gf: 8, ga: 1 },
      { name: "سالیذ", w: 1, d: 0, l: 0, gf: 4, ga: 0 }
    ]
  },
  {
    id: "g3",
    label: "گروه ۳",
    teams: [
      { name: "یاسین پلاست", w: 0, d: 0, l: 0, gf: 0, ga: 0 },
      { name: "پتروشیمی شیراز", w: 0, d: 0, l: 1, gf: 2, ga: 3 },
      { name: "فولاد غدیر نیریز", w: 1, d: 0, l: 0, gf: 3, ga: 2 },
      { name: "گاز اتان", w: 0, d: 0, l: 30, gf: 0, ga: 0 }
    ]
  },
  {
    id: "g4",
    label: "گروه ۴",
    teams: [
      { name: "شهرداری شیراز", w: 0, d: 0, l: 0, gf: 0, ga: 0 },
      { name: "شام شام", w: 1, d: 0, l: 0, gf: 8, ga: 1 },
      { name: "فراسان", w: 0, d: 0, l: 1, gf: 1, ga: 8 }
    ]
  }
];

// برنامه مسابقات: هر بازی به یک گروه اشاره می‌کند.
// برای بازی‌های برگزار شده status را "played" و score را پر کنید.
// برای بازی‌های پیش‌رو status را "upcoming" بگذارید و date/time را وارد کنید.
const FIXTURES = [
  { group: "گروه ۱", home: "تیم A1", away: "تیم A2", status: "played", score: "3 - 1", date: "۱۴۰۵/۰۱/۱۰", time: "۱۷:۰۰" },
  { group: "گروه ۱", home: "تیم A3", away: "تیم A4", status: "played", score: "2 - 2", date: "۱۴۰۵/۰۱/۱۰", time: "۱۹:۰۰" },
  { group: "گروه ۲", home: "تیم B1", away: "تیم B3", status: "played", score: "2 - 0", date: "۱۴۰۵/۰۱/۱۱", time: "۱۷:۰۰" },
  { group: "گروه ۲", home: "تیم B2", away: "تیم B4", status: "played", score: "1 - 1", date: "۱۴۰۵/۰۱/۱۱", time: "۱۹:۰۰" },
  { group: "گروه ۳", home: "تیم C1", away: "تیم C4", status: "played", score: "4 - 1", date: "۱۴۰۵/۰۱/۱۲", time: "۱۷:۰۰" },
  { group: "گروه ۳", home: "تیم C2", away: "تیم C3", status: "played", score: "2 - 2", date: "۱۴۰۵/۰۱/۱۲", time: "۱۹:۰۰" },
  { group: "گروه ۴", home: "تیم D1", away: "تیم D2", status: "played", score: "3 - 0", date: "۱۴۰۵/۰۱/۱۳", time: "۱۷:۰۰" },
  { group: "گروه ۴", home: "تیم D3", away: "تیم D4", status: "played", score: "1 - 0", date: "۱۴۰۵/۰۱/۱۳", time: "۱۹:۰۰" },

  { group: "گروه ۱", home: "تیم A1", away: "تیم A3", status: "upcoming", date: "۱۴۰۵/۰۱/۱۷", time: "۱۷:۰۰" },
  { group: "گروه ۱", home: "تیم A2", away: "تیم A4", status: "upcoming", date: "۱۴۰۵/۰۱/۱۷", time: "۱۹:۰۰" },
  { group: "گروه ۲", home: "تیم B1", away: "تیم B4", status: "upcoming", date: "۱۴۰۵/۰۱/۱۸", time: "۱۷:۰۰" },
  { group: "گروه ۲", home: "تیم B2", away: "تیم B3", status: "upcoming", date: "۱۴۰۵/۰۱/۱۸", time: "۱۹:۰۰" },
  { group: "گروه ۳", home: "تیم C1", away: "تیم C3", status: "upcoming", date: "۱۴۰۵/۰۱/۱۹", time: "۱۷:۰۰" },
  { group: "گروه ۳", home: "تیم C2", away: "تیم C4", status: "upcoming", date: "۱۴۰۵/۰۱/۱۹", time: "۱۹:۰۰" },
  { group: "گروه ۴", home: "تیم D1", away: "تیم D3", status: "upcoming", date: "۱۴۰۵/۰۱/۲۰", time: "۱۷:۰۰" },
  { group: "گروه ۴", home: "تیم D2", away: "تیم D4", status: "upcoming", date: "۱۴۰۵/۰۱/۲۰", time: "۱۹:۰۰" },

  { group: "گروه ۱", home: "تیم A1", away: "تیم A4", status: "upcoming", date: "۱۴۰۵/۰۱/۲۴", time: "۱۷:۰۰" },
  { group: "گروه ۱", home: "تیم A2", away: "تیم A3", status: "upcoming", date: "۱۴۰۵/۰۱/۲۴", time: "۱۹:۰۰" },
  { group: "گروه ۲", home: "تیم B1", away: "تیم B2", status: "upcoming", date: "۱۴۰۵/۰۱/۲۵", time: "۱۷:۰۰" },
  { group: "گروه ۲", home: "تیم B3", away: "تیم B4", status: "upcoming", date: "۱۴۰۵/۰۱/۲۵", time: "۱۹:۰۰" },
  { group: "گروه ۳", home: "تیم C1", away: "تیم C2", status: "upcoming", date: "۱۴۰۵/۰۱/۲۶", time: "۱۷:۰۰" },
  { group: "گروه ۳", home: "تیم C3", away: "تیم C4", status: "upcoming", date: "۱۴۰۵/۰۱/۲۶", time: "۱۹:۰۰" },
  { group: "گروه ۴", home: "تیم D1", away: "تیم D4", status: "upcoming", date: "۱۴۰۵/۰۱/۲۷", time: "۱۷:۰۰" },
  { group: "گروه ۴", home: "تیم D2", away: "تیم D3", status: "upcoming", date: "۱۴۰۵/۰۱/۲۷", time: "۱۹:۰۰" }
];

/* =========================================================
   رندر جدول گروه‌بندی
   ========================================================= */
function computeRow(team) {
  const played = team.w + team.d + team.l;
  const gd = team.gf - team.ga;
  const pts = team.w * 3 + team.d;
  return { ...team, played, gd, pts };
}

function renderGroupTable(group) {
  const rows = group.teams
    .map(computeRow)
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
    <p class="table-legend"><span class="legend-dot"></span> دو تیم برتر صعود می‌کنند</p>
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
   رندر برنامه مسابقات (اسکرول‌پذیر)
   ========================================================= */
function renderFixtureRow(f) {
  const isPlayed = f.status === "played";
  return `
    <li class="fixture-row ${isPlayed ? "is-played" : "is-upcoming"}">
      <span class="fixture-group">${f.group}</span>
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

document.addEventListener("DOMContentLoaded", () => {
  initGroupTabs();
  initFixtures();
  const yearEl = document.getElementById("compYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
