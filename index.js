/* 
 * TEE TUBE - MAIN WEBSITE LOGIC (index.js)
 * 
 * Hello! If you are reading this and want to understand how the website works without AI, here is the breakdown:
 * 
 * 1. HOW IT STARTS (INIT): 
 *    When the page loads (DOMContentLoaded), we initialize the tabs, search bar, and modals.
 *    Then, we call `loadDatabase()`.
 * 
 * 2. LOADING THE DATABASE (loadDatabase):
 *    We fetch the global database from GitHub via jsDelivr CDN (`DB_URL`).
 *    We save it into the `allVideos` variable.
 *    Then we extract all unique maps, players, and clans from the videos to build the sidebar filters (`extractDynamicFilters`).
 *    Finally, we render the videos onto the screen (`renderVideos`) and generate the leaderboards (`renderLeaderboards`).
 * 
 * 3. FILTERING & SEARCHING (renderVideos):
 *    Whenever you type in the search bar or click a filter in the sidebar, we re-run `renderVideos()`.
 *    It loops through `allVideos`, checks if a video matches the active filters and your search query.
 *    If it matches, it gets sorted (by newest, oldest, most views, or most likes) and displayed on the grid!
 * 
 * 4. LEADERBOARDS (renderLeaderboards):
 *    This loops through all videos and counts how many videos each player, clan, and map has.
 *    It sorts them from highest to lowest and displays them in the Leaderboard tab.
 * 
 * 5. VIDEO MODAL (openModal):
 *    When you click a video card, it opens a popup (modal). We embed the YouTube iframe there and show the tags!
 * 
 * Have fun coding!
 */

// ===== CONFIG =====
const DB_URL = 'https://cdn.jsdelivr.net/gh/m09l6d0ur13ii/teetube-db@main/database.json';

const CATEGORIES = {
  game: ["ddnet", "teeworlds", "ddper"],
  video: ["moment", "montage", "playthrough", "speedrun", "t0speedrun", "tutorial", "trailer", "skips", "animation", "gameplay", "tournament", "match", "podcast", "fun", "meme", "other"],
  mode: ["DDRace", "Gores", "fng", "F-DDrace", "Race", "Block", "BOMB", "CTF", "TB", "TeeWare", "InfClass", "Monster", "zCatch", "Foot", "DM", "Soup", "AXRace", "Sheep", "Battle", "Training", "other mods"],
  gameplayer: ["real", "tas", "dummy"],
  lang: ["ru", "en", "zh", "other"]
};

// ===== STATE =====
let allVideos   = {};
let searchQuery = '';
let currentSort = 'newest';
let activeFilters = { game: [], video: [], mode: [], gameplayer: [], map: [], player: [], clan: [] };
let availableMaps = new Set();
let availablePlayers = new Set();
let availableClans = new Set();

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSearch();
  initModal();
  loadDatabase();
  initSidebarToggle();
});

// ===== LOAD DATABASE =====
async function loadDatabase() {
  setStatus('loading', 'Loading...');
  try {
    const res = await fetch(DB_URL + '?_=' + Date.now());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const db = await res.json();
    allVideos = db.videos || {};
    extractDynamicFilters();
    initFilters();
    renderVideos();
    renderLeaderboards();
    setStatus('ok', `${Object.keys(allVideos).length} videos`);
  } catch (e) {
    setStatus('error', 'Failed to load');
    document.getElementById('video-grid').innerHTML =
      `<div class="empty-state"><strong>Could not load database</strong>Check your connection or try again later.</div>`;
  }
}

function setStatus(type, text) {
  const dot  = document.querySelector('.status-dot');
  const span = document.getElementById('status-text');
  dot.className  = 'status-dot ' + type;
  span.textContent = text;
}

// ===== TABS =====
function initTabs() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const tabId = 'tab-' + btn.dataset.tab;
      document.getElementById(tabId).classList.add('active');

      const filters = document.getElementById('sidebar-filters');
      filters.style.display = btn.dataset.tab === 'videos' ? 'flex' : 'none';
    });
  });
}

// ===== SIDEBAR MOBILE =====
function initSidebarToggle() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle) return;
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && e.target !== toggle) {
      sidebar.classList.remove('open');
    }
  });
}

// ===== SEARCH & SORT =====
function initSearch() {
  document.getElementById('main-search').addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderVideos();
  });
  document.getElementById('sort-select').addEventListener('change', e => {
    currentSort = e.target.value;
    renderVideos();
  });
  document.getElementById('clear-filters-btn').addEventListener('click', clearAllFilters);
  document.getElementById('clear-all-btn').addEventListener('click', clearAllFilters);
}

function clearAllFilters() {
  activeFilters = { game: [], video: [], mode: [], gameplayer: [], map: [], player: [], clan: [] };
  searchQuery = '';
  document.getElementById('main-search').value = '';
  document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
  renderVideos();
  updateActiveFilterBar();
}

// ===== DYNAMIC FILTERS =====
function extractDynamicFilters() {
  availableMaps.clear(); availablePlayers.clear(); availableClans.clear();
  Object.values(allVideos).forEach(v => {
    (v.maps    || []).forEach(m => availableMaps.add(m));
    (v.players || []).forEach(p => availablePlayers.add(p));
    (v.clans   || []).forEach(c => availableClans.add(c));
  });
}

function initFilters() {
  for (const [cat, tags] of Object.entries(CATEGORIES)) {
    const container = document.getElementById('f-' + cat);
    if (!container) continue;
    container.innerHTML = '';
    tags.forEach(tag => makeFilterTag(cat, tag, container));
  }

  populateDynFilter('f-map',    availableMaps,    'map',    'search-map');
  populateDynFilter('f-player', availablePlayers, 'player', 'search-player');
  populateDynFilter('f-clan',   availableClans,   'clan',   'search-clan');
}

function populateDynFilter(containerId, set, category, searchId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  Array.from(set).sort().forEach(val => makeFilterTag(category, val, container));

  const searchEl = document.getElementById(searchId);
  if (searchEl) {
    searchEl.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      container.querySelectorAll('.filter-tag').forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }
}

function makeFilterTag(category, tag, container) {
  const el = document.createElement('div');
  el.className = 'filter-tag';
  el.textContent = tag;
  if (activeFilters[category] && activeFilters[category].includes(tag)) el.classList.add('active');
  el.addEventListener('click', () => {
    const arr = activeFilters[category] || (activeFilters[category] = []);
    const idx = arr.indexOf(tag);
    if (idx > -1) { arr.splice(idx, 1); el.classList.remove('active'); }
    else          { arr.push(tag);      el.classList.add('active');    }
    renderVideos();
    updateActiveFilterBar();
  });
  container.appendChild(el);
}

function updateActiveFilterBar() {
  const bar   = document.getElementById('active-filter-bar');
  const chips = document.getElementById('active-filter-chips');
  chips.innerHTML = '';
  let count = 0;
  for (const [cat, vals] of Object.entries(activeFilters)) {
    vals.forEach(v => {
      count++;
      const chip = document.createElement('span');
      chip.className = 'active-chip';
      chip.textContent = `${cat}: ${v} ✕`;
      chip.addEventListener('click', () => {
        const idx = activeFilters[cat].indexOf(v);
        if (idx > -1) activeFilters[cat].splice(idx, 1);
        document.querySelectorAll('.filter-tag').forEach(el => {
          if (el.textContent === v) el.classList.remove('active');
        });
        renderVideos();
        updateActiveFilterBar();
      });
      chips.appendChild(chip);
    });
  }
  bar.style.display = count > 0 ? 'flex' : 'none';
}

// ===== FILTERING =====
function matchesFilters(v) {
  if (searchQuery) {
    const t = (v.title  || '').toLowerCase();
    const a = (v.author || '').toLowerCase();
    if (!t.includes(searchQuery) && !a.includes(searchQuery)) return false;
  }

  const vTags    = v.tags    || {};
  const vMaps    = v.maps    || [];
  const vPlayers = v.players || [];
  const vClans   = v.clans   || [];

  for (const cat of ['game', 'video', 'mode', 'gameplayer']) {
    if (activeFilters[cat].length > 0) {
      if (!vTags[cat]) return false;
      if (!activeFilters[cat].some(f => vTags[cat].includes(f))) return false;
    }
  }
  if (activeFilters.map.length    > 0 && !activeFilters.map.some(f    => vMaps.includes(f)))    return false;
  if (activeFilters.player.length > 0 && !activeFilters.player.some(f => vPlayers.includes(f))) return false;
  if (activeFilters.clan.length   > 0 && !activeFilters.clan.some(f   => vClans.includes(f)))   return false;

  return true;
}

// ===== SORTING =====
function parseNum(str) {
  if (!str) return 0;
  const s = str.toString().toLowerCase();
  let multi = 1;
  if (s.includes('k') || s.includes('тыс')) multi = 1000;
  if (s.includes('m') || s.includes('млн')) multi = 1000000;
  return (parseFloat(s.replace(/[^\d.]/g, '')) || 0) * multi;
}

function parseDate(dateStr) {
  if (!dateStr || dateStr === 'Unknown Date') return 0;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

function sortVideos(entries) {
  return entries.sort((a, b) => {
    const vA = a[1], vB = b[1];
    if (currentSort === 'views')  return parseNum(vB.views) - parseNum(vA.views);
    if (currentSort === 'likes')  return parseNum(vB.likes) - parseNum(vA.likes);
    if (currentSort === 'oldest') return parseDate(vA.date) - parseDate(vB.date);
    return parseDate(vB.date) - parseDate(vA.date); // newest
  });
}

// ===== RENDER VIDEOS =====
function renderVideos() {
  const grid = document.getElementById('video-grid');
  grid.innerHTML = '';

  let filtered = Object.entries(allVideos).filter(([, v]) => matchesFilters(v));
  filtered = sortVideos(filtered);

  document.getElementById('count-badge').textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state"><strong>No videos found</strong>Try adjusting your filters or search.</div>';
    return;
  }

  filtered.forEach(([id, v]) => {
    const card = document.createElement('div');
    card.className = 'video-card';

    // Build tags html safely
    let tagsHtml = '';
    ['game', 'video', 'mode', 'gameplayer'].forEach(cat => {
      (v.tags?.[cat] || []).forEach(tag => {
        tagsHtml += `<span class="ctag ${cat}">${esc(tag)}</span>`;
      });
    });
    (v.maps    || []).forEach(m => tagsHtml += `<span class="ctag map">🗺 ${esc(m)}</span>`);
    (v.players || []).forEach(p => tagsHtml += `<span class="ctag player">👤 ${esc(p)}</span>`);
    (v.clans   || []).forEach(c => tagsHtml += `<span class="ctag clan">🛡 ${esc(c)}</span>`);

    const thumb = v.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    const dateStr = v.date ? formatDate(v.date) : '';

    // Use DOM methods for user-controlled text to prevent XSS
    card.innerHTML = `
      <img class="card-thumb" src="${esc(thumb)}" alt="" loading="lazy">
      <div class="card-body">
        <div class="card-title"></div>
        <div class="card-author"></div>
        <div class="card-meta">
          ${v.views !== undefined && v.views !== null && v.views !== 0 ? `<span>👁 ${esc(fmtNum(v.views))}</span>` : ''}
          ${v.likes !== undefined && v.likes !== null && v.likes !== 0 ? `<span>👍 ${esc(fmtNum(v.likes))}</span>` : ''}
          ${dateStr  ? `<span>📅 ${esc(dateStr)}</span>`  : ''}
        </div>
        <div class="card-tags">${tagsHtml}</div>
      </div>
    `;

    card.querySelector('.card-title').textContent  = v.title  || 'Unknown Title';
    card.querySelector('.card-author').textContent = v.author || 'Unknown Author';

    card.addEventListener('click', () => openModal(id, v));
    grid.appendChild(card);
  });
}

// ===== MODAL =====
function initModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('video-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('video-modal')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(id, v) {
  const modal = document.getElementById('video-modal');
  const content = document.getElementById('modal-content');

  const thumb = v.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const dateStr = v.date ? formatDate(v.date) : '';

  let tagsHtml = '';
  ['game', 'video', 'mode', 'gameplayer'].forEach(cat => {
    (v.tags?.[cat] || []).forEach(tag => { tagsHtml += `<span class="ctag ${cat}">${esc(tag)}</span>`; });
  });
  (v.maps    || []).forEach(m => tagsHtml += `<span class="ctag map">🗺 ${esc(m)}</span>`);
  (v.players || []).forEach(p => tagsHtml += `<span class="ctag player">👤 ${esc(p)}</span>`);
  (v.clans   || []).forEach(c => tagsHtml += `<span class="ctag clan">🛡 ${esc(c)}</span>`);

  // External links
  let extLinks = `<a href="https://www.youtube.com/watch?v=${id}" target="_blank" class="ext-link">▶ YouTube</a>`;
  if (v.maps?.[0])    extLinks += `<a href="https://ddstats.tw/map/${encodeURIComponent(v.maps[0])}" target="_blank" class="ext-link">🗺 ddstats</a>`;
  if (v.players?.[0]) extLinks += `<a href="https://ddnet.org/players/${encodeURIComponent(v.players[0])}" target="_blank" class="ext-link">👤 ddnet</a>`;

  content.innerHTML = `<img class="modal-thumb" src="${esc(thumb)}" alt="">`;

  const body = document.createElement('div');
  body.className = 'modal-body';

  body.innerHTML = `
    <div class="modal-meta">
      ${v.views !== undefined && v.views !== null && v.views !== 0 ? `<span>👁 ${esc(fmtNum(v.views))}</span>` : ''}
      ${v.likes !== undefined && v.likes !== null && v.likes !== 0 ? `<span>👍 ${esc(fmtNum(v.likes))}</span>` : ''}
      ${dateStr   ? `<span>📅 ${esc(dateStr)}</span>`   : ''}
      ${v.addedBy ? `<span>✅ by ${esc(v.addedBy)}</span>` : ''}
    </div>
    <div class="modal-tags">${tagsHtml}</div>
    <div class="modal-ext-links">${extLinks}</div>
  `;

  // Safe text insertion
  const title  = document.createElement('div');  title.className  = 'modal-title';  title.textContent  = v.title  || 'Unknown';
  const author = document.createElement('div');  author.className = 'modal-author'; author.textContent = v.author || '';
  body.insertBefore(author, body.firstChild);
  body.insertBefore(title,  body.firstChild);

  content.appendChild(body);
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('video-modal').style.display = 'none';
  document.body.style.overflow = '';
}

// ===== LEADERBOARDS =====
function renderLeaderboards() {
  const container = document.getElementById('leaderboards-grid');
  if (!container) return;
  container.innerHTML = '';

  const stats = { byVideos: {}, byViews: {}, maps: {}, clans: {} };

  Object.values(allVideos).forEach(v => {
    const views = parseNum(v.views);
    (v.players || []).forEach(p => {
      stats.byVideos[p] = (stats.byVideos[p] || 0) + 1;
      stats.byViews[p]  = (stats.byViews[p]  || 0) + views;
    });
    (v.maps  || []).forEach(m => stats.maps[m]  = (stats.maps[m]  || 0) + 1);
    (v.clans || []).forEach(c => stats.clans[c] = (stats.clans[c] || 0) + 1);
  });

  makeTable(container, '👤 Top Players (Videos)', stats.byVideos, v => `${v} pts`, 'player');
  makeTable(container, '👁 Top Players (Views)',  stats.byViews,  v => fmtNum(v) + ' views', 'player');
  makeTable(container, '🗺 Top Maps',             stats.maps,     v => `${v} videos`);
  makeTable(container, '🛡 Top Clans',            stats.clans,    v => `${v} pts`);
}

function makeTable(container, title, dataDict, valFn, filterCat) {
  const entries = Object.entries(dataDict).sort((a, b) => b[1] - a[1]).slice(0, 20);
  if (entries.length === 0) return;

  const div = document.createElement('div');
  div.className = 'lb-table';

  const h3 = document.createElement('h3');
  h3.textContent = title;
  div.appendChild(h3);

  entries.forEach(([name, val], i) => {
    const row = document.createElement('div');
    row.className = 'lb-row';

    const rank = document.createElement('div'); rank.className = 'lb-rank'; rank.textContent = `${i+1}.`;
    const nm   = document.createElement('div'); nm.className   = 'lb-name'; nm.textContent   = name;
    const sc   = document.createElement('div'); sc.className   = 'lb-score'; sc.textContent  = valFn(val);

    row.appendChild(rank);
    row.appendChild(nm);
    row.appendChild(sc);

    if (filterCat) {
      row.addEventListener('click', () => {
        activeFilters = { game: [], video: [], mode: [], gameplayer: [], map: [], player: [], clan: [] };
        searchQuery = '';
        document.getElementById('main-search').value = '';
        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        
        activeFilters[filterCat].push(name);
        
        updateActiveFilterBar();
        document.querySelector('.nav-btn[data-tab="videos"]').click();
        renderVideos();
      });
    }

    div.appendChild(row);
  });

  container.appendChild(div);
}

// ===== UTILS =====
function fmtNum(n) {
  if (!n) return '0';
  const num = typeof n === 'string' ? parseNum(n) : n;
  return num >= 1e6 ? (num/1e6).toFixed(1)+'M' : num >= 1e3 ? (num/1e3).toFixed(1)+'K' : num.toString();
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
  } catch { return dateStr; }
}
