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
  
  { group: "گروه ۳", home: "پتروشیمی شیراز", away: "فولاد غدیر نی ریز", status: "played", score: "2 - 3", date: "۱۴۰۵/۰۶/۲۴", time: "۱۴:۱۵" }, //
  { group: "گروه ۲", home: "پارس الکل اقلید", away: "زنجیره سالیذ", status: "played", score: "0 - 4", date: "۱۴۰۵/۰۶/۲۴", time: "۱۵:۱۵" },//
   
  { group: "گروه ۱", home: "آرتا تجارت", away: "نظام مهندسی", status: "played", score: "2 - 1", date: "۱۴۰۵/۰۶/۲۵", time: "۱۱:۰۰" },//
  { group: "گروه ۴", home: "شام شام", away: "فراسان", status: "played", score: "8 - 1", date: "۱۴۰۵/۰۶/۲۵", time: "۱۲:۰۰" },//
  { group: "گروه ۲", home: "پگاه فارس", away: "پارس الکل اقلید", status: "played", score: "4 - 1", date: "۱۴۰۵/۰۶/۲۵", time: "۱۳:۰۰" },//
   
  { group: "گروه ۳", home: "یاسین پلاست", away: "گاز استان", status: "upcoming", date: "1405/06/28", time: "12:30" },
  { group: "گروه ۱", home: "سیمان فارس نو", away: "صنایع شیمیایی فارس", status: "upcoming", date: "1405/06/28", time: "13:30" },
  { group: "گروه ۴", home: "شهرداری شیراز", away: "شام شام", status: "upcoming", date: "1405/06/28", time: "14:30" }, 
   
  { group: "گروه ۱", home: "سیمان فارس نو", away: "نظام مهندسی", status: "upcoming", date: "1405/07/01", time: "11" },
  { group: "گروه ۲", home: "رامک", away: "پارس الکل اقلید", status: "upcoming", date: "1405/07/01", time: "12" },
  { group: "گروه ۴", home: "شهرداری شیراز", away: "فراسان", status: "upcoming", date: "1405/07/01", time: "13" },
  { group: "گروه ۳", home: "یاسین پلاست", away: "فولاد غدیر نی ریز", status: "upcoming", date: "1405/07/01", time: "14" },
   
  { group: "گروه ۱", home: "آرتا تجارت", away: "صنایع شیمیایی فارس", status: "upcoming", date: "1405/07/04", time: "12:30" },
  { group: "گروه ۳", home: "پتروشیمی شیراز", away: "گاز استان", status: "upcoming", date: "1405/07/04", time: "13:30" }, 
  { group: "گروه ۲", home: "رامک", away: "زنجیره سالیذ", status: "upcoming", date: "1405/07/04", time: "14:30" },
  
  { group: "گروه ۲", home: "رامک", away: "پگاه فارس", status: "upcoming", date: "**", time: "**" },
  { group: "گروه ۳", home: "یاسین پلاست", away: "پتروشیمی شیراز", status: "upcoming", date: "**", time: "**" },
  { group: "گروه ۱", home: "سیمان فارس نو", away: "آرتا تجارت", status: "upcoming", date: "**", time: "**" },
  { group: "گروه ۱", home: "نظام مهندسی", away: "صنایع شیمیایی فارس", status: "upcoming", date: "**", time: "**" }, 
  { group: "گروه ۲", home: "پگاه فارس", away: "زنجیره سالیذ", status: "upcoming", date: "**", time: "**" }, 
  { group: "گروه ۳", home: "فولاد غدیر نی ریز", away: "گاز استان", status: "upcoming", date: "**", time: "**" }
  
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
  initFixtures();
  const yearEl = document.getElementById("compYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
