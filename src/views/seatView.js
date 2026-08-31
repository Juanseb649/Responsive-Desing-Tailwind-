import { renderPlaneSVG } from '../components/planeIcon.js';
import { renderAircraftSVG } from '../components/aircraftSVG.js';

const getSeatColorClasses = (state) => {
  switch (state) {
    case 'occupied':
      return 'bg-gray-400 cursor-not-allowed';
    case 'selected':
      return 'bg-[#5846F6] text-white shadow-md cursor-pointer';
    default:
      return 'bg-gray-200 hover:bg-gray-300 cursor-pointer active:scale-90';
  }
};

export class SeatView {
  /** Renderiza el SVG del fuselaje dentro del stage del minimap */
  renderAircraft(activeSectionId, selectedRows) {
    const slot = document.getElementById('fuselage-slot');
    if (!slot) return;
    slot.innerHTML = renderAircraftSVG({ activeSectionId, selectedRows });
  }

  renderPlaneIndicator() {
    const planeIndicator = document.getElementById('plane-indicator');
    if (planeIndicator) {
      planeIndicator.innerHTML = renderPlaneSVG({ width: 32, height: 32 });
    }
  }

  /** Vincula los tabs de sección del viewport selector */
  bindSectionTabs(handler) {
    document.querySelectorAll('.viewport-tab').forEach((item) => {
      item.addEventListener('click', () => handler(parseInt(item.dataset.section, 10)));
    });
  }

  /** Marca el tab activo visualmente */
  setActiveTab(activeSectionId) {
    document.querySelectorAll('.viewport-tab').forEach((tab) => {
      const id = String(tab.dataset.section);
      tab.classList.toggle('is-active', id === String(activeSectionId));
    });
  }

  /**
   * Posiciona el ActiveViewportLens sobre la sección activa.
   * Usa translate3d() para animación fluida; eje X en desktop.
   */
  positionLens(activeSectionId) {
    const lens = document.getElementById('active-lens');
    const tabs = document.querySelectorAll('.viewport-tab');
    if (!lens || !tabs.length) return;

    const total = tabs.length;
    const target = tabs[activeSectionId - 1];
    if (!target) return;

    const lensWidth = lens.offsetWidth;
    const stageWidth = lens.parentElement.offsetWidth;

    // Posición base porcentual centrada sobre el segmento activo
    const centerPct = ((activeSectionId - 0.5) / total) * 100;
    const offsetX = (centerPct / 100) * stageWidth - lensWidth / 2;
    // Mantener el lens dentro del stage
    const maxX = stageWidth - lensWidth;
    const clamped = Math.max(0, Math.min(maxX, offsetX));

    lens.style.transform = `translate3d(${clamped}px, -50%, 0)`;

    const label = document.getElementById('active-lens__label');
    if (label) {
      label.textContent = target.dataset.label || '';
    }
  }

  /** Configura el drag/swipe del lens (scrubbing) sobre el stage */
  bindLensDrag(onSectionChange) {
    const stage = document.getElementById('viewport-stage');
    const lens = document.getElementById('active-lens');
    if (!stage || !lens) return;

    const tabs = document.querySelectorAll('.viewport-tab');
    const total = tabs.length;

    const getSectionFromPointer = (clientX) => {
      const rect = stage.getBoundingClientRect();
      const pct = (clientX - rect.left) / rect.width;
      const idx = Math.max(0, Math.min(total - 1, Math.floor(pct * total)));
      return idx + 1;
    };

    let isDragging = false;

    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const sectionId = getSectionFromPointer(clientX);
      if (sectionId !== Number(lens.dataset.section)) {
        lens.dataset.section = String(sectionId);
        onSectionChange(sectionId);
      }
    };

    stage.addEventListener('pointerdown', (e) => {
      isDragging = true;
      stage.setPointerCapture(e.pointerId);
      const sectionId = getSectionFromPointer(e.clientX);
      if (sectionId !== Number(lens.dataset.section)) {
        onSectionChange(sectionId);
      }
    });

    stage.addEventListener('pointermove', onMove);

    const endDrag = () => {
      isDragging = false;
    };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
  }

  renderSeatMatrix(model) {
    const container = document.getElementById('seat-matrix');
    const summary = model.getSectionSummary();

    if (!container || !summary) return;

    const titleEl = document.getElementById('section-title');
    const infoEl = document.getElementById('section-info');

    if (titleEl) titleEl.textContent = summary.title;
    if (infoEl) infoEl.innerHTML = summary.info;

    container.innerHTML = '';

    const columns = model.getSeatColumns();
    const colHeaders = document.createElement('div');
    colHeaders.className = 'grid items-center gap-2 sm:gap-3 text-center text-xs text-gray-400 font-mono mb-2';
    colHeaders.style.gridTemplateColumns = `2rem repeat(${columns.length}, minmax(0, 1fr))`;
    colHeaders.innerHTML = `<span></span>${summary.section.rows.map((row) => `<span>${row}</span>`).join('')}`;
    container.appendChild(colHeaders);

    columns.forEach((col, colIndex) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'grid items-center gap-2 sm:gap-3 card-row';
      rowEl.style.gridTemplateColumns = `2rem repeat(${columns.length}, minmax(0, 1fr))`;
      rowEl.style.animationDelay = `${colIndex * 60}ms`;

      let cellsHTML = `<span class="text-xs font-mono text-gray-400 text-center">${col}</span>`;
      summary.section.rows.forEach((row) => {
        const id = model.seatId(row, col);
        const state = model.getSeatState(id);
        const colorClasses = getSeatColorClasses(state);

        cellsHTML += `
          <button
            data-seat="${id}"
            class="seat-btn flex items-center justify-center h-10 sm:h-12 rounded-xl ${colorClasses} font-bold text-sm transition-all duration-200 w-full"
            onclick="window.__toggleSeat(${row}, '${col}')"
            ${state === 'occupied' ? 'disabled' : ''}
            aria-label="Asiento ${col}${row}"
          >${state === 'selected' ? `<svg class="w-5 h-5 block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>` : state === 'occupied' ? '' : `${col}`}</button>
        `;
      });

      rowEl.innerHTML = cellsHTML;
      container.appendChild(rowEl);

      if (colIndex === Math.floor(columns.length / 2) - 1) {
        const aisle = document.createElement('div');
        aisle.className = 'h-3 sm:h-4';
        container.appendChild(aisle);
      }
    });
  }

  renderDock(selectedSeats = []) {
    const chipsContainer = document.getElementById('selected-chips');
    const totalEl = document.getElementById('dock-total');
    const countEl = document.getElementById('dock-count');
    const button = document.getElementById('dock-btn');

    if (!chipsContainer || !totalEl || !countEl || !button) return;

    chipsContainer.innerHTML = '';

    if (selectedSeats.length === 0) {
      const empty = document.getElementById('chips-empty') ?? document.createElement('span');
      empty.id = 'chips-empty';
      empty.className = 'text-xs text-gray-400 italic';
      empty.textContent = 'Selecciona tus asientos';
      chipsContainer.appendChild(empty);
      totalEl.textContent = '$0';
      countEl.textContent = '0';
      button.disabled = true;
      return;
    }

    button.disabled = false;
    let total = 0;

    selectedSeats.forEach((seat, index) => {
      total += seat.price;
      const chip = document.createElement('span');
      chip.className = 'chip-in inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-xs font-semibold';
      chip.style.animationDelay = `${index * 50}ms`;
      chip.innerHTML = `
        ${seat.col}${seat.row}
        <button onclick="window.__toggleSeat(${seat.row}, '${seat.col}')" class="text-gray-400 hover:text-white transition-colors ml-0.5">&times;</button>
      `;
      chipsContainer.appendChild(chip);
    });

    totalEl.textContent = `$${total.toLocaleString()}`;
    countEl.textContent = selectedSeats.length;
  }

  showAlert(message) {
    const el = document.getElementById('mobile-alert');
    if (!el) return;

    if (!message) {
      el.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
      el.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      return;
    }

    el.textContent = message;
    el.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
    el.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    setTimeout(() => this.showAlert(''), 2500);
  }

  flashSeat(row, col, wasSelected) {
    requestAnimationFrame(() => {
      const btn = document.querySelector(`[data-seat="${row}${col}"]`);
      if (!btn) return;

      btn.classList.add(wasSelected ? 'just-deselected' : 'just-selected');
      setTimeout(() => btn.classList.remove('just-deselected', 'just-selected'), 400);
    });
  }
}
