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
  const isBusiness = activeSectionId === '1';
  const isPremium = activeSectionId === '2';

  const sectionLabel = isBusiness ? 'BUSINESS' : isPremium ? 'PREMIUM' : 'ECONOMY';

  const windows = [
    { x: 200, active: isBusiness },
    { x: 270, active: isBusiness },
    { x: 340, active: isBusiness },
    { x: 410, active: isPremium },
    { x: 480, active: isPremium },
    { x: 550, active: isPremium },
    { x: 620, active: !isBusiness && !isPremium },
    { x: 690, active: !isBusiness && !isPremium },
  ];

  const windowDots = windows
    .map(({ x, active }) => {
      const fill = active ? '#1A1B1F' : '#dfe4ea';
      return `<circle cx="${x}" cy="110" r="8" fill="${fill}" />`;
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
    >
      <defs>
        <linearGradient id="aircraftBody" x1="0" x2="1">
          <stop offset="0" stop-color="#f7f7f5" />
          <stop offset="1" stop-color="#eaeaea" />
        </linearGradient>
      </defs>

      <g>
        <ellipse cx="500" cy="178" rx="360" ry="13" fill="#E7E8EB" opacity="0.8" />

        <path d="M82 110C82 76 106 48 146 42L192 42C222 42 242 60 252 76L265 95L271 94C281 102 298 105 315 105H664C679 105 695 102 705 94L711 95L724 76C734 60 754 42 784 42H830C870 48 894 76 894 110V128C894 160 874 176 838 176H728C704 176 687 190 649 190H340C302 190 285 176 261 176H142C106 176 82 160 82 128V110Z" fill="url(#aircraftBody)" stroke="#B9BDC5" stroke-width="2.5"/>

        <path d="M154 74H831" stroke="#C5CAD2" stroke-width="2" stroke-linecap="round" />

        <path d="M195 140H782" stroke="#D4D8DE" stroke-width="2" stroke-linecap="round" stroke-dasharray="0 8" opacity="0.9" />

        <g>
          ${windowDots}
        </g>

        <g opacity="0.9">
          <rect x="356" y="178" width="96" height="18" rx="9" fill="#121316"/>
          <rect x="528" y="178" width="96" height="18" rx="9" fill="#121316"/>
        </g>

        <path d="M760 78L818 52L884 52L840 78L760 78Z" fill="#F1F2F4" stroke="#B9BDC5" stroke-width="2.5"/>
        <path d="M864 52L894 42L918 44L902 60L864 52Z" fill="#121316"/>

        <path d="M111 104L150 72L183 72L154 104H111Z" fill="#F2F3F5" stroke="#B9BDC5" stroke-width="2.5"/>

        <g>
          <rect x="315" y="98" width="158" height="24" rx="12" fill="rgba(17,19,22,0.92)"/>
          <text x="394" y="115" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="800" letter-spacing="1.2" font-family="Inter, sans-serif">${sectionLabel}</text>
        </g>
      </g>
    </svg>
  `;
}
