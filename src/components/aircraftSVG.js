export const AIRCRAFT_SECTIONS = [
  { id: '1', label: 'Business', rows: [1, 2, 3, 4] },
  { id: '2', label: 'Premium Economy', rows: [5, 6, 7] },
  { id: '3', label: 'Economy', rows: [8, 9, 10] },
];

/**
 * Componente SVG paramétrico del fuselaje Airbus A320neo (vista lateral).
 * Geométria basada en un viewBox 920x260, apuntando hacia la derecha.
 *
 * Props:
 *  - activeSectionId {string}  id de la sección activa (para pintar ventanas)
 *  - selectedRows    {Array<number>} filas con asientos seleccionados
 *  - className       {string}  clases utilitarias para el contenedor svg
 */
export function renderAircraftSVG({
  activeSectionId = '1',
  selectedRows = [],
  className = 'w-full h-auto',
} = {}) {
  const sectionData = [
    { id: '1', label: 'Business', x: 180, y: 86, width: 210, height: 54 },
    { id: '2', label: 'Premium', x: 390, y: 80, width: 190, height: 58 },
    { id: '3', label: 'Economy', x: 580, y: 80, width: 220, height: 58 },
  ];

  const hotspots = sectionData
    .map(({ id, label, x, y, width, height }) => {
      const isActive = id === activeSectionId;
      const fill = isActive ? 'rgba(17, 19, 22, 0.14)' : 'rgba(255,255,255,0.04)';
      const stroke = isActive ? '#121316' : 'rgba(17, 19, 22, 0.08)';
      return `
        <g data-section="${id}" class="aircraft-section-hit" style="cursor:pointer; pointer-events:all;">
          <rect
            x="${x}"
            y="${y}"
            width="${width}"
            height="${height}"
            rx="20"
            fill="${fill}"
            stroke="${stroke}"
            stroke-width="${isActive ? 2 : 1}"
            onclick="window.__selectAircraftSection('${id}')"
          />
          <text x="${x + width / 2}" y="${y + 34}" text-anchor="middle" fill="#121316" font-size="11" font-weight="800" letter-spacing="1.2" font-family="Inter, sans-serif" opacity="${isActive ? 1 : 0.5}">${label}</text>
        </g>
      `;
    })
    .join('');

  return `
    <svg
      id="fuselage"
      class="${className}"
      viewBox="0 0 980 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mapa del avión A320neo"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="planeShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#D0D5DD" flood-opacity="0.5"/>
        </filter>
      </defs>

      <ellipse cx="480" cy="182" rx="350" ry="14" fill="#E7E8EB" opacity="0.9" />

      <g filter="url(#planeShadow)">
        <image
          href="https://www.shutterstock.com/image-photo/isolated-widebody-jet-passenger-aircraft-260nw-2490224859.jpg"
          x="70"
          y="32"
          width="840"
          height="140"
          preserveAspectRatio="xMidYMid meet"
          opacity="0.95"
        />
      </g>

      <g>
        ${hotspots}
      </g>
    </svg>
  `;
}
