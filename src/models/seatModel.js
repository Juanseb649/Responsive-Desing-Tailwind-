export const ROWS = 10;
export const COLS = ['A', 'B', 'C', 'D'];
export const MAX_SEATS = 4;

export const SECTIONS = [
  { id: 1, label: 'Sección 1', rows: [1, 2, 3, 4] },
  { id: 2, label: 'Sección 2', rows: [5, 6, 7] },
  { id: 3, label: 'Sección 3', rows: [8, 9, 10] },
];

export const PRICES = { A: 85, B: 65, C: 65, D: 85 };

export class SeatModel {
  constructor() {
    this.occupiedSeats = new Set();
    this.selectedSeats = new Map();
    this.activeSection = 1;
    this.activeSectionId = '1'; // prop expuesta por la spec (string)
    this.generateOccupied();
  }

  seatId(row, col) {
    return `${row}${col}`;
  }

  getPrice(col) {
    return PRICES[col];
  }

  generateOccupied() {
    const total = Math.floor(ROWS * COLS.length * 0.3);
    while (this.occupiedSeats.size < total) {
      const row = Math.floor(Math.random() * ROWS) + 1;
      const col = COLS[Math.floor(Math.random() * COLS.length)];
      this.occupiedSeats.add(this.seatId(row, col));
    }
  }

  getActiveSection() {
    return SECTIONS.find((section) => section.id === this.activeSection) ?? SECTIONS[0];
  }

  getSectionById(sectionId) {
    return SECTIONS.find((section) => section.id === sectionId) ?? SECTIONS[0];
  }

  getSeatState(id) {
    if (this.occupiedSeats.has(id)) return 'occupied';
    if (this.selectedSeats.has(id)) return 'selected';
    return 'available';
  }

  toggleSeat(row, col) {
    const id = this.seatId(row, col);

    if (this.occupiedSeats.has(id)) {
      return { changed: false, message: '' };
    }

    const wasSelected = this.selectedSeats.has(id);

    if (wasSelected) {
      this.selectedSeats.delete(id);
      return { changed: true, wasSelected: true, message: '' };
    }

    if (this.selectedSeats.size >= MAX_SEATS) {
      return { changed: false, message: `Máximo ${MAX_SEATS} asientos permitidos` };
    }

    this.selectedSeats.set(id, { row, col, price: this.getPrice(col) });
    return { changed: true, wasSelected: false, message: '' };
  }

  getSelectedSeatsSorted() {
    return [...this.selectedSeats.values()].sort((a, b) => a.row - b.row || a.col.localeCompare(b.col));
  }

  getSectionSummary(sectionId = this.activeSection) {
    const section = this.getSectionById(sectionId);
    let freeCount = 0;

    section.rows.forEach((row) => {
      COLS.forEach((col) => {
        if (!this.occupiedSeats.has(this.seatId(row, col))) freeCount += 1;
      });
    });

    return {
      section,
      freeCount,
      title: `${section.label} (${section.id === 1 ? 'Ventana' : section.id === 2 ? 'Centro' : 'Pasillo'})`,
      info: `${freeCount} asientos &bull; Desde $65`,
    };
  }
}
