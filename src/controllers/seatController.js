import { SeatModel } from '../models/seatModel.js';
import { SeatView } from '../views/seatView.js';
import { AIRCRAFT_SECTIONS } from '../components/aircraftSVG.js';

export class SeatController {
  constructor() {
    this.model = new SeatModel();
    this.view = new SeatView();

    this.view.renderPlaneIndicator();
    this.view.renderAircraft(this.model.activeSection, this.getSelectedRows());

    this.view.bindSectionTabs((sectionId) => this.switchToSection(sectionId));
    this.view.setActiveTab(this.model.activeSection);
    this.view.bindLensDrag((sectionId) => this.switchToSection(sectionId));

    // Posiciona el lens tras el primer paint
    requestAnimationFrame(() => {
      this.view.positionLens(this.model.activeSection);
    });

    window.addEventListener('resize', () => {
      this.view.positionLens(this.model.activeSection);
    });

    window.__toggleSeat = (row, col) => this.toggleSeat(row, col);
    window.__selectAircraftSection = (sectionId) => this.switchToSection(Number(sectionId));
    this.render();
  }

  getSelectedRows() {
    return this.model.getSelectedSeatsSorted().map((seat) => seat.row);
  }

  switchToSection(sectionId) {
    if (this.model.activeSection === sectionId) return;
    this.model.activeSection = sectionId;

    this.model.activeSectionId = String(sectionId);
    this.view.setActiveTab(sectionId);
    this.view.renderAircraft(String(sectionId), this.getSelectedRows());
    this.view.positionLens(sectionId);
    this.render();
  }

  toggleSeat(row, col) {
    const result = this.model.toggleSeat(row, col);

    if (!result.changed) {
      if (result.message) this.view.showAlert(result.message);
      return result;
    }

    // Actualiza minimap (ventanas seleccionadas) y resto del UI
    const section = AIRCRAFT_SECTIONS.find((s) => s.rows.includes(row));
    const sectionId = String(section ? section.id : this.model.activeSection);
    this.view.renderAircraft(sectionId, this.getSelectedRows());

    this.render();
    this.view.flashSeat(row, col, result.wasSelected);
    return result;
  }

  render() {
    this.view.renderSeatMatrix(this.model);
    this.view.renderDock(this.model.getSelectedSeatsSorted());
    this.view.positionLens(this.model.activeSection);
  }
}
