(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[`A`,`B`,`C`,`D`,`E`,`F`,`G`,`H`],t=[{id:1,label:`Sección 1`,rows:[1,2,3,4]},{id:2,label:`Sección 2`,rows:[1,2,3,4]},{id:3,label:`Sección 3`,rows:[1,2,3,4]}],n={A:85,B:65,C:65,D:85},r=class{constructor(){this.occupiedSeats=new Set,this.selectedSeats=new Map,this.activeSection=1,this.activeSectionId=`1`,this.generateOccupied()}seatId(e,t){return`${e}${t}`}getPrice(e){return n[e]}generateOccupied(){let t=Math.floor(4*e.length*.3);for(;this.occupiedSeats.size<t;){let t=Math.floor(Math.random()*4)+1,n=e[Math.floor(Math.random()*e.length)];this.occupiedSeats.add(this.seatId(t,n))}}getSeatColumns(){return e}getActiveSection(){return t.find(e=>e.id===this.activeSection)??t[0]}getSectionById(e){return t.find(t=>t.id===e)??t[0]}getSeatState(e){return this.occupiedSeats.has(e)?`occupied`:this.selectedSeats.has(e)?`selected`:`available`}toggleSeat(e,t){let n=this.seatId(e,t);return this.occupiedSeats.has(n)?{changed:!1,message:``}:this.selectedSeats.has(n)?(this.selectedSeats.delete(n),{changed:!0,wasSelected:!0,message:``}):this.selectedSeats.size>=4?{changed:!1,message:`Máximo 4 asientos permitidos`}:(this.selectedSeats.set(n,{row:e,col:t,price:this.getPrice(t)}),{changed:!0,wasSelected:!1,message:``})}getSelectedSeatsSorted(){return[...this.selectedSeats.values()].sort((e,t)=>e.row-t.row||e.col.localeCompare(t.col))}getSectionSummary(t=this.activeSection){let n=this.getSectionById(t),r=0;return n.rows.forEach(t=>{e.forEach(e=>{this.occupiedSeats.has(this.seatId(t,e))||(r+=1)})}),{section:n,freeCount:r,title:`${n.label} (${n.id===1?`Ventana`:n.id===2?`Centro`:`Pasillo`})`,info:`${r} asientos &bull; Desde $65`}}};function i({color:e=`#121316`,width:t=32,height:n=32,strokeWidth:r=1.6,className:i=`sv-plane`}={}){return`
    <svg class="${i}" viewBox="0 0 24 24" width="${t}" height="${n}"
      fill="none" stroke="${e}" stroke-width="${r}"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
    </svg>
  `}var a=[{id:`1`,label:`Business`,rows:[1,2,3,4]},{id:`2`,label:`Premium Economy`,rows:[5,6,7]},{id:`3`,label:`Economy`,rows:[8,9,10]}];function o({activeSectionId:e=`1`,selectedRows:t=[],className:n=`w-full h-auto`}={}){return`
    <svg
      id="fuselage"
      class="${n}"
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
        ${[{id:`1`,label:`Business`,x:180,y:86,width:210,height:54},{id:`2`,label:`Premium`,x:390,y:80,width:190,height:58},{id:`3`,label:`Economy`,x:580,y:80,width:220,height:58}].map(({id:t,label:n,x:r,y:i,width:a,height:o})=>{let s=t===e;return`
        <g data-section="${t}" class="aircraft-section-hit" style="cursor:pointer; pointer-events:all;">
          <rect
            x="${r}"
            y="${i}"
            width="${a}"
            height="${o}"
            rx="20"
            fill="${s?`rgba(17, 19, 22, 0.14)`:`rgba(255,255,255,0.04)`}"
            stroke="${s?`#121316`:`rgba(17, 19, 22, 0.08)`}"
            stroke-width="${s?2:1}"
            onclick="window.__selectAircraftSection('${t}')"
          />
          <text x="${r+a/2}" y="${i+34}" text-anchor="middle" fill="#121316" font-size="11" font-weight="800" letter-spacing="1.2" font-family="Inter, sans-serif" opacity="${s?1:.5}">${n}</text>
        </g>
      `}).join(``)}
      </g>
    </svg>
  `}var s=e=>{switch(e){case`occupied`:return`bg-gray-400 cursor-not-allowed`;case`selected`:return`bg-[#5846F6] text-white shadow-md cursor-pointer`;default:return`bg-gray-200 hover:bg-gray-300 cursor-pointer active:scale-90`}},c=class{renderAircraft(e,t){let n=document.getElementById(`fuselage-slot`);n&&(n.innerHTML=o({activeSectionId:e,selectedRows:t}))}renderPlaneIndicator(){let e=document.getElementById(`plane-indicator`);e&&(e.innerHTML=i({width:32,height:32}))}bindSectionTabs(e){document.querySelectorAll(`.viewport-tab`).forEach(t=>{t.addEventListener(`click`,()=>e(parseInt(t.dataset.section,10)))})}setActiveTab(e){document.querySelectorAll(`.viewport-tab`).forEach(t=>{let n=String(t.dataset.section);t.classList.toggle(`is-active`,n===String(e))})}positionLens(e){let t=document.getElementById(`active-lens`),n=document.querySelectorAll(`.viewport-tab`);if(!t||!n.length)return;let r=n.length,i=n[e-1];if(!i)return;let a=t.offsetWidth,o=t.parentElement.offsetWidth,s=(e-.5)/r*100/100*o-a/2,c=o-a,l=Math.max(0,Math.min(c,s));t.style.transform=`translate3d(${l}px, -50%, 0)`;let u=document.getElementById(`active-lens__label`);u&&(u.textContent=i.dataset.label||``)}bindLensDrag(e){let t=document.getElementById(`viewport-stage`),n=document.getElementById(`active-lens`);if(!t||!n)return;let r=document.querySelectorAll(`.viewport-tab`).length,i=e=>{let n=t.getBoundingClientRect(),i=(e-n.left)/n.width;return Math.max(0,Math.min(r-1,Math.floor(i*r)))+1},a=!1;t.addEventListener(`pointerdown`,r=>{a=!0,t.setPointerCapture(r.pointerId);let o=i(r.clientX);o!==Number(n.dataset.section)&&e(o)}),t.addEventListener(`pointermove`,t=>{if(!a)return;let r=t.touches?t.touches[0].clientX:t.clientX,o=i(r);o!==Number(n.dataset.section)&&(n.dataset.section=String(o),e(o))});let o=()=>{a=!1};t.addEventListener(`pointerup`,o),t.addEventListener(`pointercancel`,o)}renderSeatMatrix(e){let t=document.getElementById(`seat-matrix`),n=e.getSectionSummary();if(!t||!n)return;let r=document.getElementById(`section-title`),i=document.getElementById(`section-info`);r&&(r.textContent=n.title),i&&(i.innerHTML=n.info),t.innerHTML=``;let a=e.getSeatColumns(),o=document.createElement(`div`);o.className=`grid items-center gap-2 sm:gap-3 text-center text-xs text-gray-400 font-mono mb-2`,o.style.gridTemplateColumns=`2rem repeat(${a.length}, minmax(0, 1fr))`,o.innerHTML=`<span></span>${n.section.rows.map(e=>`<span>${e}</span>`).join(``)}`,t.appendChild(o),a.forEach((r,i)=>{let o=document.createElement(`div`);o.className=`grid items-center gap-2 sm:gap-3 card-row`,o.style.gridTemplateColumns=`2rem repeat(${a.length}, minmax(0, 1fr))`,o.style.animationDelay=`${i*60}ms`;let c=`<span class="text-xs font-mono text-gray-400 text-center">${r}</span>`;if(n.section.rows.forEach(t=>{let n=e.seatId(t,r),i=e.getSeatState(n),a=s(i);c+=`
          <button
            data-seat="${n}"
            class="seat-btn flex items-center justify-center h-10 sm:h-12 rounded-xl ${a} font-bold text-sm transition-all duration-200 w-full"
            onclick="window.__toggleSeat(${t}, '${r}')"
            ${i===`occupied`?`disabled`:``}
            aria-label="Asiento ${r}${t}"
          >${i===`selected`?`<svg class="w-5 h-5 block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>`:i===`occupied`?``:`${r}`}</button>
        `}),o.innerHTML=c,t.appendChild(o),i===Math.floor(a.length/2)-1){let e=document.createElement(`div`);e.className=`h-3 sm:h-4`,t.appendChild(e)}})}renderDock(e=[]){let t=document.getElementById(`selected-chips`),n=document.getElementById(`dock-total`),r=document.getElementById(`dock-count`),i=document.getElementById(`dock-btn`);if(!t||!n||!r||!i)return;if(t.innerHTML=``,e.length===0){let e=document.getElementById(`chips-empty`)??document.createElement(`span`);e.id=`chips-empty`,e.className=`text-xs text-gray-400 italic`,e.textContent=`Selecciona tus asientos`,t.appendChild(e),n.textContent=`$0`,r.textContent=`0`,i.disabled=!0;return}i.disabled=!1;let a=0;e.forEach((e,n)=>{a+=e.price;let r=document.createElement(`span`);r.className=`chip-in inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-xs font-semibold`,r.style.animationDelay=`${n*50}ms`,r.innerHTML=`
        ${e.col}${e.row}
        <button onclick="window.__toggleSeat(${e.row}, '${e.col}')" class="text-gray-400 hover:text-white transition-colors ml-0.5">&times;</button>
      `,t.appendChild(r)}),n.textContent=`$${a.toLocaleString()}`,r.textContent=e.length}showAlert(e){let t=document.getElementById(`mobile-alert`);if(t){if(!e){t.classList.add(`opacity-0`,`pointer-events-none`,`translate-y-2`),t.classList.remove(`opacity-100`,`pointer-events-auto`,`translate-y-0`);return}t.textContent=e,t.classList.remove(`opacity-0`,`pointer-events-none`,`translate-y-2`),t.classList.add(`opacity-100`,`pointer-events-auto`,`translate-y-0`),setTimeout(()=>this.showAlert(``),2500)}}flashSeat(e,t,n){requestAnimationFrame(()=>{let r=document.querySelector(`[data-seat="${e}${t}"]`);r&&(r.classList.add(n?`just-deselected`:`just-selected`),setTimeout(()=>r.classList.remove(`just-deselected`,`just-selected`),400))})}};new class{constructor(){this.model=new r,this.view=new c,this.view.renderPlaneIndicator(),this.view.renderAircraft(this.model.activeSection,this.getSelectedRows()),this.view.bindSectionTabs(e=>this.switchToSection(e)),this.view.setActiveTab(this.model.activeSection),this.view.bindLensDrag(e=>this.switchToSection(e)),requestAnimationFrame(()=>{this.view.positionLens(this.model.activeSection)}),window.addEventListener(`resize`,()=>{this.view.positionLens(this.model.activeSection)}),window.__toggleSeat=(e,t)=>this.toggleSeat(e,t),window.__selectAircraftSection=e=>this.switchToSection(Number(e)),this.render()}getSelectedRows(){return this.model.getSelectedSeatsSorted().map(e=>e.row)}switchToSection(e){this.model.activeSection!==e&&(this.model.activeSection=e,this.model.activeSectionId=String(e),this.view.setActiveTab(e),this.view.renderAircraft(String(e),this.getSelectedRows()),this.view.positionLens(e),this.render())}toggleSeat(e,t){let n=this.model.toggleSeat(e,t);if(!n.changed)return n.message&&this.view.showAlert(n.message),n;let r=a.find(t=>t.rows.includes(e)),i=String(r?r.id:this.model.activeSection);return this.view.renderAircraft(i,this.getSelectedRows()),this.render(),this.view.flashSeat(e,t,n.wasSelected),n}render(){this.view.renderSeatMatrix(this.model),this.view.renderDock(this.model.getSelectedSeatsSorted()),this.view.positionLens(this.model.activeSection)}};