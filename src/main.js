const ROWS = 10;
const COLS = ['A', 'B', 'C', 'D'];
const MAX_SEATS = 4;
const SECTIONS = [
  { id: 1, label: 'Sección 1', rows: [1, 2, 3, 4] },
  { id: 2, label: 'Sección 2', rows: [5, 6, 7] },
  { id: 3, label: 'Sección 3', rows: [8, 9, 10] },
];

const PRICES = { A: 85, B: 65, C: 65, D: 85 };
const getPrice = (col) => PRICES[col];

const occupiedSeats = new Set();
function generateOccupied() {
  const total = Math.floor(ROWS * 4 * 0.3);
  while (occupiedSeats.size < total) {
    const row = Math.floor(Math.random() * ROWS) + 1;
    const col = COLS[Math.floor(Math.random() * 4)];
    occupiedSeats.add(`${row}${col}`);
  }
}
generateOccupied();

const selectedSeats = new Map();
let activeSection = 1;

const seatId = (row, col) => `${row}${col}`;

function toggleSeat(row, col) {
  const id = seatId(row, col);
  if (occupiedSeats.has(id)) return;

  const wasSelected = selectedSeats.has(id);

  if (wasSelected) {
    selectedSeats.delete(id);
    show_alert('');
  } else {
    if (selectedSeats.size >= MAX_SEATS) {
      show_alert(`Máximo ${MAX_SEATS} asientos permitidos`);
      return;
    }
    selectedSeats.set(id, { row, col, price: getPrice(col) });
    show_alert('');
  }

  renderSeatMatrix();
  renderMinimap();
  renderDock();

  requestAnimationFrame(() => {
    const btn = document.querySelector(`[data-seat="${id}"]`);
    if (btn) {
      btn.classList.add(wasSelected ? 'just-deselected' : 'just-selected');
      setTimeout(() => btn.classList.remove('just-deselected', 'just-selected'), 400);
    }
  });
}

function getSeatState(id) {
  if (occupiedSeats.has(id)) return 'occupied';
  if (selectedSeats.has(id)) return 'selected';
  return 'available';
}

function getSeatColorClasses(id) {
  const state = getSeatState(id);
  switch (state) {
    case 'occupied':
      return 'bg-gray-400 cursor-not-allowed';
    case 'selected':
      return 'bg-[#5846F6] text-white shadow-md cursor-pointer';
    default:
      return 'bg-gray-200 hover:bg-gray-300 cursor-pointer active:scale-90';
  }
}

// ========== MINIMAP ==========
function getSectionForRow(row) {
  return SECTIONS.find(s => s.rows.includes(row));
}

function switchToSection(sectionId) {
  if (activeSection === sectionId) return;
  activeSection = sectionId;

  document.querySelectorAll('.section-tab').forEach(t => {
    t.className = 'section-tab px-5 py-1.5 rounded-full text-gray-600 text-xs font-medium hover:bg-gray-200/60 transition-all duration-200';
  });
  const activeTab = document.querySelector(`.section-tab[data-section="${sectionId}"]`);
  if (activeTab) {
    activeTab.className = 'section-tab px-5 py-1.5 rounded-full bg-black text-white text-xs font-medium shadow-sm transition-all duration-200';
  }

  renderSeatMatrix();
  renderMinimap();
}

function renderMinimap() {
  const container = document.getElementById('aircraft-sections');
  const viewport = document.getElementById('minimap-viewport');
  const label = document.getElementById('minimap-label');
  if (!container) return;
  container.innerHTML = '';

  const totalRows = ROWS;

  container.appendChild(renderCockpit());

  SECTIONS.forEach(section => {
    const band = document.createElement('div');
    band.className = 'absolute flex items-center justify-center transition-all duration-300 cursor-pointer group/band';
    band.onclick = (e) => {
      e.stopPropagation();
      switchToSection(section.id);
    };

    const isActive = section.id === activeSection;
    const firstRow = section.rows[0];
    const lastRow = section.rows[section.rows.length - 1];

    const startPct = ((firstRow - 1) / (totalRows - 1)) * 100;
    const endPct = ((lastRow - 1) / (totalRows - 1)) * 100;
    const width = endPct - startPct;

    band.style.left = `${startPct}%`;
    band.style.width = `${width}%`;
    band.style.top = '50%';
    band.style.transform = 'translateY(-50%)';
    band.style.height = '100%';

    const hasSeats = COLS.some(col => selectedSeats.has(seatId(firstRow, col))) ||
      COLS.some(col => selectedSeats.has(seatId(lastRow, col)));

    band.innerHTML = `
      <div class="absolute inset-0 rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-gray-900/10 border-2 border-gray-900/40'
          : 'group-hover/band:bg-gray-900/5'
      }"></div>
      <div class="relative z-10 flex flex-col items-center ${
        isActive ? 'opacity-100' : 'opacity-0 group-hover/band:opacity-70'
      } transition-opacity duration-300">
        <span class="text-[8px] sm:text-[10px] font-mono font-bold ${
          hasSeats ? 'text-[#5846F6]' : isActive ? 'text-gray-900' : 'text-gray-700'
        }">${section.label.replace('Sección ', 'S')}</span>
        <div class="flex gap-0.5 mt-0.5">
          ${section.rows.map(row => `<span class="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${
            COLS.some(col => selectedSeats.has(seatId(row, col))) ? 'bg-[#5846F6]' : 'bg-gray-500'
          }"></span>`).join('')}
        </div>
      </div>
    `;
    container.appendChild(band);
  });

  container.appendChild(renderTail());

  const section = SECTIONS.find(s => s.id === activeSection);
  if (section) {
    const firstRow = section.rows[0];
    const lastRow = section.rows[section.rows.length - 1];

    const startPercent = ((firstRow - 1) / (totalRows - 1)) * 100;
    const endPercent = ((lastRow - 1) / (totalRows - 1)) * 100;
    const widthPercent = endPercent - startPercent + 8;

    viewport.style.left = `${Math.max(0, startPercent)}%`;
    viewport.style.width = `${Math.min(widthPercent, 100)}%`;
    viewport.style.transform = 'translateY(-50%)';
    label.textContent = section.label;
  }
}

function renderCockpit() {
  const div = document.createElement('div');
  div.className = 'absolute left-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1';
  div.innerHTML = `
    <span class="text-[8px] sm:text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Cabina</span>
    <div class="w-2 h-2 rounded-full bg-gray-400"></div>
  `;
  return div;
}

function renderTail() {
  const div = document.createElement('div');
  div.className = 'absolute right-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1';
  div.innerHTML = `
    <span class="text-[8px] sm:text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Cola</span>
    <div class="w-2 h-2 rounded-full bg-gray-400"></div>
  `;
  return div;
}

// ========== SEAT MATRIX ==========
function renderSeatMatrix() {
  const container = document.getElementById('seat-matrix');
  const section = SECTIONS.find(s => s.id === activeSection);
  if (!section) return;

  const sectionRows = section.rows;

  const titleEl = document.getElementById('section-title');
  const infoEl = document.getElementById('section-info');
  titleEl.textContent = `${section.label} (${section.id === 1 ? 'Ventana' : section.id === 2 ? 'Centro' : 'Pasillo'})`;

  let freeCount = 0;
  sectionRows.forEach(row => {
    COLS.forEach(col => {
      if (!occupiedSeats.has(seatId(row, col))) freeCount++;
    });
  });
  infoEl.textContent = `${freeCount} asientos &bull; Desde $65`;

  container.innerHTML = '';

  const colHeaders = document.createElement('div');
  colHeaders.className = 'grid grid-cols-[2rem_repeat(10,1fr)] items-center gap-2 sm:gap-3 text-center text-xs text-gray-400 font-mono mb-2';
  colHeaders.innerHTML = `<span></span>${sectionRows.map(r => `<span>${r}</span>`).join('')}`;
  container.appendChild(colHeaders);

  COLS.forEach((col, colIndex) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'grid grid-cols-[2rem_repeat(10,1fr)] items-center gap-2 sm:gap-3 card-row';
    rowEl.style.animationDelay = `${colIndex * 60}ms`;

    let cellsHTML = `<span class="text-xs font-mono text-gray-400 text-center">${col}</span>`;
    sectionRows.forEach(row => {
      const id = seatId(row, col);
      const colorClasses = getSeatColorClasses(id);
      const state = getSeatState(id);
      cellsHTML += `
        <button
          data-seat="${id}"
          class="seat-btn h-10 sm:h-12 rounded-xl ${colorClasses} font-bold text-sm transition-all duration-200 w-full"
          onclick="window.__toggleSeat(${row}, '${col}')"
          ${state === 'occupied' ? 'disabled' : ''}
          aria-label="Asiento ${col}${row}"
        >${state === 'selected' ? `<svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>` : state === 'occupied' ? '' : `${col}`}</button>
      `;
    });
    rowEl.innerHTML = cellsHTML;
    container.appendChild(rowEl);

    if (colIndex === 1) {
      const aisle = document.createElement('div');
      aisle.className = 'h-3 sm:h-4';
      container.appendChild(aisle);
    }
  });
}

// ========== SECTION TABS ==========
function setupSectionTabs() {
  document.querySelectorAll('.section-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchToSection(parseInt(tab.dataset.section));
    });
  });
}

function setupMinimapViewport() {
  const viewport = document.getElementById('minimap-viewport');
  viewport.style.cursor = 'pointer';
  viewport.style.pointerEvents = 'auto';
  viewport.onclick = () => {
    const section = SECTIONS.find(s => s.id === activeSection);
    if (!section) return;
    const nextId = section.id < SECTIONS.length ? section.id + 1 : 1;
    switchToSection(nextId);
  };
}

// ========== CHECKOUT DOCK ==========
function renderDock() {
  const chipsContainer = document.getElementById('selected-chips');
  const emptyEl = document.getElementById('chips-empty');
  const totalEl = document.getElementById('dock-total');
  const countEl = document.getElementById('dock-count');
  const btn = document.getElementById('dock-btn');

  chipsContainer.innerHTML = '';

  if (selectedSeats.size === 0) {
    chipsContainer.appendChild(emptyEl || (() => {
      const p = document.createElement('span');
      p.className = 'text-xs text-gray-400 italic';
      p.id = 'chips-empty';
      p.textContent = 'Selecciona tus asientos';
      return p;
    })());
    totalEl.textContent = '$0';
    countEl.textContent = '0';
    btn.disabled = true;
    return;
  }

  btn.disabled = false;
  let total = 0;
  const sorted = [...selectedSeats.values()].sort((a, b) => a.row - b.row || a.col.localeCompare(b.col));

  sorted.forEach((seat, i) => {
    total += seat.price;
    const chip = document.createElement('span');
    chip.className = 'chip-in inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-xs font-semibold';
    chip.style.animationDelay = `${i * 50}ms`;
    chip.innerHTML = `
      ${seat.col}${seat.row}
      <button onclick="window.__toggleSeat(${seat.row}, '${seat.col}')" class="text-gray-400 hover:text-white transition-colors ml-0.5">&times;</button>
    `;
    chipsContainer.appendChild(chip);
  });

  totalEl.textContent = `$${total.toLocaleString()}`;
  countEl.textContent = selectedSeats.size;
}

// ========== ALERT ==========
function show_alert(msg) {
  const el = document.getElementById('mobile-alert');
  if (!msg) {
    el.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
    el.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
    return;
  }
  el.textContent = msg;
  el.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
  el.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
  setTimeout(() => show_alert(''), 2500);
}

// ========== INIT ==========
window.__toggleSeat = toggleSeat;
setupSectionTabs();
setupMinimapViewport();
renderMinimap();
renderSeatMatrix();
renderDock();
