import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from './firebase';

// ─── DATOS INICIALES ──────────────────────────────────────────────────────────
const FALTANTES = {
  "Especiales/FWC": [0, 4, 5, 8, 17, 18],
  "México": [2, 3, 10, 11, 17, 18, 19],
  "Sudáfrica": [1, 4, 6, 9, 12, 13, 14, 15, 17, 18, 19],
  "Corea del Sur": [4, 5, 8, 10, 15, 17, 18, 19, 20],
  "República Checa": [1, 4, 9, 15, 16, 18],
  "Canadá": [4, 5, 18, 19],
  "Bosnia": [2, 4, 5, 6, 10, 11, 15, 16, 17, 18, 20],
  "Suiza": [2, 7, 8, 11, 12, 13, 16],
  "Brasil": [1, 5, 13],
  "Marruecos": [1, 2, 3, 7, 8, 10, 11, 12, 14, 20],
  "Haití": [2, 5, 6, 13, 14, 15, 17, 18, 19],
  "Escocia": [7, 11, 13],
  "Estados Unidos": [3, 6, 7, 8, 10, 13, 15, 16, 17, 19, 20],
  "Paraguay": [1, 3, 4, 5, 8, 9, 13],
  "Australia": [2, 3, 9, 10, 11, 15, 19],
  "Turquía": [1, 4, 5, 8, 9, 15, 19, 20],
  "Alemania": [4, 8, 9, 12, 18],
  "Curazao": [1, 4, 5, 8, 12, 14, 17, 18],
  "Costa de Marfil": [1, 3, 4, 6, 7, 8, 9],
  "Ecuador": [2, 3, 6, 7, 10, 15, 20],
  "Países Bajos": [1, 2, 3, 6, 7, 8, 11, 12, 13, 15, 16, 18],
  "Japón": [1, 4, 6, 7, 15, 16, 20],
  "Suecia": [1, 4, 5, 8, 9, 12, 14, 20],
  "Túnez": [8, 14, 18, 19, 20],
  "Bélgica": [4, 6, 10, 11, 13, 16, 20],
  "Egipto": [1, 5, 8, 9, 10, 12, 14, 15, 18, 19],
  "Irán": [1, 2, 6, 10, 13, 15, 16, 18, 19, 20],
  "Nueva Zelanda": [2, 3, 4, 5, 6, 7, 11, 15, 16, 18, 20],
  "España": [4, 5, 9, 13, 19],
  "Cabo Verde": [1, 2, 6, 19],
  "Arabia Saudita": [4, 5, 6, 8, 9, 11, 12, 13, 14, 18, 20],
  "Uruguay": [4, 5, 8, 9, 14, 18],
  "Francia": [4, 14, 15, 16, 19, 20],
  "Senegal": [9, 14, 15, 19],
  "Irak": [3, 5, 13],
  "Noruega": [3, 16, 19],
  "Argentina": [1, 4, 6, 7, 9, 13],
  "Argelia": [1, 5, 13, 19, 20],
  "Austria": [4, 5, 6, 10, 19],
  "Jordania": [3, 13, 19],
  "Portugal": [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 14, 15, 18, 19],
  "Congo": [2, 5, 8, 9, 10, 12, 13, 15, 19],
  "Uzbekistán": [2, 4, 5, 6, 8, 9, 13, 17, 18],
  "Colombia": [1, 9, 10, 11, 12, 13, 15],
  "Inglaterra": [1, 3, 4, 6, 7, 8, 10, 11, 13, 14, 15, 16, 18, 19, 20],
  "Croacia": [1, 2, 3, 7, 10, 11, 13, 16, 20],
  "Ghana": [1, 3, 10, 11, 15, 16, 20],
  "Panamá": [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 18, 19, 20],
  "Coca-Cola": Array.from({ length: 14 }, (_, i) => i + 1)
};

const REPETIDAS = {
  "ALG": [9, 12, 14, 17, 18], "AUS": [8, 13, 14, 17, 18], "AUT": [2, 3, 7, 13, 20],
  "BEL": [5, 14, 18], "BIH": [19], "BRA": [6, 16], "CAN": [12, 14],
  "CIV": [13, 19, 20], "COD": [4, 14], "CPV": [8, 20], "CRO": [4, 5],
  "CUW": [2, 20], "CZE": [10, 19], "ECU": [5], "ENG": [5, 17], "ESP": [12],
  "FWC": [1, 2, 9, 10, 13, 14, 16], "GER": [1], "GHA": [4, 5],
  "HAI": [7, 11, 16, 20], "IRQ": [4, 8, 12], "JOR": [2, 6, 9, 14],
  "MAR": [6, 15, 18, 19], "MEX": [4, 8], "NOR": [6, 7], "NZL": [8, 9],
  "PAN": [10, 11, 12, 17], "PAR": [12, 14], "POR": [16, 17], "QAT": [8, 9],
  "RSA": [3, 5, 7], "SCO": [2, 3, 4, 5, 6, 18, 19], "SEN": [3, 6, 7, 8, 17, 20],
  "SUI": [2], "TUN": [5, 9], "TUR": [13], "UZB": [19, 20]
};

const C = { azul: '#1a2d5a', naranja: '#ff6b35', verde: '#06a77d', amarillo: '#ffd60a', turquesa: '#4ecdc4' };

const cardBlanco = {
  background: 'rgba(255,255,255,0.95)',
  borderRadius: '1rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  border: '4px solid white',
  padding: '1.5rem'
};

export default function App() {
  const [tab, setTab] = useState('negociar');
  const [checklistTipo, setChecklistTipo] = useState('faltantes');
  const [cargando, setCargando] = useState(true);

  const [inputTengo, setInputTengo] = useState('');
  const [inputFalta, setInputFalta] = useState('');
  const [resTengo, setResTengo] = useState(null);
  const [resFalta, setResFalta] = useState(null);
  const [selTengo, setSelTengo] = useState(null);
  const [selFalta, setSelFalta] = useState(null);

  const [estado, setEstado] = useState({
    faltantes: FALTANTES,
    repetidas: REPETIDAS,
    enProgreso: [],
    entregadas: [],
  });

  const [pendientes, setPendientes] = useState({});
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  // ─── FIREBASE: escuchar cambios en tiempo real ────────────────────────────
  useEffect(() => {
    const dbRef = ref(db, 'panini');
    const unsub = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setEstado({
          faltantes: data.faltantes || FALTANTES,
          repetidas: data.repetidas || REPETIDAS,
          enProgreso: data.enProgreso || [],
          entregadas: data.entregadas || [],
        });
      }
      setCargando(false);
    });
    return () => unsub();
  }, []);

  // ─── FIREBASE: guardar ────────────────────────────────────────────────────
  const guardar = (nuevoEstado) => {
    set(ref(db, 'panini'), nuevoEstado);
  };

  const update = (cambios) => {
    const nuevo = { ...estado, ...cambios };
    setEstado(nuevo);
    guardar(nuevo);
  };

  // ─── BÚSQUEDA ─────────────────────────────────────────────────────────────
  const buscarEnRepetidas = (input) => {
    const txt = input.trim().toLowerCase();
    if (!txt) return null;
    const numMatch = txt.match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0]) : null;
    const texto = txt.replace(/\d+/g, '').trim();

    for (const [codigo, laminas] of Object.entries(estado.repetidas)) {
      const codigoNorm = codigo.toLowerCase();
      const textoCoincide = !texto || codigoNorm.includes(texto);
      const numCoincide = num === null || laminas.includes(num);
      if (textoCoincide && numCoincide) {
        return { clave: codigo, laminas: num !== null ? [num] : laminas, soloUna: num !== null };
      }
    }
    return null;
  };

  const buscarEnFaltantes = (input) => {
    const txt = input.trim().toLowerCase();
    if (!txt) return null;
    const numMatch = txt.match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0]) : null;
    const texto = txt.replace(/\d+/g, '').trim();

    for (const [equipo, laminas] of Object.entries(estado.faltantes)) {
      const equipoNorm = equipo.toLowerCase();
      const textoCoincide = !texto || equipoNorm.includes(texto);
      const numCoincide = num === null || laminas.includes(num);
      if (textoCoincide && numCoincide) {
        return { clave: equipo, laminas: num !== null ? [num] : laminas, soloUna: num !== null };
      }
    }
    return null;
  };

  const onChangeTengo = (val) => { setInputTengo(val); setSelTengo(null); setResTengo(buscarEnRepetidas(val)); };
  const onChangeFalta = (val) => { setInputFalta(val); setSelFalta(null); setResFalta(buscarEnFaltantes(val)); };

  // ─── ACCIONES ─────────────────────────────────────────────────────────────
  const entregarLamina = (codigo, num) => {
    const newRep = { ...estado.repetidas };
    newRep[codigo] = newRep[codigo].filter(l => l !== num);
    const newEntr = [...estado.entregadas, { codigo, num }];
    update({ repetidas: newRep, entregadas: newEntr });
    setInputTengo(''); setResTengo(null); setSelTengo(null);
  };

  const deshacerEntrega = (idx) => {
    const item = estado.entregadas[idx];
    const newEntr = estado.entregadas.filter((_, i) => i !== idx);
    const newRep = { ...estado.repetidas };
    newRep[item.codigo] = [...(newRep[item.codigo] || []), item.num].sort((a, b) => a - b);
    update({ repetidas: newRep, entregadas: newEntr });
  };

  const acordarCambio = (equipo, num) => {
    const newProg = [...estado.enProgreso, { equipo, num }];
    update({ enProgreso: newProg });
    setInputFalta(''); setResFalta(null); setSelFalta(null);
  };

  const deshacerProgreso = (idx) => {
    const newProg = estado.enProgreso.filter((_, i) => i !== idx);
    update({ enProgreso: newProg });
  };

  const pegarLamina = (idx) => {
    const item = estado.enProgreso[idx];
    const newProg = estado.enProgreso.filter((_, i) => i !== idx);
    const newFalt = { ...estado.faltantes };
    newFalt[item.equipo] = (newFalt[item.equipo] || []).filter(l => l !== item.num);
    update({ enProgreso: newProg, faltantes: newFalt });
  };

  const togglePendiente = (key) => setPendientes(prev => ({ ...prev, [key]: !prev[key] }));

  const pendientesActivos = Object.entries(pendientes).filter(([_, v]) => v);

  const confirmarCambios = () => {
    let newFalt = { ...estado.faltantes };
    let newRep = { ...estado.repetidas };
    const newEntr = [...estado.entregadas];
    pendientesActivos.forEach(([key]) => {
      const [tipo, clave, numStr] = key.split('|');
      const num = parseInt(numStr);
      if (tipo === 'faltante') {
        newFalt[clave] = (newFalt[clave] || []).filter(l => l !== num);
      } else {
        newRep[clave] = (newRep[clave] || []).filter(l => l !== num);
        newEntr.push({ codigo: clave, num });
      }
    });
    update({ faltantes: newFalt, repetidas: newRep, entregadas: newEntr });
    setPendientes({});
    setMostrarConfirmar(false);
  };

  const totalFalt = Object.values(estado.faltantes).reduce((s, a) => s + a.length, 0);
  const totalRep = Object.values(estado.repetidas).reduce((s, a) => s + a.length, 0);

  if (cargando) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.azul }}>
      <p style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem' }}>⚽ Cargando...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '1rem 1rem 5rem', background: `linear-gradient(135deg, ${C.azul} 0%, ${C.naranja} 30%, #00d9ff 60%, ${C.amarillo} 80%, ${C.verde} 100%)`, backgroundSize: '400% 400%', animation: 'grad 15s ease infinite' }}>
      <style>{`@keyframes grad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} } *{box-sizing:border-box}`}</style>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'white', textShadow: `3px 3px 0 ${C.azul}`, margin: 0 }}>PANINI LIVE</h1>
          <p style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', margin: '0.25rem 0 0' }}>⚽ MUNDIAL 2026 ⚽</p>
        </div>

        {/* PESTAÑAS */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'negociar', label: 'Negociar', bg: C.naranja },
            { id: 'estado', label: 'Estado', bg: C.verde },
            { id: 'checklist', label: 'Checklist', bg: C.amarillo, color: C.azul }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', color: t.color || 'white', backgroundColor: tab === t.id ? t.bg : t.bg + 'aa', boxShadow: tab === t.id ? `0 6px 20px ${t.bg}66` : 'none' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── NEGOCIAR ── */}
        {tab === 'negociar' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

            {/* TENGO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ ...cardBlanco, borderColor: C.verde }}>
                <p style={{ margin: '0 0 0.75rem', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em', color: C.verde }}>✓ TENGO</p>
                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="MEX, 8, MEX 4..." value={inputTengo} onChange={e => onChangeTengo(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem', fontWeight: 900, border: `3px solid ${C.verde}`, borderRadius: '0.75rem', outline: 'none', color: C.azul }} />
                </div>
              </div>

              {inputTengo && !resTengo && <div style={{ background: C.naranja, borderRadius: '0.75rem', padding: '1rem', color: 'white', fontWeight: 900 }}>No encontré</div>}

              {resTengo && !selTengo && (
                <div style={{ background: `linear-gradient(135deg, ${C.verde}, ${C.turquesa})`, borderRadius: '1rem', padding: '1.25rem', border: '3px solid white' }}>
                  <p style={{ color: 'white', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>{resTengo.clave}</p>
                  {resTengo.soloUna ? (
                    <>
                      <p style={{ color: 'white', fontWeight: 900, fontSize: '2.5rem', margin: '0 0 0.75rem' }}>#{resTengo.laminas[0]}</p>
                      <button onClick={() => entregarLamina(resTengo.clave, resTengo.laminas[0])} style={{ width: '100%', padding: '0.75rem', background: C.azul, color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>✓ ENTREGUÉ</button>
                    </>
                  ) : (
                    <>
                      <p style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', margin: '0 0 0.5rem' }}>{resTengo.laminas.length} para cambiar</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {resTengo.laminas.map(l => <button key={l} onClick={() => setSelTengo(l)} style={{ padding: '0.4rem 0.6rem', background: C.azul, color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 900, cursor: 'pointer' }}>#{l}</button>)}
                      </div>
                    </>
                  )}
                </div>
              )}

              {resTengo && selTengo && (
                <div style={{ background: `linear-gradient(135deg, ${C.verde}, ${C.turquesa})`, borderRadius: '1rem', padding: '1.25rem', border: '3px solid white' }}>
                  <p style={{ color: 'white', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>{resTengo.clave}</p>
                  <p style={{ color: 'white', fontWeight: 900, fontSize: '2.5rem', margin: '0 0 0.75rem' }}>#{selTengo}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={() => entregarLamina(resTengo.clave, selTengo)} style={{ padding: '0.75rem', background: C.azul, color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>✓ ENTREGUÉ</button>
                    <button onClick={() => setSelTengo(null)} style={{ padding: '0.6rem', background: 'transparent', color: 'white', border: '2px solid white', borderRadius: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>← VOLVER</button>
                  </div>
                </div>
              )}
            </div>

            {/* ME FALTAN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ ...cardBlanco, borderColor: C.naranja }}>
                <p style={{ margin: '0 0 0.75rem', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em', color: C.naranja }}>✗ ME FALTAN</p>
                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="Argentina, 7, ARG 1..." value={inputFalta} onChange={e => onChangeFalta(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem', fontWeight: 900, border: `3px solid ${C.naranja}`, borderRadius: '0.75rem', outline: 'none', color: C.azul }} />
                </div>
              </div>

              {inputFalta && !resFalta && <div style={{ background: C.amarillo, borderRadius: '0.75rem', padding: '1rem', color: C.azul, fontWeight: 900 }}>No encontré</div>}

              {resFalta && !selFalta && (
                <div style={{ background: `linear-gradient(135deg, ${C.naranja}, #ff8c5a)`, borderRadius: '1rem', padding: '1.25rem', border: '3px solid white' }}>
                  <p style={{ color: 'white', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>{resFalta.clave}</p>
                  {resFalta.soloUna ? (
                    <>
                      <p style={{ color: 'white', fontWeight: 900, fontSize: '2.5rem', margin: '0 0 0.75rem' }}>#{resFalta.laminas[0]}</p>
                      <button onClick={() => acordarCambio(resFalta.clave, resFalta.laminas[0])} style={{ width: '100%', padding: '0.75rem', background: C.azul, color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>✓ ACORDAMOS</button>
                    </>
                  ) : (
                    <>
                      <p style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', margin: '0 0 0.5rem' }}>{resFalta.laminas.length} faltantes</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {resFalta.laminas.map(l => <button key={l} onClick={() => setSelFalta(l)} style={{ padding: '0.4rem 0.6rem', background: C.azul, color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 900, cursor: 'pointer' }}>#{l}</button>)}
                      </div>
                    </>
                  )}
                </div>
              )}

              {resFalta && selFalta && (
                <div style={{ background: `linear-gradient(135deg, ${C.naranja}, #ff8c5a)`, borderRadius: '1rem', padding: '1.25rem', border: '3px solid white' }}>
                  <p style={{ color: 'white', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>{resFalta.clave}</p>
                  <p style={{ color: 'white', fontWeight: 900, fontSize: '2.5rem', margin: '0 0 0.75rem' }}>#{selFalta}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={() => acordarCambio(resFalta.clave, selFalta)} style={{ padding: '0.75rem', background: C.azul, color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>✓ ACORDAMOS</button>
                    <button onClick={() => setSelFalta(null)} style={{ padding: '0.6rem', background: 'transparent', color: 'white', border: '2px solid white', borderRadius: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>← VOLVER</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ESTADO ── */}
        {tab === 'estado' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: `linear-gradient(135deg, ${C.naranja}, #ff8c5a)`, borderRadius: '1rem', padding: '1.25rem', border: '3px solid white' }}>
                <p style={{ color: 'white', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>ME FALTAN</p>
                <p style={{ color: 'white', fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>{totalFalt}</p>
              </div>
              <div style={{ background: `linear-gradient(135deg, ${C.verde}, ${C.turquesa})`, borderRadius: '1rem', padding: '1.25rem', border: '3px solid white' }}>
                <p style={{ color: 'white', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>TENGO REPETIDAS</p>
                <p style={{ color: 'white', fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>{totalRep}</p>
              </div>
            </div>

            {estado.enProgreso.length > 0 && (
              <div style={cardBlanco}>
                <p style={{ margin: '0 0 1rem', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.1em', color: C.azul }}>EN PROGRESO ({estado.enProgreso.length})</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {estado.enProgreso.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: C.amarillo, borderRadius: '0.75rem' }}>
                      <span style={{ fontWeight: 900, color: C.azul }}>#{item.num} {item.equipo}</span>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => deshacerProgreso(idx)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 0.6rem', fontWeight: 900, cursor: 'pointer' }}>✕</button>
                        <button onClick={() => pegarLamina(idx)} style={{ background: C.verde, color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', fontWeight: 900, cursor: 'pointer' }}>✓</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {estado.entregadas.length > 0 && (
              <div style={cardBlanco}>
                <p style={{ margin: '0 0 1rem', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.1em', color: C.verde }}>YA ENTREGUÉ ({estado.entregadas.length})</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {estado.entregadas.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: `${C.verde}22`, borderRadius: '0.75rem', borderLeft: `4px solid ${C.verde}` }}>
                      <span style={{ fontWeight: 900, color: C.azul }}>#{item.num} {item.codigo}</span>
                      <button onClick={() => deshacerEntrega(idx)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 0.6rem', fontWeight: 900, cursor: 'pointer', fontSize: '0.75rem' }}>✕ deshacer</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={cardBlanco}>
              <p style={{ margin: '0 0 0.75rem', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.1em', color: C.naranja }}>FALTANTES</p>
              <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {Object.entries(estado.faltantes).filter(([_, l]) => l.length > 0).map(([eq, lams]) => (
                  <div key={eq} style={{ padding: '0.6rem 0.75rem', borderLeft: `4px solid ${C.naranja}`, background: `${C.naranja}18`, borderRadius: '0 0.5rem 0.5rem 0' }}>
                    <span style={{ fontWeight: 900, color: C.azul, fontSize: '0.8rem' }}>{eq}: </span>
                    <span style={{ color: C.naranja, fontWeight: 700, fontSize: '0.8rem' }}>{lams.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={cardBlanco}>
              <p style={{ margin: '0 0 0.75rem', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.1em', color: C.verde }}>MIS REPETIDAS</p>
              <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {Object.entries(estado.repetidas).filter(([_, l]) => l.length > 0).map(([cod, lams]) => (
                  <div key={cod} style={{ padding: '0.6rem 0.75rem', borderLeft: `4px solid ${C.verde}`, background: `${C.verde}18`, borderRadius: '0 0.5rem 0.5rem 0' }}>
                    <span style={{ fontWeight: 900, color: C.azul, fontSize: '0.8rem' }}>{cod}: </span>
                    <span style={{ color: C.verde, fontWeight: 700, fontSize: '0.8rem' }}>{lams.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CHECKLIST ── */}
        {tab === 'checklist' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: pendientesActivos.length > 0 ? '5rem' : 0 }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setChecklistTipo('faltantes')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer', color: 'white', backgroundColor: checklistTipo === 'faltantes' ? C.naranja : '#ff8c5a' }}>FALTANTES</button>
              <button onClick={() => setChecklistTipo('repetidas')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer', color: 'white', backgroundColor: checklistTipo === 'repetidas' ? C.verde : C.turquesa }}>REPETIDAS</button>
            </div>

            {checklistTipo === 'faltantes' && Object.entries(estado.faltantes).filter(([_, l]) => l.length > 0).map(([eq, lams]) => (
              <div key={eq} style={cardBlanco}>
                <p style={{ margin: '0 0 0.75rem', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em', color: C.naranja, textTransform: 'uppercase' }}>{eq}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {lams.map(l => {
                    const key = `faltante|${eq}|${l}`;
                    const marcada = !!pendientes[key];
                    return (
                      <button key={l} onClick={() => togglePendiente(key)} style={{ padding: '0.4rem 0.6rem', background: marcada ? C.naranja : `${C.naranja}22`, borderRadius: '0.5rem', border: `2px solid ${C.naranja}`, fontWeight: 900, fontSize: '0.85rem', color: marcada ? 'white' : C.azul, cursor: 'pointer' }}>
                        #{l}{marcada ? ' ✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {checklistTipo === 'repetidas' && Object.entries(estado.repetidas).filter(([_, l]) => l.length > 0).map(([cod, lams]) => (
              <div key={cod} style={cardBlanco}>
                <p style={{ margin: '0 0 0.75rem', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em', color: C.verde, textTransform: 'uppercase' }}>{cod}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {lams.map(l => {
                    const key = `repetida|${cod}|${l}`;
                    const marcada = !!pendientes[key];
                    return (
                      <button key={l} onClick={() => togglePendiente(key)} style={{ padding: '0.4rem 0.6rem', background: marcada ? C.verde : `${C.verde}22`, borderRadius: '0.5rem', border: `2px solid ${C.verde}`, fontWeight: 900, fontSize: '0.85rem', color: marcada ? 'white' : C.azul, cursor: 'pointer' }}>
                        #{l}{marcada ? ' ✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {pendientesActivos.length > 0 && (
              <div style={{ position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: '90%', maxWidth: 400 }}>
                <button onClick={() => setMostrarConfirmar(true)} style={{ width: '100%', padding: '1rem', background: C.azul, color: 'white', border: '3px solid white', borderRadius: '1rem', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
                  CONFIRMAR {pendientesActivos.length} CAMBIO{pendientesActivos.length > 1 ? 'S' : ''}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL CONFIRMACIÓN */}
      {mostrarConfirmar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', width: '100%', maxWidth: 400, boxShadow: '0 16px 48px rgba(0,0,0,0.4)' }}>
            <p style={{ fontWeight: 900, fontSize: '1.1rem', color: C.azul, margin: '0 0 1rem' }}>¿CONFIRMAR CAMBIOS?</p>
            <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {pendientesActivos.map(([key]) => {
                const [tipo, clave, num] = key.split('|');
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', borderRadius: '0.6rem', background: tipo === 'faltante' ? `${C.naranja}22` : `${C.verde}22`, borderLeft: `4px solid ${tipo === 'faltante' ? C.naranja : C.verde}` }}>
                    <span style={{ fontWeight: 900, color: C.azul, fontSize: '0.85rem' }}>#{num} {clave}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: tipo === 'faltante' ? C.naranja : C.verde }}>{tipo === 'faltante' ? 'OBTENIDA' : 'ENTREGADA'}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setMostrarConfirmar(false)} style={{ flex: 1, padding: '0.75rem', background: 'white', color: C.azul, border: `2px solid ${C.azul}`, borderRadius: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>CANCELAR</button>
              <button onClick={confirmarCambios} style={{ flex: 1, padding: '0.75rem', background: C.azul, color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>CONFIRMAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
