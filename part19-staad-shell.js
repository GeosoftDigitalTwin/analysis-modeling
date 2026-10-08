/* GeoSoft Structural Modeller — part 19: the STAAD-layout shell, in GeoSoft green.
   Title band and menu tabs, ribbon with large and small buttons in labelled groups,
   Workflow panel, workflow bar, a framed viewport window, docked tables and panes,
   and a segmented status bar. Every button either runs a real command or is shown
   disabled with the reason, as the hand-off rules require. */

/* ---------------- icons: original two-tone glyphs, 24-unit grid ---------------- */
const SXI = (() => {
  const F = 'var(--ico-fill)', K = 'currentColor', G = '#1E8F4E', O = '#E8912D', R = '#D9433A', Y = '#F2C230';
  const st = (w = 1.5) => `fill="none" stroke="${K}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  return {
    save: `<path d="M4 3h13l3 3v15H4z" fill="${F}" stroke="${K}" stroke-width="1.3"/><rect x="7" y="3" width="9" height="6" fill="#fff" stroke="${K}" stroke-width="1.2"/><rect x="7" y="13" width="10" height="7" fill="#fff" stroke="${K}" stroke-width="1.2"/>`,
    open: `<path d="M2 6h7l2 2h10v12H2z" fill="${Y}" stroke="#A67C00" stroke-width="1.2"/><path d="M2 11h20l-2 9H2z" fill="#FFD966" stroke="#A67C00" stroke-width="1.2"/>`,
    undo: `<path d="M9 7L4 12l5 5" ${st(2)}/><path d="M4 12h10a6 6 0 0 1 0 12" ${st(2)} transform="translate(0,-5)"/>`,
    redo: `<path d="M15 7l5 5-5 5" ${st(2)}/><path d="M20 12H10a6 6 0 0 0 0 12" ${st(2)} transform="translate(0,-5)"/>`,
    cut: `<circle cx="7" cy="18" r="3" ${st()}/><circle cx="17" cy="18" r="3" ${st()}/><path d="M8.5 15.5L17 3M15.5 15.5L7 3" ${st()}/>`,
    copy: `<rect x="8" y="7" width="12" height="14" fill="#fff" stroke="${K}" stroke-width="1.3"/><path d="M5 17V3h11" ${st(1.3)}/>`,
    paste: `<rect x="4" y="4" width="13" height="17" rx="1" fill="#E9C46A" stroke="#9A7B1C" stroke-width="1.2"/><rect x="8" y="2.5" width="5" height="3" fill="#fff" stroke="#9A7B1C"/><rect x="10" y="10" width="10" height="12" fill="#fff" stroke="${K}" stroke-width="1.2"/>`,
    del: `<path d="M5 5l14 14M19 5L5 19" stroke="${R}" stroke-width="3" stroke-linecap="round"/>`,
    grids: `<path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" fill="#fff" stroke="${K}" stroke-width="1.2"/><path d="M15 15h6v6h-6z" fill="${F}"/>`,
    wizard: `<path d="M4 20V9l8-5 8 5v11z" fill="${F}" stroke="${K}" stroke-width="1.3"/><path d="M4 9h16M8 9v11M16 9v11M4 14.5h16" ${st(1.1)}/><path d="M17 2l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="${O}"/>`,
    repeat: `<rect x="3" y="12" width="7" height="9" fill="${F}" stroke="${K}"/><rect x="14" y="12" width="7" height="9" fill="none" stroke="${K}" stroke-dasharray="2 1.5"/><path d="M6 9q6-6 12 0M16 7l2 2 2-2" ${st(1.4)}/>`,
    circ: `<circle cx="12" cy="12" r="8" fill="none" stroke="${K}" stroke-dasharray="2 2"/><rect x="9" y="2" width="6" height="5" fill="${F}" stroke="${K}"/><rect x="17" y="10" width="5" height="5" fill="${F}" stroke="${K}"/><rect x="9" y="17" width="6" height="5" fill="${F}" stroke="${K}"/>`,
    mirror: `<path d="M12 2v20" stroke="${G}" stroke-dasharray="2 2" stroke-width="1.5"/><path d="M10 6L3 18h7z" fill="${F}" stroke="${K}" stroke-width="1.2"/><path d="M14 6l7 12h-7z" fill="none" stroke="${K}" stroke-width="1.2"/>`,
    rotate: `<rect x="5" y="9" width="9" height="9" fill="${F}" stroke="${K}"/><path d="M14 4a8 8 0 0 1 6 9" ${st(1.5)}/><path d="M17 12l3 2 2-3" ${st(1.5)}/>`,
    movenode: `<path d="M12 2v20M2 12h20M12 2l-3 3M12 2l3 3M22 12l-3-3M22 12l-3 3M12 22l-3-3M12 22l3-3M2 12l3-3M2 12l3 3" ${st(1.4)}/><circle cx="12" cy="12" r="3" fill="${G}"/>`,
    mergenode: `<circle cx="8" cy="12" r="5" fill="${F}" stroke="${K}" stroke-width="1.3"/><circle cx="16" cy="12" r="5" fill="none" stroke="${K}" stroke-width="1.3"/>`,
    renum: `<circle cx="12" cy="12" r="9" fill="${F}" stroke="${K}" stroke-width="1.3"/><text x="6.5" y="16" font-size="10" font-family="Segoe UI,Arial" font-weight="700" fill="${K}">12</text>`,
    addbeam: `<path d="M3 21L21 3" stroke="${F}" stroke-width="6"/><path d="M3 21L21 3" stroke="${K}" stroke-width="1.4"/><rect x="2" y="18" width="4" height="4" fill="${K}"/><rect x="18" y="2" width="4" height="4" fill="${K}"/><path d="M16 15v6M13 18h6" stroke="${G}" stroke-width="2.4"/>`,
    beamlayout: `<path d="M3 6h18M3 12h18M3 18h18" stroke="${K}" stroke-width="1.6"/><path d="M6 4v16M18 4v16" stroke="${F}" stroke-width="2"/>`,
    insnode: `<path d="M3 12h18" stroke="${K}" stroke-width="2"/><circle cx="12" cy="12" r="3.2" fill="${G}"/><circle cx="3" cy="12" r="2" fill="${K}"/><circle cx="21" cy="12" r="2" fill="${K}"/>`,
    stretch: `<path d="M3 12h12" stroke="${K}" stroke-width="2"/><path d="M15 12h6M18 9l3 3-3 3" ${st(1.5)}/>`,
    intersect: `<path d="M4 4l16 16M20 4L4 20" stroke="${K}" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="${G}"/>`,
    split: `<path d="M3 12h7M14 12h7" stroke="${K}" stroke-width="2"/><path d="M12 6v12" stroke="${G}" stroke-width="2"/>`,
    addplate: `<path d="M3 8l13-5 5 11-13 6z" fill="${F}" stroke="${K}" stroke-width="1.4"/><path d="M17 15v6M14 18h6" stroke="${G}" stroke-width="2.4"/>`,
    platelayout: `<path d="M3 6l9-3 9 3-9 3zM3 12l9-3 9 3-9 3zM3 18l9-3 9 3-9 3z" fill="${F}" stroke="${K}" stroke-width="1"/>`,
    parametric: `<path d="M3 4h18v16H3z" fill="${F}" stroke="${K}" stroke-width="1.2"/><circle cx="12" cy="12" r="4" fill="#fff" stroke="${K}"/><path d="M3 8h18M3 16h18M8 4v16M16 4v16" stroke="${K}" stroke-width=".6"/>`,
    mesh: `<path d="M3 5l12-3 6 9-12 4z" fill="${F}" stroke="${K}" stroke-width="1.2"/><path d="M6 4.3l6 9.7M9 3.5l6 9.5M3 5l6 10M15 2l6 9M4.5 7.8l13.3-3.1M6 10.5l13.5-3.1M7.5 13l13.3-3" stroke="${K}" stroke-width=".6"/>`,
    addsolid: `<path d="M4 7l8-4 8 4v10l-8 4-8-4z" fill="${F}" stroke="${K}" stroke-width="1.3"/><path d="M4 7l8 4 8-4M12 11v10" ${st(1.1)}/><path d="M18 16v6M15 19h6" stroke="${G}" stroke-width="2.4"/>`,
    solidlayout: `<path d="M4 9l8-4 8 4-8 4z" fill="${F}" stroke="${K}"/><path d="M4 14l8 4 8-4M4 9v5M20 9v5" ${st(1)}/>`,
    physical: `<path d="M3 20V8h4v12M10 20V4h4v16M17 20V11h4v9" fill="${F}" stroke="${K}" stroke-width="1.2"/><path d="M2 20h20" stroke="${K}" stroke-width="1.5"/>`,
    deck: `<path d="M2 13l10-5 10 5-10 5z" fill="${F}" stroke="${K}" stroke-width="1.2"/><path d="M5 11.5l10 5M8 10l10 5M11 8.5l10 5" stroke="${K}" stroke-width=".7"/><path d="M2 13v3l10 5 10-5v-3" ${st(1.1)}/>`,
    heal: `<path d="M3 12h7M14 12h7M12 3v7M12 14v7" stroke="${K}" stroke-width="1.8"/><circle cx="12" cy="12" r="3.5" fill="${G}" stroke="#0B5A35"/><path d="M10.5 12l1.2 1.2 2-2.4" stroke="#fff" stroke-width="1.2" fill="none"/>`,
    addnode: `<rect x="7" y="7" width="10" height="10" fill="${K}"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="${K}" stroke-width="1.4"/><path d="M18 16v6M15 19h6" stroke="${G}" stroke-width="2.4"/>`,
    xyz: `<path d="M5 19V5M5 19h14M5 19l9-6" ${st(1.6)}/><circle cx="14" cy="13" r="2.4" fill="${G}"/>`,
    table: `<rect x="3" y="4" width="18" height="16" fill="#fff" stroke="${K}" stroke-width="1.2"/><path d="M3 9h18M3 14h18M9 4v16" stroke="${K}" stroke-width="1"/><rect x="3" y="4" width="18" height="5" fill="${F}" stroke="${K}" stroke-width="1"/>`,
    label: `<path d="M3 7h12l6 5-6 5H3z" fill="${F}" stroke="${K}" stroke-width="1.3"/><text x="5" y="15" font-size="7.5" font-family="Segoe UI,Arial" font-weight="700" fill="${K}">123</text>`,
    lblN: `<circle cx="8" cy="15" r="3" fill="${K}"/><text x="11" y="11" font-size="9" font-family="Arial" font-weight="700" fill="${G}">N</text>`,
    lblB: `<path d="M3 20L15 8" stroke="${K}" stroke-width="2"/><text x="13" y="11" font-size="9" font-family="Arial" font-weight="700" fill="${G}">B</text>`,
    lblP: `<path d="M2 14l8-3 5 5-8 3z" fill="${F}" stroke="${K}"/><text x="13" y="11" font-size="9" font-family="Arial" font-weight="700" fill="${G}">P</text>`,
    lblS: `<path d="M3 5h10v3H9.5v8H13v3H3v-3h3.5V8H3z" fill="${K}"/><text x="15" y="13" font-size="9" font-family="Arial" font-weight="700" fill="${G}">S</text>`,
    lblR: `<path d="M2 14h5M11 14h5" stroke="${K}" stroke-width="2"/><circle cx="9" cy="14" r="2" fill="none" stroke="${K}" stroke-width="1.4"/><text x="15" y="10" font-size="9" font-family="Arial" font-weight="700" fill="${G}">R</text>`,
    lblSup: `<path d="M8 6l-5 9h10z" fill="${F}" stroke="${K}" stroke-width="1.2"/><path d="M2 18h12" stroke="${K}" stroke-width="1.5"/><text x="15" y="12" font-size="9" font-family="Arial" font-weight="700" fill="${G}">⊥</text>`,
    zoomwin: `<rect x="2" y="2" width="16" height="13" fill="none" stroke="${K}" stroke-dasharray="2 1.5" stroke-width="1.3"/><circle cx="13" cy="13" r="5" fill="#fff" stroke="${O}" stroke-width="2"/><path d="M16.5 16.5L22 22" stroke="${O}" stroke-width="2.6" stroke-linecap="round"/>`,
    whole: `<rect x="2" y="2" width="20" height="20" fill="none" stroke="${K}" stroke-width="1.3"/><path d="M12 5v14M5 12h14M12 5l-2.5 2.5M12 5l2.5 2.5M19 12l-2.5-2.5M19 12l-2.5 2.5M12 19l-2.5-2.5M12 19l2.5-2.5M5 12l2.5-2.5M5 12l2.5 2.5" ${st(1.4)}/>`,
    zin: `<circle cx="10" cy="10" r="6.5" fill="#fff" stroke="${K}" stroke-width="1.6"/><path d="M15 15l6 6" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/><path d="M7 10h6M10 7v6" stroke="${K}" stroke-width="1.6"/>`,
    zout: `<circle cx="10" cy="10" r="6.5" fill="#fff" stroke="${K}" stroke-width="1.6"/><path d="M15 15l6 6" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/><path d="M7 10h6" stroke="${K}" stroke-width="1.6"/>`,
    zprev: `<circle cx="10" cy="10" r="6.5" fill="#fff" stroke="${K}" stroke-width="1.6"/><path d="M15 15l6 6" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/><path d="M12 7l-3 3 3 3" ${st(1.5)}/>`,
    zsel: `<circle cx="10" cy="10" r="6.5" fill="${F}" stroke="${K}" stroke-width="1.6"/><path d="M15 15l6 6" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/><rect x="7.5" y="7.5" width="5" height="5" fill="${G}"/>`,
    pan: `<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5V4a1.5 1.5 0 0 1 3 0v7V5.5a1.5 1.5 0 0 1 3 0V12v-3a1.5 1.5 0 0 1 3 0v6c0 4-3 7-7 7s-6-2-8-5l-2-3a1.5 1.5 0 0 1 2.5-1.6z" fill="#fff" stroke="${K}" stroke-width="1.2"/>`,
    persp: `<path d="M3 5l18-3v20L3 19z" fill="${F}" stroke="${K}" stroke-width="1.3"/><path d="M3 12h18" stroke="${K}" stroke-width=".8" stroke-dasharray="2 1"/>`,
    viso: `<path d="M4 7l8-4 8 4v10l-8 4-8-4z" fill="${F}" stroke="${K}" stroke-width="1.3"/><path d="M4 7l8 4 8-4M12 11v10" ${st(1.1)}/>`,
    vfront: `<path d="M4 7l8-4 8 4v10l-8 4-8-4z" fill="#fff" stroke="${K}" stroke-width="1.2"/><path d="M4 7l8 4v10l-8-4z" fill="${G}" fill-opacity=".55" stroke="${K}"/>`,
    vback: `<path d="M4 7l8-4 8 4v10l-8 4-8-4z" fill="#fff" stroke="${K}" stroke-width="1.2"/><path d="M12 3l8 4v10l-8-4z" fill="${G}" fill-opacity=".35" stroke="${K}" stroke-dasharray="2 1"/>`,
    vleft: `<path d="M4 7l8-4 8 4v10l-8 4-8-4z" fill="#fff" stroke="${K}" stroke-width="1.2"/><path d="M4 7l8-4v10l-8 4z" fill="${G}" fill-opacity=".45" stroke="${K}" stroke-dasharray="2 1"/>`,
    vright: `<path d="M4 7l8-4 8 4v10l-8 4-8-4z" fill="#fff" stroke="${K}" stroke-width="1.2"/><path d="M12 11l8-4v10l-8 4z" fill="${G}" fill-opacity=".55" stroke="${K}"/>`,
    vtop: `<path d="M4 7l8-4 8 4v10l-8 4-8-4z" fill="#fff" stroke="${K}" stroke-width="1.2"/><path d="M4 7l8-4 8 4-8 4z" fill="${G}" fill-opacity=".55" stroke="${K}"/>`,
    vbottom: `<path d="M4 7l8-4 8 4v10l-8 4-8-4z" fill="#fff" stroke="${K}" stroke-width="1.2"/><path d="M4 17l8-4 8 4-8 4z" fill="${G}" fill-opacity=".45" stroke="${K}" stroke-dasharray="2 1"/>`,
    openview: `<rect x="2" y="4" width="20" height="15" fill="#fff" stroke="${K}" stroke-width="1.2"/><rect x="2" y="4" width="20" height="4" fill="${F}"/><path d="M14 13h6M17 10l3 3-3 3" ${st(1.3)}/>`,
    newview: `<rect x="2" y="4" width="15" height="12" fill="#fff" stroke="${K}" stroke-width="1.2"/><rect x="7" y="9" width="15" height="12" fill="${F}" stroke="${K}" stroke-width="1.2"/>`,
    selobj: `<rect x="3" y="3" width="18" height="18" fill="#fff" stroke="${K}" stroke-width="1.2"/><rect x="7" y="7" width="7" height="7" fill="${G}"/><path d="M13 13l7 3-3 1-1 3z" fill="#222"/>`,
    viewmgmt: `<rect x="2" y="3" width="20" height="14" fill="#fff" stroke="${K}" stroke-width="1.3"/><rect x="2" y="3" width="20" height="3.5" fill="${F}"/><circle cx="17" cy="17" r="4.5" fill="#9AA3AD" stroke="#59616A"/><circle cx="17" cy="17" r="1.6" fill="#fff"/>`,
    dispopt: `<rect x="2" y="3" width="13" height="10" fill="#fff" stroke="${K}"/><rect x="9" y="11" width="13" height="10" fill="${F}" stroke="${K}"/>`,
    colors: `<rect x="3" y="3" width="18" height="18" fill="#fff" stroke="${K}"/><path d="M3 7h18" stroke="${R}" stroke-width="3"/><path d="M3 12h18" stroke="${O}" stroke-width="3"/><path d="M3 17h18" stroke="${G}" stroke-width="3"/>`,
    tooltip: `<path d="M3 4h18v11H11l-5 5v-5H3z" fill="#FFF7C2" stroke="#9A7B1C" stroke-width="1.2"/><path d="M6 8h12M6 11h8" stroke="#9A7B1C"/>`,
    cascade: `<rect x="2" y="2" width="13" height="10" fill="#fff" stroke="${K}"/><rect x="5" y="6" width="13" height="10" fill="#fff" stroke="${K}"/><rect x="8" y="10" width="13" height="10" fill="${F}" stroke="${K}"/>`,
    tileh: `<rect x="2" y="3" width="20" height="8" fill="${F}" stroke="${K}"/><rect x="2" y="13" width="20" height="8" fill="#fff" stroke="${K}"/>`,
    tilev: `<rect x="2" y="3" width="9" height="18" fill="${F}" stroke="${K}"/><rect x="13" y="3" width="9" height="18" fill="#fff" stroke="${K}"/>`,
    structonly: `<rect x="2" y="3" width="20" height="18" fill="#fff" stroke="${K}" stroke-width="1.2"/><rect x="2" y="3" width="20" height="4" fill="${F}"/><path d="M6 18V10l6-3 6 3v8M6 10h12" ${st(1)}/>`,
    tables: `<rect x="3" y="3" width="18" height="18" fill="#fff" stroke="${K}" stroke-width="1.2"/><path d="M3 8h18M3 13h18M3 18h18M9 3v18M15 3v18" stroke="${K}" stroke-width=".9"/>`,
    windows: `<rect x="2" y="4" width="20" height="16" fill="#fff" stroke="${K}"/><rect x="2" y="4" width="20" height="4" fill="${F}"/>`,
    render3d: `<path d="M4 7l8-4 8 4v10l-8 4-8-4z" fill="#4FA3E8"/><path d="M4 7l8 4 8-4-8-4z" fill="#BFE0FA"/><path d="M12 11v10l8-4V7z" fill="#2569AF"/><path d="M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10" fill="none" stroke="#1B4F86" stroke-width="1"/>`,
    copilot: `<path d="M3 11a9 8 0 1 1 5 7.2L3 21l1.6-4.2A8 8 0 0 1 3 11z" fill="#1E8F4E"/><path d="M12 6l1.2 3.3L16.5 10.5 13.2 11.7 12 15l-1.2-3.3L7.5 10.5l3.3-1.2z" fill="#fff"/><circle cx="19" cy="4" r="2" fill="#F2C230"/>`,
    cursorN: `<path d="M3 2l4 15 2.5-5.5L15 9z" fill="#fff" stroke="#222" stroke-width="1.2"/><circle cx="17.5" cy="17.5" r="4" fill="${K}"/>`,
    cursorB: `<path d="M3 2l4 15 2.5-5.5L15 9z" fill="#fff" stroke="#222" stroke-width="1.2"/><path d="M13 13h8v2.5h-2.6v4h2.6V22h-8v-2.5h2.6v-4H13z" fill="${K}"/>`,
    cursorP: `<path d="M3 2l4 15 2.5-5.5L15 9z" fill="#fff" stroke="#222" stroke-width="1.2"/><path d="M11 17l6-4 6 3-6 5z" fill="#9FD3F7" stroke="${K}"/>`,
    cursorS: `<path d="M3 2l4 15 2.5-5.5L15 9z" fill="#fff" stroke="#222" stroke-width="1.2"/><path d="M13 14l5-3 5 3v6l-5 3-5-3z" fill="#9FD3F7" stroke="${K}"/>`,
    cursorG: `<path d="M5 2l4 15 2.5-5.5L17 9z" fill="#fff" stroke="#222" stroke-width="1.2"/>`,
    members: `<path d="M3 2l4 15 2.5-5.5L15 9z" fill="#fff" stroke="#222" stroke-width="1.2"/><path d="M12 22l4-8 4 8M12 14h9" ${st(1.2)}/>`,
    platesolids: `<path d="M3 2l4 15 2.5-5.5L15 9z" fill="#fff" stroke="#222" stroke-width="1.2"/><path d="M12 15l5-3 5 3-5 3z" fill="${F}" stroke="${K}"/><path d="M12 15v4l5 3 5-3v-4" ${st(1)}/>`,
    text: `<path d="M3 4h18v14H3z" fill="#fff" stroke="${K}"/><text x="6" y="15" font-size="11" font-family="Times New Roman" font-weight="700" fill="${K}">A</text><path d="M14 9h5M14 12h5M14 15h3" stroke="${K}"/>`,
    previous: `<path d="M10 5L3 12l7 7" ${st(2)}/><path d="M3 12h13a5 5 0 0 1 5 5v2" ${st(2)}/>`,
    loadsel: `<path d="M3 2l4 15 2.5-5.5L15 9z" fill="#fff" stroke="#222" stroke-width="1.2"/><path d="M14 11v8M18 11v8M12 17l2 2 2-2M16 17l2 2 2-2" ${st(1.2)}/><path d="M12 22h10" stroke="${K}" stroke-width="1.6"/>`,
    sqAll: `<rect x="4" y="4" width="16" height="16" fill="${K}"/>`,
    sqInv: `<rect x="4" y="4" width="16" height="16" fill="#fff" stroke="${K}"/><path d="M4 20L20 4V20z" fill="${K}"/>`,
    sqList: `<rect x="4" y="4" width="16" height="16" fill="#fff" stroke="${K}"/><path d="M7 9h10M7 12h10M7 15h7" stroke="${K}" stroke-width="1.2"/>`,
    parallel: `<path d="M8 3v18M15 3v18" stroke="${K}" stroke-width="2.4"/>`,
    connected: `<rect x="2" y="7" width="8" height="10" fill="${K}"/><path d="M10 12h4" stroke="${K}" stroke-width="2"/><rect x="14" y="5" width="8" height="14" fill="${F}" stroke="${K}"/>`,
    highlight: `<circle cx="12" cy="12" r="8" fill="#fff" stroke="${K}" stroke-width="1.3"/><circle cx="12" cy="12" r="3.5" fill="#222"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3" stroke="${K}" stroke-width="1.3"/>`,
    nodeAll: `<rect x="4" y="4" width="16" height="16" fill="${K}"/><circle cx="12" cy="12" r="3" fill="#fff"/>`,
    supsel: `<path d="M12 4l-7 12h14z" fill="${F}" stroke="${K}" stroke-width="1.3"/><path d="M3 19h18" stroke="${K}" stroke-width="1.6"/><circle cx="12" cy="4" r="2.4" fill="${K}"/>`,
    beamAll: `<path d="M5 3h14v4h-5v10h5v4H5v-4h5V7H5z" fill="${K}"/>`,
    beamInv: `<path d="M5 3h14v4h-5v10h5v4H5v-4h5V7H5z" fill="#fff" stroke="${K}"/><path d="M5 21h14v-4h-5V7l5-4" fill="${K}" opacity=".7"/>`,
    beamList: `<path d="M3 3h11v3h-4v12h4v3H3v-3h4V6H3z" fill="${F}" stroke="${K}"/><path d="M16 8h6M16 12h6M16 16h4" stroke="${K}" stroke-width="1.3"/>`,
    pointer: `<rect x="2" y="2" width="20" height="20" fill="#fff" stroke="#555"/><path d="M8 5l3 12 2-4.5 4.5-2z" fill="#fff" stroke="#222" stroke-width="1.3"/>`,
    stdsec: `<path d="M3 3h12v3h-4v12h4v3H3v-3h4V6H3z" fill="${F}" stroke="${K}" stroke-width="1.2"/><text x="13.5" y="11" font-size="6.5" font-family="Arial" font-weight="700" fill="${K}">I C</text><path d="M14 17h7M18 14l3 3-3 3" stroke="${G}" stroke-width="1.8" fill="none"/>`,
    legacy: `<path d="M3 5h12v3h-4v10h4v3H3v-3h4V8H3z" fill="#E0E7EE" stroke="${K}" stroke-width="1.2"/><circle cx="17" cy="6" r="4" fill="#fff" stroke="#333"/><path d="M17 4v2l1.5 1" stroke="#333"/><path d="M14 17h7M18 14l3 3-3 3" stroke="${G}" stroke-width="1.8" fill="none"/>`,
    prismatic: `<rect x="5" y="3" width="13" height="18" rx="1" fill="${F}" stroke="${K}" stroke-width="1.3"/><rect x="8" y="6" width="7" height="12" fill="#fff" stroke="${K}"/>`,
    tapered: `<path d="M4 9l14-6 3 5-14 7z" fill="${F}" stroke="${K}" stroke-width="1.2"/><path d="M4 9v6l3 6V15M21 8v3l-14 10" ${st(1.1)}/>`,
    usertable: `<path d="M3 10l8-6 8 6v10H3z" fill="${F}" stroke="${K}" stroke-width="1.2"/><path d="M3 14h16M8 10v10M14 10v10" stroke="${K}" stroke-width=".9"/><path d="M19 2l1 2.5L22.5 5 20 6l-1 2.5L18 6l-2.5-1L18 4z" fill="#222"/>`,
    platethk: `<path d="M3 8l11-4 7 4-11 4z" fill="${F}" stroke="${K}"/><path d="M3 8v3l11 4 7-4V8" ${st(1)}/><path d="M12 13v8M9 18l3 3 3-3" stroke="${G}" stroke-width="1.8" fill="none"/>`,
    constants: `<path d="M5 6l6-3 9 3v13l-9 3-6-3z" fill="#E8B26A" stroke="#8F5D17" stroke-width="1.2"/><path d="M11 3v19M5 6l6 3 9-3" stroke="#8F5D17" fill="none"/><rect x="12" y="11" width="9" height="7" fill="#fff" stroke="${K}"/><path d="M14 13h5M14 15.5h5" stroke="${K}" stroke-width=".8"/>`,
    specnode: `<circle cx="6" cy="7" r="4" fill="${K}"/><path d="M10 7h11" stroke="${K}" stroke-width="2.4"/><circle cx="20" cy="7" r="2.8" fill="${F}" stroke="${K}"/><rect x="11" y="13" width="10" height="8" fill="#fff" stroke="${K}"/><path d="M13 15.5h6M13 18h6" stroke="${K}" stroke-width=".8"/>`,
    specbeam: `<path d="M3 3h10v3H9.5v10H13v3H3v-3h3.5V6H3z" fill="${F}" stroke="${K}"/><rect x="11" y="13" width="10" height="8" fill="#fff" stroke="${K}"/><path d="M13 15.5h6M13 18h6" stroke="${K}" stroke-width=".8"/>`,
    specplate: `<path d="M2 10l9-5 8 4-9 5z" fill="#fff" stroke="${K}"/><rect x="11" y="13" width="10" height="8" fill="#fff" stroke="${K}"/><path d="M13 15.5h6M13 18h6" stroke="${K}" stroke-width=".8"/>`,
    fixed: `<path d="M12 3v9" stroke="${K}" stroke-width="2.6"/><path d="M3 12h18" stroke="${K}" stroke-width="2.4"/><path d="M5 16l2-4M9 16l2-4M13 16l2-4M17 16l2-4" stroke="${K}" stroke-width="1.2"/>`,
    pinned: `<path d="M12 4l-8 13h16z" fill="${F}" stroke="${K}" stroke-width="1.4"/><path d="M3 20h18" stroke="${K}" stroke-width="1.6"/>`,
    custom: `<path d="M3 10q4-5 9 0t9 0M3 15q4-5 9 0t9 0" fill="none" stroke="${K}" stroke-width="2.2"/><path d="M3 20h18" stroke="${K}" stroke-width="1.4"/>`,
    foundation: `<path d="M12 2v10" stroke="${K}" stroke-width="2"/><path d="M5 12h14v4H5z" fill="${F}" stroke="${K}"/><path d="M3 20h18" stroke="${K}"/>`,
    oneway: `<path d="M12 2v4l-4 2 8 2-8 2 8 2-4 2v2" fill="none" stroke="${K}" stroke-width="1.4"/><path d="M5 19h14M7 22l2-3M11 22l2-3M15 22l2-3" stroke="${K}"/>`,
    othersup: `<circle cx="12" cy="7" r="3" fill="${K}"/><path d="M12 10v4" stroke="${K}" stroke-width="2"/><path d="M5 16h14" stroke="${K}" stroke-width="2"/><path d="M7 20h10" stroke="${K}" stroke-dasharray="2 1.5"/>`,
    shape: `<path d="M5 3h14v4h-5v10h5v4H5v-4h5V7H5z" fill="${K}"/><path d="M5 3h14v4h-5v10h5v4H5v-4h5V7H5z" fill="none" stroke="#fff" stroke-dasharray="2 2" stroke-width=".8"/>`,
    dbman: `<path d="M3 3h10v3H9.5v12H13v3H3v-3h3.5V6H3z" fill="${K}"/><ellipse cx="17.5" cy="9" rx="4.5" ry="2" fill="#9AA3AD" stroke="#59616A"/><path d="M13 9v9c0 1.1 2 2 4.5 2s4.5-.9 4.5-2V9" fill="#C3C9D0" stroke="#59616A"/>`,
    primary: `<path d="M5 4v12M12 4v12M19 4v12" stroke="${K}" stroke-width="2"/><path d="M3 14l2 3 2-3M10 14l2 3 2-3M17 14l2 3 2-3" fill="${K}"/><path d="M2 20h20" stroke="${K}" stroke-width="2"/><path d="M2 4h20" stroke="${K}" stroke-width="2"/>`,
    combcase: `<path d="M4 4v10M10 4v10" stroke="${K}" stroke-width="2"/><path d="M2 12l2 3 2-3M8 12l2 3 2-3" fill="${K}"/><path d="M2 20h11M2 4h11" stroke="${K}" stroke-width="2"/><path d="M14 22l4-9 4 9M15.5 19h5" stroke="#222" stroke-width="2.2" fill="none"/>`,
    refcase: `<path d="M5 4v10M12 4v10M19 4v10" stroke="${K}" stroke-width="2"/><path d="M3 12l2 3 2-3M10 12l2 3 2-3M17 12l2 3 2-3" fill="${K}"/><path d="M2 4h20M2 18h20" stroke="${K}" stroke-width="2"/><rect x="14" y="16" width="8" height="7" fill="#fff" stroke="${K}"/>`,
    loaditems: `<path d="M12 2v13" stroke="${K}" stroke-width="2.6"/><path d="M6 11l6 7 6-7" fill="${K}"/><path d="M3 22h18" stroke="${K}" stroke-width="1.8"/>`,
    vehicle: `<path d="M3 6h7M3 9h9M3 12h7" stroke="${K}" stroke-width="1.6"/><path d="M12 6v12M15 6v12M18 6v12M21 6v12" stroke="${K}" stroke-width="1.4"/><path d="M2 20h20" stroke="${K}" stroke-width="2"/>`,
    windgen: `<path d="M2 7h9a2.5 2.5 0 1 0-2.5-2.5M2 11h13a2.5 2.5 0 1 1-2.5 2.5M2 15h7" fill="none" stroke="#222" stroke-width="1.5"/><path d="M14 6v12M18 6v12M22 6v12" stroke="${K}" stroke-width="1.6"/><path d="M12 20h12" stroke="${K}" stroke-width="2"/>`,
    mass: `<path d="M7 7h10l3 14H4z" fill="#9AA3AD" stroke="#59616A" stroke-width="1.2"/><circle cx="12" cy="5" r="2.5" fill="none" stroke="#59616A" stroke-width="1.5"/>`,
    ptype: `<text x="3" y="9" font-size="7" font-family="Arial" font-weight="700" fill="${K}">1</text><text x="3" y="15.5" font-size="7" font-family="Arial" font-weight="700" fill="${K}">2</text><text x="3" y="22" font-size="7" font-family="Arial" font-weight="700" fill="${K}">3</text><path d="M9 6h12M9 12.5h12M9 19h12" stroke="#222" stroke-width="2"/>`,
    autocomb: `<path d="M6 4v16M12 4v16M18 4v16" stroke="#555" stroke-width="1.5"/><circle cx="6" cy="9" r="3" fill="#fff" stroke="${R}" stroke-width="2"/><circle cx="12" cy="15" r="3" fill="#fff" stroke="${G}" stroke-width="2"/><circle cx="18" cy="7" r="3" fill="#fff" stroke="${K}" stroke-width="2"/>`,
    enclosed: `<path d="M5 8l7-4 7 4v9l-7 4-7-4z" fill="${F}" fill-opacity=".6" stroke="${K}"/><path d="M5 8l7 4 7-4M12 12v9" ${st(1)}/>`,
    thist: `<circle cx="12" cy="12" r="9" fill="#fff" stroke="#555" stroke-width="1.6"/><path d="M12 6v6l4 3" stroke="${R}" stroke-width="2" fill="none"/><path d="M5 5l-2-2M19 5l2-2" stroke="${G}" stroke-width="2"/>`,
    damping: `<path d="M12 2c5 2 5 5 0 7s-5 5 0 7 5 5 0 6" fill="none" stroke="${R}" stroke-width="2.4"/><path d="M8 6h8M8 13h8M8 19h8" stroke="#555" stroke-width="1"/>`,
    viewdiag: `<path d="M12 3v12" stroke="${K}" stroke-width="2.4"/><path d="M7 11l5 6 5-6" fill="${K}"/><path d="M3 21h18" stroke="${O}" stroke-width="2"/>`,
    wind: `<path d="M2 8h12a3 3 0 1 0-3-3M2 13h17a3 3 0 1 1-3 3M2 18h8" fill="none" stroke="${K}" stroke-width="1.6"/>`,
    snow: `<path d="M12 2v20M3.5 7l17 10M20.5 7l-17 10" stroke="${K}" stroke-width="1.5"/>`,
    seismic: `<path d="M2 12h4l2-6 3 12 3-14 3 12 2-4h3" fill="none" stroke="${K}" stroke-width="1.5"/>`,
    direct: `<path d="M4 20V4h4v16M10 20V8h4v12M16 20V12h4v8" fill="${F}" stroke="${K}"/>`,
    pushover: `<path d="M3 21l5-12 4 4 4-9 5 4" fill="none" stroke="${K}" stroke-width="1.6"/><path d="M3 21h18" stroke="#555"/>`,
    env: `<path d="M2 15q2.5-3 5 0t5 0 5 0 5 0" fill="none" stroke="#2BA3C9" stroke-width="2"/><path d="M2 20q2.5-3 5 0t5 0 5 0 5 0" fill="none" stroke="#2BA3C9" stroke-width="1.4"/><path d="M8 13V3h8v10" fill="${F}" stroke="${K}"/>`,
    buoy: `<path d="M2 12q2.5-3 5 0t5 0 5 0 5 0" fill="none" stroke="#2BA3C9" stroke-width="1.6"/><rect x="8" y="9" width="8" height="11" rx="4" fill="${F}" stroke="${K}"/><path d="M12 3v6M9.5 5.5L12 3l2.5 2.5" stroke="${G}" stroke-width="1.8" fill="none"/>`,
    wave: `<path d="M2 9q3-5 6 0t6 0 6 0 4 0M2 16q3-5 6 0t6 0 6 0 4 0" fill="none" stroke="#2BA3C9" stroke-width="2"/>`,
    waveset: `<path d="M2 6q3-4 6 0t6 0 6 0 4 0M2 12q3-4 6 0t6 0 6 0 4 0M2 18q3-4 6 0t6 0 6 0 4 0" fill="none" stroke="#2BA3C9" stroke-width="1.5"/>`,
    equip: `<rect x="4" y="5" width="16" height="11" rx="1.5" fill="${F}" stroke="${K}"/><path d="M6 16v4M18 16v4M3 20h18" stroke="${K}" stroke-width="1.5"/><circle cx="12" cy="10.5" r="2.5" fill="${O}"/>`,
    pipe: `<rect x="2" y="8" width="20" height="8" rx="4" fill="${F}" stroke="${K}" stroke-width="1.3"/><path d="M7 8v8M17 8v8" stroke="${K}"/>`,
    pipecsv: `<rect x="2" y="13" width="14" height="6" rx="3" fill="${F}" stroke="${K}"/><path d="M10 2h8l4 4v9h-6" fill="#fff" stroke="${K}"/><text x="11.5" y="12" font-size="4.6" font-family="Arial" font-weight="700" fill="${G}">CSV</text>`,
    deckarea: `<path d="M2 15l10-5 10 5-10 5z" fill="${F}" stroke="${K}"/><path d="M7 3v8M12 2v7M17 3v8" stroke="${K}" stroke-width="1.4"/>`,
    nodal: `<path d="M12 2v13" stroke="${R}" stroke-width="2.2"/><path d="M8 11l4 5 4-5" fill="${R}"/><rect x="9" y="17" width="6" height="5" fill="${K}"/>`,
    uniform: `<path d="M4 4v9M10 4v9M16 4v9M22 4v9M2 4h22" stroke="${R}" stroke-width="1.4" fill="none"/><path d="M2 11l2 3 2-3M8 11l2 3 2-3M14 11l2 3 2-3M20 11l2 3 2-3" fill="${R}"/><path d="M2 18h20" stroke="${K}" stroke-width="2.6"/>`,
    point: `<path d="M12 2v11" stroke="${R}" stroke-width="2.2"/><path d="M8 10l4 5 4-5" fill="${R}"/><path d="M2 18h20" stroke="${K}" stroke-width="2.6"/>`,
    pressure: `<path d="M3 15l10-4 8 4-10 5z" fill="${F}" stroke="${K}"/><path d="M8 2v8M13 2v7M18 2v8" stroke="${R}" stroke-width="1.5"/>`,
    temp: `<path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0z" fill="#fff" stroke="${K}" stroke-width="1.4"/><circle cx="12" cy="17" r="2.4" fill="${R}"/><path d="M12 8v8" stroke="${R}" stroke-width="2"/>`,
    sw: `<path d="M7 6h10l3 15H4z" fill="${F}" stroke="${K}" stroke-width="1.3"/><text x="7.4" y="17" font-size="8" font-family="Arial" font-weight="700" fill="${K}">SW</text>`,
    sum: `<text x="5" y="19" font-size="18" font-family="Times New Roman" fill="${K}">Σ</text>`,
    run: `<circle cx="12" cy="12" r="10" fill="#22A35A"/><circle cx="12" cy="12" r="10" fill="none" stroke="#0B5A35"/><path d="M9.5 7v10l8-5z" fill="#fff"/>`,
    output: `<rect x="3" y="4" width="18" height="16" fill="#fff" stroke="${K}"/><path d="M6 17V12M10 17V9M14 17v-6M18 17V7" stroke="${K}" stroke-width="2.2"/>`,
    diag: `<path d="M3 16h18" stroke="#222" stroke-width="1.6"/><path d="M3 16q9-16 18 0" fill="${F}" stroke="${K}" stroke-width="1.5"/>`,
    deflect: `<path d="M3 8h18" stroke="#999" stroke-dasharray="2 2"/><path d="M3 8q9 12 18 0" fill="none" stroke="${G}" stroke-width="2.2"/>`,
    bigger: `<path d="M4 20L20 4M12 4h8v8" ${st(1.8)}/>`,
    smaller: `<path d="M20 4L4 20M12 20H4v-8" ${st(1.8)}/>`,
    report: `<path d="M5 2h10l4 4v16H5z" fill="#fff" stroke="${K}"/><path d="M8 9h8M8 12h8M8 15h5" stroke="${K}"/><path d="M15 2v4h4" fill="${F}" stroke="${K}"/>`,
    designp: `<path d="M3 3h10v3H9.5v12H13v3H3v-3h3.5V6H3z" fill="${F}" stroke="${K}"/><path d="M15 12h7M15 16h7M15 20h5" stroke="${K}" stroke-width="1.6"/>`,
    codecheck: `<path d="M3 3h10v3H9.5v12H13v3H3v-3h3.5V6H3z" fill="${F}" stroke="${K}"/><circle cx="18" cy="16" r="5" fill="#fff" stroke="${G}" stroke-width="1.6"/><path d="M15.7 16l1.6 1.6 3-3.2" stroke="${G}" stroke-width="1.6" fill="none"/>`,
    server: `<rect x="4" y="3" width="16" height="7" rx="1" fill="${F}" stroke="${K}"/><rect x="4" y="13" width="16" height="7" rx="1" fill="${F}" stroke="${K}"/><circle cx="8" cy="6.5" r="1.2" fill="${G}"/><circle cx="8" cy="16.5" r="1.2" fill="${G}"/>`,
    plug: `<path d="M8 2v6M16 2v6M5 8h14v4a7 7 0 0 1-14 0zM12 19v4" fill="${F}" stroke="${K}" stroke-width="1.4"/>`,
    gear: `<circle cx="12" cy="12" r="3.5" fill="#fff" stroke="${K}" stroke-width="1.4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="${K}" stroke-width="2.2" stroke-linecap="round"/>`,
    cross: `<path d="M3 12h7M14 12h7" stroke="${K}" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="${K}"/><path d="M5 5l14 14" stroke="${G}" stroke-width="1.6"/>`,
    rom: `<rect x="3" y="3" width="18" height="18" fill="#fff" stroke="${K}"/><path d="M6 18l4-6 3 3 5-9" stroke="${G}" stroke-width="2" fill="none"/>`,
    tools: `<path d="M14 3a5 5 0 0 0-5 6.5L3 15.5 5.5 18l6-6A5 5 0 0 0 18 7l-3 3-2.5-.5L12 7l3-3z" fill="${F}" stroke="${K}" stroke-width="1.2"/>`,
    nodetools: `<rect x="7" y="7" width="10" height="10" fill="${K}"/><path d="M12 1v5M12 18v5M1 12h5M18 12h5" stroke="${K}" stroke-width="1.4"/>`,
    beamtools: `<path d="M5 3h14v4h-5v10h5v4H5v-4h5V7H5z" fill="${F}" stroke="${K}"/>`,
    platetools: `<path d="M2 12l10-6 10 6-10 6z" fill="${F}" stroke="${K}" stroke-width="1.3"/>`,
    solidtools: `<path d="M5 8l7-4 7 4v8l-7 4-7-4z" fill="${F}" stroke="${K}"/><path d="M5 8l7 4 7-4M12 12v8" ${st(1)}/>`,
    restraint: `<path d="M3 12h18" stroke="${K}" stroke-width="2.4"/><path d="M8 7v10M16 7v10" stroke="#555" stroke-width="1.4"/>`,
    groups: `<path d="M3 3h7v4H3zM14 3h7v4h-7zM3 17h7v4H3zM14 17h7v4h-7z" fill="${F}" stroke="${K}"/><path d="M8 7l3 4 3-4M8 17l3-4 3 4" ${st(1.2)}/><circle cx="12" cy="12" r="2.2" fill="${K}"/>`,
    dropphys: `<path d="M4 20V8l8-4 8 4v12" fill="#fff" stroke="${K}"/><circle cx="17" cy="17" r="5" fill="#fff" stroke="${R}" stroke-width="1.6"/><path d="M13.5 20.5l7-7" stroke="${R}" stroke-width="1.6"/>`,
    query: `<circle cx="11" cy="11" r="8" fill="#22A35A"/><text x="7.3" y="15.5" font-size="12" font-family="Arial" font-weight="700" fill="#fff">?</text>`,
    inserttext: `<text x="1" y="18" font-size="17" font-family="Times New Roman" font-weight="700" fill="${R}">A</text><path d="M17 3v18M14 3h6M14 21h6" stroke="#222" stroke-width="1.4"/>`,
    cmdfile: `<rect x="3" y="3" width="16" height="18" fill="#fff" stroke="${K}"/><path d="M6 8h10M6 11h10M6 14h7" stroke="${K}"/><path d="M14 20l7-9-2-2-7 9-.5 2.5z" fill="${O}" stroke="#8F5D17"/>`,
    alog: `<rect x="4" y="2" width="14" height="19" fill="#fff" stroke="#888"/><path d="M7 6h8M7 9h8M7 12h8M7 15h5" stroke="#888"/>`,
    elog: `<rect x="4" y="2" width="14" height="19" fill="#fff" stroke="#888"/><path d="M7 6h8M7 9h8" stroke="#888"/><circle cx="17" cy="17" r="4" fill="#fff" stroke="${R}" stroke-width="1.4"/><path d="M15.5 15.5l3 3M18.5 15.5l-3 3" stroke="${R}" stroke-width="1.4"/>`,
    conntags: `<path d="M3 13l8-8h7v7l-8 8z" fill="#222"/><circle cx="15" cy="8" r="1.6" fill="#fff"/><path d="M4 4l3 3M7 2v3M2 7h3" stroke="${G}" stroke-width="1.6"/>`,
    calc: `<rect x="5" y="2" width="14" height="20" rx="1.5" fill="#fff" stroke="${K}"/><rect x="7" y="4" width="10" height="4" fill="${F}" stroke="${K}" stroke-width=".8"/><path d="M8 11h2M11 11h2M14 11h2M8 14h2M11 14h2M14 14h2M8 17h2M11 17h2M14 17h2" stroke="${K}" stroke-width="1.6"/>`,
    unitconv: `<path d="M3 21L21 3v18z" fill="#F2C230" stroke="#A67C00"/><path d="M8 21v-3M12 21v-2M16 21v-3" stroke="#A67C00"/>`,
    takepic: `<rect x="3" y="7" width="18" height="13" rx="2" fill="#555"/><circle cx="12" cy="13.5" r="4" fill="#fff" stroke="#222"/><rect x="8" y="4" width="8" height="3" fill="#555"/>`,
    copypic: `<rect x="2" y="6" width="13" height="11" fill="#fff" stroke="${K}"/><rect x="8" y="10" width="13" height="11" fill="${F}" stroke="${K}"/>`,
    avi: `<rect x="3" y="5" width="13" height="14" fill="#fff" stroke="${K}"/><path d="M16 9l5-3v12l-5-3z" fill="${G}"/>`,
    macroed: `<path d="M8 3c-3 0-3 2-3 4s-2 2-2 5 2 2 2 5 0 4 3 4M16 3c3 0 3 2 3 4s2 2 2 5-2 2-2 5 0 4-3 4" fill="none" stroke="#555" stroke-width="1.6"/><circle cx="14" cy="15" r="3.5" fill="#fff" stroke="${K}"/><path d="M11 18l-3 3" stroke="${K}" stroke-width="2"/>`,
    macros: `<path d="M8 3c-3 0-3 2-3 4s-2 2-2 5 2 2 2 5 0 4 3 4M16 3c3 0 3 2 3 4s2 2 2 5-2 2-2 5 0 4-3 4" fill="none" stroke="#555" stroke-width="1.6"/>`,
    usertools: `<rect x="2" y="2" width="20" height="20" fill="#fff" stroke="#555"/><path d="M9 6a3 3 0 0 0-3 4l-3 3 2 2 3-3a3 3 0 0 0 4-3l-2 1-1-1zM15 18a3 3 0 0 0 3-4l3-3-2-2-3 3a3 3 0 0 0-4 3l2-1 1 1z" fill="#555"/>`,
    tol: `<circle cx="12" cy="12" r="8" fill="none" stroke="${K}" stroke-dasharray="2 2"/><circle cx="12" cy="12" r="2.5" fill="${G}"/>`,
    palette: `<rect x="2" y="5" width="20" height="14" rx="1.5" fill="#fff" stroke="${K}"/><path d="M5 9h2M9 9h2M13 9h2M17 9h2M5 12h2M9 12h2M13 12h2M17 12h2M7 15h10" stroke="${K}" stroke-width="1.4"/>`,
    legend: `<rect x="3" y="3" width="5" height="18" fill="url(#sxlg)"/><defs><linearGradient id="sxlg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${R}"/><stop offset=".5" stop-color="#F2C230"/><stop offset="1" stop-color="#2F74C2"/></linearGradient></defs><path d="M11 5h10M11 12h10M11 19h10" stroke="#555" stroke-width="1.4"/>`,
    isolate: `<circle cx="12" cy="12" r="9" fill="none" stroke="${K}" stroke-dasharray="2 2"/><rect x="8" y="8" width="8" height="8" fill="${G}"/>`,
    showall: `<rect x="3" y="3" width="8" height="8" fill="${K}"/><rect x="13" y="3" width="8" height="8" fill="${K}"/><rect x="3" y="13" width="8" height="8" fill="${K}"/><rect x="13" y="13" width="8" height="8" fill="${K}"/>`,
    upaxis: `<path d="M12 21V4M7 9l5-5 5 5" ${st(1.8)}/><text x="15" y="20" font-size="8" font-family="Arial" font-weight="700" fill="${G}">Z</text>`,
    units: `<text x="1" y="11" font-size="8.5" font-family="Arial" font-weight="700" fill="${K}">kN</text><text x="9" y="21" font-size="8.5" font-family="Arial" font-weight="700" fill="${G}">m</text><path d="M3 21L21 3" stroke="#888"/>`,
    newdoc: `<path d="M5 2h10l4 4v16H5z" fill="#fff" stroke="${K}" stroke-width="1.3"/><path d="M15 2v4h4" fill="${F}" stroke="${K}"/><path d="M12 11v7M8.5 14.5h7" stroke="${G}" stroke-width="2"/>`,
    exportf: `<path d="M5 2h10l4 4v16H5z" fill="#fff" stroke="${K}" stroke-width="1.3"/><path d="M12 18V9M8.5 12.5L12 9l3.5 3.5" stroke="${G}" stroke-width="2" fill="none"/>`,
    sample: `<path d="M4 20V9l8-5 8 5v11" fill="${F}" stroke="${K}" stroke-width="1.3"/><path d="M4 14h16M8 9v11M16 9v11M8 14l4-5 4 5" ${st(1)}/>`,
    mto: `<path d="M4 20h16M6 20V10M10 20V6M14 20v-8M18 20V4" stroke="${K}" stroke-width="2.4"/>`,
    check: `<path d="M4 12l5 5L20 6" fill="none" stroke="${G}" stroke-width="2.6"/>`
  };
})();
const sxi = (k, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${SXI[k] || (typeof ICON !== 'undefined' && ICON[k]) || SXI.check}</svg>`;

/* --------------- reasons shown on disabled controls --------------- */
const NB = {
  phys: 'Physical members are not built. This model is analytical: one beam per element.',
  layout: 'Layout generators are not built. Use the Structure Wizard or Translational Repeat.',
  stretch: 'Stretching a beam to a target is not built. Move the end node instead.',
  solidedit: 'Solid editing tools are not built. Solids can be drawn and deleted only.',
  deck: 'Composite decks are not built. Mesh the deck as plates instead.',
  views: 'Saved and multiple views are not built. There is one view of the model.',
  win: 'There is one structure window. Cascading and tiling apply only with several.',
  zoomwin: 'Zoom by rectangle is not built. Use the mouse wheel, Zoom to Selection or Whole Structure.',
  tooltipopt: 'Tooltip options are not built. Hover tooltips show the node or member number.',
  legacy: 'Legacy STAAD section tables are not included. Use the standard database or import a CSV library.',
  tapered: 'Tapered members are not built. The solver uses prismatic members only.',
  shape: 'The shape editor is not built. Define a section by dimensions or by values instead.',
  nodespec: 'Node specifications (master/slave, rigid links by node) are not built.',
  platespec: 'Plate specifications (releases, ignore in-plane rotation) are not built.',
  foundation: 'Foundation supports, piles and soil springs are not built. P-y, t-z and Q-z curves are on the roadmap.',
  oneway: 'One-way (compression-only) springs need a non-linear solve, which the backend does not have.',
  text: 'Selecting text annotations is not built; there are no annotations yet.',
  previous: 'Recalling the previous selection is not built.',
  sload: 'Selecting by load is not built. Use the Load & Definition tree to see where loads are.',
  connected: 'Selecting connected members is not built.',
  highlight: 'Highlighting a selection set is not built. Selected items are already drawn highlighted.',
  filter: 'Selection filters are not built. Use the cursors and Attributes instead.',
  modes: 'Mode shapes are listed in the Frequencies panel; selecting by mode is not built.',
  vehicle: 'Moving loads need a moving-load analysis, which the backend does not have.',
  mass: 'Mass model generation for dynamics is not built. Modal analysis uses self-weight mass.',
  ptype: 'Set the load type when you create or edit a load case.',
  snow: 'Snow loading is not implemented; it is not relevant to the Gulf and North Sea jackets in scope.',
  seismic: 'Static and response-spectrum seismic loading are not in the backend.',
  direct: 'Direct analysis (AISC Appendix 7 stiffness reduction) is not written.',
  pushover: 'Pushover needs plastic hinges and an arc-length solver. Not written.',
  enclosed: 'Enclosed zones are not built. Enter module wind as an area or deck load for now.',
  thist: 'Time-history analysis (Newmark integration) is not written.',
  damping: 'Modal damping is only used by dynamic response analysis, which is not built. The modal solve gives frequencies and shapes.',
  refcase: 'Reference load cases are not built. Combinations reference primary cases directly.',
  members: 'Selecting physical members is not built.',
  groups: 'Named groups are not built. Use Select by List with member numbers.',
  dropphys: 'There is no physical model to drop.',
  inserttext: 'Text annotations are not built.',
  conntags: 'Connection tags belong to connection design, which is not built.',
  calc: 'The engineering calculator is not built.',
  avi: 'Recording an animation file is not built. Use Take Picture for stills.',
  macro: 'Macros are not built. Every command is available from the Search box and the API.',
  usertools: 'User tools are not built.',
  restraint: 'Member restraints for buckling length are part of code checking, which is not built.',
  solidneg: 'Negative volume checking for solids is not built.',
  solidwarp: 'Warped solid checking is not built.',
  plateconn: 'Plate connectivity checking is in Structure Tools as Beam / plate connectivity.',
  errlog: 'There is no separate error log. Errors are in the Analysis Log.',
  help: 'Help is not written yet. Hover any button for what it does.',
  copilot: 'The engineering Copilot is planned for MVP 3 and is not built. It will answer only from traceable model evidence.',
  code: 'API RP 2A-LRFD member checks are the next build item and are not available. The utilisation shown today is a simplified stress ratio, not a code check.',
  envelope: 'Load envelopes are not built.',
  values: 'Entering a section by its property values is under Prismatic.',
  edit: 'Sections cannot be edited after creation, because members may depend on them. Define a new section and reassign.'
};

/* --------------- ribbon content, tab by tab --------------- */
/* item: [size, id, label, icon, opts]   size: L large, S small with label, I small icon only
   opts: { menu: [[id,label,dis?]...], dis: reason, title } */
const SXR = {
  file: { label: 'File' },
  geometry: { label: 'Geometry', groups: [
    { n: 'Clipboard', it: [['I', 'undo', 'Undo', 'undo'], ['I', 'redo', 'Redo', 'redo'], ['I', 'del', 'Delete', 'del'], ['I', 'cut', 'Cut', 'cut'], ['I', 'copy', 'Copy', 'copy'], ['I', 'paste', 'Paste with move', 'paste']] },
    { n: 'Structure', it: [['L', 'm:grids', 'Grids', 'grids', { menu: [['gridSet', 'Grid settings…'], ['gridToggle', 'Show or hide the snap grid']] }], ['L', 'wizard', 'Structure\nWizard', 'wizard'],
      ['I', 'repeat', 'Translational repeat', 'repeat'], ['I', 'circular', 'Circular repeat', 'circ'], ['I', 'mirror2', 'Mirror', 'mirror'], ['I', 'rotate', 'Rotate', 'rotate'], ['I', 'intersect', 'Intersect selected members', 'intersect'], ['I', 'nodeTable', 'Nodes table', 'table']] },
    { n: 'Node', it: [['S', 'tool:addNode', 'Add Node', 'addnode', { menu: [['tool:addNode', 'Add node by clicking'], ['nodeXYZ', 'Add node by coordinates…']] }], ['S', 'move2', 'Move Node', 'movenode'], ['S', 'merge', 'Merge Nodes', 'mergenode'], ['S', 'renumber', 'Renumber Nodes', 'renum']] },
    { n: 'Beam', it: [['L', 'tool:addBeam', 'Add\nBeam', 'addbeam', { menu: [['tool:addBeam', 'Add beam from point to point'], ['wizard', 'Structure Wizard…']] }], ['S', 'x:beamLayout', 'Beam Layout', 'beamlayout', { dis: NB.layout }], ['S', 'split', 'Insert Node', 'insnode'], ['S', 'x:stretch', 'Stretch Beam', 'stretch', { dis: NB.stretch }]] },
    { n: 'Plate', it: [['L', 'tool:addPlate', 'Add\nPlate', 'addplate'], ['S', 'x:plateLayout', 'Plate Layout', 'platelayout', { dis: NB.layout }], ['S', 'x:param', 'Parametric Models', 'parametric', { dis: NB.layout }], ['S', 'mesh', 'Generate Mesh', 'mesh']] },
    { n: 'Solid', it: [['L', 'tool:addSolid', 'Add\nSolid', 'addsolid'], ['S', 'x:solidLayout', 'Solid Layout', 'solidlayout', { dis: NB.solidedit }], ['S', 'x:moveSolid', 'Move Solids', 'movenode', { dis: NB.solidedit }], ['S', 'x:renSolid', 'Renumber Solids', 'renum', { dis: NB.solidedit }]] },
    { n: 'Analytical Model', it: [['L', 'heal', 'Prepare\nModel', 'heal']] },
    { n: '', it: [['L', 'x:phys', 'Physical\nMember', 'physical', { dis: NB.phys, menu: [] }]] },
    { n: '', it: [['L', 'x:deck', 'Composite\nDeck', 'deck', { dis: NB.deck, menu: [] }]] }] },
  view: { label: 'View', groups: [
    { n: 'Labels', it: [['L', 'm:labels', 'Label\nSettings', 'label', { menu: 'labels' }], ['I', 'lbl:nodes', 'Node numbers', 'lblN'], ['I', 'lbl:beams', 'Beam numbers', 'lblB'], ['I', 'lbl:plates', 'Plate numbers', 'lblP'], ['I', 'lbl:sections', 'Section names', 'lblS'], ['I', 'lbl:specs', 'Releases and specifications', 'lblR'], ['I', 'lbl:supports', 'Supports', 'lblSup']] },
    { n: 'Tools', it: [['L', 'x:zoomwin', 'Zoom\nWindow', 'zoomwin', { dis: NB.zoomwin }], ['L', 'v:fit', 'Display\nWhole Structure', 'whole'],
      ['I', 'zin', 'Zoom in', 'zin'], ['I', 'zout', 'Zoom out', 'zout'], ['I', 'v:zsel', 'Zoom to selection', 'zsel'], ['I', 'persp', 'Perspective', 'persp'], ['I', 'isolate', 'Show selected only', 'isolate'], ['I', 'showAll', 'Show all', 'showall'],
      ['I', 'v:iso', 'Isometric view', 'viso'], ['I', 'v:front', 'Front view', 'vfront'], ['I', 'v:back', 'Back view', 'vback'], ['I', 'v:left', 'Left view', 'vleft'], ['I', 'v:right', 'Right view', 'vright'], ['I', 'v:top', 'Top view', 'vtop'], ['I', 'v:bottom', 'Bottom view', 'vbottom']] },
    { n: 'Views', it: [['S', 'x:openview', 'Open View', 'openview', { dis: NB.views }], ['S', 'x:newview', 'New View', 'newview', { dis: NB.views }], ['S', 'isolate', 'Selected Objects', 'selobj'], ['L', 'x:viewmgmt', 'View\nManagement', 'viewmgmt', { dis: NB.views, menu: [] }]] },
    { n: 'Options', it: [['S', 'm:disp', 'Display Options', 'dispopt', { menu: 'display' }], ['S', 'm:colors', 'Set Structure Colors', 'colors', { menu: 'colors' }], ['S', 'x:tipopt', 'Structural Tooltip Options', 'tooltip', { dis: NB.tooltipopt }]] },
    { n: 'Windows', it: [['S', 'x:cascade', 'Cascade', 'cascade', { dis: NB.win }], ['S', 'x:tileh', 'Tile Horizontal', 'tileh', { dis: NB.win }], ['S', 'x:tilev', 'Tile Vertical', 'tilev', { dis: NB.win }],
      ['S', 'sx:structOnly', 'Structure Only', 'structonly'], ['S', 'sx:tables', 'Tables', 'tables'], ['S', 'm:windows', 'Windows', 'windows', { menu: 'windows' }]] },
    { n: '', it: [['L', 'disp:render', '3D\nRendering', 'render3d']] },
    { n: 'Model', it: [['S', 'm:up', 'Vertical Axis', 'upaxis', { menu: [['up:Z', 'Z up (SACS, IFC)'], ['up:Y', 'Y up (STAAD)']] }], ['S', 'unitsSet', 'Input Units', 'units'], ['S', 'legend', 'Colour Legend', 'legend']] }] },
  select: { label: 'Select', groups: [
    { n: 'Cursors', it: [['L', 'cur:nodes', 'Node\nCursor', 'cursorN'], ['L', 'cur:beams', 'Beam\nCursor', 'cursorB'], ['L', 'cur:plates', 'Plate\nCursor', 'cursorP'], ['L', 'cur:solids', 'Solid\nCursor', 'cursorS'],
      ['S', 'cur:geometry', 'Geometry', 'cursorG'], ['S', 'x:members', 'Members', 'members', { dis: NB.members }], ['S', 'sx:curPS', 'Plates & Solids', 'platesolids'],
      ['S', 'x:text', 'Text', 'text', { dis: NB.text }], ['S', 'x:previous', 'Previous', 'previous', { dis: NB.previous }], ['S', 'x:sload', 'Load', 'loadsel', { dis: NB.sload }]] },
    { n: 'Geometry', it: [['S', 'sx:g:all', 'All', 'sqAll'], ['S', 'sx:g:inv', 'Inverse', 'sqInv'], ['S', 'sx:g:list', 'List', 'sqList'],
      ['S', 'm:gpar', 'Parallel', 'parallel', { menu: [['par:x', 'Parallel to X'], ['par:y', 'Parallel to Y'], ['par:z', 'Parallel to Z']] }], ['S', 'x:gconn', 'Connected', 'connected', { dis: NB.connected, menu: [] }], ['S', 'x:highlight', 'Highlight', 'highlight', { dis: NB.highlight }]] },
    { n: 'Nodes', it: [['S', 'sx:n:all', 'All', 'nodeAll'], ['S', 'sx:n:inv', 'Inverse', 'sqInv'], ['S', 'sx:n:list', 'List', 'sqList'], ['S', 'sx:supports', 'Supports', 'supsel'], ['S', 'm:nmiss', 'Unconnected', 'nodetools', { menu: [['sx:orphans', 'Unconnected nodes'], ['sx:freeends', 'Free beam ends']] }]] },
    { n: 'Beams', it: [['S', 'sx:b:all', 'All', 'beamAll'], ['S', 'sx:b:inv', 'Inverse', 'beamInv'], ['S', 'sx:b:list', 'List', 'beamList'],
      ['S', 'm:bpar', 'Parallel', 'parallel', { menu: [['par:x', 'Parallel to X'], ['par:y', 'Parallel to Y'], ['par:z', 'Parallel to Z']] }], ['S', 'x:bconn', 'Connected', 'connected', { dis: NB.connected, menu: [] }]] },
    { n: '', it: [['L', 'm:plates', 'Plates', 'pointer', { menu: [['sx:p:all', 'All plates'], ['sx:p:inv', 'Inverse plates'], ['sx:p:list', 'Plates by list…'], ['sx:p:nothk', 'Plates without thickness']] }]] },
    { n: '', it: [['L', 'm:solids', 'Solids', 'pointer', { menu: [['sx:s:all', 'All solids'], ['sx:s:inv', 'Inverse solids'], ['sx:s:list', 'Solids by list…']] }]] },
    { n: '', it: [['L', 'x:filter', 'Filter', 'pointer', { dis: NB.filter, menu: [] }]] },
    { n: '', it: [['L', 'm:attr', 'Attributes', 'pointer', { menu: [['selByProp', 'By property…'], ['selByMat', 'By material…'], ['selMissing', 'Missing attributes…'], ['-'], ['selNone', 'Clear selection'], ['pickTol', 'Cursor tolerance…']] }]] },
    { n: '', it: [['L', 'x:modes', 'Modes', 'pointer', { dis: NB.modes, menu: [] }]] },
    ] },
  spec: { label: 'Specification', groups: [
    { n: 'Beam Profiles', it: [['L', 'secDb', 'Standard', 'stdsec', { menu: [['secDb', 'Section database…'], ['assignCurSec', 'Assign current section to selection'], ['removeSec', 'Remove section from selection']] }], ['L', 'x:legacy', 'Legacy', 'legacy', { dis: NB.legacy, menu: [] }], ['L', 'secDef', 'Prismatic', 'prismatic'], ['L', 'x:tapered', 'Tapered', 'tapered', { dis: NB.tapered }], ['L', 'secCsv', 'User\nTable', 'usertable', { menu: [['secCsv', 'Import CSV section library…']] }]] },
    { n: 'Plate Profiles', it: [['L', 'thick', 'Plate\nThickness', 'platethk']] },
    { n: 'Materials', it: [['L', 'm:const', 'Constants', 'constants', { menu: [['matLib', 'Material library…'], ['matUser', 'User-defined material…'], ['assignCurMat', 'Assign current material to selection'], ['removeMat', 'Remove material from selection'], ['beta', 'Beta angle…']] }]] },
    { n: 'Specifications', it: [['L', 'x:nspec', 'Node', 'specnode', { dis: NB.nodespec, menu: [] }], ['L', 'm:bspec', 'Beam', 'specbeam', { menu: [['releases', 'Member releases…'], ['offsets', 'Member offsets…'], ['-'], ['mt:normal', 'Normal member'], ['mt:truss', 'Truss'], ['mt:tension', 'Tension only (solved as linear)'], ['mt:compression', 'Compression only (solved as linear)'], ['mt:cable', 'Cable'], ['mt:inactive', 'Inactive'], ['-'], ['clrRel', 'Clear releases'], ['clrOff', 'Clear offsets']] }], ['L', 'x:pspec', 'Plate', 'specplate', { dis: NB.platespec, menu: [] }]] },
    { n: 'Supports', it: [['L', 'qs:fixed', 'Fixed', 'fixed'], ['L', 'qs:pinned', 'Pinned', 'pinned'], ['L', 'supCreate', 'Custom', 'custom'],
      ['S', 'x:found', 'Foundation', 'foundation', { dis: NB.foundation }], ['S', 'x:oneway', 'One Way Spring', 'oneway', { dis: NB.oneway }], ['S', 'm:othersup', 'Other Supports', 'othersup', { menu: [['supMgr', 'Support manager…'], ['supBut', 'Fixed but / spring…'], ['supLowest', 'Supports at lowest level…'], ['supDel', 'Remove supports from selection']] }]] },
    { n: 'Tools', it: [['L', 'x:shape', 'Shape\nEditor', 'shape', { dis: NB.shape }], ['L', 'secDb', 'Database\nManager', 'dbman']] }] },
  loading: { label: 'Loading', groups: [
    { n: 'Loading Specifications', it: [['L', 'lcNew', 'Primary\nLoad Case', 'primary'], ['L', 'cbNew', 'Combination\nLoad Case', 'combcase'], ['L', 'x:refcase', 'Reference\nLoad Case', 'refcase', { dis: NB.refcase }], ['L', 'm:items', 'Load\nItems', 'loaditems', { menu: 'items' }]] },
    { n: 'Load Generation', it: [['L', 'x:vehgen', 'Vehicle\nLoad Generator', 'vehicle', { dis: NB.vehicle }], ['L', 'ldWind', 'Wind Load\nGenerator', 'windgen', { menu: [['ldWind', 'Wind loads on members…']] }], ['L', 'x:mass', 'Mass Model\nGenerator', 'mass', { dis: NB.mass }], ['L', 'lcEdit', 'Primary\nLoad Type', 'ptype'], ['L', 'cbTpl', 'Automatic\nCombinations', 'autocomb', { menu: [['cbTpl', 'API RP 2A-LRFD templates…'], ['cbNew', 'New combination…']] }]] },
    { n: 'Define Load Systems', it: [['S', 'ldWind', 'Wind', 'wind'], ['S', 'x:snow', 'Snow', 'snow', { dis: NB.snow }], ['S', 'x:seis', 'Seismic', 'seismic', { dis: NB.seismic, menu: [] }], ['S', 'x:direct', 'Direct Analysis', 'direct', { dis: NB.direct }], ['S', 'x:veh', 'Vehicle', 'vehicle', { dis: NB.vehicle }], ['S', 'x:push', 'Pushover', 'pushover', { dis: NB.pushover }], ['L', 'x:encl', 'Enclosed\nZone', 'enclosed', { dis: NB.enclosed }]] },
    { n: 'Dynamic Specifications', it: [['L', 'x:thist', 'Time\nHistory', 'thist', { dis: NB.thist, menu: [] }], ['L', 'x:damp', 'Modal\nDamping', 'damping', { dis: NB.damping }]] },
    { n: 'Display', ctl: 'lcase' }] },
  analysis: { label: 'Analysis and Design', groups: [
    { n: 'Analysis', it: [['L', 'runAna', 'Run\nAnalysis', 'run'], ['L', 'resReport', 'Analysis\nOutput', 'output'], ['S', 'netCheck', 'Test Connection', 'plug'], ['S', 'srvSet', 'Server Settings', 'gear'], ['S', 'srvCross', 'Cross-check (PyNite)', 'cross']] },
    { n: 'Results', it: [['L', 'm:diag', 'Diagrams', 'diag', { menu: 'diagrams' }], ['S', 'defUp', 'Deflected Shape ×', 'deflect'], ['S', 'defOff', 'Hide Deflection', 'deflect'], ['S', 'diagUp', 'Larger', 'bigger'], ['S', 'diagDn', 'Smaller', 'smaller'], ['S', 'legend', 'Colour Legend', 'legend']] },
    { n: 'Reduced-Order Models', it: [['L', 'srvRom', 'ROM\nSolve', 'rom']] },
    { n: 'Design', it: [['L', 'designParams', 'Design\nParameters', 'designp'], ['L', 'x:code', 'API RP 2A\nCode Check', 'codecheck', { dis: NB.code }]] }] },
  utilities: { label: 'Utilities', groups: [
    { n: 'Geometry Tools', it: [['S', 'm:structT', 'Structure Tools', 'tools', { menu: [['utilConn', 'Beam / plate connectivity'], ['utilMergeProp', 'Merge properties'], ['utilCut', 'Cut section…']] }], ['S', 'm:nodeT', 'Node Tools', 'nodetools', { menu: [['utilDupNode', 'Duplicate nodes'], ['utilOrphan', 'Orphan nodes'], ['utilRmOrphan', 'Remove orphan nodes'], ['utilDist', 'Node to node distance']] }], ['S', 'm:beamT', 'Beam Tools', 'beamtools', { menu: [['utilDupBeam', 'Duplicate beams'], ['utilZero', 'Zero-length beams'], ['utilCollinear', 'Overlapping collinear beams'], ['utilDim', 'Dimension beams']] }],
      ['S', 'm:plateT', 'Plate Tools', 'platetools', { menu: [['utilDupPlate', 'Duplicate Plates'], ['utilWarped', 'Warped Plates'], ['x:pc', 'Plate Connectivity', NB.plateconn]] }], ['S', 'm:solidT', 'Solid Tools', 'solidtools', { menu: [['x:nv', 'Negative Volume', NB.solidneg], ['x:ws', 'Warped Solids', NB.solidwarp]] }], ['S', 'x:restr', 'Member Restraints', 'restraint', { dis: NB.restraint }]] },
    { n: '', it: [['L', 'x:groups', 'Groups', 'groups', { dis: NB.groups }]] },
    { n: 'Physical Model', it: [['L', 'x:dropphys', 'Drop\nPhysical Model', 'dropphys', { dis: NB.dropphys }]] },
    { n: 'Query', it: [['L', 'sx:query', 'Query', 'query']] },
    { n: 'Display', it: [['L', 'x:instext', 'Insert\nText', 'inserttext', { dis: NB.inserttext }]] },
    { n: 'Edit', it: [['L', 'sx:cmdfile', 'Command\nFile', 'cmdfile']] },
    { n: 'View', it: [['L', 'resReport', 'Analysis\nOutput', 'output'], ['S', 'sx:alog', 'Analysis Log', 'alog'], ['S', 'x:elog', 'Error Log', 'elog', { dis: NB.errlog }]] },
    { n: 'Tools', it: [['L', 'x:conntags', 'Connection\nTags', 'conntags', { dis: NB.conntags, menu: [] }], ['L', 'x:calc', 'Calculator', 'calc', { dis: NB.calc }], ['L', 'unitsSet', 'Unit\nConverter', 'unitconv'], ['S', 'sx:takepic', 'Take Picture', 'takepic'], ['S', 'sx:copypic', 'Copy Picture', 'copypic'], ['S', 'x:avi', 'AVI File', 'avi', { dis: NB.avi }]] },
    { n: 'Developer', it: [['L', 'x:macroed', 'Macro\nEditor', 'macroed', { dis: NB.macro }], ['L', 'x:macros', 'Macros', 'macros', { dis: NB.macro }]] },
    { n: '', it: [['L', 'x:usertools', 'User Tools', 'usertools', { dis: NB.usertools, menu: [] }]] }] }
};
const SX_TABS = ['file', 'geometry', 'view', 'select', 'spec', 'loading', 'analysis', 'utilities'];

/* workflow icons for the left panel */
Object.assign(SXI, {
  wfAna: `<path d="M2 21V10l7-5 7 5v11" fill="#D6E9FA" stroke="#2F74C2" stroke-width="1.4"/><path d="M2 15h14M6 10v11M12 10v11" stroke="#2F74C2"/><circle cx="17" cy="16" r="4.2" fill="#fff" stroke="#1E8F4E" stroke-width="1.8"/><path d="M20 19l3 3" stroke="#1E8F4E" stroke-width="2.2" stroke-linecap="round"/>`,
  wfImport: `<g fill="#2F74C2"><circle cx="4" cy="17" r="1.1"/><circle cx="7" cy="14" r="1.1"/><circle cx="10" cy="16" r="1.1"/><circle cx="6" cy="20" r="1.1"/><circle cx="9" cy="11" r="1.1"/><circle cx="12" cy="13" r="1.1"/><circle cx="3" cy="13" r="1.1"/><circle cx="11" cy="19" r="1.1"/></g><path d="M13 9l5-6 5 6v12h-10z" fill="#D6E9FA" stroke="#1E8F4E" stroke-width="1.4"/><path d="M13 15h10M18 9v12" stroke="#1E8F4E"/>`,
  wfPost: `<path d="M12 3a9 9 0 0 1 8.5 6" fill="none" stroke="#1E8F4E" stroke-width="2.6"/><path d="M21 14a9 9 0 0 1-7 7" fill="none" stroke="#2F74C2" stroke-width="2.6"/><path d="M10 21a9 9 0 0 1-7-8" fill="none" stroke="#1E8F4E" stroke-width="2.6"/><path d="M3 9a9 9 0 0 1 4-5" fill="none" stroke="#2F74C2" stroke-width="2.6"/>`,
  wfRom: `<rect x="2" y="3" width="20" height="18" fill="#fff" stroke="#2F74C2" stroke-width="1.4"/><path d="M5 17l4-7 3 4 3-6 4 5" fill="none" stroke="#1E8F4E" stroke-width="2"/><path d="M5 19h14" stroke="#2F74C2"/>`,
  wfCode: `<path d="M4 2h11l5 5v15H4z" fill="#fff" stroke="#2F74C2" stroke-width="1.4"/><path d="M7 8h8M7 11h8M7 14h4" stroke="#2F74C2"/><circle cx="16" cy="17" r="4.5" fill="#E3F1E8" stroke="#1E8F4E" stroke-width="1.6"/><path d="M14 17l1.5 1.5 2.5-3" stroke="#1E8F4E" stroke-width="1.6" fill="none"/>`,
  wfFat: `<path d="M2 18l4-8 3 6 3-11 3 9 3-5 4 9" fill="none" stroke="#2F74C2" stroke-width="1.8"/><path d="M2 21h20" stroke="#555"/>`,
  wfFound: `<path d="M12 2v8" stroke="#2F74C2" stroke-width="2.4"/><rect x="4" y="10" width="16" height="4" fill="#D6E9FA" stroke="#2F74C2"/><path d="M7 14v8M12 14v8M17 14v8" stroke="#8F5D17" stroke-width="2"/>`,
  wfShm: `<path d="M2 13h4l2-5 3 9 3-12 2 8h6" fill="none" stroke="#1E8F4E" stroke-width="2"/><circle cx="20" cy="5" r="2.5" fill="#2F74C2"/>`,
  wfInsp: `<circle cx="10" cy="10" r="7" fill="#fff" stroke="#2F74C2" stroke-width="1.8"/><path d="M15 15l7 7" stroke="#2F74C2" stroke-width="2.6" stroke-linecap="round"/><path d="M7 8l2 4 1-3 2 4" stroke="#D9433A" stroke-width="1.4" fill="none"/>`,
  wfTwin: `<path d="M4 8l8-5 8 5v9l-8 5-8-5z" fill="#D6E9FA" stroke="#2F74C2" stroke-width="1.4"/><path d="M4 8l8 5 8-5M12 13v9" fill="none" stroke="#2F74C2"/><circle cx="12" cy="13" r="2.4" fill="#1E8F4E"/>`
});

const SX_WF = [
  ['ana', 'Analytical Modeling', 'wfAna'],
  ['import', 'Import & Healing', 'wfImport'],
  ['post', 'Postprocessing', 'wfPost'],
  ['rom', 'Reduced-Order Models', 'wfRom'],
  ['code', 'Code Check', 'wfCode', NB.code, 'API RP 2A-LRFD · not built'],
  ['fatigue', 'Fatigue Assessment', 'wfFat', 'Fatigue (SCFs, S-N curves, rainflow counting) is not built.', 'not built'],
  ['found', 'Piles & Foundations', 'wfFound', NB.foundation, 'not built'],
  ['shm', 'Health Monitoring', 'wfShm', 'Sensor integration and live monitoring are MVP 2 and not built.', 'MVP 2 · not built'],
  ['insp', 'Inspection & Defects', 'wfInsp', 'Inspection and defect management are MVP 2 and not built.', 'MVP 2 · not built'],
  ['twin', 'Digital Twin', 'wfTwin', 'The live digital twin view is a separate prototype and is not connected to this modeller yet.', 'not connected']
];
const SX_STEPS = [['geometry', 'Geometry'], ['property', 'Properties'], ['material', 'Materials'], ['spec', 'Specifications'], ['support', 'Supports'], ['loading', 'Loading'], ['analysis', 'Analysis'], ['design', 'Design']];
const SX_STEP_TAB = { geometry: 'geometry', property: 'spec', material: 'spec', spec: 'spec', support: 'spec', loading: 'loading', analysis: 'analysis', design: 'analysis' };

S.wf = S.wf || 'geometry'; S.sxModule = 'ana'; S.sxp = { prop: { tab: 'sec', sel: null, method: 'sel', list: '', hl: true, beta: 0 }, mat: { sel: null, method: 'sel', list: '' }, spec: { type: 'normal', method: 'sel', list: '' }, sup: { sel: null, method: 'sel', list: '' }, load: { sel: null, open: { D: false, L: true, E: false }, method: 'sel', list: '' } };
S.sxWin = { top: true, bot: true, right: true, minTop: false, minBot: false };
S.sxPane = null; S.sxAssign = null; S.sxMsg = '';

/* ---------------- build the shell ---------------- */
function sxBuild() {
  document.documentElement.dataset.theme = 'light';
  document.body.classList.add('sx');
  const top = document.createElement('div'); top.id = 'sxTop';
  top.innerHTML = `<div id="sxTitle"><div class="qat">
      <svg class="logo" viewBox="0 0 64 44" aria-hidden="true"><circle cx="23" cy="22" r="13" fill="none" stroke="#7FF2BC" stroke-width="7"/><path d="M41 9a13 13 0 1 1-12.6 16.2" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>
      <button type="button" data-q="saveProject" title="Save project (Ctrl+S)">${sxi('save', '')}</button>
      <button type="button" data-q="open" title="Open or import a model">${sxi('open', '')}</button>
      <span class="sep"></span>
      <button type="button" id="sxUndo" title="Undo">${sxi('undo', '')}</button>
      <button type="button" id="sxRedo" title="Redo">${sxi('redo', '')}</button>
      <span class="sep"></span><span id="sxNet"></span></div>
    <div class="ttl" id="sxTtl"></div><div class="right"></div></div>
    <div id="sxMenu"><div class="tabs" role="tablist" id="sxTabs"></div>
      <div class="tools"><button class="help" type="button" id="sxHelp" title="${esc(NB.help)}">?</button>
      <label id="sxSearch"><input id="sxSearchIn" placeholder="Search" aria-label="Search commands" autocomplete="off">${sxi('zin', '')}</label></div></div>`;
  document.body.insertBefore(top, document.body.firstChild);
  const rib = $('#ribbon'); top.after(rib);

  const stage = document.createElement('div'); stage.id = 'sxStage';
  stage.innerHTML = `<aside id="sxWf"><div class="hd"><span>Workflow</span><button type="button" id="sxWfPin" title="Collapse the Workflow panel">${'<svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 3h6v2l-1 1v6l3 3v1H7v-1l3-3V6L9 5z M12 16v6" fill="#fff" stroke="#fff"/></svg>'}</button></div>
      <div class="list" id="sxWfList"></div>
      <div class="ft"><button type="button" id="sxWfMin" title="Collapse or expand the Workflow panel"><svg viewBox="0 0 24 24" width="18" height="14"><path d="M20 12H6M11 7l-5 5 5 5" fill="none" stroke="#C0392B" stroke-width="2.4"/></svg></button></div></aside>
    <section id="sxMain"><div id="sxWfBar" role="tablist" aria-label="Analytical modeling steps"></div>
      <div id="sxMdi">
        <div class="sxwin" id="sxVpWin"><div class="wt">${'<svg class="wi" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" fill="#fff" stroke="#9B1C1C" stroke-width="0"/><rect x="2" y="3" width="20" height="18" fill="#fff" stroke="#0B5A35" stroke-width="1.6"/><path d="M6 17V9l6-3 6 3v8M6 13h12" fill="none" stroke="#0B5A35" stroke-width="1.6"/></svg>'}<span class="t" id="sxVpTtl"></span>
          <button class="wb dis" type="button" title="The structure window stays open in the browser">${'<svg viewBox="0 0 12 12"><path d="M2 9h8" stroke="#333" stroke-width="1.6"/></svg>'}</button>
          <button class="wb" type="button" id="sxVpMax" title="Structure only (hide docked windows)">${'<svg viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" fill="none" stroke="#333" stroke-width="1.3"/><rect x="2" y="2" width="8" height="2" fill="#333"/></svg>'}</button>
          <button class="wb x dis" type="button" title="The structure window cannot be closed">${'<svg viewBox="0 0 12 12"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="#fff" stroke-width="1.8"/></svg>'}</button></div>
          <div class="wc" id="sxVpHost"></div></div>
        <div id="sxRight">
          <div class="sxwin" id="sxWinA"><div class="wt"></div><div class="wc"></div></div>
          <div class="sxwin" id="sxWinB"><div class="wt"></div><div class="wc"></div></div>
        </div></div></section>`;
  rib.after(stage);
  const vp = $('#vp'); $('#sxVpHost').appendChild(vp);
  const tri = document.createElement('div'); tri.className = 'sxtriad'; vp.appendChild(tri);
  /* the old side panel lives inside the generic pane */
  S.sxSide = document.querySelector('aside.side');

  const back = document.createElement('div'); back.id = 'sxBack'; document.body.appendChild(back);

  /* events */
  $$('#sxTitle [data-q]').forEach(b => b.addEventListener('click', () => runCmd(b.dataset.q)));
  $('#sxUndo').addEventListener('click', () => undo()); $('#sxRedo').addEventListener('click', () => redo());
  $('#sxHelp').addEventListener('click', () => toast(NB.help));
  const si = $('#sxSearchIn');
  si.addEventListener('focus', () => { si.blur(); runCmd('palette'); });
  $('#sxWfMin').addEventListener('click', () => $('#sxWf').classList.toggle('min'));
  $('#sxWfPin').addEventListener('click', () => $('#sxWf').classList.add('min'));
  $('#sxVpMax').addEventListener('click', () => sxRun('sx:structOnly'));
  const net = $('#netstat'); if (net) $('#sxNet').appendChild(net);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { sxCloseMenu(); if (S.sxAssign) { S.sxAssign = null; toast('Cursor assignment stopped.'); sxPaneSoon(); } if ($('#sxBack').classList.contains('open')) sxBackstage(false); } });
  document.addEventListener('mousedown', e => { if (S.sxMenuEl && !S.sxMenuEl.contains(e.target) && !e.target.closest('[data-sx]')) sxCloseMenu(); });
}

/* ---------------- ribbon rendering ---------------- */
function sxIsOn(id) {
  if (id === 'sx:structOnly') return !S.sxWin.right;
  if (id === 'sx:tables') return S.sxWin.right && S.sxWin.top;
  if (id === 'sx:curPS') return S.cursor === 'plates';
  if (id.startsWith('qs:') || id.startsWith('m:') || id.startsWith('x:') || id.startsWith('sx:')) return false;
  try { return isOn(id); } catch (e) { return false; }
}
function sxItem(it) {
  const [sz, id, label, ic, o = {}] = it;
  const dis = !!o.dis, menu = o.menu !== undefined, on = !dis && sxIsOn(id);
  const tip = esc(label.replace(/\n/g, ' '));
  const cls = (sz === 'L' ? 'sxL' : 'sxS' + (sz === 'I' ? ' icon' : '')) + (dis ? ' dis' : '') + (on ? ' on' : '');
  const car = menu ? `<span class="car">▼</span>` : '';
  const inner = sz === 'L' ? `${sxi(ic)}<span class="lb">${esc(label)}</span>${car}`
    : sz === 'I' ? sxi(ic) : `${sxi(ic)}<span>${esc(label)}</span>${car}`;
  return `<button type="button" class="${cls}" data-sx="${esc(id)}" data-tip="${tip}" ${dis ? `data-nb="${esc(o.dis)}" aria-disabled="true"` : ''} aria-label="${tip}">${inner}</button>`;
}
function sxGroupHtml(g) {
  if (g.ctl === 'lcase') {
    const ld = L();
    return `<div class="sxg"><div class="body"><div class="sxctl"><label>Load:<select id="sxLc">${ld.cases.length ? ld.cases.map(c => `<option value="${c.id}" ${c.id === S.lc ? 'selected' : ''}>${c.id}: ${esc(c.title)}</option>`).join('') : '<option>(no load cases)</option>'}</select></label>
      ${sxItem(['S', 'ldShow', 'View Loading Diagram', 'viewdiag'])}${sxItem(['S', 'ldSum', 'Load Summary', 'sum'])}</div></div><div class="gl">${esc(g.n)}</div></div>`;
  }
  let html = '', col = [];
  const flush = () => { if (col.length) { html += `<div class="sxcol">${col.join('')}</div>`; col = []; } };
  for (const it of g.it) {
    if (it[0] === 'L') { flush(); html += sxItem(it); }
    else { col.push(sxItem(it)); if (col.length === 3) flush(); }
  }
  flush();
  return `<div class="sxg"><div class="body">${html}</div><div class="gl">${esc(g.n)}</div></div>`;
}
function sxRenderTabs() {
  const host = $('#sxTabs'); if (!host) return;
  host.innerHTML = SX_TABS.map(k => `<button type="button" role="tab" data-st="${k}" class="${k === 'file' ? 'file' : ''}" aria-selected="${S.tab === k}">${esc(SXR[k].label)}</button>`).join('');
  $$('#sxTabs [data-st]').forEach(b => {
    b.addEventListener('click', () => {
      const k = b.dataset.st;
      if (k === 'file') { sxBackstage(true); return; }
      if (S.sxRibbonCollapsed && S.tab === k) { S.sxRibbonCollapsed = false; }
      S.tab = k;
      if (k === 'geometry') S.wf = 'geometry';
      else if (k === 'spec' && !['property', 'material', 'spec', 'support'].includes(S.wf)) S.wf = 'property';
      else if (k === 'loading') S.wf = 'loading';
      else if (k === 'analysis' && !['analysis', 'design'].includes(S.wf)) S.wf = 'analysis';
      renderRibbonTabs(); renderRibbon(); sxLayout();
    });
  });
}
function sxNormaliseTab() {
  const legacy = { property: 'property', material: 'material', support: 'support' };
  if (legacy[S.tab]) { S.wf = legacy[S.tab]; S.tab = 'spec'; }
  if (!SXR[S.tab] || S.tab === 'file') S.tab = 'geometry';
}
function sxRenderRibbon() {
  sxNormaliseTab();
  const el = $('#ribbon'); const t = SXR[S.tab];
  el.className = 'ribbon' + (S.sxRibbonCollapsed ? ' collapsed' : '');
  el.innerHTML = (t.groups || []).map(sxGroupHtml).join('')
    + `<div id="sxCopilot">${sxItem(['L', 'x:copilot', 'GeoSoft\nCopilot', 'copilot', { dis: NB.copilot }])}</div>`
    + `<button id="sxCollapse" type="button" title="Collapse the ribbon"><svg viewBox="0 0 18 14" width="18" height="14"><path d="M4 10l5-5 5 5" fill="none" stroke="#333" stroke-width="1.6"/></svg></button>`;
  $$('#ribbon [data-sx]').forEach(b => {
    b.addEventListener('click', e => { e.stopPropagation(); if (b.dataset.nb) { toast(b.dataset.nb); return; } sxRun(b.dataset.sx, b); });
    b.addEventListener('mouseenter', () => sxTip(b)); b.addEventListener('mouseleave', sxTipHide);
  });
  const lc = $('#sxLc'); if (lc && L().cases.length) lc.addEventListener('change', () => { S.lc = +lc.value; draw(); refreshPanel(); sxStatus(); });
  $('#sxCollapse').addEventListener('click', () => { S.sxRibbonCollapsed = true; sxRenderRibbon(); });
}
function sxTip(b) {
  sxTipHide();
  const t = document.createElement('div'); t.className = 'sxtip';
  t.innerHTML = `<b>${esc(b.dataset.tip)}</b>${b.dataset.nb ? `<span class="nb">Not available. ${esc(b.dataset.nb)}</span>` : ''}`;
  document.body.appendChild(t);
  const r = b.getBoundingClientRect();
  t.style.left = Math.min(innerWidth - t.offsetWidth - 6, r.left) + 'px'; t.style.top = (r.bottom + 4) + 'px';
  S.sxTipEl = t;
}
function sxTipHide() { if (S.sxTipEl) { S.sxTipEl.remove(); S.sxTipEl = null; } }

/* ---------------- dropdown menus ---------------- */
function sxMenuItems(key) {
  if (Array.isArray(key)) return key;
  if (key === 'labels') return [['lbl:nodes', 'Node numbers'], ['lbl:beams', 'Beam numbers'], ['lbl:plates', 'Plate numbers'], ['lbl:sections', 'Section names'], ['lbl:specs', 'Releases and specifications'], ['lbl:supports', 'Supports'], ['lbl:axes', 'Member local axes']];
  if (key === 'display') return [['disp:line', 'Line elements'], ['disp:render', '3D rendering'], ['persp', 'Perspective'], ['renderScope', 'Render whole structure']];
  if (key === 'colors') return [['col:property', 'Colour by property'], ['col:material', 'Colour by material'], ['col:type', 'Colour by member type'], ['col:status', 'Colour by missing data'], ['col:healed', 'Colour healed joints'], ['-'], ['legend', 'Show colour legend']];
  if (key === 'windows') return [['sx:showAllWin', 'Show all docked windows'], ['sx:structOnly', 'Structure only'], ['-'], ['sx:query', 'Query: selection details'], ['sx:cmdfile', 'Command file'], ['sx:alog', 'Analysis log']];
  if (key === 'items') return [['loadTree', 'Load & Definition…'], ['-'], ['ldSW', 'Self-weight…'], ['ldNode', 'Nodal load…'], ['ldUni', 'Member uniform load…'], ['ldCon', 'Member concentrated load…'], ['ldPr', 'Plate pressure…'], ['ldTemp', 'Temperature load…'], ['-'], ['envSet', 'Project environment…'], ['ldWaveSet', 'Wave case set…'], ['ldWave', 'Wave & current…'], ['ldBuoy', 'Buoyancy & flooding…'], ['ldEquip', 'Equipment…'], ['ldPipe', 'Pipe weight…'], ['ldStress', 'Pipe stress CSV…'], ['ldArea', 'Deck area (DNV)…'], ['ldWind', 'Wind…'], ['-'], ['ldSum', 'Load summary'], ['selfWeight', 'Self-weight and MTO'], ['ldClrSel', 'Delete loads on selection']];
  if (key === 'diagrams') return [['dg:none', 'Off'], ['dg:Fx', 'Axial force Fx'], ['dg:Fy', 'Shear Fy'], ['dg:Fz', 'Shear Fz'], ['dg:Mx', 'Torsion Mx'], ['dg:My', 'Moment My'], ['dg:Mz', 'Moment Mz'], ['dg:stress', 'Beam stress'], ['dg:util', 'Stress ratio (not a code check)']];
  return [];
}
function sxOpenMenu(btn, items) {
  sxCloseMenu(); sxTipHide();
  const m = document.createElement('div'); m.className = 'sxmenu';
  m.innerHTML = items.map(([id, label, dis]) => id === '-' ? '<hr>' : `<button type="button" data-mi="${esc(id)}" class="${dis ? 'dis' : ''}${!dis && sxIsOn(id) ? ' on' : ''}" ${dis ? `title="${esc(dis)}"` : ''}>${esc(label)}</button>`).join('');
  document.body.appendChild(m);
  const r = btn.getBoundingClientRect();
  m.style.left = Math.min(innerWidth - m.offsetWidth - 4, r.left) + 'px'; m.style.top = r.bottom + 'px';
  m.querySelectorAll('[data-mi]').forEach(b => b.addEventListener('click', () => {
    const it = items.find(x => x[0] === b.dataset.mi);
    sxCloseMenu();
    if (it && it[2]) { toast(it[2]); return; }
    sxRun(b.dataset.mi);
  }));
  S.sxMenuEl = m;
}
function sxCloseMenu() { if (S.sxMenuEl) { S.sxMenuEl.remove(); S.sxMenuEl = null; } }

/* ---------------- command dispatch ---------------- */
function sxFindItem(id) { for (const t of Object.values(SXR)) for (const g of (t.groups || [])) for (const it of (g.it || [])) if (it[1] === id) return it; return null; }
function sxSelKind(kind, mode) {
  const src = { nodes: M.nodes, beams: M.beams, plates: M.plates, solids: M.solids };
  if (mode === 'list') {
    runCmd('selList');
    setTimeout(() => { const f = $('#f_kind'); if (f) f.value = kind; }, 0);
    return;
  }
  if (kind === 'geometry') { S.cursor = 'geometry'; runCmd(mode === 'all' ? 'selAll' : 'selInverse'); renderRibbon(); return; }
  if (mode === 'all') { for (const k in S.sel) S.sel[k].clear(); for (const id of src[kind].keys()) S.sel[kind].add(id); }
  else { const nw = new Set(); for (const id of src[kind].keys()) if (!S.sel[kind].has(id)) nw.add(id); S.sel[kind] = nw; }
  S.cursor = kind; afterSel(); renderRibbon();
  toast(`${S.sel[kind].size} ${kind} selected.`);
}
function sxRun(id, btn) {
  if (id.startsWith('x:')) { const it = sxFindItem(id); toast(it && it[4] && it[4].dis ? it[4].dis : 'Not available.'); return; }
  if (id.startsWith('m:')) { const it = sxFindItem(id); if (it) sxOpenMenu(btn || document.querySelector(`[data-sx="${id}"]`), sxMenuItems(it[4].menu)); return; }
  if (btn) { const it = sxFindItem(id); if (it && it[4] && it[4].menu && it[0] === 'L' && !it[4].dis && btn.querySelector('.car')) { /* large split button: run the primary command */ } }
  const [a, b, c] = id.split(':');
  if (id === 'undo') { undo(); return; } if (id === 'redo') { redo(); return; }
  if (a === 'sx') {
    if (b === 'g' || b === 'n' || b === 'b' || b === 'p' || b === 's') {
      const kind = { g: 'geometry', n: 'nodes', b: 'beams', p: 'plates', s: 'solids' }[b];
      if (c === 'nothk') { clearSel(); for (const p of M.plates.values()) if (!p.t) S.sel.plates.add(p.id); S.cursor = 'plates'; afterSel(); renderRibbon(); toast(`${S.sel.plates.size} plates without thickness.`); return; }
      sxSelKind(kind, c); return;
    }
    if (b === 'supports') { clearSel(); for (const n of M.supports.keys()) if (M.nodes.has(n)) S.sel.nodes.add(n); S.cursor = 'nodes'; afterSel(); renderRibbon(); toast(`${S.sel.nodes.size} supported nodes selected.`); return; }
    if (b === 'orphans' || b === 'freeends') {
      const deg = new Map(); for (const bm of M.beams.values()) { deg.set(bm.i, (deg.get(bm.i) || 0) + 1); deg.set(bm.j, (deg.get(bm.j) || 0) + 1); }
      for (const p of M.plates.values()) p.n.forEach(n => deg.set(n, (deg.get(n) || 0) + 2)); for (const s of M.solids.values()) s.n.forEach(n => deg.set(n, (deg.get(n) || 0) + 2));
      clearSel(); for (const n of M.nodes.keys()) { const d = deg.get(n) || 0; if (b === 'orphans' ? d === 0 : (d === 1 && !M.supports.has(n))) S.sel.nodes.add(n); }
      S.cursor = 'nodes'; afterSel(); renderRibbon(); toast(`${S.sel.nodes.size} ${b === 'orphans' ? 'unconnected nodes' : 'free beam ends'} selected.`); return;
    }
    if (b === 'curPS') { S.cursor = 'plates'; setTool('select'); return; }
    if (b === 'structOnly') { S.sxWin.right = !S.sxWin.right; sxLayout(); renderRibbon(); return; }
    if (b === 'tables') { S.sxWin.right = true; S.sxWin.top = !S.sxWin.top || !S.sxWin.right; sxLayout(); renderRibbon(); return; }
    if (b === 'showAllWin') { Object.assign(S.sxWin, { top: true, bot: true, right: true, minTop: false, minBot: false }); sxLayout(); renderRibbon(); return; }
    if (b === 'query') { sxShowGeneric('selection', 'Query'); return; }
    if (b === 'cmdfile') { sxShowGeneric('input', 'Command File'); return; }
    if (b === 'alog') { sxShowGeneric('log', 'Analysis Log'); return; }
    if (b === 'takepic' || b === 'copypic') { sxPicture(b === 'copypic'); return; }
    return;
  }
  runCmd(id);
}
function sxPicture(copy) {
  draw();
  setTimeout(() => {
    const cv = $('#cv'); if (!cv) return;
    cv.toBlob(async blob => {
      if (!blob) { toast('Could not capture the view.'); return; }
      if (copy) {
        try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); toast('Picture of the view copied to the clipboard.'); }
        catch (e) { toast('The browser blocked clipboard access. Use Take Picture to download instead.'); }
        return;
      }
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = (M.name || 'model').replace(/\.[^.]+$/, '') + '_view.png'; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      toast('Picture of the view saved as PNG.');
    }, 'image/png');
  }, 60);
}

/* ---------------- Workflow panel and workflow bar ---------------- */
function sxRenderWf() {
  $('#sxWfList').innerHTML = SX_WF.map(([k, l, ic, nb, sub]) => `<button type="button" class="it ${nb ? 'dis' : ''} ${S.sxModule === k ? 'on' : ''}" data-wfm="${k}" title="${esc(nb || l)}">${sxi(ic, '')}<span>${esc(l)}${sub ? `<small>${esc(sub)}</small>` : ''}</span></button>`).join('');
  $$('#sxWfList [data-wfm]').forEach(b => b.addEventListener('click', () => {
    const row = SX_WF.find(x => x[0] === b.dataset.wfm);
    if (row[3]) { toast(row[3]); return; }
    const k = row[0];
    if (k === 'ana') { S.sxModule = 'ana'; S.sxPane = null; gotoWorkflow(S.wf === 'analysis' || S.wf === 'design' ? 'geometry' : S.wf); }
    else if (k === 'import') { S.sxModule = 'ana'; gotoWorkflow('geometry'); sxBackstage(true, 'open'); }
    else if (k === 'post') { S.sxModule = 'post'; gotoWorkflow('analysis'); }
    else if (k === 'rom') { S.sxModule = 'rom'; gotoWorkflow('analysis'); runCmd('srvRom'); }
    sxRenderWf();
  }));
}
function sxRenderWfBar() {
  const bar = $('#sxWfBar'); if (!bar) return;
  const lab = S.sxModule === 'post' ? 'Postprocessing:' : 'Analytical Modeling:';
  bar.innerHTML = `<span class="lbl">${sxi('wfAna', '')}${lab}</span>`
    + SX_STEPS.map(([k, l]) => `<button type="button" role="tab" data-wfs="${k}" aria-selected="${S.wf === k}">${l}</button>`).join('')
    + `<span class="sp"></span><button class="dock" type="button" id="sxDock" title="Show or hide the docked windows"><svg viewBox="0 0 24 24" width="22" height="22"><rect x="2" y="3" width="20" height="18" fill="#fff" stroke="#2F74C2" stroke-width="1.6"/><path d="M14 3v18M14 12h8" stroke="#2F74C2" stroke-width="1.6"/></svg></button>`;
  $$('#sxWfBar [data-wfs]').forEach(b => b.addEventListener('click', () => { S.sxPane = null; gotoWorkflow(b.dataset.wfs); }));
  $('#sxDock').addEventListener('click', () => sxRun('sx:structOnly'));
}

/* ---------------- File backstage ---------------- */
function sxBackstage(open, page) {
  const el = $('#sxBack');
  if (!open) { el.classList.remove('open'); return; }
  const pg = page || 'start';
  const tile = (cmd, ic, t, d) => `<button type="button" class="tile" data-bk="${cmd}">${sxi(ic, '')}<span><b>${esc(t)}</b>${esc(d)}</span></button>`;
  const pages = {
    start: ['Start', tile('newModel', 'newdoc', 'New model', 'Discard the current model and start empty.') + tile('open', 'open', 'Open or import', 'IFC, SACS, STAAD .std, OBJ, GeoSoft JSON or CSV.') + tile('sampleSJ', 'sample', 'Small jacket SJ-01', '4-leg jacket, 73 members.') + tile('sampleJ01', 'sample', 'Jacket J-01', 'Sample jacket in IFC.')],
    open: ['Open', tile('open', 'open', 'Browse for a file', 'IFC, SACS, STAAD .std, OBJ, GeoSoft JSON or CSV. Joints are healed on import with a report.') + tile('sampleSJ', 'sample', 'Small jacket SJ-01', '4-leg jacket, 73 members.') + tile('sampleJ01', 'sample', 'Jacket J-01', 'Sample jacket in IFC.')],
    save: ['Save', tile('saveProject', 'save', 'Save project', 'Downloads a GeoSoft JSON project with model, loads and combinations.')],
    export: ['Export', tile('exStaad', 'exportf', 'STAAD .std', 'Input file for STAAD.Pro.') + tile('exSacs', 'exportf', 'SACS input', 'Joint, member and group cards.') + tile('exCsv', 'exportf', 'Member CSV', 'One row per member with section and material.') + tile('exJson', 'exportf', 'GeoSoft JSON', 'The full project.')],
    check: ['Model checks', tile('mto', 'mto', 'Material take-off', 'Weights and lengths by section with a cut list.') + tile('selfWeight', 'sw', 'Self-weight and MTO', 'Total weight and centre of gravity.')]
  };
  const [h, body] = pages[pg] || pages.start;
  el.innerHTML = `<nav><button type="button" class="back" data-bp="close" title="Back to the model">⟵</button>
    ${[['start', 'Start'], ['newModel', 'New'], ['open', 'Open'], ['save', 'Save'], ['export', 'Export'], ['check', 'Checks']].map(([k, l]) => `<button type="button" data-bp="${k}" class="${k === pg ? 'on' : ''}">${l}</button>`).join('')}
    <span style="flex:1"></span><button type="button" data-bp="close">Close</button></nav>
    <main><h2>${esc(h)}</h2><div class="tiles">${body}</div></main>`;
  el.classList.add('open');
  el.querySelectorAll('[data-bp]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.bp;
    if (k === 'close') { sxBackstage(false); return; }
    if (k === 'newModel') { sxBackstage(false); runCmd('newModel'); return; }
    sxBackstage(true, k);
  }));
  el.querySelectorAll('[data-bk]').forEach(b => b.addEventListener('click', () => { sxBackstage(false); runCmd(b.dataset.bk); }));
}

/* ---------------- docked windows on the right ---------------- */
const SX_PANE_TITLE = { property: 'Properties', material: 'Materials', spec: 'Specifications', support: 'Supports', loading: 'Load & Definition', analysis: 'Analysis', design: 'Design' };
function sxPtabKey(label, fallback) { const p = (typeof PTABS !== 'undefined' ? PTABS : []).find(x => x[1] === label); return p ? p[0] : fallback; }
function sxPlan() {
  if (S.sxPane) return { a: 'beams', b: 'generic' };
  if (S.wf === 'geometry') return { a: 'nodes', b: 'beams' };
  if (S.wf === 'analysis') return { a: 'beams', b: 'generic' };
  return { a: 'beams', b: { property: 'prop', material: 'mat', spec: 'spec', support: 'sup', loading: 'load', design: 'design' }[S.wf] || 'generic' };
}
function sxWinTitle(kind) {
  const nm = (M.name || 'Structure1').replace(/\.[^.]+$/, '');
  if (kind === 'nodes') return `${nm} - Nodes`; if (kind === 'beams') return `${nm} - Beams`;
  if (kind === 'generic') return S.sxPane ? `${S.sxPane.title} - Whole Structure` : `${SX_PANE_TITLE[S.wf] || 'Data'} - Whole Structure`;
  if (kind === 'load') return 'Load & Definition';
  return `${SX_PANE_TITLE[S.wf]} - Whole Structure`;
}
const SX_WIN_ICO = '<svg class="wi" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" fill="#fff" stroke="#2F74C2" stroke-width="1.4"/><rect x="2" y="4" width="20" height="4" fill="#BFD8F2" stroke="#2F74C2" stroke-width="1"/><path d="M2 12h20M2 16h20M8 8v12" stroke="#2F74C2" stroke-width=".8"/></svg>';
const SX_PANE_ICO = '<svg class="wi" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" fill="#fff" stroke="#555" stroke-width="1.2"/><rect x="2" y="3" width="6" height="18" fill="#1E8F4E"/></svg>';
function sxLayout() {
  const nm = (M.name || 'Structure1').replace(/\.[^.]+$/, '');
  if ($('#sxVpTtl')) $('#sxVpTtl').textContent = `${nm} - Whole Structure`;
  if ($('#sxTtl')) $('#sxTtl').textContent = `${M.name || 'Untitled model'} - GeoSoft Structural Modeller`;
  document.title = `${M.name || 'Untitled model'} - GeoSoft Structural Modeller`;
  const R = $('#sxRight'); if (!R) return;
  R.classList.toggle('hidden', !S.sxWin.right || (!S.sxWin.top && !S.sxWin.bot));
  const plan = sxPlan(); S.sxPlanNow = plan;
  const A = $('#sxWinA'), B = $('#sxWinB');
  const frame = (el, kind, slot) => {
    const min = slot === 'a' ? S.sxWin.minTop : S.sxWin.minBot, show = slot === 'a' ? S.sxWin.top : S.sxWin.bot;
    el.style.display = show ? '' : 'none';
    el.className = 'sxwin' + (kind === 'nodes' || kind === 'beams' ? ' inactive' : '');
    if (plan.a === 'beams' && plan.b !== 'beams') { if (slot === 'a') el.classList.add('short'); else el.classList.add('tall'); }
    if (min) { el.style.flex = '0 0 auto'; el.style.height = '32px'; } else { el.style.flex = ''; el.style.height = ''; }
    el.querySelector('.wt').innerHTML = `${kind === 'nodes' || kind === 'beams' ? SX_WIN_ICO : SX_PANE_ICO}<span class="t">${esc(sxWinTitle(kind))}</span>
      <button class="wb" type="button" data-w="min" title="${min ? 'Restore' : 'Minimise'}"><svg viewBox="0 0 12 12"><path d="M2 9h8" stroke="#333" stroke-width="1.6"/></svg></button>
      <button class="wb" type="button" data-w="max" title="Fill the docked area"><svg viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" fill="none" stroke="#333" stroke-width="1.3"/><rect x="2" y="2" width="8" height="2" fill="#333"/></svg></button>
      <button class="wb x" type="button" data-w="close" title="Close (View, Windows, Show all docked windows brings it back)"><svg viewBox="0 0 12 12"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="#fff" stroke-width="1.8"/></svg></button>`;
    el.querySelectorAll('[data-w]').forEach(b => b.addEventListener('click', () => {
      const w = b.dataset.w;
      if (w === 'min') { if (slot === 'a') S.sxWin.minTop = !S.sxWin.minTop; else S.sxWin.minBot = !S.sxWin.minBot; }
      if (w === 'max') { if (slot === 'a') { S.sxWin.bot = !S.sxWin.bot || !S.sxWin.top; S.sxWin.top = true; S.sxWin.minTop = false; } else { S.sxWin.top = !S.sxWin.top || !S.sxWin.bot; S.sxWin.bot = true; S.sxWin.minBot = false; } }
      if (w === 'close') { if (slot === 'a') S.sxWin.top = false; else S.sxWin.bot = false; }
      sxLayout(); renderRibbon();
    }));
    el.dataset.kind = kind;
  };
  frame(A, plan.a, 'a'); frame(B, plan.b, 'b');
  sxRenderContents();
}
let sxRaf = 0;
function sxPaneSoon() { cancelAnimationFrame(sxRaf); sxRaf = requestAnimationFrame(sxRenderContents); }
function sxRenderContents() {
  const park = $('#sxPark') || (() => { const d = document.createElement('div'); d.id = 'sxPark'; d.hidden = true; document.body.appendChild(d); return d; })();
  if (S.sxSide && S.sxSide.parentElement !== park && !(S.sxPlanNow && S.sxPlanNow.b === 'generic')) park.appendChild(S.sxSide);
  for (const el of [$('#sxWinA'), $('#sxWinB')]) {
    if (!el || el.style.display === 'none') continue;
    const host = el.querySelector('.wc'); const kind = el.dataset.kind;
    const keep = host.querySelector('.sxgrid, .sxpane .lst, .sxpane .ltr'); const st = keep ? keep.scrollTop : 0;
    const R = { nodes: sxNodesTable, beams: sxBeamsTable, prop: sxPropPane, mat: sxMatPane, spec: sxSpecPane, sup: sxSupPane, load: sxLoadPane, design: sxDesignPane, generic: sxGenericPane }[kind];
    if (R) R(host);
    const k2 = host.querySelector('.sxgrid, .sxpane .lst, .sxpane .ltr'); if (k2) k2.scrollTop = st;
  }
}

/* ---------------- tables ---------------- */
const SX_ROWS = 5000;
function sxRowClick(kind, id, e) {
  if (!(e.ctrlKey || e.metaKey)) clearSel();
  if (S.sel[kind].has(id) && (e.ctrlKey || e.metaKey)) S.sel[kind].delete(id); else S.sel[kind].add(id);
  afterSel();
}
function sxNodesTable(host) {
  const list = [...M.nodes.values()]; const u = uL();
  host.innerHTML = `<div class="sxgrid"><table><thead><tr><th>Node</th><th>X<br>${u}</th><th>Y<br>${u}</th><th>Z<br>${u}</th></tr></thead><tbody>${list.slice(0, SX_ROWS).map(n => `<tr data-r="${n.id}" class="${S.sel.nodes.has(n.id) ? 'sel' : ''}"><td>${n.id}</td>${['x', 'y', 'z'].map(k => `<td><input data-nx="${n.id}" data-k="${k}" value="${fx(toU(n[k]), 3)}" aria-label="Node ${n.id} ${k.toUpperCase()}"></td>`).join('')}</tr>`).join('') || '<tr><td>1</td><td></td><td></td><td></td></tr>'}</tbody></table>
    ${list.length > SX_ROWS ? `<div class="more">Showing the first ${SX_ROWS} of ${list.length} nodes.</div>` : ''}</div>`;
  host.querySelectorAll('tr[data-r] td:first-child').forEach(td => td.addEventListener('click', e => sxRowClick('nodes', +td.parentElement.dataset.r, e)));
  host.querySelectorAll('input[data-nx]').forEach(inp => inp.addEventListener('change', () => {
    const v = +inp.value; if (!Number.isFinite(v)) { inp.value = ''; return; }
    mutate('Edit node coordinate', () => { M.nodes.get(+inp.dataset.nx)[inp.dataset.k] = frU(v); nodeIndex = null; });
  }));
}
function sxBeamsTable(host) {
  const list = [...M.beams.values()];
  host.innerHTML = `<div class="sxgrid"><table><thead><tr><th>Beam</th><th>Node A</th><th>Node B</th><th>Property Refn.</th><th>Material</th></tr></thead><tbody>${list.slice(0, SX_ROWS).map(b => { const m = M.materials.get(b.mat); return `<tr data-r="${b.id}" class="${S.sel.beams.has(b.id) ? 'sel' : ''}"><td>${b.id}</td><td>${b.i}</td><td>${b.j}</td><td>${b.sec || ''}</td><td class="tl">${m ? esc(m.name) : ''}</td></tr>`; }).join('') || '<tr><td>1</td><td></td><td></td><td></td><td></td></tr>'}</tbody></table>
    ${list.length > SX_ROWS ? `<div class="more">Showing the first ${SX_ROWS} of ${list.length} beams.</div>` : ''}</div>`;
  host.querySelectorAll('tr[data-r]').forEach(tr => tr.addEventListener('click', e => sxRowClick('beams', +tr.dataset.r, e)));
}

/* ---------------- assignment helpers (the four STAAD methods, all real) ---------------- */
function sxMethodsHtml(st, noun, enabled) {
  const o = [['sel', `Assign To Selected ${noun}`], ['cursor', 'Use Cursor To Assign'], ['list', 'Assign To Edit List'], ['view', 'Assign To View']];
  const d = enabled ? '' : 'disabled';
  return `<fieldset ${d}><legend>Assignment Method</legend><div class="rgrid">${o.map(([k, l]) => `<label class="rad ${enabled ? '' : 'dis'}"><input type="radio" name="sxam" value="${k}" ${st.method === k ? 'checked' : ''} ${d}> ${l}</label>`).join('')}</div>
    <input class="el" data-sxlist placeholder="e.g. 1 TO 20 31 45" value="${esc(st.list)}" ${d} aria-label="Edit list"></fieldset>`;
}
function sxBindMethods(host, st) {
  host.querySelectorAll('input[name=sxam]').forEach(r => r.addEventListener('change', () => { st.method = r.value; }));
  const l = host.querySelector('[data-sxlist]'); if (l) l.addEventListener('input', () => { st.list = l.value; if (l.value) { st.method = 'list'; const r = host.querySelector('input[name=sxam][value=list]'); if (r) r.checked = true; } });
}
function sxTargets(kind, st) {
  const src = { nodes: M.nodes, beams: M.beams, plates: M.plates, solids: M.solids }[kind];
  if (st.method === 'sel') return [...S.sel[kind]];
  if (st.method === 'view') return S.isolate && S.isolate[kind] ? [...S.isolate[kind]].filter(i => src.has(i)) : [...src.keys()];
  if (st.method === 'list') return parseList(st.list).filter(i => src.has(i));
  return null;
}
/* apply now, or arm the cursor so each click assigns */
function sxAssign(kind, st, what, apply) {
  const ids = sxTargets(kind, st);
  if (ids === null) {
    S.sxAssign = { kind, what, apply }; S.cursor = kind; setTool('select'); clearSel(); afterSel();
    toast(`Click ${kind} to assign ${what}. Press Esc to stop.`); sxPaneSoon(); return;
  }
  if (!ids.length) { toast(st.method === 'sel' ? `Select ${kind} first, or choose another assignment method.` : `No ${kind} match.`); return; }
  mutate(`Assign ${what}`, () => apply(ids));
  toast(`Assigned ${what} to ${ids.length} ${kind}.`);
}
function sxCursorBanner() {
  return S.sxAssign ? `<p class="note2" style="background:#FFF4D6;border:1px solid #E0B44A;padding:4px 6px;margin:0 0 6px">Assigning ${esc(S.sxAssign.what)} by cursor. Click ${esc(S.sxAssign.kind)} in the view. <button type="button" class="wbtn" data-sxstop style="height:20px;font-size:12px">Stop</button></p>` : '';
}
function sxBindStop(host) { const b = host.querySelector('[data-sxstop]'); if (b) b.addEventListener('click', () => { S.sxAssign = null; sxPaneSoon(); toast('Cursor assignment stopped.'); }); }
function sxFoot(host, onAssign, canAssign) {
  host.querySelector('[data-sxa]')?.addEventListener('click', () => { if (canAssign) onAssign(); });
  host.querySelector('[data-sxc]')?.addEventListener('click', () => { S.sxWin.bot = false; S.sxAssign = null; sxLayout(); });
  host.querySelector('[data-sxh]')?.addEventListener('click', () => toast(NB.help));
}
const sxFootHtml = can => `<div class="brow end"><button type="button" class="wbtn" data-sxa ${can ? '' : 'disabled'}>Assign</button><button type="button" class="wbtn" data-sxc>Close</button><button type="button" class="wbtn" data-sxh>Help</button></div>`;

/* ---------------- Properties ---------------- */
function sxPropPane(host) {
  const P = S.sxp.prop; if (P.sel && !M.sections.has(P.sel)) P.sel = null;
  const secs = [...M.sections.values()];
  const matOf = id => { const s = new Set(); for (const b of M.beams.values()) if (b.sec === id && b.mat && M.materials.has(b.mat)) s.add(M.materials.get(b.mat).name); return [...s].join(', '); };
  const nUse = id => { let n = 0; for (const b of M.beams.values()) if (b.sec === id) n++; return n; };
  const cols = 'grid-template-columns:34px 1.4fr 1fr 1fr';
  const canAssign = P.tab === 'beta' || !!P.sel;
  host.innerHTML = `<div class="sxpane">${sxCursorBanner()}
    <div class="ptabsx"><button type="button" data-pt2="sec" aria-selected="${P.tab === 'sec'}">Section</button><button type="button" data-pt2="beta" aria-selected="${P.tab === 'beta'}">Beta Angle</button></div>
    ${P.tab === 'sec' ? `<div class="box"><div class="lsth" style="${cols}"><span>Ref</span><span>Section</span><span>Source</span><span>Material</span></div>
      <div class="lst" style="border:0;border-top:1px solid #DDD">${secs.map(s => `<div class="lr ${P.sel === s.id ? 'on' : ''}" data-sec="${s.id}" style="${cols}" title="${nUse(s.id)} members use this section"><span>${s.id}</span><span>${esc(s.name)}</span><span>${esc(s.src || '')}</span><span>${esc(matOf(s.id))}</span></div>`).join('') || '<div class="note2" style="padding:6px">No sections yet. Add one from a database below.</div>'}</div></div>
      <label class="chk"><input type="checkbox" data-hl ${P.hl ? 'checked' : ''}> Highlight Assigned Geometry</label>
      <div class="brow"><span></span><button type="button" class="wbtn" disabled title="${esc(NB.edit)}">Edit</button><button type="button" class="wbtn" data-del ${P.sel ? '' : 'disabled'}>Delete</button></div>
      <div class="sec">Databases</div>
      <div class="brow"><button type="button" class="wbtn" data-c="secDb">Standard</button><button type="button" class="wbtn" disabled title="${esc(NB.legacy)}">Legacy</button><button type="button" class="wbtn" data-c="secCsv">User Table</button>
        <button type="button" class="wbtn" data-c="secDef">Prismatic</button><button type="button" class="wbtn" data-c="thick">Thickness</button><button type="button" class="wbtn" data-c="secDef" title="${esc(NB.values)}">Values</button></div>`
      : `<div class="box" style="padding:10px"><label class="rad">Beta angle (degrees) <input type="number" step="any" data-beta value="${P.beta}" style="width:90px;height:22px;border:1px solid #ADADAD;font:12px var(--s-font);padding:0 4px"></label>
        <p class="note2">Rotates the member about its own axis. Applies to beams.</p></div>`}
    ${sxMethodsHtml(P, 'Beams', canAssign)}${sxFootHtml(canAssign)}</div>`;
  host.querySelectorAll('[data-pt2]').forEach(b => b.addEventListener('click', () => { P.tab = b.dataset.pt2; sxRenderContents(); }));
  host.querySelectorAll('[data-sec]').forEach(r => r.addEventListener('click', () => {
    P.sel = +r.dataset.sec; S.curSec = P.sel;
    if (P.hl) { clearSel(); for (const b of M.beams.values()) if (b.sec === P.sel) S.sel.beams.add(b.id); afterSel(); } else sxRenderContents();
  }));
  host.querySelector('[data-hl]')?.addEventListener('change', e => { P.hl = e.target.checked; if (!P.hl) { clearSel(); afterSel(); } });
  host.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => runCmd(b.dataset.c)));
  host.querySelector('[data-beta]')?.addEventListener('input', e => { P.beta = +e.target.value || 0; });
  host.querySelector('[data-del]')?.addEventListener('click', () => {
    const id = P.sel, n = nUse(id), s = M.sections.get(id); if (!s) return;
    confirmDlg('Delete section', n ? `Section ${s.name} is used by ${n} members. Delete it and leave those members without a section?` : `Delete section ${s.name}?`, () => mutate('Delete section', () => { M.sections.delete(id); P.sel = null; }));
  });
  sxBindMethods(host, P); sxBindStop(host);
  sxFoot(host, () => {
    if (P.tab === 'beta') { const v = P.beta; sxAssign('beams', P, `beta ${v}°`, ids => { for (const i of ids) M.beams.get(i).beta = v; }); return; }
    const sid = P.sel, s = M.sections.get(sid); if (!s) return;
    sxAssign('beams', P, `section ${s.name}`, ids => { for (const i of ids) M.beams.get(i).sec = sid; });
  }, canAssign);
}

/* ---------------- Materials ---------------- */
function sxMatPane(host) {
  const P = S.sxp.mat; if (P.sel && !M.materials.has(P.sel)) P.sel = null;
  const mats = [...M.materials.values()];
  const cols = 'grid-template-columns:30px 1.5fr .8fr .8fr .8fr';
  host.innerHTML = `<div class="sxpane">${sxCursorBanner()}
    <div class="box"><div class="lsth" style="${cols}"><span>Ref</span><span>Material</span><span>E (GPa)</span><span>fy (MPa)</span><span>ρ (kg/m³)</span></div>
    <div class="lst" style="border:0;border-top:1px solid #DDD">${mats.map(m => `<div class="lr ${P.sel === m.id ? 'on' : ''}" data-mt="${m.id}" style="${cols}"><span>${m.id}</span><span>${esc(m.name)}</span><span>${m.E ? fx(m.E / 1e9, 0) : '<b style="color:#B3261E">missing</b>'}</span><span>${m.fy ? fx(m.fy, 0) : '<b style="color:#B3261E">missing</b>'}</span><span>${m.rho != null ? fx(m.rho, 0) : '—'}</span></div>`).join('') || '<div class="note2" style="padding:6px">No materials yet.</div>'}</div></div>
    <p class="note2">A missing value is shown as missing. It is never filled with a default; members without it are reported as insufficient data.</p>
    <div class="brow r2"><button type="button" class="wbtn" data-c="matLib">Material Library…</button><button type="button" class="wbtn" data-c="matUser">User Defined…</button></div>
    ${sxMethodsHtml(P, 'Beams', !!P.sel)}${sxFootHtml(!!P.sel)}</div>`;
  host.querySelectorAll('[data-mt]').forEach(r => r.addEventListener('click', () => { P.sel = +r.dataset.mt; S.curMat = P.sel; clearSel(); for (const b of M.beams.values()) if (b.mat === P.sel) S.sel.beams.add(b.id); afterSel(); }));
  host.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => runCmd(b.dataset.c)));
  sxBindMethods(host, P); sxBindStop(host);
  sxFoot(host, () => { const id = P.sel, m = M.materials.get(id); if (!m) return; sxAssign('beams', P, `material ${m.name}`, ids => { for (const i of ids) M.beams.get(i).mat = id; }); }, !!P.sel);
}

/* ---------------- Specifications ---------------- */
function sxSpecPane(host) {
  const P = S.sxp.spec;
  const types = [['normal', 'Normal member'], ['truss', 'Truss'], ['tension', 'Tension only', 'Solved as linear: the backend has no tension-only iteration yet.'], ['compression', 'Compression only', 'Solved as linear: the backend has no compression-only iteration yet.'], ['cable', 'Cable', 'Solved as a linear truss member.'], ['inactive', 'Inactive']];
  const cnt = {}; for (const b of M.beams.values()) cnt[b.type || 'normal'] = (cnt[b.type || 'normal'] || 0) + 1;
  let rel = 0, off = 0; for (const b of M.beams.values()) { if (b.rel && (b.rel.s.some(Boolean) || b.rel.e.some(Boolean))) rel++; if (b.off && (b.off.s || b.off.e)) off++; }
  const cols = 'grid-template-columns:1.6fr .6fr';
  host.innerHTML = `<div class="sxpane">${sxCursorBanner()}
    <div class="box"><div class="lsth" style="${cols}"><span>Member specification</span><span>Members</span></div>
    <div class="lst" style="height:150px;border:0;border-top:1px solid #DDD">${types.map(([k, l, n]) => `<div class="lr ${P.type === k ? 'on' : ''}" data-ty="${k}" style="${cols}" title="${esc(n || l)}"><span>${esc(l)}${n ? ' *' : ''}</span><span>${cnt[k] || 0}</span></div>`).join('')}
      <div class="lr" style="${cols}"><span>Members with releases</span><span>${rel}</span></div><div class="lr" style="${cols}"><span>Members with offsets</span><span>${off}</span></div></div></div>
    <p class="note2 bad">* Declared and stored, but the backend solves these as linear members.</p>
    <div class="sec">Beam</div><div class="brow"><button type="button" class="wbtn" data-c="releases">Releases…</button><button type="button" class="wbtn" data-c="offsets">Offsets…</button><button type="button" class="wbtn" data-c="clrRel">Clear Releases</button></div>
    <div class="sec">Node and Plate</div><div class="brow r2"><button type="button" class="wbtn" disabled title="${esc(NB.nodespec)}">Node…</button><button type="button" class="wbtn" disabled title="${esc(NB.platespec)}">Plate…</button></div>
    ${sxMethodsHtml(P, 'Beams', true)}${sxFootHtml(true)}</div>`;
  host.querySelectorAll('[data-ty]').forEach(r => r.addEventListener('click', () => { P.type = r.dataset.ty; clearSel(); for (const b of M.beams.values()) if ((b.type || 'normal') === P.type) S.sel.beams.add(b.id); afterSel(); }));
  host.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => runCmd(b.dataset.c)));
  sxBindMethods(host, P); sxBindStop(host);
  sxFoot(host, () => { const t = P.type; sxAssign('beams', P, `member type ${t}`, ids => { for (const i of ids) M.beams.get(i).type = t; }); }, true);
}

/* ---------------- Supports ---------------- */
function sxSupDesc(s) {
  if (!s) return '';
  const fr = (s.rel || []).map((r, k) => r ? DOF[k] : null).filter(Boolean);
  const kk = (s.k || []).map((v, k) => v ? `K${DOF[k]}` : null).filter(Boolean);
  return `${String(s.type || 'support').toUpperCase()}${fr.length ? ' BUT ' + fr.join(' ') : ''}${kk.length ? ' ' + kk.join(' ') : ''}`;
}
function sxSupPane(host) {
  const P = S.sxp.sup;
  const groups = new Map(); for (const [n, s] of M.supports) { const k = JSON.stringify(s); const g = groups.get(k) || { s, nodes: [] }; g.nodes.push(n); groups.set(k, g); }
  const list = [...groups.entries()]; if (P.sel && !groups.has(P.sel)) P.sel = null;
  const cols = 'grid-template-columns:40px 1.8fr .6fr';
  host.innerHTML = `<div class="sxpane">${sxCursorBanner()}
    <div class="box"><div class="lsth" style="${cols}"><span>Ref</span><span>Support</span><span>Nodes</span></div>
    <div class="lst" style="border:0;border-top:1px solid #DDD">${list.map(([k, g], i) => `<div class="lr ${P.sel === k ? 'on' : ''}" data-sg="${esc(k)}" style="${cols}"><span>S${i + 1}</span><span>${esc(sxSupDesc(g.s))}</span><span>${g.nodes.length}</span></div>`).join('') || '<div class="note2" style="padding:6px">No supports yet. Create one, or use Fixed or Pinned on the ribbon.</div>'}</div></div>
    <div class="brow"><button type="button" class="wbtn" data-c="supCreate">Create…</button><button type="button" class="wbtn" data-c="supMgr">Edit…</button><button type="button" class="wbtn" data-del ${P.sel ? '' : 'disabled'}>Delete</button></div>
    <p class="note2 bad">Pile and soil supports are not built: ${esc(NB.foundation)}</p>
    ${sxMethodsHtml(P, 'Nodes', !!P.sel)}${sxFootHtml(!!P.sel)}</div>`;
  host.querySelectorAll('[data-sg]').forEach(r => r.addEventListener('click', () => { P.sel = r.dataset.sg; clearSel(); for (const n of groups.get(P.sel).nodes) S.sel.nodes.add(n); afterSel(); }));
  host.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => runCmd(b.dataset.c)));
  host.querySelector('[data-del]')?.addEventListener('click', () => { const g = groups.get(P.sel); if (!g) return; confirmDlg('Delete support', `Remove this support from ${g.nodes.length} nodes?`, () => mutate('Delete support', () => { for (const n of g.nodes) M.supports.delete(n); P.sel = null; })); });
  sxBindMethods(host, P); sxBindStop(host);
  sxFoot(host, () => { const g = groups.get(P.sel); if (!g) return; const tpl = JSON.parse(P.sel); sxAssign('nodes', P, sxSupDesc(tpl).toLowerCase(), ids => { for (const i of ids) M.supports.set(i, JSON.parse(JSON.stringify(tpl))); }); }, !!P.sel);
}

/* ---------------- Load & Definition ---------------- */
const SX_DEF_CMD = { wind: 'ldWind', env: 'envSet', growth: 'envSet', zone: 'ldArea' };
const sxTgt = it => it.k === 'node' ? ['nodes', it.node] : it.k === 'pr' ? ['plates', it.plate] : (it.k === 'uni' || it.k === 'con' || it.k === 'temp') ? ['beams', it.beam] : [null, null];
function sxGrpKey(it) { if (it.src) return it.k + '|src|' + it.src; const o = Object.assign({}, it); delete o.node; delete o.beam; delete o.plate; return it.k + '|' + JSON.stringify(o); }
function sxItemText(it, n) {
  const unit = { nodes: 'nodes', beams: 'members', plates: 'plates' }[sxTgt(it)[0]] || '';
  if (it.src) return `${it.src} <small>(${n} ${unit || 'items'})</small>`;
  let t;
  if (it.k === 'sw') t = `SELFWEIGHT ${it.dir} ${it.f}`;
  else if (it.k === 'node') t = 'JOINT LOAD ' + DOF.map((d, k) => it.F[k] ? `${d} ${fx(it.F[k], 2)}` : '').filter(Boolean).join(' ');
  else if (it.k === 'uni') t = `UNI ${it.dir} ${fx(it.w, 3)} kN/m${it.d1 != null || it.d2 != null ? ` ${fx(it.d1 || 0, 2)} to ${it.d2 != null ? fx(it.d2, 2) : 'end'} m` : ''}`;
  else if (it.k === 'con') t = `CON ${it.dir} ${fx(it.P, 2)} kN at ${fx(it.d || 0, 2)} m`;
  else if (it.k === 'pr') t = `PRESSURE ${it.dir} ${fx(it.p, 3)} kN/m²`;
  else if (it.k === 'temp') t = `TEMPERATURE ${it.dt} °C`;
  else t = it.k.toUpperCase();
  return `${esc(t)}${unit ? ` <small>(${n} ${unit})</small>` : ''}`;
}
function sxCaseGroups(c) { const g = new Map(); for (const it of c.items) { const k = sxGrpKey(it); const e = g.get(k) || { rep: it, items: [] }; e.items.push(it); g.set(k, e); } return g; }
function sxLoadPane(host) {
  const P = S.sxp.load; const ld = L(); P.openCase = P.openCase || {};
  const row = (lvl, key, ic, label, opts = {}) => `<div class="n ${opts.it ? 'it' : ''} ${opts.nb ? 'nb' : ''} ${P.sel === key ? 'on' : ''}" data-lk="${esc(key)}" style="padding-left:${2 + lvl * 18}px" title="${esc(opts.title || '')}">
      ${opts.tw != null ? `<span class="tw" data-tw="${esc(opts.twk)}">${opts.tw ? '−' : '+'}</span>` : '<span class="tw blank"></span>'}<span class="dots"></span>${ic ? `<span class="ic">${ic}</span>` : ''}<span class="lb">${label}</span></div>`;
  let h = row(0, 'R:D', 'D', 'Definitions', { tw: P.open.D, twk: 'D' });
  if (P.open.D) for (const d of DEFS) h += row(1, 'D:' + d[0], 'D', esc(d[1]) + (d[2] === 'partial' ? ' <small>(partly)</small>' : d[2] === 'no' ? ' <small>(not built)</small>' : ''), { nb: d[2] === 'no', title: d[3] });
  h += row(0, 'R:L', 'L', 'Load Cases Details', { tw: P.open.L, twk: 'L' });
  if (P.open.L) {
    for (const c of ld.cases) {
      const groups = sxCaseGroups(c); const open = !!P.openCase[c.id];
      h += row(1, 'L:' + c.id, 'L', `${c.id} : ${esc(c.title)}`, { tw: groups.size ? open : null, twk: 'c' + c.id, title: `${c.type}, ${c.items.length} load items` });
      if (open) for (const [k, g] of groups) h += row(2, `G:${c.id}:${k}`, '', sxItemText(g.rep, g.items.length), { it: true });
    }
    for (const cb of ld.combos) {
      const open = !!P.openCase['b' + cb.id];
      h += row(1, 'C:' + cb.id, 'L', `${cb.id} : ${esc(cb.title || 'COMBINATION')}`, { tw: (cb.f || []).length ? open : null, twk: 'b' + cb.id, title: [cb.code, cb.ref].filter(Boolean).join(' ') });
      if (open) for (const [lc, f] of (cb.f || [])) h += row(2, `T:${cb.id}:${lc}`, '', `${fx(f, 2)} × load case ${lc}`, { it: true });
    }
    if (!ld.cases.length && !ld.combos.length) h += row(1, 'X:none', '', '<small>No load cases. Use New… to create one.</small>', { it: true });
  }
  h += row(0, 'R:E', 'L', 'Load Envelopes', { tw: P.open.E, twk: 'E' });
  if (P.open.E) h += row(1, 'X:env', 'L', 'Envelopes <small>(not built)</small>', { nb: true, title: NB.envelope });

  const sel = P.sel || ''; const t = sel.split(':')[0];
  let grp = null;
  if (t === 'G') { const [, cid, ...rest] = sel.split(':'); const c = ld.cases.find(x => x.id === +cid); if (c) grp = { c, g: sxCaseGroups(c).get(rest.join(':')) }; if (!grp || !grp.g) { grp = null; P.sel = null; } }
  const assignable = grp && !grp.g.rep.src && sxTgt(grp.g.rep)[0];
  const canEdit = t === 'L' || t === 'C' || (t === 'D' && (DEFS.find(d => 'D:' + d[0] === sel) || [])[2] !== 'no');
  const canDel = t === 'L' || t === 'C' || t === 'G';
  host.innerHTML = `<div class="sxpane">${sxCursorBanner()}<div class="ltr">${h}</div>
    <div class="brow r4" style="margin-top:8px"><button type="button" class="wbtn" data-lb="new">New…</button><button type="button" class="wbtn" data-lb="add">Add…</button><button type="button" class="wbtn" data-lb="edit" ${canEdit ? '' : 'disabled'}>Edit …</button><button type="button" class="wbtn" data-lb="del" ${canDel ? '' : 'disabled'}>Delete…</button></div>
    <label class="chk"><input type="checkbox" data-tg ${S.showLoads ? 'checked' : ''}> Toggle Load</label>
    ${grp && grp.g.rep.src ? '<p class="note2">Generated loads (waves, wind, equipment) are tied to member geometry. Regenerate them rather than assigning copies.</p>' : ''}
    ${sxMethodsHtml(P, assignable ? { nodes: 'Nodes', beams: 'Beams', plates: 'Plates' }[assignable] : 'Entities', !!assignable)}${sxFootHtml(!!assignable)}</div>`;

  host.querySelectorAll('[data-tw]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); const k = b.dataset.tw;
    if (k === 'D' || k === 'L' || k === 'E') P.open[k] = !P.open[k];
    else { const id = k[0] === 'c' ? +k.slice(1) : k; P.openCase[k[0] === 'c' ? id : k] = !P.openCase[k[0] === 'c' ? id : k]; }
    sxRenderContents();
  }));
  host.querySelectorAll('[data-lk]').forEach(r => {
    r.addEventListener('click', () => {
      const k = r.dataset.lk; P.sel = k; const [tt, a] = k.split(':');
      if (tt === 'L') { S.lc = +a; draw(); renderRibbon(); }
      if (tt === 'G') {
        const [, cid, ...rest] = k.split(':'); const c = L().cases.find(x => x.id === +cid); const g = c && sxCaseGroups(c).get(rest.join(':'));
        S.lc = +cid; clearSel(); if (g) for (const it of g.items) { const [kind, id] = sxTgt(it); if (kind && id != null) S.sel[kind].add(id); }
        afterSel(); renderRibbon(); return;
      }
      sxRenderContents();
    });
    r.addEventListener('dblclick', () => { if (r.dataset.lk.split(':')[0] === 'D') host.querySelector('[data-lb=edit]')?.click(); });
  });
  host.querySelector('[data-tg]').addEventListener('change', e => { S.showLoads = e.target.checked; draw(); });
  host.querySelector('[data-lb=new]').addEventListener('click', e => sxOpenMenu(e.currentTarget, [['lcNew', 'Primary load case…'], ['cbNew', 'Combination…'], ['cbTpl', 'Automatic combinations (API RP 2A-LRFD)…']]));
  host.querySelector('[data-lb=add]').addEventListener('click', e => {
    const cid = t === 'L' ? +sel.split(':')[1] : t === 'G' ? +sel.split(':')[1] : null;
    if (!cid) { toast('Select a load case in the tree, then Add… puts a load in it.'); return; }
    S.lc = cid;
    sxOpenMenu(e.currentTarget, [['ldSW', 'Self-weight…'], ['ldNode', 'Nodal load… (selected nodes)'], ['ldUni', 'Member uniform load… (selected members)'], ['ldCon', 'Member concentrated load… (selected members)'], ['ldPr', 'Plate pressure… (selected plates)'], ['ldTemp', 'Temperature load… (selected members)'], ['-'], ['ldWave', 'Wave & current…'], ['ldBuoy', 'Buoyancy & flooding…'], ['ldEquip', 'Equipment…'], ['ldPipe', 'Pipe weight…'], ['ldArea', 'Deck area…'], ['ldWind', 'Wind…']]);
  });
  host.querySelector('[data-lb=edit]').addEventListener('click', () => {
    const [tt, a] = sel.split(':');
    if (tt === 'L') { S.lc = +a; runCmd('lcEdit'); }
    else if (tt === 'C') { const cb = L().combos.find(x => x.id === +a); if (cb) comboDlg(cb); }
    else if (tt === 'D') { const d = DEFS.find(x => x[0] === a); if (d && d[2] !== 'no') runCmd(SX_DEF_CMD[a] || DEF_CMD[a] || 'envSet'); else if (d) toast(d[3]); }
  });
  host.querySelector('[data-lb=del]').addEventListener('click', () => {
    const [tt, a] = sel.split(':');
    if (tt === 'L') { S.lc = +a; runCmd('lcDel'); P.sel = null; }
    else if (tt === 'C') confirmDlg('Delete combination', `Delete combination ${a}?`, () => mutate('Delete combination', () => { const l2 = L(); l2.combos = l2.combos.filter(x => x.id !== +a); P.sel = null; }));
    else if (tt === 'G' && grp) confirmDlg('Delete load', `Delete this load from ${grp.g.items.length} ${sxTgt(grp.g.rep)[0] || 'items'} in load case ${grp.c.id}?`, () => mutate('Delete load', () => { const set = new Set(grp.g.items); const c = L().cases.find(x => x.id === grp.c.id); c.items = c.items.filter(x => !set.has(x)); P.sel = null; }));
  });
  sxBindMethods(host, P); sxBindStop(host);
  sxFoot(host, () => {
    if (!assignable) return;
    const rep = grp.g.rep, kind = assignable, cid = grp.c.id;
    const field = { nodes: 'node', beams: 'beam', plates: 'plate' }[kind];
    sxAssign(kind, P, 'the load', ids => {
      const c = L().cases.find(x => x.id === cid); if (!c) return;
      const have = new Set(c.items.filter(x => sxGrpKey(x) === sxGrpKey(rep)).map(x => x[field]));
      for (const i of ids) if (!have.has(i)) { const it = JSON.parse(JSON.stringify(rep)); it[field] = i; c.items.push(it); }
    });
  }, !!assignable);
}

/* ---------------- Design ---------------- */
function sxDesignPane(host) {
  host.innerHTML = `<div class="sxpane"><div class="box" style="padding:10px">
    <div class="sec" style="margin-top:0"><b>Design code</b>: API RP 2A-LRFD (chosen, not yet built)</div>
    <p class="note2 bad">${esc(NB.code)}</p>
    <p class="note2">When built, each check will show the clause, the formula, every intermediate value and the governing combination, and a member with missing yield strength, section or effective length will read DATA INSUFFICIENT rather than pass.</p></div>
    <div class="brow r2" style="margin-top:8px"><button type="button" class="wbtn" data-c="designParams">Design Parameters…</button><button type="button" class="wbtn" disabled title="${esc(NB.code)}">Check Code</button></div>
    <div class="brow end"><span></span><button type="button" class="wbtn" data-sxc>Close</button><button type="button" class="wbtn" data-sxh>Help</button></div></div>`;
  host.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => runCmd(b.dataset.c)));
  sxFoot(host, () => {}, false);
}

/* ---------------- the existing data panel, docked ---------------- */
function sxGenericPane(host) {
  let wrap = host.querySelector('.sxpane .gen');
  if (!wrap) { host.innerHTML = '<div class="sxpane" style="padding:4px"><div class="gen"></div></div>'; wrap = host.querySelector('.gen'); }
  if (S.sxSide && S.sxSide.parentElement !== wrap) wrap.appendChild(S.sxSide);
  const want = S.sxPane ? S.sxPane.ptab : (S.wf === 'analysis' ? sxPtabKey('Server results', sxPtabKey('Results', 'selection')) : 'selection');
  if (S.sxPaneTab !== want) { S.sxPaneTab = want; if (S.ptab !== want) { S.ptab = want; renderPTabs(); _sxRefresh(); } }
}
function sxShowGeneric(ptab, title) { S.sxPane = { ptab, title }; S.sxWin.right = true; S.sxWin.bot = true; S.sxWin.minBot = false; S.sxPaneTab = null; sxLayout(); }

/* ---------------- status bar ---------------- */
function sxStatus() {
  const el = $('#status'); if (!el || !document.body.classList.contains('sx')) return;
  const n = selCount(); const eng = ['ft', 'in'].includes(S.U.len) || ['kip', 'lb'].includes(S.U.force);
  el.innerHTML = `<span class="seg grow" title="${esc(S.sxMsg || 'Ready')}">${esc(S.sxMsg || 'Ready')}</span>
    <span class="seg">${M.nodes.size} nodes, ${M.beams.size} beams, ${M.plates.size} plates</span>
    <span class="seg">Selected : <b>&nbsp;${n}</b></span>
    <span class="seg">${S.sxModule === 'post' ? 'Postprocessing' : 'Analytical Modeling'} Workflow</span>
    <span class="seg">Load : ${S.lc != null ? S.lc : ''}</span>
    <span class="seg clk" id="sxUnits" title="Change input units">Input Units : ${esc(uF())}-${esc(uL())}</span>
    <span class="seg">Base Unit : ${eng ? 'ENGLISH' : 'METRIC'}</span>`;
  $('#sxUnits').addEventListener('click', () => runCmd('unitsSet'));
  const u = $('#sxUndo'), r = $('#sxRedo');
  if (u) { u.disabled = !UNDO.length; u.title = UNDO.length ? 'Undo ' + UNDO[UNDO.length - 1].label : 'Nothing to undo'; }
  if (r) { r.disabled = !REDO.length; r.title = REDO.length ? 'Redo ' + REDO[REDO.length - 1].label : 'Nothing to redo'; }
  const nm = (M.name || 'Structure1').replace(/\.[^.]+$/, '');
  if ($('#sxTtl')) $('#sxTtl').textContent = `${M.name || 'Untitled model'} - GeoSoft Structural Modeller`;
  if ($('#sxVpTtl')) $('#sxVpTtl').textContent = `${nm} - Whole Structure`;
}

/* ---------------- hook into the existing application ---------------- */
const _sxRefresh = refreshPanel;
refreshPanel = function () { _sxRefresh(); sxPaneSoon(); };
const _sxAfterSel = afterSel;
afterSel = function () {
  const A = S.sxAssign;
  if (A && !A.busy && S.sel[A.kind] && S.sel[A.kind].size) {
    A.busy = true; const ids = [...S.sel[A.kind]];
    try { mutate(`Assign ${A.what}`, () => A.apply(ids)); toast(`Assigned ${A.what} to ${ids.length} ${A.kind}. Keep clicking, or press Esc to stop.`); }
    finally { A.busy = false; }
    clearSel();
  }
  _sxAfterSel();
};
const _sxUpdateStatus = updateStatus;
updateStatus = function () { _sxUpdateStatus(); sxStatus(); if (S.sxLastName !== M.name) { S.sxLastName = M.name; sxLayout(); } };
const _sxToast = toast;
toast = function (msg) { _sxToast(msg); S.sxMsg = String(msg).replace(/<[^>]+>/g, ''); sxStatus(); };
renderRibbonTabs = function () { sxRenderTabs(); };
renderRibbon = function () {
  const prevWf = S.wf; sxNormaliseTab();
  if (S.sxLastTab !== S.tab) {
    if (S.tab === 'geometry') S.wf = 'geometry';
    else if (S.tab === 'loading') S.wf = 'loading';
    else if (S.tab === 'analysis' && !['analysis', 'design'].includes(S.wf)) S.wf = 'analysis';
    else if (S.tab === 'spec' && !['property', 'material', 'spec', 'support'].includes(S.wf)) S.wf = 'property';
    S.sxLastTab = S.tab;
  }
  sxRenderRibbon(); sxRenderWfBar(); sxRenderTabs(); sxStatus();
  if (prevWf !== S.wf) { S.sxPane = null; S.sxAssign = null; sxLayout(); }
};
gotoWorkflow = function (key) {
  S.wf = key; S.tab = SX_STEP_TAB[key] || 'geometry'; S.sxLastTab = S.tab; S.sxAssign = null; S.sxPane = null;
  if (key !== 'analysis' && key !== 'design' && S.sxModule === 'post') S.sxModule = 'ana';
  S.sxWin.bot = true; S.sxWin.right = true;
  sxRenderTabs(); sxRenderRibbon(); sxRenderWfBar(); sxRenderWf(); sxLayout(); sxStatus();
};
syncWorkflow = function () { sxRenderWfBar(); };
CMD.loadTree = () => gotoWorkflow('loading');
loadTreeDlg = function () { gotoWorkflow('loading'); };

/* ---------------- start ---------------- */
sxBuild();
S.sxLastTab = S.tab;
renderRibbonTabs(); renderRibbon(); sxRenderWf(); sxLayout(); updateStatus();
setTimeout(() => { draw(); sxLayout(); }, 80);
