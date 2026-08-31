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
          <text x="${x + width / 2}" y="${y + 34}" text-anchor="middle" fill="#121316" font-size="11" font-weight="800" letter-spacing="1.2" font-family="Inter, sans-serif" opacity="${isActive ? 1 : 0.6}">${label}</text>
        </g>
      `;
    })
    .join('');

  // ---------- Dibujo vectorial del avión widebody (estilo sketch) ----------
  // Nariz a la izquierda (Business/delante), cola a la derecha (Economy/atrás).
  const STROKE = '#121316';
  const SW = 2; // grosor de línea del dibujo
  const fillLight = '#F8F9FB';
  const fillMid = '#E7E9EE';
  const fillDark = '#C9CDD6';

  // Ventanas de pasajeros (fila central)
  const windows = [];
  for (let x = 195; x <= 805; x += 26) {
    windows.push(`<rect x="${x}" y="96" width="13" height="13" rx="6.5" fill="#fff" stroke="${STROKE}" stroke-width="1.4"/>`);
  }

  // Puertas de pasajeros
  const doors = [
    [210, 'delantera'],
    [480, 'central'],
    [760, 'trasera'],
  ]
    .map(([dx]) =>
      `<path d="M ${dx} 72 L ${dx} 150" stroke="${STROKE}" stroke-width="2" stroke-linecap="round"/>
       <path d="M ${dx + 6} 74 L ${dx + 6} 148" stroke="#C9CDD6" stroke-width="1.2" stroke-linecap="round"/>`
    )
    .join('');

  return `
    <svg
      id="fuselage"
      class="${className}"
      viewBox="0 0 980 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Dibujo del avión de fuselaje ancho"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="sketchShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#C9CDD6" flood-opacity="0.6"/>
        </filter>
      </defs>

      <!-- sombra en el suelo -->
      <ellipse cx="485" cy="196" rx="345" ry="12" fill="#E7E9EE" opacity="0.85" />

      <g filter="url(#sketchShadow)">

        <!-- ===== Ala trasera (lejana) ===== -->
        <!-- Capa superior: se ve por encima del fuselaje hacia atrás -->
        <path d="M 570 60 C 625 44 690 42 742 52 L 738 58 C 688 50 628 52 574 66 Z" fill="${fillMid}" stroke="${STROKE}" stroke-width="1.6"/>

        <!-- ===== Timón vertical + estabilizador horizontal (cola derecha) ===== -->
        <path d="M 748 62 C 782 20 850 12 902 30 L 912 58 C 858 50 796 50 752 66 Z" fill="${fillLight}" stroke="${STROKE}" stroke-width="${SW}"/>
        <path d="M 756 64 L 900 60 C 892 74 872 78 850 78 L 770 76 Z" fill="${fillMid}" stroke="${STROKE}" stroke-width="1.6"/>

        <!-- ===== Fuselaje (puro widebody, nariz izquierda) ===== -->
        <!-- mitad superior -->
        <path
          d="M 58 110
             C 58 72 94 52 154 50
             C 300 46 640 46 742 52
             C 812 56 858 82 872 110
             C 858 138 812 164 742 168
             C 640 174 300 174 154 170
             C 94 168 58 148 58 110
             Z"
          fill="${fillLight}"
          stroke="${STROKE}"
          stroke-width="${SW}"
          stroke-linejoin="round"
        />

        <!-- línea dorsal (lomo) -->
        <path d="M 160 60 C 320 52 620 52 730 60" stroke="#D6DAE1" stroke-width="1.4" fill="none"/>

        <!-- ===== cabina / ventanas frontales (nariz) ===== -->
        <path d="M 86 88 C 92 72 108 66 120 70 L 120 94 L 88 90 Z" fill="#121316" opacity="0.85"/>
        <path d="M 94 86 C 98 76 106 73 112 74 L 112 92 L 92 89 Z" fill="#fff"/>
        <circle cx="124" cy="94" r="4" fill="#121316" opacity="0.85"/>

        <!-- ===== ventanas de pasajeros ===== -->
        ${windows.join('')}

        <!-- ===== puertas de pasajeros ===== -->
        ${doors}

        <!-- ===== Ala delantera (cercana, desde el fuselaje) ===== -->
        <path
          d="M 376 118 C 446 140 526 150 612 142 L 600 162 C 530 174 444 168 368 150 Z"
          fill="${fillMid}"
          stroke="${STROKE}"
          stroke-width="${SW}"
          stroke-linejoin="round"
        />

        <!-- ===== Motor izquierdo (bajo el ala delantera) ===== -->
        <path d="M 440 158 C 460 152 500 152 520 156 C 536 160 532 174 512 176 C 470 184 430 180 428 170 Z"
          fill="${fillLight}" stroke="${STROKE}" stroke-width="${SW}" stroke-linejoin="round"/>

        <!-- ===== Ala trasera cercana (segunda ala, desde el fuselaje) ===== -->
        <path d="M 500 132 C 560 146 620 152 700 142 L 690 150 C 610 160 540 152 492 140 Z"
          fill="${fillDark}" stroke="${STROKE}" stroke-width="1.6" stroke-linejoin="round"/>

      </g>

      <g>
        ${hotspots}
      </g>
    </svg>
  `;
}
