/* GeoSoft Structural Modeller — part 20: command file, pre-analysis checklist,
   analysis commands, floating windows content, selection rules and ribbon tools.
   Rule kept throughout: nothing reaches the analysis unless the checklist passes,
   and nothing the solver would ignore is allowed through silently. */

/* ---------------- extra model data, kept through undo, save and open ---------------- */
const SX_EXTRA = ['job', 'anal', 'groups', 'texts', 'views', 'pmembers', 'restr', 'ctags', 'macros'];
function sxDefaults(m) {
  m.job = m.job || { name: '', client: '', no: '', engineer: '', checker: '', date: new Date().toISOString().slice(0, 10) };
  m.anal = m.anal || { perform: false, print: 'NO PRINT', post: { disp: false, forces: false, reac: false }, finish: false };
  m.anal.post = m.anal.post || { disp: false, forces: false, reac: false };
  for (const k of ['groups', 'texts', 'views', 'pmembers', 'macros']) m[k] = m[k] || [];
  m.restr = m.restr || {}; m.ctags = m.ctags || {};
  return m;
}
sxDefaults(M);
const _ser20 = serialize;
serialize = function () { sxDefaults(M); const o = JSON.parse(_ser20()); o.sx = {}; for (const k of SX_EXTRA) o.sx[k] = M[k]; return JSON.stringify(o); };
const _des20 = deserialize;
deserialize = function (txt) { const m = _des20(txt); try { const d = JSON.parse(txt); if (d.sx) for (const k of SX_EXTRA) if (d.sx[k] !== undefined) m[k] = d.sx[k]; } catch (e) { /* older project */ } return sxDefaults(m); };
if (!LTYPES.some(t => t[0] === 'Reference')) LTYPES.push(['Reference', 'Q']);
if (!LTYPES.some(t => t[0] === 'Snow')) LTYPES.push(['Snow', 'Q']);
if (!LTYPES.some(t => t[0] === 'Vehicle')) LTYPES.push(['Vehicle', 'Q']);

/* a revision counter: results are valid only for the revision they were computed on */
S.rev = 0; S.resRev = -1;
const _touched20 = touched;
touched = function (label) {
  sxDefaults(M); S.rev++;
  const was = S.resRev; _touched20(label);
  if (was >= 0 && S.resRev !== S.rev && RES && !S.resStaleWarned) {
    S.resStaleWarned = true;
    try { if (CMD['dg:none'] || true) runCmd('dg:none'); runCmd('defOff'); } catch (e) { /* diagrams already off */ }
    log('The model changed after the analysis. Results are out of date until the analysis is run again.');
  }
};
function sxResOK() { return !!(typeof RES !== 'undefined' && RES && RES.server && S.resRev === S.rev); }
function sxResWhy() {
  if (typeof RES === 'undefined' || !RES || !RES.server) return 'Results need a completed analysis. Finish the model, pass the pre-analysis check, then Run Analysis.';
  return 'The model changed after the last analysis, so these results no longer describe it. Run the analysis again.';
}
NB.needres = 'Results need a completed analysis.';

/* ---------------- STAAD command file: write ---------------- */
const SX_PRINTS = ['NO PRINT', 'LOAD DATA', 'STATICS CHECK', 'STATICS LOAD', 'MODE SHAPES', 'BOTH', 'ALL'];
const _toStaad20 = toStaad;
toStaad = function () {
  sxDefaults(M);
  let lines = _toStaad20().split('\n');
  while (lines.length && /^FINISH\s*$/.test(lines[lines.length - 1])) lines.pop();
  const j = M.job; const a = lines.indexOf('START JOB INFORMATION'), b = lines.indexOf('END JOB INFORMATION');
  const info = ['START JOB INFORMATION'];
  if (j.name) info.push(`JOB NAME ${j.name}`); if (j.client) info.push(`JOB CLIENT ${j.client}`); if (j.no) info.push(`JOB NO ${j.no}`);
  if (j.engineer) info.push(`ENGINEER NAME ${j.engineer}`); info.push(`ENGINEER DATE ${j.date || new Date().toISOString().slice(0, 10)}`); if (j.checker) info.push(`CHECKER NAME ${j.checker}`);
  info.push('END JOB INFORMATION');
  if (a >= 0 && b > a) lines.splice(a, b - a + 1, ...info);
  /* groups, after the incidences */
  if (M.groups.length) {
    const gl = ['START GROUP DEFINITION'];
    for (const kind of [['nodes', 'JOINT'], ['beams', 'MEMBER'], ['plates', 'ELEMENT']]) {
      const gs = M.groups.filter(g => g.kind === kind[0]); if (!gs.length) continue;
      gl.push(kind[1]); for (const g of gs) gl.push(wrap(`_${g.name.toUpperCase().replace(/[^A-Z0-9_]+/g, '_')} ${compact(g.ids)}`));
    }
    gl.push('END GROUP DEFINITION');
    let at = lines.findIndex(l => /^(DEFINE MATERIAL|MEMBER PROPERTY|ELEMENT PROPERTY|CONSTANTS|SUPPORTS|LOAD )/.test(l)); if (at < 0) at = lines.length;
    lines.splice(at, 0, ...gl);
  }
  /* GeoSoft data with no STAAD command, kept as structured comments so they survive a round trip */
  const extra = [];
  for (const [bid, r] of Object.entries(M.restr)) extra.push(`* GEOSOFT RESTRAINT ${bid} LY ${r.ly} LZ ${r.lz} KY ${r.ky} KZ ${r.kz}`);
  for (const [nid, t] of Object.entries(M.ctags)) extra.push(`* GEOSOFT TAG ${nid} ${t}`);
  for (const t of M.texts) extra.push(`* GEOSOFT TEXT ${+t.p[0].toFixed(4)} ${+t.p[1].toFixed(4)} ${+t.p[2].toFixed(4)} ${t.text}`);
  if (extra.length) { const at = lines.findIndex(l => /^LOAD /.test(l)); lines.splice(at < 0 ? lines.length : at, 0, ...extra); }
  if (M.anal.perform) {
    lines.push(`PERFORM ANALYSIS${M.anal.print && M.anal.print !== 'NO PRINT' ? ' PRINT ' + M.anal.print : ''}`);
    if (M.anal.post.disp) lines.push('PRINT JOINT DISPLACEMENTS ALL');
    if (M.anal.post.forces) lines.push('PRINT MEMBER FORCES ALL');
    if (M.anal.post.reac) lines.push('PRINT SUPPORT REACTION ALL');
  }
  if (M.anal.finish) lines.push('FINISH');
  return lines.join('\n');
};

/* ---------------- STAAD command file: validate ---------------- */
const SX_KNOWN = [
  /^STAAD\s+(SPACE|PLANE|FLOOR|TRUSS)\b/, /^START JOB INFORMATION$/, /^END JOB INFORMATION$/, /^(JOB|ENGINEER|CHECKER|APPROVED)\s+(NAME|CLIENT|NO|PART|REF|COMMENT|DATE)\b/,
  /^INPUT\s+(WIDTH|NODESIGN)\b/, /^SET\s+/, /^UNIT\b/, /^JOINT COORDINATES?\b/, /^MEMBER INCIDENCES?\b/, /^ELEMENT INCIDENCES?(\s+(SHELL|SOLID))?$/,
  /^DEFINE MATERIAL( START)?$/, /^END DEFINE MATERIAL$/, /^(ISOTROPIC|E|POISSON|DENSITY|ALPHA|DAMP|G|FY|FU|TYPE|STRENGTH|CP)\b/,
  /^MEMBER PROPERTY\b/, /^ELEMENT PROPERTY$/, /^CONSTANTS?$/, /^(MATERIAL|BETA)\s+/, /^SUPPORTS?$/, /^MEMBER RELEASES?$/, /^MEMBER OFFSETS?$/,
  /^MEMBER (TRUSS|TENSION|COMPRESSION|CABLE)\b/, /^INACTIVE MEMBERS?\b/, /^START GROUP DEFINITION$/, /^END GROUP DEFINITION$/, /^(JOINT|MEMBER|ELEMENT|GEOMETRY)$/, /^_\w+/,
  /^LOAD\s+\d+/, /^LOAD COMB(INATION)?\s+\d+/, /^SELFWEIGHT\s+[XYZ]\b/, /^JOINT LOADS?$/, /^MEMBER LOADS?$/, /^ELEMENT LOADS?$/, /^TEMPERATURE LOADS?$/,
  /^PERFORM ANALYSIS\b/, /^PRINT\s+(JOINT DISPLACEMENTS?|MEMBER FORCES?|SUPPORT REACTIONS?|ANALYSIS RESULTS?)\b/, /^FINISH$/
];
const SX_UNSUPPORTED = [[/^PERFORM\s+(PDELTA|NONLINEAR|BUCKLING|CABLE|IMPERFECTION|DIRECT|PUSHOVER)/, 'This analysis type needs backend work and is not available yet.'],
  [/^(SPECTRUM|TIME LOAD|DEFINE TIME HISTORY|DEFINE (UBC|IBC|AISC|1893)|CUT OFF|MODAL CALCULATION|CALCULATE RAYLEIGH|DEFINE MOVING LOAD|DEFINE REFERENCE)/, 'Dynamic, seismic and moving-load commands are not read. Use the Loading generators instead.'],
  [/^(SPRING|MULTILINEAR|PARAMETER|CHECK CODE|SELECT|CODE|DESIGN)/, 'Not read yet. Design parameters and one-way springs are entered in the dialogs.']];
function sxSplitLines(text) {
  const raw = text.split(/\r?\n/); const out = [];
  for (let i = 0; i < raw.length; i++) {
    let l = raw[i]; const n = i + 1; l = l.replace(/^\s+|\s+$/g, '');
    if (!l || l.startsWith('*')) continue;
    while (/\s-$/.test(l) && i + 1 < raw.length) { i++; l = l.replace(/\s-$/, ' ') + raw[i].trim(); }
    out.push({ n, t: l.toUpperCase() });
  }
  return out;
}
function sxValidateCmd(text) {
  const errs = [], warns = []; const L2 = sxSplitLines(text);
  if (!L2.length || !/^STAAD\s+(SPACE|PLANE|FLOOR|TRUSS)/.test(L2[0].t)) errs.push({ line: L2.length ? L2[0].n : 1, msg: 'The file must start with STAAD SPACE (or PLANE, FLOOR, TRUSS).' });
  const DATA = /^(JOINT COORD|MEMBER INCIDENCE|ELEMENT INCIDENCE|MEMBER PROPERTY|ELEMENT PROPERTY|SUPPORT|MEMBER RELEASE|MEMBER OFFSET|MEMBER (TRUSS|TENSION|COMPRESSION|CABLE)|INACTIVE|JOINT LOAD|MEMBER LOAD|ELEMENT LOAD|TEMPERATURE LOAD|LOAD COMB|CONSTANT|DEFINE MATERIAL|ISOTROPIC|START GROUP|JOINT$|MEMBER$|ELEMENT$)/;
  let block = null, finished = false, perform = false, lenNote = false;
  const joints = new Set(), members = new Set(), elems = new Set(), loads = new Set();
  for (const { n, t } of L2) {
    if (finished) { warns.push({ line: n, msg: 'Text after FINISH is ignored.' }); break; }
    const un = SX_UNSUPPORTED.find(([re]) => re.test(t));
    if (un) { errs.push({ line: n, msg: `${t.split(/\s+/).slice(0, 3).join(' ')}: ${un[1]}` }); continue; }
    if (/^[\d-]/.test(t)) {
      if (!block) { errs.push({ line: n, msg: 'Numbers with no command above them. Is a block heading missing?' }); continue; }
      for (const seg of t.split(';').map(x => x.trim()).filter(Boolean)) {
        const tk = seg.split(/\s+/);
        if (/^JOINT COORD/.test(block)) { if (tk.length < 4 || tk.slice(0, 4).some(v => !Number.isFinite(+v))) errs.push({ line: n, msg: `Joint line needs: number X Y Z. Got "${seg}".` }); else { if (joints.has(+tk[0])) errs.push({ line: n, msg: `Joint ${tk[0]} is defined twice.` }); joints.add(+tk[0]); } }
        else if (/^MEMBER INCIDENCE/.test(block)) { if (tk.length < 3) errs.push({ line: n, msg: `Member line needs: number start-joint end-joint. Got "${seg}".` }); else { for (const j of [tk[1], tk[2]]) if (!joints.has(+j)) errs.push({ line: n, msg: `Member ${tk[0]} uses joint ${j}, which is not defined.` }); if (tk[1] === tk[2]) errs.push({ line: n, msg: `Member ${tk[0]} starts and ends at the same joint.` }); members.add(+tk[0]); } }
        else if (/^ELEMENT INCIDENCE/.test(block)) { const nn = tk.slice(1).map(Number); for (const j of nn) if (!joints.has(j)) errs.push({ line: n, msg: `Element ${tk[0]} uses joint ${j}, which is not defined.` }); if (members.has(+tk[0])) errs.push({ line: n, msg: `Element ${tk[0]} has the same number as a member. STAAD needs unique numbers.` }); elems.add(+tk[0]); }
        else if (/^(JOINT LOAD)/.test(block)) { for (const id of parseList(tk.filter(x => /^\d+$|^TO$|^BY$/.test(x)).join(' '))) if (!joints.has(id)) errs.push({ line: n, msg: `Joint load on joint ${id}, which is not defined.` }); }
        else if (/^(MEMBER LOAD|TEMPERATURE LOAD)/.test(block)) { const ids = []; for (const x of tk) { if (/^\d+$|^TO$|^BY$/.test(x)) ids.push(x); else break; } for (const id of parseList(ids.join(' '))) if (!members.has(id)) errs.push({ line: n, msg: `Load on member ${id}, which is not defined.` }); }
        else if (/^LOAD COMB/.test(block)) { for (let i = 0; i + 1 < tk.length; i += 2) if (!loads.has(+tk[i])) errs.push({ line: n, msg: `The combination refers to load case ${tk[i]}, which is not defined above it.` }); }
      }
      continue;
    }
    if (!SX_KNOWN.some(re => re.test(t))) { errs.push({ line: n, msg: `Command not recognised: "${t.slice(0, 40)}". Check the spelling.` }); continue; }
    if (/^UNIT/.test(t) && !/MET/.test(t) && !lenNote) { lenNote = true; warns.push({ line: n, msg: 'Coordinates are converted from this unit, but load values are always read as kN and metres.' }); }
    if (/^LOAD\s+(\d+)/.test(t) && !/^LOAD COMB/.test(t)) loads.add(+t.match(/^LOAD\s+(\d+)/)[1]);
    if (/^PERFORM ANALYSIS/.test(t)) { perform = true; const pr = t.replace(/^PERFORM ANALYSIS\s*/, '').replace(/^PRINT\s*/, ''); if (pr && !SX_PRINTS.includes(pr)) errs.push({ line: n, msg: `Unknown print option "${pr}". Use one of: ${SX_PRINTS.join(', ')}.` }); }
    if (/^FINISH$/.test(t)) finished = true;
    if (DATA.test(t) || /^LOAD\s+\d+/.test(t)) block = t; else if (!/^(SELFWEIGHT|MATERIAL|BETA|_|E\b|POISSON|DENSITY|ALPHA|DAMP|G\b|FY|FU|TYPE|STRENGTH|CP)/.test(t)) block = null;
    if (/^LOAD COMB/.test(t)) block = 'LOAD COMB';
  }
  if (!perform) warns.push({ line: L2.length ? L2[L2.length - 1].n : 1, msg: 'No PERFORM ANALYSIS command. The model can be edited, but the analysis will not run until it is added.' });
  if (!finished) warns.push({ line: L2.length ? L2[L2.length - 1].n : 1, msg: 'No FINISH command at the end.' });
  /* dry run of the real reader, on a copy, so the current model is untouched */
  let counts = null;
  if (!errs.length) {
    const keep = M, keepIdx = nodeIndex, keepLc = S.lc;
    try { const w = fromStaad(text); staadLoadsIn(text); counts = { nodes: M.nodes.size, beams: M.beams.size, plates: M.plates.size, solids: M.solids.size, cases: M.loads.cases.length, combos: M.loads.combos.length, sections: M.sections.size }; for (const x of w) warns.push({ line: null, msg: x }); for (const b of M.beams.values()) if (!b.sec) { warns.push({ line: null, msg: `Member ${b.id} has no property after reading.` }); break; } }
    catch (e) { errs.push({ line: null, msg: 'The reader stopped: ' + e.message }); }
    finally { M = keep; nodeIndex = keepIdx; S.lc = keepLc; }
  }
  return { errs, warns, counts };
}
/* ---------------- STAAD command file: apply ---------------- */
function sxParseExtras(text, m) {
  sxDefaults(m);
  const g = re => { const x = text.match(re); return x ? x[1].trim() : ''; };
  m.job = { name: g(/^\s*JOB NAME\s+(.*)$/im), client: g(/^\s*JOB CLIENT\s+(.*)$/im), no: g(/^\s*JOB NO\s+(.*)$/im), engineer: g(/^\s*ENGINEER NAME\s+(.*)$/im), checker: g(/^\s*CHECKER NAME\s+(.*)$/im), date: g(/^\s*(?:ENGINEER\s+)?DATE\s+(.*)$/im) || new Date().toISOString().slice(0, 10) };
  const pa = text.match(/^\s*PERFORM ANALYSIS(?:\s+PRINT\s+(.*))?\s*$/im);
  m.anal = { perform: !!pa, print: pa && pa[1] ? pa[1].trim().toUpperCase() : 'NO PRINT', post: { disp: /^\s*PRINT JOINT DISP/im.test(text), forces: /^\s*PRINT MEMBER FORCE/im.test(text), reac: /^\s*PRINT SUPPORT REAC/im.test(text) }, finish: /^\s*FINISH\s*$/im.test(text) };
  m.groups = [];
  const gb = text.match(/START GROUP DEFINITION([\s\S]*?)END GROUP DEFINITION/i);
  if (gb) { let kind = 'beams'; for (const l of gb[1].replace(/-\s*\r?\n/g, ' ').split(/\r?\n/).map(x => x.trim().toUpperCase()).filter(Boolean)) { if (l === 'JOINT') kind = 'nodes'; else if (l === 'MEMBER') kind = 'beams'; else if (l === 'ELEMENT') kind = 'plates'; else if (l.startsWith('_')) { const [nm, ...rest] = l.split(/\s+/); m.groups.push({ name: nm.slice(1), kind, ids: parseList(rest.join(' ')) }); } } }
  m.restr = {}; m.ctags = {}; m.texts = [];
  for (const x of text.matchAll(/^\*\s*GEOSOFT RESTRAINT\s+(\d+)\s+LY\s+(\S+)\s+LZ\s+(\S+)\s+KY\s+(\S+)\s+KZ\s+(\S+)/gim)) m.restr[x[1]] = { ly: +x[2], lz: +x[3], ky: +x[4], kz: +x[5] };
  for (const x of text.matchAll(/^\*\s*GEOSOFT TAG\s+(\d+)\s+(.*)$/gim)) m.ctags[x[1]] = x[2].trim();
  for (const x of text.matchAll(/^\*\s*GEOSOFT TEXT\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/gim)) m.texts.push({ p: [+x[1], +x[2], +x[3]], text: x[4].trim() });
}
function sxApplyCmd(text, why) {
  const v = sxValidateCmd(text);
  if (v.errs.length) { sxCmdShowIssues(v); toast(`The command file has ${v.errs.length} error${v.errs.length > 1 ? 's' : ''}. Nothing was changed.`); return false; }
  const before = serialize(), old = M, camKeep = JSON.parse(JSON.stringify(cam)), name = M.name;
  try {
    const w = fromStaad(text); staadLoadsIn(text); sxParseExtras(text, M);
    /* keep what the command file has no words for */
    for (const k of ['env', 'supDefs', 'nextSup', 'views', 'macros', 'waveSets']) if (old[k] !== undefined && M[k] === undefined) M[k] = old[k];
    M.name = name; w.forEach(x => log(x));
  } catch (e) { M = old; toast('Could not apply: ' + e.message); return false; }
  UNDO.push({ s: before, label: why || 'Apply command file' }); REDO.length = 0;
  clearSel(); touched(why || 'Apply command file'); Object.assign(cam, camKeep); draw();
  S.cmdDirty = false; toast(`Command file applied: ${M.nodes.size} joints, ${M.beams.size} members, ${M.plates.size} plates, ${M.loads.cases.length} load cases. Undo reverses it.`);
  return true;
}

/* ---------------- the Command File window ---------------- */
S.sxWin.cmd = false; S.sxWin.out = false; S.cmdDirty = false;
function sxEnsureWin(id, elId) {
  let el = $('#' + elId); if (el) return el;
  el = document.createElement('div'); el.className = 'sxwin'; el.id = elId; el.innerHTML = '<div class="wt"></div><div class="wc"></div>';
  $('#sxMdi').appendChild(el); return el;
}
const SX_CMD_ICO = '<svg class="wi" viewBox="0 0 24 24"><rect x="3" y="2" width="16" height="20" fill="#fff" stroke="#2F74C2" stroke-width="1.4"/><path d="M6 7h10M6 10h10M6 13h7" stroke="#2F74C2"/><path d="M14 20l7-9-2-2-7 9-.5 2.5z" fill="#E8912D"/></svg>';
function sxExtraHeads() {
  const nm = (M.name || 'model').replace(/\.[^.]+$/, '');
  if (S.sxWin.cmd) sxHead(sxEnsureWin('cmd', 'sxCmdWin'), 'cmd', `${nm}.std - Command File`, SX_CMD_ICO);
  if (S.sxWin.out) sxHead(sxEnsureWin('out', 'sxOutWin'), 'out', `${nm}.anl - Analysis Output`, SX_CMD_ICO);
}
function sxOpenCmd() {
  S.sxWin.cmd = true; const el = sxEnsureWin('cmd', 'sxCmdWin'); sxLayout();
  if (!S.sxGeo.cmd || S.sxGeo.cmd.w == null) { const R = sxMdiRect(); S.sxGeo.cmd = { x: R.x + 30, y: R.y + 20, w: Math.min(780, R.w * 0.62), h: R.h * 0.85 }; }
  sxFront('cmd'); sxApplyGeo(); sxRenderCmd(true);
  return el;
}
function sxRenderCmd(regen) {
  const el = $('#sxCmdWin'); if (!el || !S.sxWin.cmd) return;
  const host = el.querySelector('.wc');
  if (!host.querySelector('#sxCmdTxt')) {
    host.innerHTML = `<div class="sxpane" style="padding:4px;gap:4px">
      <div class="brow" style="grid-template-columns:repeat(6,auto);justify-content:start;margin:0">
        <button type="button" class="wbtn" data-cc="regen" title="Write the command file again from the model">Refresh from Model</button>
        <button type="button" class="wbtn" data-cc="check" title="Check the commands without changing the model">Validate</button>
        <button type="button" class="wbtn def" data-cc="apply" title="Replace the model with what this file describes (undoable)">Apply to Model</button>
        <button type="button" class="wbtn" data-cc="job">Job Information…</button>
        <button type="button" class="wbtn" data-cc="open">Open .std…</button>
        <button type="button" class="wbtn" data-cc="save">Download .std</button></div>
      <div id="sxCmdBanner"></div>
      <textarea id="sxCmdTxt" spellcheck="false" wrap="off" aria-label="STAAD command file" style="flex:1;min-height:120px;resize:none;border:1px solid #828790;font:12.5px/1.45 Consolas,'Cascadia Mono','Courier New',monospace;padding:6px 8px;white-space:pre;background:#fff;color:#111"></textarea>
      <div id="sxCmdIssues" style="max-height:30%;overflow:auto"></div></div>`;
    const ta = host.querySelector('#sxCmdTxt');
    ta.addEventListener('input', () => { if (!S.cmdDirty) { S.cmdDirty = true; sxCmdBanner(); } });
    ta.addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); const p = ta.selectionStart; ta.setRangeText('  ', p, ta.selectionEnd, 'end'); } if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); sxApplyCmd(ta.value); } });
    host.querySelectorAll('[data-cc]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.cc;
      if (k === 'regen') { S.cmdDirty = false; sxRenderCmd(true); toast('Command file written from the model.'); }
      if (k === 'check') { const v = sxValidateCmd(ta.value); sxCmdShowIssues(v); toast(v.errs.length ? `${v.errs.length} errors found.` : `No errors.${v.warns.length ? ' ' + v.warns.length + ' notes.' : ''}`); }
      if (k === 'apply') sxApplyCmd(ta.value);
      if (k === 'job') sxJobDlg();
      if (k === 'save') saveFile((M.name || 'model').replace(/\.[^.]+$/, '') + '.std', ta.value);
      if (k === 'open') { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.std,.txt'; inp.onchange = () => { const f = inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { ta.value = r.result; S.cmdDirty = true; sxCmdBanner(); sxCmdShowIssues(sxValidateCmd(ta.value)); }; r.readAsText(f); }; inp.click(); }
    }));
    regen = true;
  }
  if (regen && !S.cmdDirty) { const ta = host.querySelector('#sxCmdTxt'); const top = ta.scrollTop; ta.value = toStaad(); ta.scrollTop = top; host.querySelector('#sxCmdIssues').innerHTML = ''; }
  sxCmdBanner();
}
function sxCmdBanner() {
  const b = $('#sxCmdBanner'); if (!b) return;
  b.innerHTML = S.cmdDirty ? `<p class="note2" style="background:#FFF4D6;border:1px solid #E0B44A;padding:4px 6px;margin:0">Edited by hand and not applied yet. <b>Apply to Model</b> (Ctrl+Enter) to use it, or <b>Refresh from Model</b> to discard the edits.</p>`
    : `<p class="note2" style="margin:0">This is the model written as commands, and it follows every change you make on screen. Type here and Apply to change the model.</p>`;
}
function sxCmdShowIssues(v) {
  const el = $('#sxCmdIssues'); if (!el) { if (v.errs.length) sxOpenCmd(); return; }
  const row = (x, bad) => `<div class="lr" data-ln="${x.line || ''}" style="grid-template-columns:70px 1fr;${bad ? 'color:#B3261E' : 'color:#7A4A00'}"><span>${x.line ? 'Line ' + x.line : ''}</span><span style="white-space:normal">${esc(x.msg)}</span></div>`;
  el.innerHTML = `<div class="box" style="font-size:12px">${v.errs.map(x => row(x, true)).join('')}${v.warns.map(x => row(x, false)).join('')}
    ${!v.errs.length && v.counts ? `<div class="lr" style="grid-template-columns:1fr;color:#1E6B3C"><span>Reads as ${v.counts.nodes} joints, ${v.counts.beams} members, ${v.counts.plates} plates, ${v.counts.sections} sections, ${v.counts.cases} load cases, ${v.counts.combos} combinations.</span></div>` : ''}</div>`;
  el.querySelectorAll('[data-ln]').forEach(r => r.addEventListener('click', () => {
    const n = +r.dataset.ln; if (!n) return; const ta = $('#sxCmdTxt'); const lines = ta.value.split('\n'); let p = 0; for (let i = 0; i < n - 1; i++) p += lines[i].length + 1;
    ta.focus(); ta.setSelectionRange(p, p + (lines[n - 1] || '').length); ta.scrollTop = Math.max(0, (n - 5) * 18);
  }));
}
function sxJobDlg() {
  const j = M.job;
  formDlg('Job information', [['name', 'Job name', 'text', j.name], ['client', 'Client', 'text', j.client], ['no', 'Job number', 'text', j.no], ['engineer', 'Engineer', 'text', j.engineer], ['checker', 'Checker', 'text', j.checker], ['date', 'Date', 'text', j.date]],
    v => mutate('Job information', () => { M.job = Object.assign({}, v); }), 'Save');
}

/* ---------------- Analysis commands ---------------- */
function sxDefineCmdDlg() {
  const a = M.anal;
  openDlg('Analysis/Print Commands', `<div class="form" style="grid-template-columns:max-content 220px">
      <label for="dcP">Perform Analysis</label><input type="checkbox" id="dcP" ${a.perform ? 'checked' : ''}>
      <label for="dcPr">Print option</label><select id="dcPr">${SX_PRINTS.map(p => `<option ${a.print === p ? 'selected' : ''}>${p}</option>`).join('')}</select>
      <label for="dcD">Print joint displacements</label><input type="checkbox" id="dcD" ${a.post.disp ? 'checked' : ''}>
      <label for="dcF">Print member forces</label><input type="checkbox" id="dcF" ${a.post.forces ? 'checked' : ''}>
      <label for="dcR">Print support reactions</label><input type="checkbox" id="dcR" ${a.post.reac ? 'checked' : ''}>
      <label for="dcE">FINISH (end of input)</label><input type="checkbox" id="dcE" ${a.finish ? 'checked' : ''}></div>
    <p class="note">PERFORM ANALYSIS runs a linear static analysis of every primary load case on the server; combinations are then formed by linear superposition. The print options decide what goes into the Analysis Output. FINISH closes the input; the analysis will not run without both.</p>`,
    [['Cancel', () => true], ['OK', () => { mutate('Analysis commands', () => { M.anal = { perform: $('#dcP').checked, print: $('#dcPr').value, post: { disp: $('#dcD').checked, forces: $('#dcF').checked, reac: $('#dcR').checked }, finish: $('#dcE').checked }; }); }, true]]);
}

/* ---------------- the pre-analysis checklist ---------------- */
const SX_STEP_NAMES = { geometry: 'Geometry', property: 'Properties', material: 'Materials', spec: 'Specifications', support: 'Supports', loading: 'Loading', analysis: 'Analysis commands' };
function sxList(ids, max = 12) { const a = [...ids]; return a.length > max ? `${a.slice(0, max).join(', ')} and ${a.length - max} more` : a.join(', '); }
function sxPlural(n, one, many) { return n === 1 ? one : `${n} ${many}`; }
function sxPreCheck(scope) {
  sxDefaults(M);
  const R = []; const add = (step, level, msg, sel) => R.push({ step, level, msg, sel });
  const beams = [...M.beams.values()], plates = [...M.plates.values()];
  /* geometry */
  if (!beams.length && !plates.length) add('geometry', 'err', 'The model has no members or plates. There is nothing to analyse.');
  const missingN = beams.filter(b => !M.nodes.has(b.i) || !M.nodes.has(b.j)); if (missingN.length) add('geometry', 'err', `${sxPlural(missingN.length, 'One member uses', 'members use')} a joint that does not exist: ${sxList(missingN.map(b => b.id))}.`, { beams: missingN.map(b => b.id) });
  const zero = beams.filter(b => M.nodes.has(b.i) && M.nodes.has(b.j) && beamLen(b) < 1e-6); if (zero.length) add('geometry', 'err', `${sxPlural(zero.length, 'One member has', 'members have')} zero length: ${sxList(zero.map(b => b.id))}.`, { beams: zero.map(b => b.id) });
  const seen = new Map(), dup = []; for (const b of beams) { const k = Math.min(b.i, b.j) + '-' + Math.max(b.i, b.j); if (seen.has(k)) dup.push(b.id); else seen.set(k, b.id); }
  if (dup.length) add('geometry', 'err', `${sxPlural(dup.length, 'One member duplicates', 'members duplicate')} another between the same joints: ${sxList(dup)}.`, { beams: dup });
  const deg = new Map(); for (const b of beams) { deg.set(b.i, 1); deg.set(b.j, 1); } for (const p of plates) p.n.forEach(n => deg.set(n, 1));
  const orphan = [...M.nodes.keys()].filter(n => !deg.has(n)); if (orphan.length) add('geometry', 'warn', `${sxPlural(orphan.length, 'One joint is', 'joints are')} not connected to anything and will be ignored: ${sxList(orphan)}.`, { nodes: orphan });
  if (M.solids.size) add('geometry', 'err', `The model has ${M.solids.size} solid elements. The analysis server does not solve solids yet, so the results would leave them out. Delete them or wait for solid support.`, { solids: [...M.solids.keys()] });
  /* parts without support */
  const adj = new Map(); const link = (a, b) => { (adj.get(a) || adj.set(a, []).get(a)).push(b); (adj.get(b) || adj.set(b, []).get(b)).push(a); };
  for (const b of beams) if (b.type !== 'inactive') link(b.i, b.j); for (const p of plates) for (let i = 0; i < p.n.length; i++) link(p.n[i], p.n[(i + 1) % p.n.length]);
  const seenN = new Set(); for (const start of adj.keys()) { if (seenN.has(start)) continue; const part = []; const st = [start]; seenN.add(start); while (st.length) { const n = st.pop(); part.push(n); for (const m of adj.get(n) || []) if (!seenN.has(m)) { seenN.add(m); st.push(m); } } if (!part.some(n => M.supports.has(n))) add('geometry', 'err', `A separate part of ${part.length} joints has no support, so it would float free (joints ${sxList(part, 6)}). Connect it or support it.`, { nodes: part }); }
  /* properties */
  const noSec = beams.filter(b => b.type !== 'inactive' && !b.sec); if (noSec.length) add('property', 'err', `${noSec.length === 1 ? 'One beam property is missing' : noSec.length + ' beam properties are missing'} (member${noSec.length > 1 ? 's' : ''} ${sxList(noSec.map(b => b.id))}). You cannot proceed to the analysis.`, { beams: noSec.map(b => b.id) });
  const noProps = beams.filter(b => b.sec && M.sections.has(b.sec) && !M.sections.get(b.sec).props); if (noProps.length) add('property', 'err', `${sxPlural(noProps.length, 'One member has', 'members have')} a section with no section properties: ${sxList(noProps.map(b => b.id))}.`, { beams: noProps.map(b => b.id) });
  const noT = plates.filter(p => !p.t); if (noT.length) add('property', 'err', `${noT.length === 1 ? 'One plate thickness is missing' : noT.length + ' plate thicknesses are missing'} (plates ${sxList(noT.map(p => p.id))}). You cannot proceed to the analysis.`, { plates: noT.map(p => p.id) });
  const tri = plates.filter(p => p.n.length !== 4); if (tri.length) add('property', 'err', `${sxPlural(tri.length, 'One plate is', 'plates are')} not 4-noded; the server would carry them as mass only, with no stiffness: ${sxList(tri.map(p => p.id))}.`, { plates: tri.map(p => p.id) });
  /* materials */
  const noMat = beams.filter(b => b.type !== 'inactive' && !b.mat), noMatP = plates.filter(p => !p.mat);
  if (noMat.length) add('material', 'err', `${noMat.length === 1 ? 'One member material is missing' : noMat.length + ' member materials are missing'} (${sxList(noMat.map(b => b.id))}). You cannot proceed to the analysis.`, { beams: noMat.map(b => b.id) });
  if (noMatP.length) add('material', 'err', `${sxPlural(noMatP.length, 'One plate has', 'plates have')} no material: ${sxList(noMatP.map(p => p.id))}.`, { plates: noMatP.map(p => p.id) });
  const usedMats = new Set([...beams.map(b => b.mat), ...plates.map(p => p.mat)].filter(Boolean));
  for (const id of usedMats) { const m = M.materials.get(id); if (!m) continue; if (!(m.E > 0)) add('material', 'err', `Material ${m.name} has no elastic modulus E. Stiffness cannot be computed.`, { beams: beams.filter(b => b.mat === id).map(b => b.id) }); if (m.fy == null) add('material', 'warn', `Material ${m.name} has no yield strength. The analysis can run, but code checks will report insufficient data.`); }
  /* specifications */
  for (const [t, why] of [['tension', 'tension-only'], ['compression', 'compression-only'], ['cable', 'cable']]) { const ids = beams.filter(b => b.type === t).map(b => b.id); if (ids.length) add('spec', 'err', `${sxPlural(ids.length, 'One member is', 'members are')} declared ${why}, but the server solves them as ordinary linear members, so the results would not match the model: ${sxList(ids)}. Change the type or wait for the non-linear solver.`, { beams: ids }); }
  /* supports */
  if (!M.supports.size) add('support', 'err', 'There are no supports. The structure would be a mechanism. Add supports before the analysis.');
  const bad = { foundation: 'elastic footing', tcspring: 'one-way spring', multi: 'multilinear spring', inclined: 'inclined support' };
  const byT = {}; for (const [n, sp] of M.supports) { if (bad[sp.type]) (byT[sp.type] = byT[sp.type] || []).push(n); if ((sp.type === 'enforced' || sp.type === 'enforcedbut') && (sp.enf || []).some(Boolean)) (byT.enf = byT.enf || []).push(n); }
  for (const [t, ids] of Object.entries(byT)) add('support', 'err', t === 'enf' ? `${ids.length} supports carry enforced displacements, which the server does not apply: ${sxList(ids)}.` : `${ids.length} supports are ${bad[t]}s, which the server would treat as fixed: ${sxList(ids)}. The supports and the analysis model would not match.`, { nodes: ids });
  let held = 0; for (const sp of M.supports.values()) held += sp.type === 'fixed' ? 6 : sp.type === 'pinned' ? 3 : (sp.rel || []).filter(r => !r).length + (sp.k || []).filter(Boolean).length;
  if (M.supports.size && held < 6) add('support', 'err', `The supports restrain only ${held} of the 6 rigid-body movements, so the structure can move freely. Add restraints.`);
  if (scope === 'nolo') return R;
  /* loading */
  const ld = L(), cases = ld.cases.filter(c => c.type !== 'Reference');
  if (!cases.length) add('loading', 'err', 'There are no load cases to analyse. Add at least one load case with loads in it.');
  const caseIds = new Set(ld.cases.map(c => c.id));
  for (const c of cases) {
    if (!c.items.length) { if (!(c.defs || []).length) add('loading', 'err', `Load case ${c.id} (${c.title}) is empty.`); continue; }
    const lost = { con: [], part: [], local: [], pr: [], temp: [] }; const gone = [];
    for (const it of c.items) {
      if ((it.node != null && !M.nodes.has(it.node)) || (it.beam != null && !M.beams.has(it.beam)) || (it.plate != null && !M.plates.has(it.plate))) { gone.push(it); continue; }
      if (it.k === 'con') lost.con.push(it.beam);
      else if (it.k === 'uni' && (it.d1 != null || it.d2 != null)) lost.part.push(it.beam);
      else if (it.k === 'uni' && !(it.dir && it.dir[0] === 'G')) lost.local.push(it.beam);
      else if (it.k === 'pr') lost.pr.push(it.plate);
      else if (it.k === 'temp') lost.temp.push(it.beam);
    }
    if (gone.length) add('loading', 'err', `Load case ${c.id} has ${gone.length} loads on joints or members that no longer exist.`);
    const words = { con: 'concentrated member loads', part: 'partial-length member loads (this includes generated wave and current loads)', local: 'member loads in local directions', pr: 'plate pressures', temp: 'temperature loads' };
    for (const [k, ids] of Object.entries(lost)) if (ids.length) add('loading', 'err', `There are errors in your loading: load case ${c.id} (${c.title}) has ${ids.length} ${words[k]} that the analysis server cannot apply yet. The load definition and the analysis model would not match.`, k === 'pr' ? { plates: [...new Set(ids)] } : { beams: [...new Set(ids)] });
    if (c.items.some(it => it.k === 'sw')) { const dens = [...usedMats].filter(id => { const m = M.materials.get(id); return m && !(m.rho > 0); }); if (dens.length) add('loading', 'err', `Load case ${c.id} uses self-weight, but ${dens.length} materials have no density.`); }
    if (c.items.some(it => (it.src || '').startsWith('Buoyancy')) && !M.env) add('loading', 'err', `Load case ${c.id} has buoyancy, but no project environment (water depth) is defined.`);
  }
  for (const cb of ld.combos) {
    if (!cb.f.length) add('loading', 'err', `Combination ${cb.id} has no load cases in it.`);
    for (const [id, f] of cb.f) { if (!caseIds.has(id)) add('loading', 'err', `Combination ${cb.id} refers to load case ${id}, which does not exist. There is a discrepancy between the combination and the model.`); else if (ld.cases.find(c => c.id === id).type === 'Reference') add('loading', 'err', `Combination ${cb.id} uses reference case ${id}. Reference cases are templates; add them into a primary case instead.`); if (!f) add('loading', 'warn', `Combination ${cb.id} has a zero factor on case ${id}.`); }
  }
  /* analysis commands */
  if (!M.anal.perform) add('analysis', 'err', 'The input has no PERFORM ANALYSIS command. Add it in Analysis, Define Commands.', { fix: 'perform' });
  if (!M.anal.finish) add('analysis', 'err', 'The input has no FINISH command. Add it in Analysis, Define Commands.', { fix: 'finish' });
  return R;
}
let sxCheckCache = { rev: -1, R: [] };
function sxCheckNow() { if (sxCheckCache.rev !== S.rev) sxCheckCache = { rev: S.rev, R: sxPreCheck() }; return sxCheckCache.R; }
function sxShowSel(sel) { clearSel(); for (const k of ['nodes', 'beams', 'plates', 'solids']) for (const id of (sel && sel[k]) || []) S.sel[k].add(id); afterSel(); setView('zsel'); }
function sxCheckDlg(onPass) {
  const R = sxPreCheck(); sxCheckCache = { rev: S.rev, R };
  const errs = R.filter(r => r.level === 'err'), warns = R.filter(r => r.level === 'warn');
  const steps = ['geometry', 'property', 'material', 'spec', 'support', 'loading', 'analysis'];
  const icon = l => l === 'err' ? '<b style="color:#B3261E">✕</b>' : l === 'warn' ? '<b style="color:#B97F0B">!</b>' : '<b style="color:#1E8F4E">✓</b>';
  const body = `<div style="width:min(760px,90vw)">
    <p style="margin:0 0 8px;font-size:13px">${errs.length ? `<b style="color:#B3261E">${errs.length} problem${errs.length > 1 ? 's' : ''} must be fixed before the analysis can run.</b> You cannot proceed to the analysis until every item is ticked.` : '<b style="color:#1E6B3C">Every pre-analysis check passed.</b> The model, its loads and the analysis commands agree.'}${warns.length ? ` ${warns.length} note${warns.length > 1 ? 's' : ''} below do not stop the analysis.` : ''}</p>
    <div class="tblw" style="max-height:55vh"><table><tbody>${steps.map(st => { const rows = R.filter(r => r.step === st);
      return `<tr><td style="width:24px">${icon(rows.some(r => r.level === 'err') ? 'err' : rows.length ? 'warn' : 'ok')}</td><td colspan="2"><b>${SX_STEP_NAMES[st]}</b>${rows.length ? '' : ' <span class="muted">complete</span>'}</td></tr>`
        + rows.map((r, i) => `<tr><td></td><td style="width:22px">${icon(r.level)}</td><td style="white-space:normal">${esc(r.msg)} ${r.sel && !r.sel.fix ? `<button type="button" class="btn" data-shw="${R.indexOf(r)}" style="min-width:0;padding:1px 8px">Show</button>` : ''}${r.sel && r.sel.fix ? `<button type="button" class="btn" data-fix="${r.sel.fix}" style="min-width:0;padding:1px 8px">Add it</button>` : ''}</td></tr>`).join(''); }).join('')}</tbody></table></div></div>`;
  openDlg('Pre-analysis check', body, [['Close', () => true], [errs.length ? 'Cannot run: fix the problems' : 'Run Analysis', () => { if (errs.length) return false; setTimeout(() => onPass && onPass(), 30); return true; }, !errs.length]]);
  const okBtn = [...document.querySelectorAll('#dlgFoot .btn')].pop(); if (errs.length && okBtn) okBtn.disabled = true;
  $$('#dlgBody [data-shw]').forEach(b => b.addEventListener('click', () => { const r = R[+b.dataset.shw]; dlg.close(); sxShowSel(r.sel); toast(r.msg); }));
  $$('#dlgBody [data-fix]').forEach(b => b.addEventListener('click', () => { mutate('Analysis commands', () => { if (b.dataset.fix === 'perform') M.anal.perform = true; M.anal.finish = true; if (b.dataset.fix === 'perform') M.anal.finish = true; }); sxCheckDlg(onPass); }));
  S.errLog = S.errLog || []; for (const e of errs) S.errLog.unshift(new Date().toLocaleTimeString() + '  Pre-analysis: ' + e.msg);
}

/* ---------------- run, then combinations by superposition ---------------- */
function sxCombos() {
  if (!RES || !RES.server) return 0;
  const analysed = L().cases.filter(c => c.type !== 'Reference');
  const keyOf = new Map(analysed.map((c, k) => [c.id, 'S' + k]));
  let n = 0;
  for (const cb of L().combos) {
    const parts = cb.f.map(([id, f]) => [RES.cases.get(keyOf.get(id)), f, id]); if (!parts.length || parts.some(p => !p[0])) continue;
    const U = new Float64Array(parts[0][0].U.length); const forces = new Map(), reac = new Map(); const items = [];
    for (const [r, f, id] of parts) {
      for (let i = 0; i < U.length; i++) U[i] += f * r.U[i];
      for (const [b, v] of r.forces) { const a = forces.get(b) || new Array(v.length).fill(0); v.forEach((x, i) => { a[i] += f * x; }); forces.set(b, a); }
      for (const [nid, v] of r.reac) { const a = reac.get(nid) || [0, 0, 0, 0, 0, 0]; v.forEach((x, i) => { a[i] += f * x; }); reac.set(nid, a); }
      for (const it of r.items) { const c = JSON.parse(JSON.stringify(it)); if (c.F) c.F = c.F.map(x => x * f); if (c.w != null) c.w *= f; if (c.P != null) c.P *= f; if (c.p != null) c.p *= f; if (c.f != null && c.k === 'sw') c.f *= f; items.push(c); }
    }
    let dmax = 0, at = null; const A = RES.A; if (A && A.idx) for (const [nid, g] of A.idx) { const d = Math.hypot(U[g * 6], U[g * 6 + 1], U[g * 6 + 2]); if (d > dmax) { dmax = d; at = nid; } }
    RES.cases.set('C' + cb.id, { id: 'C' + cb.id, title: `${cb.title} (combination ${cb.id}, linear superposition)`, kind: 'server', U, F: null, fef: new Map(), items, forces, stress: new Map(), reac, plate: {}, log: [`Formed from ${cb.f.map(([i, f]) => f + ' x LC' + i).join(' + ')}`], max_displacement_m: dmax, at_node: at, eq: null, combo: true });
    n++;
  }
  return n;
}
async function sxRunAnalysis() {
  const before = typeof RES !== 'undefined' ? RES : null;
  sxCheckDlg(async () => {
    const rev = S.rev;
    await analyseOnServer();
    if (typeof RES !== 'undefined' && RES && RES !== before && RES.server) {
      S.resRev = rev; S.rev = rev; S.resStaleWarned = false;
      const n = sxCombos(); if (n) log(`${n} load combinations formed by linear superposition of the primary cases.`);
      S.sxModule = 'post'; sxRenderWf(); sxRenderRibbon(); sxLayout(); sxStatus();
      sxWriteOutput(); if (M.anal.print !== 'NO PRINT' || M.anal.post.disp || M.anal.post.forces || M.anal.post.reac) { S.sxWin.out = true; sxLayout(); }
    }
  });
}
CMD.runAna = () => sxRunAnalysis();
CMD.srvAna = () => sxRunAnalysis();
for (const k of ['srvCross', 'srvRom']) { const f = CMD[k]; if (!f) continue; CMD[k] = () => { const errs = sxPreCheck('nolo').filter(r => r.level === 'err'); if (errs.length) { openDlg('Model not ready', `<p>${esc(errs[0].msg)}</p><p class="note">${errs.length > 1 ? `${errs.length - 1} more problems. ` : ''}Use Analysis, Pre-analysis Check to see them all.</p>`, [['Close', () => true]]); return; } f(); }; }
CMD.sxCheck = () => sxCheckDlg(() => sxRunAnalysis());
CMD.sxDefCmd = () => sxDefineCmdDlg();
CMD.sxCmdFile = () => sxOpenCmd();
CMD.sxJob = () => sxJobDlg();
CMD.sxOutput = () => { if (!sxResOK()) { toast(sxResWhy()); return; } sxWriteOutput(); S.sxWin.out = true; sxLayout(); sxFront('out'); sxApplyGeo(); };
const _resReport20 = CMD.resReport; CMD.resReport = () => { if (!sxResOK()) { toast(sxResWhy()); return; } _resReport20(); };

/* ---------------- Analysis Output (what the print options ask for) ---------------- */
function sxWriteOutput() {
  if (!sxResOK()) return;
  const a = M.anal, j = M.job, P = a.print; const out = [];
  const pad = (s, n) => String(s).padStart(n), f3 = v => (v == null ? '' : (+v).toFixed(3)), kN = v => (v / 1000);
  out.push('GEOSOFT STRUCTURAL MODELLER  -  ANALYSIS OUTPUT', '='.repeat(72), `JOB NAME   ${j.name || '-'}      JOB NO ${j.no || '-'}`, `CLIENT     ${j.client || '-'}`, `ENGINEER   ${j.engineer || '-'}      DATE ${j.date || ''}`, `MODEL      ${M.name || ''}`, `RUN        ${RES.when}  (${fx(RES.ms, 0)} ms on the server)`, '',
    `JOINTS ${M.nodes.size}   MEMBERS ${M.beams.size}   PLATES ${M.plates.size}   SUPPORTS ${M.supports.size}`, `PRIMARY LOAD CASES ${[...RES.cases.values()].filter(c => !c.combo).length}   COMBINATIONS ${[...RES.cases.values()].filter(c => c.combo).length}`, `PERFORM ANALYSIS${P !== 'NO PRINT' ? ' PRINT ' + P : ''}`, '');
  const analysed = L().cases.filter(c => c.type !== 'Reference');
  const lab = r => r.combo ? 'COMB ' + String(r.id).slice(1) : 'LOAD ' + ((analysed[+String(r.id).slice(1)] || {}).id ?? r.id);
  if (['LOAD DATA', 'BOTH', 'ALL'].includes(P)) {
    out.push('LOAD DATA', '-'.repeat(72));
    for (const c of analysed) { const t = caseTotal(c); out.push(`LOAD ${c.id}  ${c.title.toUpperCase()}  (${c.type})  ${c.items.length} items`); const by = {}; for (const it of c.items) by[it.k] = (by[it.k] || 0) + 1; out.push('   ' + Object.entries(by).map(([k, n]) => `${n} x ${k}`).join(', '), `   applied resultant  FX ${f3(t[0])}  FY ${f3(t[1])}  FZ ${f3(t[2])} kN (self-weight from model data; buoyancy is computed on the server and not in this sum)`); }
    out.push('');
  }
  if (['STATICS CHECK', 'STATICS LOAD', 'BOTH', 'ALL'].includes(P)) {
    out.push('STATICS CHECK  (sum of reactions against the applied loads)', '-'.repeat(72), `${'CASE'.padEnd(10)}${pad('SUM FX', 14)}${pad('SUM FY', 14)}${pad('SUM FZ', 14)}   OUT OF BALANCE`);
    for (const r of RES.cases.values()) { const s = [0, 0, 0]; for (const v of r.reac.values()) for (let i = 0; i < 3; i++) s[i] += v[i]; out.push(`${lab(r).padEnd(10)}${pad(f3(kN(s[0])), 14)}${pad(f3(kN(s[1])), 14)}${pad(f3(kN(s[2])), 14)}   ${r.eq == null ? 'combination' : fx(r.eq, 5) + ' %'}`); }
    out.push('');
  }
  out.push('MAXIMUM DISPLACEMENTS', '-'.repeat(72)); for (const r of RES.cases.values()) out.push(`${lab(r).padEnd(10)}${pad(fx((r.max_displacement_m || 0) * 1000, 3), 12)} mm  at joint ${r.at_node ?? '-'}   ${r.title}`); out.push('');
  if (a.post.disp || P === 'ALL') { out.push('JOINT DISPLACEMENTS (mm, rad)', '-'.repeat(72)); const A = RES.A; for (const r of RES.cases.values()) { out.push(lab(r)); for (const [nid, g] of A.idx) { const u = r.U; out.push(`${pad(nid, 8)}${[0, 1, 2].map(q => pad(fx(u[g * 6 + q] * 1000, 4), 12)).join('')}${[3, 4, 5].map(q => pad(u[g * 6 + q].toExponential(3), 12)).join('')}`); } } out.push(''); }
  if (a.post.reac || P === 'ALL') { out.push('SUPPORT REACTIONS (kN, kNm)', '-'.repeat(72)); for (const r of RES.cases.values()) { out.push(lab(r)); for (const [nid, v] of r.reac) out.push(`${pad(nid, 8)}${v.map(x => pad(f3(kN(x)), 12)).join('')}`); } out.push(''); }
  if (a.post.forces || P === 'ALL') { out.push('MEMBER END FORCES, LOCAL AXES (kN, kNm): N Vy Vz T My Mz', '-'.repeat(72)); for (const r of RES.cases.values()) { out.push(lab(r)); for (const [b, v] of r.forces) { out.push(`${pad(b, 8)} start${v.slice(0, 6).map(x => pad(f3(kN(x)), 11)).join('')}`, `${pad('', 8)}   end${v.slice(6, 12).map(x => pad(f3(kN(x)), 11)).join('')}`); } } out.push(''); }
  out.push('Combinations are linear superpositions of the primary cases. Stresses for combinations are not reported.', '*** END OF OUTPUT ***');
  S.sxOutText = out.join('\n'); sxRenderOut();
}
function sxRenderOut() {
  const el = $('#sxOutWin'); if (!el || !S.sxWin.out) return; const host = el.querySelector('.wc');
  host.innerHTML = `<div class="sxpane" style="padding:4px"><div class="brow" style="grid-template-columns:auto auto;justify-content:start;margin:0 0 4px"><button type="button" class="wbtn" data-o="save">Download .anl</button><button type="button" class="wbtn" data-o="cmds">Print Options…</button></div>
    <pre style="flex:1;margin:0;overflow:auto;background:#fff;border:1px solid #828790;padding:6px 8px;font:12px/1.4 Consolas,'Courier New',monospace">${esc(S.sxOutText || (sxResOK() ? '' : sxResWhy()))}</pre></div>`;
  host.querySelector('[data-o=save]').addEventListener('click', () => saveFile((M.name || 'model').replace(/\.[^.]+$/, '') + '.anl', S.sxOutText || ''));
  host.querySelector('[data-o=cmds]').addEventListener('click', () => sxDefineCmdDlg());
}

/* ---------------- Analysis pane: the command tree, as STAAD shows it ---------------- */
function sxAnalPane(host) {
  const text = toStaad(); const lines = text.split('\n'); const top = [];
  for (const l of lines) { if (!l || l.startsWith('*')) continue; if (/^[\d_-]/.test(l) || /^(E|POISSON|DENSITY|ALPHA|FY|MATERIAL|BETA|ISOTROPIC|SELFWEIGHT|JOB|ENGINEER|CHECKER)\b/.test(l)) { if (top.length) top[top.length - 1].kids.push(l); continue; } top.push({ t: l, kids: [] }); }
  S.sxAnalOpen = S.sxAnalOpen || {};
  const R = sxCheckNow(); const nErr = R.filter(r => r.level === 'err').length;
  host.innerHTML = `<div class="sxpane"><div class="ltr" style="font-weight:400;height:auto;flex:1;min-height:180px">${top.map((x, i) => `<div class="n" style="padding-left:2px">${x.kids.length ? `<span class="tw" data-ao="${i}">${S.sxAnalOpen[i] ? '−' : '+'}</span>` : '<span class="tw blank"></span>'}<span class="dots"></span><span style="color:#1E8F4E">✓</span><span class="lb">${esc(x.t)}</span>${x.kids.length && !S.sxAnalOpen[i] ? ` <small>(${x.kids.length})</small>` : ''}</div>${S.sxAnalOpen[i] ? x.kids.slice(0, 200).map(k => `<div class="n it" style="padding-left:40px"><span class="lb">${esc(k)}</span></div>`).join('') : ''}`).join('')}
      ${M.anal.perform ? '' : '<div class="n nb" style="padding-left:2px"><span class="tw blank"></span><span class="dots"></span><span style="color:#B3261E">✕</span><span class="lb">PERFORM ANALYSIS is missing</span></div>'}
      ${M.anal.finish ? '' : '<div class="n nb" style="padding-left:2px"><span class="tw blank"></span><span class="dots"></span><span style="color:#B3261E">✕</span><span class="lb">FINISH is missing</span></div>'}</div>
    <p class="note2 ${nErr ? 'bad' : ''}" style="margin:6px 0">${nErr ? `${nErr} pre-analysis problem${nErr > 1 ? 's' : ''} open. The analysis is locked until they are fixed.` : 'Pre-analysis check passed. The analysis can run.'} ${sxResOK() ? 'Results are current.' : (typeof RES !== 'undefined' && RES && RES.server ? 'Results are out of date.' : '')}</p>
    <div class="brow r2"><button type="button" class="wbtn" data-ac="def">Define Commands…</button><button type="button" class="wbtn" data-ac="cmd">Edit Command File</button>
      <button type="button" class="wbtn" data-ac="chk">Pre-analysis Check</button><button type="button" class="wbtn def" data-ac="run">Run Analysis</button></div>
    <div class="brow end"><button type="button" class="wbtn" data-ac="out" ${sxResOK() ? '' : `disabled title="${esc(sxResWhy())}"`}>Output</button><button type="button" class="wbtn" data-sxc>Close</button><button type="button" class="wbtn" data-sxh>Help</button></div></div>`;
  host.querySelectorAll('[data-ao]').forEach(b => b.addEventListener('click', () => { S.sxAnalOpen[b.dataset.ao] = !S.sxAnalOpen[b.dataset.ao]; sxAnalPane(host); }));
  host.querySelector('[data-ac=def]').addEventListener('click', sxDefineCmdDlg);
  host.querySelector('[data-ac=cmd]').addEventListener('click', sxOpenCmd);
  host.querySelector('[data-ac=chk]').addEventListener('click', () => CMD.sxCheck());
  host.querySelector('[data-ac=run]').addEventListener('click', () => CMD.runAna());
  host.querySelector('[data-ac=out]').addEventListener('click', () => CMD.sxOutput());
  sxFoot(host, () => {}, false);
}
function sxPostPane(host) {
  if (!sxResOK()) { host.innerHTML = `<div class="sxpane"><div class="box" style="padding:12px"><p style="margin:0 0 6px;font-size:13px"><b>Postprocessing is locked.</b></p><p class="note2 bad">${esc(sxResWhy())}</p></div><div class="brow r2" style="margin-top:8px"><button type="button" class="wbtn" data-p="chk">Pre-analysis Check</button><button type="button" class="wbtn" data-p="ana">Go to Analysis</button></div></div>`;
    host.querySelector('[data-p=chk]').addEventListener('click', () => CMD.sxCheck()); host.querySelector('[data-p=ana]').addEventListener('click', () => { S.sxModule = 'ana'; gotoWorkflow('analysis'); }); return; }
  sxGenericPane(host);
}
var SX_PANES_X = { anal: sxAnalPane, post: sxPostPane };
sxPlan = function () {
  if (S.sxPane) return { a: 'beams', b: 'generic' };
  if (S.sxModule === 'post') return { a: 'beams', b: 'post' };
  if (S.wf === 'geometry') return { a: 'nodes', b: 'beams' };
  return { a: 'beams', b: { property: 'prop', material: 'mat', spec: 'spec', support: 'sup', loading: 'load', analysis: 'anal', design: 'design' }[S.wf] || 'generic' };
};
const _sxWinTitle20 = sxWinTitle;
sxWinTitle = function (kind) { if (kind === 'anal') return 'Analysis - Whole Structure'; if (kind === 'post') return 'Postprocessing - Results'; return _sxWinTitle20(kind); };

/* the left Postprocessing module is locked until results are valid */
const _sxRenderWf20 = sxRenderWf;
sxRenderWf = function () {
  _sxRenderWf20();
  const b = document.querySelector('#sxWfList [data-wfm=post]'); if (!b) return;
  const ok = sxResOK(); b.classList.toggle('dis', !ok); b.title = ok ? 'Results of the last analysis' : sxResWhy();
  const sp = b.querySelector('span'); if (sp && !ok && !sp.querySelector('small')) sp.insertAdjacentHTML('beforeend', '<small>needs a completed analysis</small>');
  b.addEventListener('click', e => { if (!sxResOK()) { e.stopImmediatePropagation(); S.sxModule = 'ana'; toast(sxResWhy()); } }, true);
};
/* the workflow bar shows which steps are complete */
const _sxRenderWfBar20 = sxRenderWfBar;
sxRenderWfBar = function () {
  _sxRenderWfBar20();
  const R = sxCheckNow();
  $$('#sxWfBar [data-wfs]').forEach(b => {
    const st = b.dataset.wfs; if (st === 'design') return;
    const rows = R.filter(r => r.step === st), e = rows.filter(r => r.level === 'err').length;
    const ok = st === 'analysis' ? !R.some(r => r.level === 'err') : !e;
    b.insertAdjacentHTML('beforeend', ` <span style="font-size:11px;font-weight:700;color:${ok ? '#1E8F4E' : '#B3261E'}" title="${esc(ok ? 'Complete' : rows.filter(r => r.level === 'err').map(r => r.msg).join('\n') || 'Earlier steps have problems')}">${ok ? '✓' : st === 'analysis' ? '✕' : e}</span>`);
  });
};
/* keep the command file and output in step with the model */
const _rp20 = refreshPanel;
refreshPanel = function () { _rp20(); if (S.sxWin.cmd && !S.cmdDirty) { clearTimeout(S.cmdT); S.cmdT = setTimeout(() => sxRenderCmd(true), 150); } else if (S.sxWin.cmd) sxCmdBanner(); };

/* ---------------- window selection: an element is taken when more than half of it is inside ---------------- */
function sxSegFrac(A, B, x0, y0, x1, y1) {
  let t0 = 0, t1 = 1; const dx = B[0] - A[0], dy = B[1] - A[1];
  if (Math.hypot(dx, dy) < 1e-9) return A[0] >= x0 && A[0] <= x1 && A[1] >= y0 && A[1] <= y1 ? 1 : 0;
  for (const [p, q] of [[-dx, A[0] - x0], [dx, x1 - A[0]], [-dy, A[1] - y0], [dy, y1 - A[1]]]) {
    if (Math.abs(p) < 1e-12) { if (q < 0) return 0; continue; }
    const r = q / p; if (p < 0) { if (r > t1) return 0; if (r > t0) t0 = r; } else { if (r < t0) return 0; if (r < t1) t1 = r; }
  }
  return Math.max(0, t1 - t0);
}
function sxPolyArea(P) { let a = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length]; a += p[0] * q[1] - q[0] * p[1]; } return Math.abs(a) / 2; }
function sxClipRect(P, x0, y0, x1, y1) {
  let out = P.map(p => [p[0], p[1]]);
  const edges = [[p => p[0] >= x0, (a, b) => { const t = (x0 - a[0]) / (b[0] - a[0]); return [x0, a[1] + t * (b[1] - a[1])]; }], [p => p[0] <= x1, (a, b) => { const t = (x1 - a[0]) / (b[0] - a[0]); return [x1, a[1] + t * (b[1] - a[1])]; }],
    [p => p[1] >= y0, (a, b) => { const t = (y0 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), y0]; }], [p => p[1] <= y1, (a, b) => { const t = (y1 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), y1]; }]];
  for (const [inside, cut] of edges) { const inp = out; out = []; for (let i = 0; i < inp.length; i++) { const a = inp[i], b = inp[(i + 1) % inp.length]; const ia = inside(a), ib = inside(b); if (ia) out.push(a); if (ia !== ib) out.push(cut(a, b)); } if (!out.length) return []; }
  return out;
}
function sxHull(P) { const p = P.map(q => [q[0], q[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const lo = [], up = []; for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); } for (const q of p.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); } return lo.slice(0, -1).concat(up.slice(0, -1)); }
function sxAreaFrac(P, x0, y0, x1, y1) {
  const A = sxPolyArea(P); if (A < 1e-6) { let tot = 0, ins = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); tot += l; ins += l * sxSegFrac(a, b, x0, y0, x1, y1); } return tot ? ins / tot : 0; }
  return sxPolyArea(sxClipRect(P, x0, y0, x1, y1)) / A;
}
const SX_HALF = 0.5;
boxSelect = function (d) {
  const x0 = Math.min(d.x0, d.x1), x1 = Math.max(d.x0, d.x1), y0 = Math.min(d.y0, d.y1), y1 = Math.max(d.y0, d.y1);
  if (S.sxZoomWin) { S.sxZoomWin = false; const keep = { nodes: new Set(S.sel.nodes), beams: new Set(S.sel.beams), plates: new Set(S.sel.plates), solids: new Set(S.sel.solids) }; clearSel(); for (const [id, q] of PROJ.nodes) if (q && q[0] >= x0 && q[0] <= x1 && q[1] >= y0 && q[1] <= y1) S.sel.nodes.add(id); if (S.sel.nodes.size) setView('zsel'); else toast('No joints inside that window.'); S.sel = keep; draw(); return; }
  if (!d.add) clearSel();
  const ks = cursorKinds(); const inside = q => q && q[0] >= x0 && q[0] <= x1 && q[1] >= y0 && q[1] <= y1;
  if (ks.includes('nodes')) for (const [id, q] of PROJ.nodes) if (inside(q)) S.sel.nodes.add(id);
  if (ks.includes('beams')) for (const [id, [A, B]] of PROJ.beams) if (sxSegFrac(A, B, x0, y0, x1, y1) > SX_HALF) S.sel.beams.add(id);
  if (ks.includes('plates')) for (const [id, pts] of PROJ.plates) if (sxAreaFrac(pts, x0, y0, x1, y1) > SX_HALF) S.sel.plates.add(id);
  if (ks.includes('solids')) for (const [id, pts] of PROJ.solids) if (sxAreaFrac(sxHull(pts), x0, y0, x1, y1) > SX_HALF) S.sel.solids.add(id);
  if (S.sxMembers) sxExpandMembers();
  sxAssignHook();
};

/* ---------------- clicking: members only between existing joints ---------------- */
function sxAssignHook() {
  const A = S.sxAssign;
  if (A && !A.busy && S.sel[A.kind] && S.sel[A.kind].size) {
    A.busy = true; const ids = [...S.sel[A.kind]];
    try { mutate(`Assign ${A.what}`, () => A.apply(ids)); toast(`Assigned ${A.what} to ${ids.length} ${A.kind}. Keep clicking, or press Esc to stop.`); } finally { A.busy = false; }
    clearSel(); draw(); refreshPanel();
  }
}
const _clickAt20 = clickAt;
clickAt = function (x, y, add) {
  if (S.sxPlaceText) { const h = pickAt(x, y, ['nodes']); const p = h ? nodeP(h.id) : pickPlane(x, y); if (!p) return; const txt = S.sxPlaceText; S.sxPlaceText = null; mutate('Insert text', () => M.texts.push({ p: p.slice(), text: txt })); toast('Text placed.'); return; }
  if (S.sxTextCur) { let best = -1, bd = 14; M.texts.forEach((t, i) => { const q = proj(t.p); const d = Math.hypot(q[0] - x, q[1] - y); if (d < bd) { bd = d; best = i; } }); if (best >= 0) sxTextDlg(best); else toast('No text there. Texts are picked by their anchor point.'); return; }
  if (['addBeam', 'addPlate', 'addSolid'].includes(S.tool) && !pickAt(x, y, ['nodes'])) {
    toast(`Click an existing joint. ${S.tool === 'addBeam' ? 'Members' : S.tool === 'addPlate' ? 'Plates' : 'Solids'} connect joints that already exist; add joints first with Add Node, the Nodes table or the command file.`); return;
  }
  const r = _clickAt20(x, y, add);
  if (S.tool === 'select') { if (S.sxMembers) sxExpandMembers(); sxAssignHook(); }
  return r;
};
const _sxAfterSel20 = afterSel;
afterSel = function () { _sxAfterSel20(); };

/* ---------------- physical members: chains of collinear members ---------------- */
function sxChain(bid) {
  const b0 = M.beams.get(bid); if (!b0) return [];
  const dir = V.norm(V.sub(nodeP(b0.j), nodeP(b0.i))); const chain = new Set([bid]);
  const byNode = new Map(); for (const b of M.beams.values()) { (byNode.get(b.i) || byNode.set(b.i, []).get(b.i)).push(b); (byNode.get(b.j) || byNode.set(b.j, []).get(b.j)).push(b); }
  for (const start of [b0.i, b0.j]) { let n = start, prev = bid; for (let guard = 0; guard < 10000; guard++) { const next = (byNode.get(n) || []).find(b => b.id !== prev && !chain.has(b.id) && Math.abs(V.dot(V.norm(V.sub(nodeP(b.j), nodeP(b.i))), dir)) > 0.9995); if (!next) break; chain.add(next.id); prev = next.id; n = next.i === n ? next.j : next.i; } }
  return [...chain];
}
function sxExpandMembers() { for (const id of [...S.sel.beams]) for (const c of sxChain(id)) S.sel.beams.add(c); draw(); refreshPanel(); }

/* ---------------- selection history, connected, load cursor, filter ---------------- */
S.selHist = [];
const _rp20b = refreshPanel;
refreshPanel = function () {
  const snap = JSON.stringify(['nodes', 'beams', 'plates', 'solids'].map(k => [...S.sel[k]]));
  if (snap !== S.selSnap) { if (S.selSnap && S.selSnap !== '[[],[],[],[]]') { S.selHist.push(S.selSnap); if (S.selHist.length > 30) S.selHist.shift(); } S.selSnap = snap; }
  _rp20b();
};
function sxSelPrev() { const s = S.selHist.pop(); if (!s) { toast('No earlier selection.'); return; } const a = JSON.parse(s); clearSel(); ['nodes', 'beams', 'plates', 'solids'].forEach((k, i) => a[i].forEach(id => S.sel[k].add(id))); S.selSnap = s; afterSel(); toast(`Previous selection restored (${selCount()} items).`); }
function sxConnected(mode) {
  if (!selCount()) { toast('Select something first.'); return; }
  const nodes = new Set(S.sel.nodes); for (const id of S.sel.beams) { const b = M.beams.get(id); if (b) { nodes.add(b.i); nodes.add(b.j); } }
  if (mode === 'beams') { for (const b of M.beams.values()) if (nodes.has(b.i) || nodes.has(b.j)) S.sel.beams.add(b.id); }
  else if (mode === 'nodes') { for (const n of nodes) S.sel.nodes.add(n); }
  else { const adj = new Map(); for (const b of M.beams.values()) { (adj.get(b.i) || adj.set(b.i, []).get(b.i)).push(b); (adj.get(b.j) || adj.set(b.j, []).get(b.j)).push(b); } const st = [...nodes], seen = new Set(st); while (st.length) { const n = st.pop(); for (const b of adj.get(n) || []) { S.sel.beams.add(b.id); for (const m of [b.i, b.j]) if (!seen.has(m)) { seen.add(m); st.push(m); } } } }
  afterSel(); toast(`${selCount()} items selected.`);
}
function sxSelByLoad() { const c = curCase(); if (!c) { toast('Choose a load case first (Loading, Display, Load).'); return; } clearSel(); for (const it of c.items) { if (it.node != null) S.sel.nodes.add(it.node); if (it.beam != null) S.sel.beams.add(it.beam); if (it.plate != null) S.sel.plates.add(it.plate); } afterSel(); toast(`${selCount()} items carry loads in case ${c.id}.`); }
function sxFilterDlg() {
  formDlg('Selection filter', [['kind', 'Select', 'select', [['beams', 'Members'], ['plates', 'Plates'], ['nodes', 'Joints']]], ['sec', 'Section', 'select', [['', 'any'], ...[...M.sections.values()].map(s => [s.id, s.name])]], ['mat', 'Material', 'select', [['', 'any'], ...[...M.materials.values()].map(m => [m.id, m.name])]],
    ['ori', 'Member orientation', 'select', [['', 'any'], ['v', 'vertical'], ['h', 'horizontal'], ['i', 'inclined']]], ['lmin', `Length at least (${uL()})`, 'number', 0], ['lmax', `Length at most (${uL()}, 0 = no limit)`, 'number', 0], ['zmin', `Elevation from (${uL()}, blank = any)`, 'text', ''], ['zmax', `Elevation to (${uL()})`, 'text', ''], ['add', 'Add to current selection', 'checkbox', false]], v => {
    if (!v.add) clearSel(); const up = M.up === 'Y' ? 1 : 2; const zin = p => (v.zmin === '' || p[up] >= frU(+v.zmin) - 1e-6) && (v.zmax === '' || p[up] <= frU(+v.zmax) + 1e-6);
    if (v.kind === 'beams') for (const b of M.beams.values()) { if (v.sec && b.sec !== +v.sec) continue; if (v.mat && b.mat !== +v.mat) continue; const L0 = beamLen(b); if (L0 < frU(+v.lmin)) continue; if (+v.lmax && L0 > frU(+v.lmax)) continue; const d = V.norm(V.sub(nodeP(b.j), nodeP(b.i))); const vz = Math.abs(d[up]); if (v.ori === 'v' && vz < 0.999) continue; if (v.ori === 'h' && vz > 0.001) continue; if (v.ori === 'i' && (vz >= 0.999 || vz <= 0.001)) continue; if (!zin(V.mul(V.add(nodeP(b.i), nodeP(b.j)), 0.5))) continue; S.sel.beams.add(b.id); }
    if (v.kind === 'plates') for (const p of M.plates.values()) { if (v.mat && p.mat !== +v.mat) continue; const c = V.mul(p.n.map(nodeP).reduce((a, q) => V.add(a, q), [0, 0, 0]), 1 / p.n.length); if (zin(c)) S.sel.plates.add(p.id); }
    if (v.kind === 'nodes') for (const n of M.nodes.values()) if (zin([n.x, n.y, n.z])) S.sel.nodes.add(n.id);
    afterSel(); toast(`${selCount()} items selected by the filter.`);
  }, 'Select');
}
function sxHighlight() {
  if (!selCount()) { toast('Select something first; Highlight finds it in the tables and the view.'); return; }
  S.sxWin.right = true; S.sxWin.top = true; S.sxWin.bot = true; sxLayout();
  setTimeout(() => { $$('#sxWinA tr.sel, #sxWinB tr.sel').forEach((tr, i) => { if (i === 0) tr.scrollIntoView({ block: 'center' }); tr.animate([{ background: '#FFD24D' }, { background: 'transparent' }], { duration: 900, iterations: 2 }); }); setView('zsel'); }, 60);
}

/* ---------------- geometry generators ---------------- */
function sxNewBeam(i, j) { if (i === j || beamExists(i, j)) return null; const id = newBeam(i, j); const b = M.beams.get(id); b.sec = M.sections.has(S.curSec) ? S.curSec : null; b.mat = M.materials.has(S.curMat) ? S.curMat : null; return id; }
function sxBeamLayout() {
  const order = S.selOrder.filter(n => S.sel.nodes.has(n)); const ids = order.length >= 2 ? order : [...S.sel.nodes];
  if (ids.length < 2) { toast('Select two or more joints with the Node Cursor, in the order the members should run (Ctrl+click), then Beam Layout.'); return; }
  formDlg('Beam layout', [['mode', 'Connect', 'select', [['chain', 'In sequence, joint to joint'], ['loop', 'In sequence and close the loop'], ['star', 'First joint to each of the others']]]], v => {
    mutate('Beam layout', () => { let n = 0; if (v.mode === 'star') for (const j of ids.slice(1)) n += sxNewBeam(ids[0], j) ? 1 : 0; else { for (let k = 0; k + 1 < ids.length; k++) n += sxNewBeam(ids[k], ids[k + 1]) ? 1 : 0; if (v.mode === 'loop' && ids.length > 2) n += sxNewBeam(ids[ids.length - 1], ids[0]) ? 1 : 0; } toast(`${n} members added between existing joints.`); });
  }, 'Create');
}
function sxStretch() {
  if (!S.sel.beams.size) { toast('Select the members to stretch.'); return; }
  formDlg('Stretch beam', [['end', 'Extend at', 'select', [['e', 'End joint'], ['s', 'Start joint']]], ['d', `Extend by (${uL()}, negative shortens)`, 'number', 1]], v => mutate('Stretch beam', () => {
    let n = 0; for (const id of S.sel.beams) { const b = M.beams.get(id); if (!b) continue; const a = nodeP(b.i), c = nodeP(b.j); const u = V.norm(V.sub(c, a)); const L0 = V.len(V.sub(c, a)); const d = frU(+v.d); if (L0 + d <= 1e-6) continue;
      const p = v.end === 'e' ? V.add(c, V.mul(u, d)) : V.sub(a, V.mul(u, d)); const nn = addNode(p[0], p[1], p[2]); if (v.end === 'e') b.j = nn; else b.i = nn; n++; }
    toast(`${n} members stretched. Other members at the old joints are unchanged.`); }), 'Apply');
}
function sxRegion(title, solid) {
  const sel = [...S.sel.nodes].map(nodeP); const mn = [0, 1, 2].map(k => sel.length ? Math.min(...sel.map(p => p[k])) : 0), mx = [0, 1, 2].map(k => sel.length ? Math.max(...sel.map(p => p[k])) : 0);
  const fields = [['plane', 'Plane', 'select', solid ? [['XYZ', 'Block (X, Y, Z)']] : [[M.up === 'Y' ? 'XZ' : 'XY', 'Horizontal'], ['XY', 'XY'], ['XZ', 'XZ'], ['YZ', 'YZ']]], ['x', `Origin X (${uL()})`, 'number', +toU(mn[0]).toFixed(4)], ['y', `Origin Y (${uL()})`, 'number', +toU(mn[1]).toFixed(4)], ['z', `Origin Z (${uL()})`, 'number', +toU(mn[2]).toFixed(4)],
    ['a', `Size along first axis (${uL()})`, 'number', +toU(Math.max(mx[0] - mn[0], 1)).toFixed(4)], ['b', `Size along second axis (${uL()})`, 'number', +toU(Math.max(mx[1] - mn[1], mx[2] - mn[2], 1)).toFixed(4)], ['m', 'Divisions, first axis', 'number', 4], ['n', 'Divisions, second axis', 'number', 4]];
  if (solid) fields.push(['c', `Size along Z (${uL()})`, 'number', 1], ['o', 'Divisions along Z', 'number', 1]); else fields.push(['t', 'Thickness (mm)', 'number', 10]);
  formDlg(title, fields, v => mutate(title, () => {
    const o = [frU(+v.x), frU(+v.y), frU(+v.z)], m = Math.max(1, v.m | 0), n = Math.max(1, v.n | 0);
    if (solid) { const oz = Math.max(1, v.o | 0); const g = []; for (let k = 0; k <= oz; k++) { g.push([]); for (let j = 0; j <= n; j++) { g[k].push([]); for (let i = 0; i <= m; i++) g[k][j].push(addNode(o[0] + frU(+v.a) * i / m, o[1] + frU(+v.b) * j / n, o[2] + frU(+v.c) * k / oz)); } }
      let c = 0; for (let k = 0; k < oz; k++) for (let j = 0; j < n; j++) for (let i = 0; i < m; i++) { newSolid([g[k][j][i], g[k][j][i + 1], g[k][j + 1][i + 1], g[k][j + 1][i], g[k + 1][j][i], g[k + 1][j][i + 1], g[k + 1][j + 1][i + 1], g[k + 1][j + 1][i]], S.curMat); c++; } toast(`${c} solids created.`); return; }
    const ax = { XY: [0, 1], XZ: [0, 2], YZ: [1, 2] }[v.plane]; const g = [];
    for (let j = 0; j <= n; j++) { g.push([]); for (let i = 0; i <= m; i++) { const p = o.slice(); p[ax[0]] += frU(+v.a) * i / m; p[ax[1]] += frU(+v.b) * j / n; g[j].push(addNode(p[0], p[1], p[2])); } }
    let c = 0; for (let j = 0; j < n; j++) for (let i = 0; i < m; i++) { newPlate([g[j][i], g[j][i + 1], g[j + 1][i + 1], g[j + 1][i]], (+v.t || 0) / 1000 || null, S.curMat); c++; } toast(`${c} plates created. Joints that already existed at those points were reused.`);
  }), 'Create');
}
function sxRenumSolids() { if (!M.solids.size) { toast('There are no solids.'); return; } mutate('Renumber solids', () => { const arr = [...M.solids.values()].map(s => { const c = V.mul(s.n.map(nodeP).reduce((a, q) => V.add(a, q), [0, 0, 0]), 1 / 8); return [s, c]; }).sort((a, b) => a[1][2] - b[1][2] || a[1][1] - b[1][1] || a[1][0] - b[1][0]); M.solids = new Map(); arr.forEach(([s], i) => { s.id = i + 1; M.solids.set(s.id, s); }); M.next.s = arr.length + 1; }); toast('Solids renumbered by elevation, then Y, then X.'); }
function sxSolidVol(s) { const P = s.n.map(nodeP); const tets = [[0, 1, 3, 4], [1, 2, 3, 6], [1, 4, 5, 6], [3, 4, 6, 7], [1, 3, 4, 6]]; let v = 0; for (const [a, b, c, d] of tets) v += V.dot(V.sub(P[b], P[a]), V.cross(V.sub(P[c], P[a]), V.sub(P[d], P[a]))) / 6; return v; }
function sxSolidCheck(kind) {
  clearSel(); let n = 0;
  for (const s of M.solids.values()) { if (kind === 'neg') { if (sxSolidVol(s) <= 0) { S.sel.solids.add(s.id); n++; } } else { const P = s.n.map(nodeP); for (const f of [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]) { const q = f.map(k => P[k]); const nrm = V.norm(V.cross(V.sub(q[2], q[0]), V.sub(q[3], q[1]))); const d = Math.abs(V.dot(V.sub(q[1], q[0]), nrm)); const size = V.len(V.sub(q[2], q[0])) || 1; if (d / size > 0.01) { S.sel.solids.add(s.id); n++; break; } } } }
  afterSel(); toast(n ? `${n} solids ${kind === 'neg' ? 'have zero or negative volume (joint order reversed)' : 'have a warped face (more than 1% out of plane)'}; they are selected.` : `No ${kind === 'neg' ? 'negative-volume' : 'warped'} solids.`);
}
function sxPhysCreate() {
  if (!S.sel.beams.size) { toast('Select members; each run of collinear members becomes one physical member.'); return; }
  mutate('Physical members', () => { const done = new Set(); let n = 0; for (const id of S.sel.beams) { if (done.has(id)) continue; const ch = sxChain(id).filter(b => S.sel.beams.has(b)); ch.forEach(b => done.add(b)); M.pmembers.push({ id: (M.pmembers.reduce((a, p) => Math.max(a, p.id), 0)) + 1, beams: ch }); n++; } toast(`${n} physical members created.`); });
}

/* ---------------- sections: legacy names and tapered members ---------------- */
function sxLegacyDlg() {
  if (!S.sel.beams.size) { toast('Select the members first.'); return; }
  formDlg('Section by STAAD table name', [['nm', 'Table name, as in a STAAD file (for example W12X26 or PIPE 508x12.7)', 'text', '']], v => {
    const key = v.nm.replace(/\s+/g, '').toUpperCase(); const hits = []; let hit = null;
    for (const c of LIB) for (const s of c.series) for (const it of s.items) { const k = it.name.replace(/\s+/g, '').toUpperCase(); if (k === key) hit = [c, it]; else if (key && k.includes(key)) hits.push(it.name); }
    if (!hit) { toast(`${esc(v.nm)} is not in the section library.${hits.length ? ' Close matches: ' + esc(hits.slice(0, 6).join(', ')) : ''}`); return false; }
    mutate('Assign section', () => { const sid = addSection(hit[1], hit[1].name, hit[0].country, hit[0].staad); for (const id of S.sel.beams) M.beams.get(id).sec = sid; }); toast(`${hit[1].name} assigned to ${S.sel.beams.size} members.`);
  }, 'Assign');
}
function sxTaperDlg() {
  if (!S.sel.beams.size) { toast('Select the members to taper.'); return; }
  formDlg('Tapered member (stepped)', [['shape', 'Shape', 'select', [['I', 'I-section'], ['CHS', 'Tube (CHS)']]], ['h1', 'Depth or diameter at start (mm)', 'number', 600], ['h2', 'Depth or diameter at end (mm)', 'number', 300], ['b', 'Flange width (mm, I only)', 'number', 250], ['tw', 'Web or wall thickness (mm)', 'number', 12], ['tf', 'Flange thickness (mm, I only)', 'number', 20], ['n', 'Number of prismatic steps', 'number', 6]], v => mutate('Tapered member', () => {
    const n = Math.max(2, v.n | 0); let c = 0;
    for (const id of [...S.sel.beams]) {
      const b = M.beams.get(id); if (!b) continue; const a = nodeP(b.i), e = nodeP(b.j); const nodes = [b.i]; for (let k = 1; k < n; k++) { const p = V.add(a, V.mul(V.sub(e, a), k / n)); nodes.push(addNode(p[0], p[1], p[2])); } nodes.push(b.j);
      const newIds = [];
      for (let k = 0; k < n; k++) { const h = (+v.h1 + (+v.h2 - +v.h1) * (k + 0.5) / n) / 1000; const def = v.shape === 'I' ? { shape: 'I', h, b: +v.b / 1000, tw: +v.tw / 1000, tf: +v.tf / 1000 } : { shape: 'CHS', D: h, t: +v.tw / 1000 };
        const sid = addSection(def, v.shape === 'I' ? `I ${(h * 1000).toFixed(0)}x${(+v.b).toFixed(0)}x${(+v.tw).toFixed(1)}/${(+v.tf).toFixed(1)} (taper)` : `CHS Ø${(h * 1000).toFixed(0)}x${(+v.tw).toFixed(1)} (taper)`, 'Tapered step');
        const nid = newBeam(nodes[k], nodes[k + 1], b); M.beams.get(nid).sec = sid; M.beams.get(nid).rel = { s: k === 0 ? b.rel.s.slice() : relZero(), e: k === n - 1 ? b.rel.e.slice() : relZero() }; newIds.push(nid); }
      M.beams.delete(id); if (typeof loadsOnSplit === 'function') loadsOnSplit(id, newIds); c++;
    }
    toast(`${c} members replaced by ${n} prismatic steps each, with depths interpolated at mid-step. This is the usual stepped approximation of a taper.`);
  }), 'Create');
}

/* ---------------- supports that open the support dialog on their own tab ---------------- */
function sxSupTab(tab) { CMD.supCreate(); setTimeout(() => { const b = document.querySelector(`#dlgBody [data-st="${tab}"]`); if (b) b.click(); }, 0); toast(tab === 'foundation' ? 'Elastic footing: the model can hold it, but the server would treat it as fixed, so the pre-analysis check will stop the analysis until the backend supports it.' : 'One-way spring: the model can hold it, but the server solves it as a two-way spring, so the pre-analysis check will stop the analysis until the backend supports it.'); }

/* ---------------- loading generators ---------------- */
function sxScaleItem(it, f) { const c = JSON.parse(JSON.stringify(it)); if (c.F) c.F = c.F.map(x => x * f); if (c.w != null) c.w *= f; if (c.P != null) c.P *= f; if (c.p != null) c.p *= f; if (c.dt != null) c.dt *= f; if (c.k === 'sw') c.f *= f; return c; }
function sxRefDlg() {
  const refs = L().cases.filter(c => c.type === 'Reference'), prim = L().cases.filter(c => c.type !== 'Reference');
  openDlg('Reference load cases', `<p class="note" style="margin-top:0">A reference case holds loads once, for example an equipment layout. It is never analysed on its own. Add it into any primary case with a factor.</p>
    <div class="form"><label for="rfT">New reference case title</label><input id="rfT" value="Equipment layout">
    <label for="rfR">Reference case</label><select id="rfR">${refs.map(c => `<option value="${c.id}">${c.id}: ${esc(c.title)}</option>`).join('') || '<option value="">(none yet)</option>'}</select>
    <label for="rfC">Add into primary case</label><select id="rfC">${prim.map(c => `<option value="${c.id}">${c.id}: ${esc(c.title)}</option>`).join('') || '<option value="">(none)</option>'}</select>
    <label for="rfF">Factor</label><input id="rfF" type="number" value="1" step="any"></div>`,
    [['Close', () => true], ['Create reference case', () => { mutate('Reference load case', () => { newCase($('#rfT').value || 'Reference', 'Reference'); }); toast(`Reference case ${S.lc} created and active. Add loads to it from the Loading ribbon.`); return true; }], ['Add into case', () => {
      const r = L().cases.find(c => c.id === +$('#rfR').value), c = L().cases.find(x => x.id === +$('#rfC').value), f = +$('#rfF').value; if (!r || !c) { toast('Choose a reference case and a primary case.'); return false; }
      mutate('Add reference load', () => { for (const it of r.items) c.items.push(Object.assign(sxScaleItem(it, f), { src: `REF ${r.id} x ${f}` + (it.src ? ' ' + it.src : '') })); }); toast(`${r.items.length} loads from reference ${r.id} added into case ${c.id} with factor ${f}.`); return true; }, true]]);
}
function sxNodalWeights(extraCases) {
  const w = new Map(); const add = (n, v) => w.set(n, (w.get(n) || 0) + v); const miss = [];
  for (const b of M.beams.values()) { if (b.type === 'inactive') continue; const s = M.sections.get(b.sec), m = M.materials.get(b.mat); if (!s || !s.props || !m || !(m.rho > 0)) { miss.push(b.id); continue; } const W = s.props.A * beamLen(b) * m.rho * 9.80665 / 1000; add(b.i, W / 2); add(b.j, W / 2); }
  for (const p of M.plates.values()) { const m = M.materials.get(p.mat); if (!p.t || !m || !(m.rho > 0)) continue; const W = plateArea(p) * p.t * m.rho * 9.80665 / 1000; p.n.forEach(n => add(n, W / p.n.length)); }
  const up = M.up === 'Y' ? 1 : 2;
  for (const [cid, f] of extraCases) { const c = L().cases.find(x => x.id === cid); if (!c) continue; for (const it of c.items) { if (it.k === 'node') add(it.node, Math.abs(it.F[up]) * f); else if (it.k === 'uni' && M.beams.has(it.beam)) { const b = M.beams.get(it.beam); const Lb = it.d2 != null ? it.d2 - (it.d1 || 0) : beamLen(b); const W = Math.abs(it.w) * Lb * f; add(b.i, W / 2); add(b.j, W / 2); } else if (it.k === 'con' && M.beams.has(it.beam)) { const b = M.beams.get(it.beam); add(b.i, Math.abs(it.P) * f / 2); add(b.j, Math.abs(it.P) * f / 2); } } }
  return { w, miss };
}
function sxSeismicDlg() {
  const dead = L().cases.filter(c => c.type !== 'Reference' && c.cat === 'G');
  formDlg('Seismic: equivalent lateral force (ASCE 7-16, 12.8)', [['dir', 'Direction', 'select', [['X', '+X'], [M.up === 'Y' ? 'Z' : 'Y', M.up === 'Y' ? '+Z' : '+Y']]], ['sds', 'SDS (g)', 'number', 0.2], ['sd1', 'SD1 (g)', 'number', 0.1], ['R', 'Response modification R', 'number', 3], ['ie', 'Importance factor Ie', 'number', 1], ['ct', 'Ct (0.0488 for "all other" systems)', 'number', 0.0488], ['x', 'x exponent', 'number', 0.75], ['inc', `Add these load cases to the seismic weight: ${dead.map(c => c.id).join(' ') || 'none'} (factors)`, 'text', dead.map(c => c.id + ':1').join(' ')]], v => {
    const up = M.up === 'Y' ? 1 : 2; const sup = [...M.supports.keys()].filter(n => M.nodes.has(n)); if (!sup.length) { toast('Define supports first; the base level is taken from them.'); return false; }
    const base = Math.min(...sup.map(n => nodeP(n)[up])); const hn = Math.max(...[...M.nodes.keys()].map(n => nodeP(n)[up])) - base; if (!(hn > 0)) { toast('The structure has no height above its supports.'); return false; }
    const extra = String(v.inc).split(/\s+/).filter(Boolean).map(t => t.split(':')).map(([a, f]) => [+a, f == null ? 1 : +f]).filter(([a]) => a);
    const { w, miss } = sxNodalWeights(extra); if (miss.length) { toast(`${miss.length} members have no section, material or density, so their weight is unknown. Fix them first (members ${sxList(miss, 8)}).`); return false; }
    const W = [...w.values()].reduce((a, b) => a + b, 0); const Ta = v.ct * Math.pow(hn, v.x); const T = Ta; /* approximate period; a modal period may be used up to Cu*Ta once modal results feed this */
    let Cs = v.sds / (v.R / v.ie); Cs = Math.min(Cs, v.sd1 / (T * (v.R / v.ie))); Cs = Math.max(Cs, 0.044 * v.sds * v.ie, 0.01);
    const V0 = Cs * W; const k = T <= 0.5 ? 1 : T >= 2.5 ? 2 : 1 + (T - 0.5) / 2;
    let den = 0; for (const [n, wi] of w) den += wi * Math.pow(Math.max(0, nodeP(n)[up] - base), k);
    const di = { X: 0, Y: 1, Z: 2 }[v.dir];
    mutate('Seismic load', () => { const c = newCase(`Seismic ELF +${v.dir} (ASCE 7-16 12.8)`, 'Seismic'); for (const [n, wi] of w) { const h = Math.max(0, nodeP(n)[up] - base); if (h <= 1e-9 || !den) continue; const F = relZero(); F[di] = V0 * wi * Math.pow(h, k) / den; if (Math.abs(F[di]) > 1e-9) c.items.push({ k: 'node', node: n, F, src: `Seismic ELF ${v.dir}` }); } });
    const msg = `Seismic case created. hn ${fx(hn, 2)} m, Ta ${fx(Ta, 3)} s, Cs ${fx(Cs, 4)}, W ${fx(W, 1)} kN, base shear V ${fx(V0, 1)} kN, k ${fx(k, 2)}. Generated from your inputs; check them against the governing code.`;
    log(msg); toast(msg);
  }, 'Generate');
}
function sxSnowDlg() {
  formDlg('Snow load (ASCE 7-16, flat roof)', [['pg', 'Ground snow load pg (kN/m²)', 'number', 1.0], ['ce', 'Exposure factor Ce', 'number', 1.0], ['ct', 'Thermal factor Ct', 'number', 1.0], ['is', 'Importance factor Is', 'number', 1.0], ['trib', `Tributary width for selected members (${uL()})`, 'number', 1], ['new', 'Put in a new load case', 'checkbox', true]], v => {
    if (!S.sel.beams.size && !S.sel.plates.size) { toast('Select the roof members or roof plates first.'); return false; }
    const pf = 0.7 * v.ce * v.ct * v.is * v.pg;
    mutate('Snow load', () => { if (v.new || !curCase()) newCase(`Snow pf ${fx(pf, 3)} kN/m2`, 'Snow'); const c = curCase(); const d = downDir();
      for (const id of S.sel.beams) c.items.push({ k: 'uni', beam: id, dir: d, w: -pf * frU(+v.trib), d1: null, d2: null }); for (const id of S.sel.plates) c.items.push({ k: 'pr', plate: id, dir: d, p: -pf }); });
    toast(`Snow: pf = 0.7 Ce Ct Is pg = ${fx(pf, 3)} kN/m², applied to ${S.sel.beams.size} members and ${S.sel.plates.size} plates. Drift and sliding are not included.`);
  }, 'Apply');
}
function sxVehicleDlg() {
  if (!S.sel.beams.size) { toast('Select the members the vehicle runs along, end to end.'); return; }
  const ids = [...S.sel.beams]; const deg = new Map(); for (const id of ids) { const b = M.beams.get(id); deg.set(b.i, (deg.get(b.i) || 0) + 1); deg.set(b.j, (deg.get(b.j) || 0) + 1); }
  const ends = [...deg.entries()].filter(([, d]) => d === 1).map(([n]) => n); if (ends.length !== 2 || [...deg.values()].some(d => d > 2)) { toast('The selected members must form one continuous line with two ends.'); return; }
  const path = []; let n = ends[0]; const left = new Set(ids); while (left.size) { const id = [...left].find(i => { const b = M.beams.get(i); return b.i === n || b.j === n; }); if (!id) break; left.delete(id); const b = M.beams.get(id); const rev = b.j === n; path.push({ id, rev, L: beamLen(b) }); n = rev ? b.i : b.j; }
  const total = path.reduce((a, p) => a + p.L, 0);
  formDlg('Vehicle load generator', [['P', 'Axle loads (kN), front to back', 'text', '100 100 50'], ['s', `Axle spacings (${uL()})`, 'text', '4 1.2'], ['step', `Step (${uL()})`, 'number', 1]], v => {
    const P = String(v.P).split(/\s+/).filter(Boolean).map(Number), sp = String(v.s).split(/\s+/).filter(Boolean).map(x => frU(+x)); if (P.length < 1 || sp.length !== P.length - 1 || P.some(x => !Number.isFinite(x))) { toast('Give one spacing fewer than axles.'); return false; }
    const off = [0]; sp.forEach(s => off.push(off[off.length - 1] + s)); const len = off[off.length - 1]; const step = Math.max(frU(+v.step), 0.01); const nPos = Math.floor((total + len) / step) + 1;
    if (nPos > 200) { toast(`That would make ${nPos} load cases. Use a larger step.`); return false; }
    mutate('Vehicle loads', () => { for (let k = 0; k < nPos; k++) { const x0 = k * step; const c = newCase(`Vehicle position ${k + 1} (front at ${fx(toU(x0), 2)} ${uL()})`, 'Vehicle'); P.forEach((p, ai) => { let s = x0 - off[ai]; if (s < 0 || s > total) return; for (const seg of path) { if (s <= seg.L + 1e-9) { c.items.push({ k: 'con', beam: seg.id, dir: downDir(), P: -p, d: seg.rev ? seg.L - s : s, src: `Vehicle axle ${ai + 1}` }); break; } s -= seg.L; } }); } });
    toast(`${nPos} vehicle load cases created, one per position. Each uses concentrated member loads, which the analysis server cannot apply yet: the pre-analysis check will say so until the backend is updated.`);
  }, 'Generate');
}

/* ---------------- annotations, tags, groups, restraints, views ---------------- */
function sxTextDlg(i) { const t = M.texts[i]; openDlg('Text', `<div class="form"><label for="txT">Text</label><input id="txT" value="${esc(t.text)}"></div>`, [['Delete', () => { mutate('Delete text', () => M.texts.splice(i, 1)); }], ['Cancel', () => true], ['Save', () => { const v = $('#txT').value; mutate('Edit text', () => { M.texts[i].text = v; }); }, true]]); }
function sxInsertText() { formDlg('Insert text', [['t', 'Text', 'text', '']], v => { if (!v.t.trim()) return false; S.sxPlaceText = v.t.trim(); S.sxTextCur = false; setTool('select'); toast('Click a joint or the grid to place the text.'); }, 'Place'); }
function sxTagsDlg() {
  const rows = Object.entries(M.ctags);
  openDlg('Connection tags', `<div class="form"><label for="tgT">Tag for the ${S.sel.nodes.size} selected joints</label><input id="tgT" value="K-joint"></div>
    <div class="tblw" style="max-height:220px;margin-top:8px"><table><thead><tr><th>Joint</th><th>Tag</th><th></th></tr></thead><tbody>${rows.map(([n, t]) => `<tr><td>${n}</td><td>${esc(t)}</td><td><button class="btn" type="button" data-tgd="${n}" style="min-width:0;padding:1px 8px">Remove</button></td></tr>`).join('') || '<tr><td colspan="3" class="muted">No tags yet</td></tr>'}</tbody></table></div>`,
    [['Close', () => true], ['Tag selected joints', () => { if (!S.sel.nodes.size) { toast('Select joints first.'); return false; } const t = $('#tgT').value.trim(); mutate('Connection tags', () => { for (const n of S.sel.nodes) M.ctags[n] = t; }); }, true]]);
  $$('[data-tgd]').forEach(b => b.addEventListener('click', () => { mutate('Remove tag', () => { delete M.ctags[b.dataset.tgd]; }); dlg.close(); sxTagsDlg(); }));
}
function sxGroupsDlg() {
  const G2 = M.groups; const kindOf = () => S.sel.beams.size ? 'beams' : S.sel.nodes.size ? 'nodes' : S.sel.plates.size ? 'plates' : null;
  openDlg('Groups', `<div class="form"><label for="grN">Name for a new group from the selection</label><input id="grN" value="GROUP${G2.length + 1}"></div>
    <div class="tblw" style="max-height:260px;margin-top:8px"><table><thead><tr><th>Group</th><th>Kind</th><th>Count</th><th></th></tr></thead><tbody>${G2.map((g, i) => `<tr><td>_${esc(g.name)}</td><td>${g.kind}</td><td>${g.ids.length}</td><td><button class="btn" type="button" data-gs="${i}" style="min-width:0;padding:1px 8px">Select</button> <button class="btn" type="button" data-gd="${i}" style="min-width:0;padding:1px 8px">Delete</button></td></tr>`).join('') || '<tr><td colspan="4" class="muted">No groups yet</td></tr>'}</tbody></table></div>
    <p class="note">Groups are written to the command file as START GROUP DEFINITION and read back from it.</p>`,
    [['Close', () => true], ['Create from selection', () => { const k = kindOf(); if (!k) { toast('Select members, joints or plates first.'); return false; } const nm = $('#grN').value.trim().replace(/\s+/g, '_') || 'GROUP'; mutate('Create group', () => { M.groups.push({ name: nm, kind: k, ids: [...S.sel[k]] }); }); toast(`Group _${nm} created with ${S.sel[k].size} ${k}.`); }, true]]);
  $$('[data-gs]').forEach(b => b.addEventListener('click', () => { const g = G2[+b.dataset.gs]; dlg.close(); clearSel(); g.ids.forEach(id => S.sel[g.kind].add(id)); afterSel(); }));
  $$('[data-gd]').forEach(b => b.addEventListener('click', () => { mutate('Delete group', () => { M.groups.splice(+b.dataset.gd, 1); }); dlg.close(); sxGroupsDlg(); }));
}
function sxRestrDlg() {
  if (!S.sel.beams.size) { toast('Select the members first.'); return; }
  const r0 = M.restr[[...S.sel.beams][0]] || {};
  formDlg('Member restraints (buckling lengths)', [['ly', `Unbraced length about local y, LY (${uL()}, 0 = member length)`, 'number', r0.ly ? toU(r0.ly) : 0], ['lz', `Unbraced length about local z, LZ (${uL()})`, 'number', r0.lz ? toU(r0.lz) : 0], ['ky', 'Effective length factor KY', 'number', r0.ky || 1], ['kz', 'Effective length factor KZ', 'number', r0.kz || 1]],
    v => mutate('Member restraints', () => { for (const id of S.sel.beams) M.restr[id] = { ly: frU(+v.ly), lz: frU(+v.lz), ky: +v.ky, kz: +v.kz }; toast(`Restraints stored for ${S.sel.beams.size} members. They are used by the code checks when those are built, and are kept in the command file.`); }), 'Apply');
}
function sxViewDlg(mode) {
  if (mode === 'new') { formDlg('New view', [['n', 'Name', 'text', `View ${M.views.length + 1}`]], v => { mutate('Save view', () => { M.views.push({ name: v.n, cam: JSON.parse(JSON.stringify(cam)), persp: !!S.persp }); }); toast(`View "${esc(v.n)}" saved.`); }, 'Save'); return; }
  if (!M.views.length) { toast('No saved views yet. Use New View to save the current one.'); return; }
  openDlg(mode === 'open' ? 'Open view' : 'View management', `<div class="tblw" style="max-height:300px"><table><tbody>${M.views.map((v, i) => `<tr><td>${esc(v.name)}</td><td><button class="btn" type="button" data-vo="${i}" style="min-width:0;padding:1px 8px">Open</button> ${mode === 'mgmt' ? `<button class="btn" type="button" data-vr="${i}" style="min-width:0;padding:1px 8px">Rename</button> <button class="btn" type="button" data-vd="${i}" style="min-width:0;padding:1px 8px">Delete</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`, [['Close', () => true]]);
  $$('[data-vo]').forEach(b => b.addEventListener('click', () => { const v = M.views[+b.dataset.vo]; Object.assign(cam, JSON.parse(JSON.stringify(v.cam))); S.persp = v.persp; BAS = basis(); dlg.close(); renderRibbon(); draw(); }));
  $$('[data-vd]').forEach(b => b.addEventListener('click', () => { mutate('Delete view', () => M.views.splice(+b.dataset.vd, 1)); dlg.close(); sxViewDlg('mgmt'); }));
  $$('[data-vr]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.vr; dlg.close(); formDlg('Rename view', [['n', 'Name', 'text', M.views[i].name]], v => mutate('Rename view', () => { M.views[i].name = v.n; }), 'Save'); }));
}
/* tooltips */
S.sxTip = 'full';
const _showTip20 = showTip;
showTip = function () { _showTip20(); const t = $('#tip'); if (S.sxTip === 'off' && S.tool === 'select' && S.hover) t.hidden = true; if (S.sxTip === 'full' && S.hover && S.hover.k === 'beams' && S.tool === 'select') { const b = M.beams.get(S.hover.id); const s = b && M.sections.get(b.sec); if (s && s.props) t.innerHTML += ` · A ${fx(s.props.A * 1e4, 1)} cm² · Iz ${fx(s.props.I1 * 1e8, 0)} cm⁴${M.restr[b.id] ? ' · LY ' + fx(M.restr[b.id].ly, 2) : ''}`; } };
function sxTipDlg() { formDlg('Structural tooltip options', [['m', 'Hover tooltip', 'select', [['full', 'Show, with section properties'], ['basic', 'Show basic information'], ['off', 'Do not show']]]], v => { S.sxTip = v.m; toast('Tooltip setting changed.'); }, 'Apply'); setTimeout(() => { const f = $('#f_m'); if (f) f.value = S.sxTip; }, 0); }

/* drawing: texts, tags and physical members on top of the model */
const _drawLoads20 = drawLoads;
drawLoads = function () {
  _drawLoads20();
  if (!M.texts.length && !Object.keys(M.ctags).length) return;
  ctx.save(); ctx.font = '600 12px ' + cssv('--font');
  ctx.fillStyle = '#0B5A35'; for (const t of M.texts) { const q = proj(t.p); ctx.fillText(t.text, q[0] + 4, q[1] - 4); ctx.fillRect(q[0] - 2, q[1] - 2, 4, 4); }
  ctx.fillStyle = '#8A4B00'; for (const [n, t] of Object.entries(M.ctags)) { if (!M.nodes.has(+n)) continue; const q = proj(nodeP(+n)); ctx.fillText('◆ ' + t, q[0] + 6, q[1] + 14); }
  ctx.restore();
};

/* ---------------- utilities: calculator, video, macros, error log, help ---------------- */
function sxCalcDlg() {
  openDlg('Calculator', `<div class="form" style="grid-template-columns:max-content 320px"><label for="clE">Expression</label><input id="clE" placeholder="e.g. 0.7*1.0*1.2*sqrt(2) or PI*0.5^2/4" style="font-family:Consolas,monospace"><label>Result</label><output id="clR" style="font:600 15px Consolas,monospace">—</output></div>
    <p class="note">Operators + - * / ^ and parentheses; functions sqrt, sin, cos, tan (radians), asin, acos, atan, log (natural), log10, exp, abs, min, max, PI, E.</p>`, [['Close', () => true]]);
  const run = () => { const s = $('#clE').value; if (!/^[\d\s+\-*/().,^a-zA-Z_]*$/.test(s)) { $('#clR').textContent = 'Only numbers, operators and functions are allowed.'; return; } try { const names = Object.getOwnPropertyNames(Math); const f = new Function(...names, `"use strict"; return (${s.replace(/\^/g, '**')});`); const r = f(...names.map(n => Math[n])); $('#clR').textContent = Number.isFinite(r) ? (+r.toPrecision(10)).toString() : 'Not a number'; } catch (e) { $('#clR').textContent = s ? 'Incomplete expression' : '—'; } };
  $('#clE').addEventListener('input', run); $('#clE').focus();
}
async function sxRecord() {
  const cv0 = $('#cv'); if (!cv0.captureStream || typeof MediaRecorder === 'undefined') { toast('This browser cannot record the view.'); return; }
  const st = cv0.captureStream(30); const rec = new MediaRecorder(st, { mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm' }); const chunks = [];
  rec.ondataavailable = e => chunks.push(e.data); rec.onstop = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' })); a.download = (M.name || 'model').replace(/\.[^.]+$/, '') + '_orbit.webm'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); toast('Video saved (.webm, plays in any browser and in VLC).'); };
  rec.start(); toast('Recording a 6-second orbit of the view…'); const y0 = cam.yaw, t0 = performance.now();
  const tick = () => { const t = (performance.now() - t0) / 6000; if (t >= 1) { cam.yaw = y0; draw(); rec.stop(); return; } cam.yaw = y0 + t * Math.PI * 2; BAS = basis(); drawNow(); requestAnimationFrame(tick); }; tick();
}
function sxMacroEd(i) {
  const m = i != null ? M.macros[i] : { name: `Macro ${M.macros.length + 1}`, lines: '' };
  openDlg('Macro editor', `<div class="form" style="grid-template-columns:max-content 420px"><label for="mcN">Name</label><input id="mcN" value="${esc(m.name)}"></div>
    <textarea id="mcL" spellcheck="false" style="width:100%;height:240px;margin-top:8px;font:12px/1.4 Consolas,monospace;border:1px solid #ADADAD;padding:6px">${esc(m.lines)}</textarea>
    <p class="note">One command per line, run in order. Use any command name from the Search box, for example <code>cur:beams</code>, <code>selAll</code>, <code>v:iso</code>, <code>sx:b:all</code>, or <code>select beams 1 TO 20</code>. Lines starting with * are comments.</p>`,
    [['Cancel', () => true], ['Run', () => { sxMacroRun($('#mcL').value); return true; }], ['Save', () => { const o = { name: $('#mcN').value, lines: $('#mcL').value }; mutate('Save macro', () => { if (i != null) M.macros[i] = o; else M.macros.push(o); }); }, true]]);
}
function sxMacroRun(text) {
  let n = 0;
  for (const raw of String(text).split(/\r?\n/)) { const l = raw.trim(); if (!l || l.startsWith('*')) continue; const m = l.match(/^select\s+(nodes|joints|beams|members|plates|solids)\s+(.*)$/i);
    if (m) { const k = { nodes: 'nodes', joints: 'nodes', beams: 'beams', members: 'beams', plates: 'plates', solids: 'solids' }[m[1].toLowerCase()]; clearSel(); parseList(m[2]).forEach(id => S.sel[k].add(id)); afterSel(); n++; continue; }
    try { sxRun(l); n++; } catch (e) { toast(`Macro stopped at "${esc(l)}": ${esc(e.message)}`); return; } }
  toast(`Macro ran ${n} commands.`);
}
function sxMacrosDlg() { if (!M.macros.length) { sxMacroEd(); return; } openDlg('Macros', `<div class="tblw"><table><tbody>${M.macros.map((m, i) => `<tr><td>${esc(m.name)}</td><td><button class="btn" type="button" data-mr="${i}" style="min-width:0;padding:1px 8px">Run</button> <button class="btn" type="button" data-me="${i}" style="min-width:0;padding:1px 8px">Edit</button> <button class="btn" type="button" data-md="${i}" style="min-width:0;padding:1px 8px">Delete</button></td></tr>`).join('')}</tbody></table></div>`, [['Close', () => true], ['New macro', () => { setTimeout(() => sxMacroEd(), 0); return true; }, true]]);
  $$('[data-mr]').forEach(b => b.addEventListener('click', () => { dlg.close(); sxMacroRun(M.macros[+b.dataset.mr].lines); })); $$('[data-me]').forEach(b => b.addEventListener('click', () => { dlg.close(); sxMacroEd(+b.dataset.me); })); $$('[data-md]').forEach(b => b.addEventListener('click', () => { mutate('Delete macro', () => M.macros.splice(+b.dataset.md, 1)); dlg.close(); sxMacrosDlg(); })); }
S.errLog = [];
const _toast20 = toast;
toast = function (msg) { _toast20(msg); const t = String(msg).replace(/<[^>]+>/g, ''); if (/cannot|could not|error|failed|missing|not in the|no supports|not defined|stopped/i.test(t)) { S.errLog.unshift(new Date().toLocaleTimeString() + '  ' + t); if (S.errLog.length > 300) S.errLog.pop(); } };
function sxErrLog() { openDlg('Error log', `<pre style="max-height:60vh;overflow:auto;font:12px/1.45 Consolas,monospace;margin:0;white-space:pre-wrap">${esc(S.errLog.join('\n') || 'No errors recorded in this session.')}</pre>`, [['Clear', () => { S.errLog = []; }], ['Close', () => true, true]]); }
function sxHelpDlg() {
  openDlg('GeoSoft Structural Modeller: help', `<div style="max-width:640px;font-size:13px;line-height:1.5">
    <p><b>Workflow.</b> Work left to right along the bar under the ribbon: Geometry, Properties, Materials, Specifications, Supports, Loading, Analysis. A tick means the step is complete; a number shows how many problems it has. The analysis runs only when every step is ticked, and results open in Postprocessing only after a successful run on the current model.</p>
    <p><b>Command file.</b> Utilities, Command File shows the model as STAAD commands. It follows every change you make on screen. Type in it and press Apply to Model (Ctrl+Enter) to change the model; Validate reports errors by line number.</p>
    <p><b>Mouse.</b> Left click selects; drag a window to select everything more than half inside it; Ctrl or Shift adds. Right-drag rotates, middle-drag or Shift+right-drag pans, the wheel zooms.</p>
    <p><b>Windows.</b> Drag a window by its title bar, resize it from any edge or corner, double-click the title to maximise. View, Windows arranges them again.</p>
    <p><b>Keys.</b> Ctrl+Z undo, Ctrl+Y redo, Ctrl+A select all, Delete deletes, Esc ends a tool or a cursor assignment, Space opens the command search.</p></div>`, [['Close', () => true, true]]);
}

/* ---------------- wire it all into the ribbon ---------------- */
Object.assign(CMD, {
  sxBeamLayout, sxStretch, sxPlateLayout: () => sxRegion('Plate layout', false), sxParam: () => sxRegion('Parametric plate model', false), sxDeck: () => sxRegion('Deck plates', false), sxSolidLayout: () => sxRegion('Solid layout', true),
  sxMoveSolids: () => { if (!S.sel.solids.size) { toast('Select solids with the Solid Cursor first.'); return; } runCmd('move2'); }, sxRenumSolids,
  sxPhysCreate, sxPhysSelect: () => { if (!S.sel.beams.size) { toast('Select a member first.'); return; } sxExpandMembers(); }, sxPhysDrop: () => { if (!M.pmembers.length) { toast('There are no physical members.'); return; } mutate('Drop physical model', () => { M.pmembers = []; }); toast('Physical members removed; the analytical members are unchanged.'); },
  sxZoomWin: () => { S.sxZoomWin = true; setTool('select'); toast('Drag a window around the area to zoom to.'); }, sxOpenView: () => sxViewDlg('open'), sxNewView: () => sxViewDlg('new'), sxViewMgmt: () => sxViewDlg('mgmt'), sxTipOpt: sxTipDlg,
  sxMembersCur: () => { S.sxMembers = !S.sxMembers; S.sxTextCur = false; S.cursor = 'beams'; setTool('select'); toast(S.sxMembers ? 'Members cursor: clicking a member selects its whole collinear run.' : 'Members cursor off.'); }, sxTextCur: () => { S.sxTextCur = !S.sxTextCur; S.sxMembers = false; toast(S.sxTextCur ? 'Text cursor: click a text anchor to edit or delete it.' : 'Text cursor off.'); }, sxPrev: sxSelPrev, sxSelLoad: sxSelByLoad, sxHighlight, sxFilter: sxFilterDlg,
  sxConnB: () => sxConnected('beams'), sxConnN: () => sxConnected('nodes'), sxConnAll: () => sxConnected('all'), sxModes: () => sxShowGeneric(sxPtabKey('Frequencies', 'selection'), 'Modes'),
  sxLegacy: sxLegacyDlg, sxTaper: sxTaperDlg, sxFound: () => sxSupTab('foundation'), sxOneWay: () => sxSupTab('tcspring'),
  sxRef: sxRefDlg, sxVehicle: sxVehicleDlg, sxSnow: sxSnowDlg, sxSeismic: sxSeismicDlg,
  sxRestr: sxRestrDlg, sxGroups: sxGroupsDlg, sxInsText: sxInsertText, sxTags: sxTagsDlg, sxCalc: sxCalcDlg, sxAvi: sxRecord, sxMacroEd: () => sxMacroEd(), sxMacros: sxMacrosDlg, sxErrLog, sxHelp: sxHelpDlg,
  sxNegVol: () => sxSolidCheck('neg'), sxWarpSol: () => sxSolidCheck('warp')
});
const _sxRun20 = sxRun;
sxRun = function (id, btn) {
  for (const [k, src] of [['nodes', M.nodes], ['beams', M.beams], ['plates', M.plates], ['solids', M.solids]]) for (const i of [...S.sel[k]]) if (!src.has(i)) S.sel[k].delete(i);
  if (id === 'sx:cmdfile') { sxOpenCmd(); return; }
  if (id === 'sx:aout') { CMD.sxOutput(); return; }
  if (id === 'sx:alog') { sxShowGeneric('log', 'Analysis Log'); return; }
  return _sxRun20(id, btn);
};
function sxSwap(oldId, item) { for (const t of Object.values(SXR)) for (const g of (t.groups || [])) if (g.it) { const k = g.it.findIndex(x => x[1] === oldId); if (k >= 0) g.it[k] = item; } }
sxSwap('x:beamLayout', ['S', 'sxBeamLayout', 'Beam Layout', 'beamlayout']); sxSwap('x:stretch', ['S', 'sxStretch', 'Stretch Beam', 'stretch']);
sxSwap('x:plateLayout', ['S', 'sxPlateLayout', 'Plate Layout', 'platelayout']); sxSwap('x:param', ['S', 'sxParam', 'Parametric Models', 'parametric']);
sxSwap('x:solidLayout', ['S', 'sxSolidLayout', 'Solid Layout', 'solidlayout']); sxSwap('x:moveSolid', ['S', 'sxMoveSolids', 'Move Solids', 'movenode']); sxSwap('x:renSolid', ['S', 'sxRenumSolids', 'Renumber Solids', 'renum']);
sxSwap('x:phys', ['L', 'm:phys', 'Physical\nMember', 'physical', { menu: [['sxPhysCreate', 'Create from selected members'], ['sxPhysSelect', 'Select whole collinear runs'], ['sxPhysDrop', 'Remove all physical members']] }]);
sxSwap('x:deck', ['L', 'm:deck', 'Composite\nDeck', 'deck', { menu: [['sxDeck', 'Deck plates over a region…'], ['mesh', 'Mesh between 4 picked joints…']] }]);
sxSwap('x:zoomwin', ['L', 'sxZoomWin', 'Zoom\nWindow', 'zoomwin']); sxSwap('x:openview', ['S', 'sxOpenView', 'Open View', 'openview']); sxSwap('x:newview', ['S', 'sxNewView', 'New View', 'newview']);
sxSwap('x:viewmgmt', ['L', 'sxViewMgmt', 'View\nManagement', 'viewmgmt']); sxSwap('x:tipopt', ['S', 'sxTipOpt', 'Structural Tooltip Options', 'tooltip']);
sxSwap('x:members', ['S', 'sxMembersCur', 'Members', 'members']); sxSwap('x:text', ['S', 'sxTextCur', 'Text', 'text']); sxSwap('x:previous', ['S', 'sxPrev', 'Previous', 'previous']); sxSwap('x:sload', ['S', 'sxSelLoad', 'Load', 'loadsel']);
sxSwap('x:gconn', ['S', 'm:gconn', 'Connected', 'connected', { menu: [['sxConnB', 'Members connected to the selection'], ['sxConnN', 'Joints of the selection'], ['sxConnAll', 'Everything connected to the selection']] }]);
sxSwap('x:bconn', ['S', 'm:bconn', 'Connected', 'connected', { menu: [['sxConnB', 'Members connected to the selection'], ['sxConnAll', 'Everything connected to the selection']] }]);
sxSwap('x:highlight', ['S', 'sxHighlight', 'Highlight', 'highlight']); sxSwap('x:filter', ['L', 'sxFilter', 'Filter', 'pointer']); sxSwap('x:modes', ['L', 'sxModes', 'Modes', 'pointer']);
sxSwap('x:legacy', ['L', 'sxLegacy', 'Legacy', 'legacy']); sxSwap('x:tapered', ['L', 'sxTaper', 'Tapered', 'tapered']); sxSwap('x:shape', ['L', 'secDef', 'Shape\nEditor', 'shape']);
sxSwap('x:found', ['S', 'sxFound', 'Foundation', 'foundation']); sxSwap('x:oneway', ['S', 'sxOneWay', 'One Way Spring', 'oneway']);
sxSwap('x:refcase', ['L', 'sxRef', 'Reference\nLoad Case', 'refcase']); sxSwap('x:vehgen', ['L', 'sxVehicle', 'Vehicle\nLoad Generator', 'vehicle']); sxSwap('x:veh', ['S', 'sxVehicle', 'Vehicle', 'vehicle']);
sxSwap('x:snow', ['S', 'sxSnow', 'Snow', 'snow']); sxSwap('x:seis', ['S', 'm:seis', 'Seismic', 'seismic', { menu: [['sxSeismic', 'Equivalent lateral force (ASCE 7-16 12.8)…'], ['x:rs', 'Response spectrum (needs the backend)', 'Response spectrum needs a modal combination on the server. Listed as backend work.']] }]);
sxSwap('x:restr', ['S', 'sxRestr', 'Member Restraints', 'restraint']); sxSwap('x:groups', ['L', 'sxGroups', 'Groups', 'groups']); sxSwap('x:dropphys', ['L', 'sxPhysDrop', 'Drop\nPhysical Model', 'dropphys']);
sxSwap('x:instext', ['L', 'sxInsText', 'Insert\nText', 'inserttext']); sxSwap('x:elog', ['S', 'sxErrLog', 'Error Log', 'elog']); sxSwap('x:conntags', ['L', 'sxTags', 'Connection\nTags', 'conntags']);
sxSwap('x:calc', ['L', 'sxCalc', 'Calculator', 'calc']); sxSwap('x:avi', ['S', 'sxAvi', 'Record Video', 'avi']); sxSwap('x:macroed', ['L', 'sxMacroEd', 'Macro\nEditor', 'macroed']); sxSwap('x:macros', ['L', 'sxMacros', 'Macros', 'macros']);
sxSwap('x:usertools', ['L', 'm:ut', 'User Tools', 'usertools', { menu: [['sxMacros', 'Run a saved macro…'], ['sxMacroEd', 'New macro…'], ['palette', 'Command search']] }]);
/* honest backend-dependent items keep their reason, now naming the backend */
const BK = ' Needs backend work, listed in the hand-off.';
sxSwap('x:nspec', ['L', 'x:nspec', 'Node', 'specnode', { dis: 'Node specifications (master/slave, rigid links by joint) need the solver to support constraint equations.' + BK, menu: [] }]);
sxSwap('x:pspec', ['L', 'x:pspec', 'Plate', 'specplate', { dis: 'Plate releases need the shell element to support them.' + BK, menu: [] }]);
sxSwap('x:mass', ['L', 'x:mass', 'Mass Model\nGenerator', 'mass', { dis: 'Converting loads to masses needs the modal solver to accept extra masses.' + BK }]);
sxSwap('x:direct', ['S', 'x:direct', 'Direct Analysis', 'direct', { dis: 'Direct analysis needs P-Delta and stiffness reduction in the solver.' + BK }]);
sxSwap('x:push', ['S', 'x:push', 'Pushover', 'pushover', { dis: 'Pushover needs plastic hinges and an incremental solver.' + BK }]);
sxSwap('x:thist', ['L', 'x:thist', 'Time\nHistory', 'thist', { dis: 'Time history needs a Newmark integrator on the server.' + BK, menu: [] }]);
sxSwap('x:damp', ['L', 'x:damp', 'Modal\nDamping', 'damping', { dis: 'Damping only matters for dynamic response analysis, which needs the time-history or spectrum solver.' + BK }]);
sxSwap('x:encl', ['L', 'x:encl', 'Enclosed\nZone', 'enclosed', { dis: 'Enclosed zones for wind on clad modules are not built yet. Use Deck Area or Wind with member loads for now.' }]);
/* Analysis tab: the commands, the checklist, then results that need a valid analysis */
SXR.analysis.groups[0].it = [['L', 'sxDefCmd', 'Define\nCommands', 'designp'], ['L', 'sxCheck', 'Pre-analysis\nCheck', 'codecheck'], ['L', 'runAna', 'Run\nAnalysis', 'run'], ['L', 'sxOutput', 'Analysis\nOutput', 'output', { need: 'res' }], ['S', 'sxCmdFile', 'Command File', 'cmdfile'], ['S', 'netCheck', 'Test Connection', 'plug'], ['S', 'srvSet', 'Server Settings', 'gear']];
for (const g of SXR.analysis.groups) if (g.n === 'Results') g.it = g.it.map(x => x[1] === 'legend' ? x : [x[0], x[1], x[2], x[3], Object.assign({}, x[4] || {}, { need: 'res' })]);
for (const g of SXR.analysis.groups) if (g.n === 'Analysis') g.it.push(['S', 'srvCross', 'Cross-check (PyNite)', 'cross']);
sxSwap('resReport', ['L', 'sxOutput', 'Analysis\nOutput', 'output', { need: 'res' }]);
sxSwap('sx:cmdfile', ['L', 'sxCmdFile', 'Command\nFile', 'cmdfile']);
/* plate and solid tool menus: the greyed entries now work */
for (const t of Object.values(SXR)) for (const g of (t.groups || [])) for (const it of (g.it || [])) { const o = it[4]; if (!o || !Array.isArray(o.menu)) continue; o.menu = o.menu.map(m => m[0] === 'x:pc' ? ['utilConn', 'Plate Connectivity'] : m[0] === 'x:nv' ? ['sxNegVol', 'Negative Volume'] : m[0] === 'x:ws' ? ['sxWarpSol', 'Warped Solids'] : m); }
$('#sxHelp').title = 'Help'; $('#sxHelp').replaceWith($('#sxHelp').cloneNode(true)); $('#sxHelp').addEventListener('click', () => sxHelpDlg());
/* File backstage gets Job Information */
const _back20 = sxBackstage;
sxBackstage = function (open, page) { _back20(open, page); if (!open) return; const nav = document.querySelector('#sxBack nav'); if (nav && !nav.querySelector('[data-bp=job]')) { const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Job Information'; b.addEventListener('click', () => { sxBackstage(false); sxJobDlg(); }); nav.insertBefore(b, nav.children[4]); } };
/* Esc also ends the text placement, text and members cursors */
document.addEventListener('keydown', e => { if (e.key === 'Escape') { S.sxPlaceText = null; S.sxZoomWin = false; } });

/* ---------------- start ---------------- */
sxDefaults(M); renderRibbon(); sxRenderWf(); sxLayout(); updateStatus();

/* ---------------- loads first, assignment second (as in STAAD) ----------------
   Add… creates the load in a load case with its values only. It is "not assigned"
   until joints, members or plates are selected and Assign is pressed.
   Self-weight starts on the whole structure and can be limited to a list. */
function sxLdFields(kind, v) {
  const f = uF(), l = uL();
  const dirsM = [['GZ', 'Global Z'], ['GY', 'Global Y'], ['GX', 'Global X'], ['Z', 'Local z'], ['Y', 'Local y'], ['X', 'Local x']];
  const down = downDir();
  const order = d => [d, ...dirsM.filter(x => x[0] !== d[0])];
  if (kind === 'sw') return [['dir', 'Direction', 'select', [[M.up, `${M.up} (vertical)`], ...['X', 'Y', 'Z'].filter(x => x !== M.up).map(x => [x, x])]], ['f', 'Factor (negative acts downward)', 'number', v ? v.f : -1]];
  if (kind === 'node') return DOF.map((d, k) => [d, `${d} (${k < 3 ? f : f + '·' + l})`, 'number', v ? +(k < 3 ? toUF(v.F[k]) : toUF(v.F[k]) / UL().f).toFixed(6) : (d === (M.up === 'Y' ? 'FY' : 'FZ') ? -10 : 0)]);
  if (kind === 'uni') return [['dir', 'Direction', 'select', order(dirsM.find(x => x[0] === (v ? v.dir : down)))], ['w', `Load w (${f}/${l})`, 'number', v ? +(toUF(v.w) * UL().f).toFixed(6) : -5], ['d1', `Starts at (${l} from the start; blank = whole length)`, 'text', v && v.d1 != null ? +toU(v.d1).toFixed(4) : ''], ['d2', `Ends at (${l}; blank = member end)`, 'text', v && v.d2 != null ? +toU(v.d2).toFixed(4) : '']];
  if (kind === 'con') return [['dir', 'Direction', 'select', order(dirsM.find(x => x[0] === (v ? v.dir : down)))], ['P', `Load P (${f})`, 'number', v ? +toUF(v.P).toFixed(6) : -10], ['d', `At distance from the start (${l})`, 'number', v ? +toU(v.d || 0).toFixed(4) : 0]];
  if (kind === 'pr') return [['dir', 'Direction', 'select', [[down, `Global ${down[1]} (vertical)`], ...['GX', 'GY', 'GZ'].filter(x => x !== down).map(x => [x, 'Global ' + x[1]]), ['LOCAL', 'Normal to the plate']]], ['p', `Pressure (${f}/${l}²)`, 'number', v ? +(toUF(v.p) * UL().f * UL().f).toFixed(6) : -5]];
  if (kind === 'temp') return [['dt', 'Uniform temperature change (°C)', 'number', v ? v.dt : 30]];
  return [];
}
function sxLdValues(kind, v) {
  if (kind === 'sw') return { k: 'sw', dir: v.dir, f: +v.f };
  if (kind === 'node') return { k: 'node', node: null, F: DOF.map((d, k) => k < 3 ? frUF(+v[d]) : frUF(+v[d]) * UL().f) };
  if (kind === 'uni') return { k: 'uni', beam: null, dir: v.dir, w: frUF(+v.w) / UL().f, d1: v.d1 === '' ? null : frU(+v.d1), d2: v.d2 === '' ? null : frU(+v.d2) };
  if (kind === 'con') return { k: 'con', beam: null, dir: v.dir, P: frUF(+v.P), d: frU(+v.d) };
  if (kind === 'pr') return { k: 'pr', plate: null, dir: v.dir, p: frUF(+v.p) / (UL().f * UL().f) };
  if (kind === 'temp') return { k: 'temp', beam: null, dt: +v.dt };
}
const SX_LD_TITLE = { sw: 'Self-weight', node: 'Nodal load', uni: 'Member load: uniform', con: 'Member load: concentrated', pr: 'Plate pressure', temp: 'Temperature load' };
function sxLoadForm(kind, cid, grp) {
  const c = L().cases.find(x => x.id === (cid ?? S.lc)) || needCase(); if (!c) return;
  const editing = !!grp;
  formDlg(`${SX_LD_TITLE[kind]}${editing ? ' (edit)' : ''} in load case ${c.id}`, sxLdFields(kind, editing ? grp.g.rep : null), v => {
    const val = sxLdValues(kind, v);
    if (kind === 'uni' && val.d1 != null && val.d2 != null && val.d2 <= val.d1) { toast('The load must end after it starts.'); return false; }
    if (editing) {
      const tgt = { node: 'node', uni: 'beam', con: 'beam', temp: 'beam', pr: 'plate' }[kind];
      mutate(`Edit ${SX_LD_TITLE[kind].toLowerCase()}`, () => { for (const it of [...grp.g.items, grp.g.def].filter(Boolean)) { const keep = tgt ? it[tgt] : null, mem = it.mem, pl = it.pl; Object.assign(it, JSON.parse(JSON.stringify(val))); if (tgt) it[tgt] = keep; if (mem) it.mem = mem; if (pl) it.pl = pl; } });
      S.sxp.load.sel = `G:${c.id}:${sxGrpKey(val)}`; toast(`Load updated on ${grp.g.items.length} ${kind === 'node' ? 'joints' : kind === 'pr' ? 'plates' : 'members'}.`); return;
    }
    mutate(`Add ${SX_LD_TITLE[kind].toLowerCase()}`, () => { if (kind === 'sw') c.items.push(val); else (c.defs = c.defs || []).push(val); });
    S.lc = c.id; const P = S.sxp.load; P.open.L = true; P.openCase = P.openCase || {}; P.openCase[c.id] = true; P.sel = `G:${c.id}:${sxGrpKey(val)}`; P.method = 'sel';
    if (S.wf !== 'loading') gotoWorkflow('loading'); else sxRenderContents();
    toast(kind === 'sw' ? `Self-weight added to load case ${c.id}, acting on the whole structure. Select members or plates and Assign to limit it.` : `${SX_LD_TITLE[kind]} added to load case ${c.id}, not assigned yet. Select ${kind === 'node' ? 'joints' : kind === 'pr' ? 'plates' : 'members'} and press Assign.`);
  }, editing ? 'Save' : 'Add');
}
function sxAssignSW(grp, P) {
  const items = grp.g.items; const cid = grp.c.id;
  const put = (mem, pl) => mutate('Assign self-weight', () => { for (const it of items) { it.mem = [...new Set([...(it.mem || []), ...mem])].filter(i => M.beams.has(i)); it.pl = [...new Set([...(it.pl || []), ...pl])].filter(i => M.plates.has(i)); } });
  if (P.method === 'view') { mutate('Self-weight on whole structure', () => { for (const it of items) { delete it.mem; delete it.pl; } }); toast(`Self-weight in load case ${cid} acts on the whole structure.`); return; }
  if (P.method === 'cursor') { S.sxAssign = { kind: 'beams', what: 'self-weight', apply: ids => { for (const it of items) it.mem = [...new Set([...(it.mem || []), ...ids])]; } }; S.cursor = 'beams'; setTool('select'); clearSel(); afterSel(); toast('Click members to give them self-weight. Press Esc to stop.'); return; }
  let mem, pl;
  if (P.method === 'list') { const ids = parseList(P.list); mem = ids.filter(i => M.beams.has(i)); pl = ids.filter(i => !M.beams.has(i) && M.plates.has(i)); }
  else { mem = [...S.sel.beams]; pl = [...S.sel.plates]; }
  if (!mem.length && !pl.length) { toast('Select members or plates first, or choose another assignment method.'); return; }
  const was = items.some(it => it.mem || it.pl);
  put(mem, pl);
  toast(`Self-weight in load case ${cid} now acts on ${items[0].mem.length} members and ${items[0].pl.length} plates${was ? '' : ' only (it was on the whole structure)'}. Assign To View returns it to the whole structure.`);
}
Object.assign(CMD, { sxLdSW: () => sxLoadForm('sw'), sxLdNode: () => sxLoadForm('node'), sxLdUni: () => sxLoadForm('uni'), sxLdCon: () => sxLoadForm('con'), sxLdPr: () => sxLoadForm('pr'), sxLdTemp: () => sxLoadForm('temp') });
const _sxMenuItems20 = sxMenuItems;
sxMenuItems = function (key) {
  if (key === 'items') return [['loadTree', 'Load & Definition…'], ['-'], ['sxLdSW', 'Self-weight…'], ['sxLdNode', 'Nodal load…'], ['sxLdUni', 'Member load: uniform…'], ['sxLdCon', 'Member load: concentrated…'], ['sxLdPr', 'Plate pressure…'], ['sxLdTemp', 'Temperature load…'], ['-'], ['envSet', 'Project environment…'], ['ldWaveSet', 'Wave case set…'], ['ldWave', 'Wave & current…'], ['ldBuoy', 'Buoyancy & flooding…'], ['ldEquip', 'Equipment…'], ['ldPipe', 'Pipe weight…'], ['ldStress', 'Pipe stress CSV…'], ['ldArea', 'Deck area (DNV)…'], ['ldWind', 'Wind…'], ['-'], ['ldSum', 'Load summary'], ['selfWeight', 'Self-weight and MTO'], ['ldClrSel', 'Delete loads on selection']];
  return _sxMenuItems20(key);
};

/* ---------------- partial self-weight: in totals, and to the server as member and joint loads ---------------- */
function sxSwParts(it) {
  const out = { beams: [], plates: [] };
  for (const id of it.mem || []) { const b = M.beams.get(id); if (!b) continue; const s = M.sections.get(b.sec), m = M.materials.get(b.mat); if (s && s.props && m && m.rho > 0) out.beams.push([b, s.props.A * m.rho * 9.80665]); }
  for (const id of it.pl || []) { const p = M.plates.get(id); if (!p) continue; const m = M.materials.get(p.mat); if (p.t && m && m.rho > 0) out.plates.push([p, plateArea(p) * p.t * m.rho * 9.80665]); }
  return out;
}
const _itemForce20 = itemForce;
itemForce = function (it) {
  if (it.k === 'sw' && (it.mem || it.pl)) { const P = sxSwParts(it); let W = 0; for (const [b, w] of P.beams) W += w * beamLen(b) / 1000; for (const [, w] of P.plates) W += w / 1000; const v = [0, 0, 0]; v[{ X: 0, Y: 1, Z: 2 }[it.dir]] = W * it.f; return v; }
  if (it.node === null || it.beam === null || it.plate === null) return [0, 0, 0];
  return _itemForce20(it);
};
const _caseToSpec20 = caseToSpec;
caseToSpec = function (c) {
  const part = c.items.filter(it => it.k === 'sw' && (it.mem || it.pl));
  if (!part.length) return _caseToSpec20(c);
  const s = _caseToSpec20(Object.assign({}, c, { items: c.items.filter(it => !part.includes(it)) }));
  for (const it of part) {
    const ax = { X: 0, Y: 1, Z: 2 }[it.dir]; const P = sxSwParts(it);
    for (const [b, w] of P.beams) { const q = { beam: b.id, wx: 0, wy: 0, wz: 0 }; q['w' + 'xyz'[ax]] = w * it.f; s.member_udl.push(q); }
    for (const [p, W] of P.plates) { const f = [0, 0, 0]; f[ax] = W * it.f / p.n.length; for (const n of p.n) s.nodal.push({ node: n, fx: f[0], fy: f[1], fz: f[2], mx: 0, my: 0, mz: 0 }); }
  }
  return s;
};

/* ---------------- the checklist knows about unassigned loads ---------------- */
const _sxPreCheck20 = sxPreCheck;
sxPreCheck = function (scope) {
  const R = _sxPreCheck20(scope); if (scope === 'nolo') return R;
  for (const c of L().cases.filter(x => x.type !== 'Reference')) {
    for (const [, g] of sxCaseGroups(c)) {
      if (g.items.length || !g.def) continue;
      const what = { sw: 'self-weight', node: 'joint load', uni: 'uniform member load', con: 'concentrated member load', pr: 'plate pressure', temp: 'temperature load' }[g.def.k] || g.def.k;
      R.push({ step: 'loading', level: 'err', msg: `Load case ${c.id} (${c.title}) has a ${what} that is not assigned to anything, so it would not be applied. Click it in Load & Definition, select ${g.def.k === 'node' ? 'joints' : g.def.k === 'pr' ? 'plates' : 'members'} and Assign, or delete it.` });
    }
    for (const it of c.items) if (it.k === 'sw' && (it.mem || it.pl) && !(it.mem || []).length && !(it.pl || []).length) R.push({ step: 'loading', level: 'err', msg: `Load case ${c.id} has self-weight limited to an empty list. Assign it to members, or use Whole structure.` });
  }
  return R;
};
/* a case holding only unassigned loads is not "empty" in the user's eyes, but it still applies nothing */
const _sxCheckNow20 = sxCheckNow;

/* ---------------- command file: unassigned loads survive as comments ---------------- */
const _toStaad20c = toStaad;
toStaad = function () {
  let txt = _toStaad20c(); const extra = [];
  for (const c of L().cases) for (const d of (c.defs || [])) extra.push(`* GEOSOFT UNASSIGNED ${c.id} ${JSON.stringify(d)}`);
  if (!extra.length) return txt;
  const lines = txt.split('\n'); let at = lines.findIndex(l => /^PERFORM ANALYSIS|^FINISH$/.test(l)); if (at < 0) at = lines.length;
  lines.splice(at, 0, ...extra); return lines.join('\n');
};
const _sxParseExtras20 = sxParseExtras;
sxParseExtras = function (text, m) {
  _sxParseExtras20(text, m);
  for (const x of text.matchAll(/^\*\s*GEOSOFT UNASSIGNED\s+(\d+)\s+(\{.*\})\s*$/gim)) { const c = (m.loads.cases || []).find(k => k.id === +x[1]); if (!c) continue; try { (c.defs = c.defs || []).push(JSON.parse(x[2])); } catch (e) { /* malformed line */ } }
};

/* ---------------- start ---------------- */
sxRenderRibbon(); sxRenderContents();
