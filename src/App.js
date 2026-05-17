import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from './firebase';
import { 
  Trophy, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  History, 
  LayoutGrid, 
  Send,
  Zap,
  Globe
} from 'lucide-react';

// ─── DATOS INICIALES ──────────────────────────────────────────────────────────
const FALTANTES = {
  "Especiales FWC": [0, 4, 5, 8, 17, 18],
  "Catar": [5, 7, 13, 19, 20],
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
    entregadas: [],
  });

  const [pendientes, setPendientes] = useState({});
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  // Estados para Modo Trueque
  const [carritoTrueque, setCarritoTrueque] = useState({ dando: [], recibiendo: [] });

  // Estados para Gestor de Inventario
  const [invInput, setInvInput] = useState('');
  const [invResFalt, setInvResFalt] = useState(null);
  const [invResRep, setInvResRep] = useState(null);

  // ─── FIREBASE: escuchar cambios en tiempo real ────────────────────────────
  useEffect(() => {
    const dbRef = ref(db, 'panini');
    const unsub = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setEstado({
          faltantes: data.faltantes || {},
          repetidas: data.repetidas || {},
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

    for (const [codigo, laminas] of Object.entries(REPETIDAS)) { // BUSCAR EN CONSTANTE GLOBAL
      const codigoNorm = codigo.toLowerCase();
      const textoCoincide = !texto || codigoNorm.includes(texto);
      const laminasActuales = estado.repetidas[codigo] || [];
      const numCoincide = num === null || laminasActuales.includes(num);
      
      // En repetidas, solo mostramos si realmente tiene la lámina (para Negociar)
      if (textoCoincide && numCoincide && laminasActuales.length > 0) {
        return { clave: codigo, laminas: num !== null ? [num] : laminasActuales, soloUna: num !== null };
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

    for (const [equipo, laminasG] of Object.entries(FALTANTES)) { // BUSCAR EN CONSTANTE GLOBAL
      const equipoNorm = equipo.toLowerCase();
      const textoCoincide = !texto || equipoNorm.includes(texto);
      const laminasActuales = estado.faltantes[equipo] || [];
      const numCoincide = num === null || laminasActuales.includes(num);
      
      if (textoCoincide && numCoincide && laminasActuales.length > 0) {
        return { clave: equipo, laminas: num !== null ? [num] : laminasActuales, soloUna: num !== null };
      }
    }
    return null;
  };

  // Buscadores para Inventario (buscan en todo, sin importar si la tienes o no)
  const buscarGlobalFaltantes = (input) => {
    const txt = input.trim().toLowerCase();
    if (!txt) return null;
    const numMatch = txt.match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0]) : null;
    if (num === null) return null;
    const texto = txt.replace(/\d+/g, '').trim();

    for (const [equipo, laminas] of Object.entries(FALTANTES)) {
      if (!texto || equipo.toLowerCase().includes(texto)) {
        const laTengo = !(estado.faltantes[equipo] || []).includes(num);
        return { clave: equipo, num, esFaltante: !laTengo };
      }
    }
    return null;
  };

  const buscarGlobalRepetidas = (input) => {
    const txt = input.trim().toLowerCase();
    if (!txt) return null;
    const numMatch = txt.match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0]) : null;
    if (num === null) return null;
    const texto = txt.replace(/\d+/g, '').trim();

    for (const [codigo, laminas] of Object.entries(REPETIDAS)) {
      if (!texto || codigo.toLowerCase().includes(texto)) {
        const cantidad = (estado.repetidas[codigo] || []).filter(l => l === num).length;
        return { clave: codigo, num, cantidad };
      }
    }
    return null;
  };

  const onChangeTengo = (val) => { setInputTengo(val); setSelTengo(null); setResTengo(buscarEnRepetidas(val)); };
  const onChangeFalta = (val) => { setInputFalta(val); setSelFalta(null); setResFalta(buscarEnFaltantes(val)); };
  
  const onChangeInventario = (val) => { 
    setInvInput(val); 
    setInvResFalt(buscarGlobalFaltantes(val)); 
    setInvResRep(buscarGlobalRepetidas(val)); 
  };

  // ─── ACCIONES TRUEQUE ────────────────────────────────────────────────────────
  const agregarDando = (codigo, num) => {
    setCarritoTrueque(prev => ({ ...prev, dando: [...prev.dando, { codigo, num }] }));
    setInputTengo(''); setResTengo(null); setSelTengo(null);
  };

  const quitarDando = (idx) => {
    setCarritoTrueque(prev => ({ ...prev, dando: prev.dando.filter((_, i) => i !== idx) }));
  };

  const agregarRecibiendo = (equipo, num) => {
    setCarritoTrueque(prev => ({ ...prev, recibiendo: [...prev.recibiendo, { equipo, num }] }));
    setInputFalta(''); setResFalta(null); setSelFalta(null);
  };

  const quitarRecibiendo = (idx) => {
    setCarritoTrueque(prev => ({ ...prev, recibiendo: prev.recibiendo.filter((_, i) => i !== idx) }));
  };

  const sellarTrueque = () => {
    if (carritoTrueque.dando.length === 0 && carritoTrueque.recibiendo.length === 0) return;

    let newFalt = { ...estado.faltantes };
    let newRep = { ...estado.repetidas };
    const newEntr = [...estado.entregadas];

    carritoTrueque.dando.forEach(item => {
      newRep[item.codigo] = (newRep[item.codigo] || []).filter(l => l !== item.num);
      newEntr.unshift({ codigo: item.codigo, num: item.num });
    });

    carritoTrueque.recibiendo.forEach(item => {
      newFalt[item.equipo] = (newFalt[item.equipo] || []).filter(l => l !== item.num);
    });

    update({ faltantes: newFalt, repetidas: newRep, entregadas: newEntr });
    setCarritoTrueque({ dando: [], recibiendo: [] });
  };

  // ─── ACCIONES INVENTARIO ──────────────────────────────────────────────────────
  const sumarRepetida = (codigo, num) => {
    const newRep = { ...estado.repetidas };
    newRep[codigo] = [...(newRep[codigo] || []), num].sort((a,b) => a - b);
    update({ repetidas: newRep });
    onChangeInventario(invInput);
  };

  const restarRepetida = (codigo, num) => {
    const newRep = { ...estado.repetidas };
    const arr = newRep[codigo] || [];
    const idx = arr.indexOf(num);
    if (idx > -1) {
      arr.splice(idx, 1);
      newRep[codigo] = arr;
      update({ repetidas: newRep });
      onChangeInventario(invInput);
    }
  };

  const toggleFaltanteInv = (equipo, num, esFaltanteActualmente) => {
    const newFalt = { ...estado.faltantes };
    if (esFaltanteActualmente) {
      // Remover de faltantes
      newFalt[equipo] = (newFalt[equipo] || []).filter(l => l !== num);
    } else {
      // Agregar a faltantes
      newFalt[equipo] = [...(newFalt[equipo] || []), num].sort((a,b) => a - b);
    }
    update({ faltantes: newFalt });
    onChangeInventario(invInput);
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
        newEntr.unshift({ codigo: clave, num });
      }
    });
    update({ faltantes: newFalt, repetidas: newRep, entregadas: newEntr });
    setPendientes({});
    setMostrarConfirmar(false);
  };

  const totalFalt = Object.values(estado.faltantes).reduce((s, a) => s + a.length, 0);
  const totalRep = Object.values(estado.repetidas).reduce((s, a) => s + a.length, 0);

  if (cargando) return (
    <div className="fifa-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Trophy size={64} className="text-neon" style={{ animation: 'float 2s ease-in-out infinite' }} />
        <h2 style={{ marginTop: '1rem', letterSpacing: '0.2em' }}>Cargando Estadio...</h2>
      </div>
    </div>
  );

  return (
    <div className="fifa-bg">
      {/* HEADER SECTION */}
      <header style={{ padding: '2rem 1.5rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.5 }}>
          <Globe size={24} />
        </div>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--hot-magenta)', borderRadius: '2rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 900, margin: 0, letterSpacing: '0.1em' }}>TRANSMISIÓN EN VIVO</p>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: 1 }}>
          PANINI <span className="text-neon">LIVE</span>
        </h1>
        <p style={{ color: 'var(--muted-text)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.5rem' }}>
          RASTREADOR OFICIAL DE LÁMINAS • MUNDIAL 2026
        </p>
      </header>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 1rem 8rem' }}>
        
        {/* TABS NAVIGATION */}
        <div className="card" style={{ padding: '0.5rem', marginBottom: '2rem', display: 'flex', overflowX: 'auto', gap: '0.5rem' }}>
          <button className={`tab-btn ${tab === 'negociar' ? 'active' : ''}`} onClick={() => setTab('negociar')} style={{ whiteSpace: 'nowrap' }}>
            Trueque
          </button>
          <button className={`tab-btn ${tab === 'inventario' ? 'active' : ''}`} onClick={() => setTab('inventario')} style={{ whiteSpace: 'nowrap' }}>
            Inventario
          </button>
          <button className={`tab-btn ${tab === 'estado' ? 'active' : ''}`} onClick={() => setTab('estado')} style={{ whiteSpace: 'nowrap' }}>
            Estado
          </button>
          <button className={`tab-btn ${tab === 'checklist' ? 'active' : ''}`} onClick={() => setTab('checklist')} style={{ whiteSpace: 'nowrap' }}>
            Checklist
          </button>
        </div>

        {/* ── NEGOCIAR (TRUEQUE) ── */}
        {tab === 'negociar' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {/* ZONA: YO DOY */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Send size={20} style={{ color: 'var(--electric-cyan)' }} />
                  <h3 className="text-neon" style={{ fontSize: '0.9rem' }}>YO DOY (Repetidas)</h3>
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={20} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--muted-text)' }} />
                  <input 
                    className="input-field" 
                    placeholder="Buscar (ej. MEX 8)" 
                    style={{ paddingLeft: '3rem' }}
                    value={inputTengo} 
                    onChange={e => onChangeTengo(e.target.value)} 
                  />
                </div>

                <div style={{ marginTop: '1rem' }}>
                  {inputTengo && !resTengo && (
                    <div style={{ padding: '1rem', background: 'rgba(255, 0, 110, 0.1)', borderRadius: '1rem', border: '1px solid var(--hot-magenta)' }}>
                      <p style={{ color: 'var(--hot-magenta)', fontWeight: 800, textAlign: 'center' }}>NO TIENES ESA REPETIDA</p>
                    </div>
                  )}

                  {resTengo && !selTengo && (
                    <div className="card" style={{ background: 'var(--grad-cyan-purple)', border: 'none' }}>
                      <p style={{ fontWeight: 900, opacity: 0.8, fontSize: '0.8rem' }}>{resTengo.clave}</p>
                      {resTengo.soloUna ? (
                        <>
                          <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0' }}>#{resTengo.laminas[0]}</h2>
                          <button className="btn btn-primary" style={{ width: '100%', background: 'var(--dark-bg)' }} onClick={() => agregarDando(resTengo.clave, resTengo.laminas[0])}>
                            <CheckCircle2 size={18} /> AGREGAR AL TRATO
                          </button>
                        </>
                      ) : (
                        <>
                          <p style={{ fontWeight: 700, margin: '0.5rem 0' }}>{resTengo.laminas.length} DISPONIBLES</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {resTengo.laminas.map((l, i) => (
                              <button key={`${l}-${i}`} className="sticker sticker-repetida active" onClick={() => setSelTengo(l)}>#{l}</button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {resTengo && selTengo && (
                    <div className="card" style={{ background: 'var(--grad-cyan-purple)', border: 'none' }}>
                      <p style={{ fontWeight: 900, opacity: 0.8 }}>{resTengo.clave}</p>
                      <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0' }}>#{selTengo}</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button className="btn btn-primary" style={{ width: '100%', background: 'var(--dark-bg)' }} onClick={() => agregarDando(resTengo.clave, selTengo)}>
                          <CheckCircle2 size={18} /> AGREGAR AL TRATO
                        </button>
                        <button className="btn" style={{ background: 'transparent', color: 'white', border: '2px solid white' }} onClick={() => setSelTengo(null)}>
                          VOLVER
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ZONA: YO RECIBO */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Trophy size={20} style={{ color: 'var(--energy-orange)' }} />
                  <h3 style={{ color: 'var(--energy-orange)', fontSize: '0.9rem' }}>YO RECIBO (Faltantes)</h3>
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={20} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--muted-text)' }} />
                  <input 
                    className="input-field" 
                    placeholder="Buscar (ej. ARG 10)" 
                    style={{ paddingLeft: '3rem' }}
                    value={inputFalta} 
                    onChange={e => onChangeFalta(e.target.value)} 
                  />
                </div>

                <div style={{ marginTop: '1rem' }}>
                  {inputFalta && !resFalta && (
                    <div style={{ padding: '1rem', background: 'rgba(255, 107, 0, 0.1)', borderRadius: '1rem', border: '1px solid var(--energy-orange)' }}>
                      <p style={{ color: 'var(--energy-orange)', fontWeight: 800, textAlign: 'center' }}>YA LA TIENES</p>
                    </div>
                  )}

                  {resFalta && !selFalta && (
                    <div className="card" style={{ background: 'var(--grad-orange-pink)', border: 'none' }}>
                      <p style={{ fontWeight: 900, opacity: 0.8 }}>{resFalta.clave}</p>
                      {resFalta.soloUna ? (
                        <>
                          <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0' }}>#{resFalta.laminas[0]}</h2>
                          <button className="btn btn-primary" style={{ width: '100%', background: 'var(--dark-bg)' }} onClick={() => agregarRecibiendo(resFalta.clave, resFalta.laminas[0])}>
                            <CheckCircle2 size={18} /> AGREGAR AL TRATO
                          </button>
                        </>
                      ) : (
                        <>
                          <p style={{ fontWeight: 700, margin: '0.5rem 0' }}>{resFalta.laminas.length} FALTANTES</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {resFalta.laminas.map(l => (
                              <button key={l} className="sticker sticker-faltante active" onClick={() => setSelFalta(l)}>#{l}</button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {resFalta && selFalta && (
                    <div className="card" style={{ background: 'var(--grad-orange-pink)', border: 'none' }}>
                      <p style={{ fontWeight: 900, opacity: 0.8 }}>{resFalta.clave}</p>
                      <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0' }}>#{selFalta}</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button className="btn btn-primary" style={{ width: '100%', background: 'var(--dark-bg)' }} onClick={() => agregarRecibiendo(resFalta.clave, selFalta)}>
                          <CheckCircle2 size={18} /> AGREGAR AL TRATO
                        </button>
                        <button className="btn" style={{ background: 'transparent', color: 'white', border: '2px solid white' }} onClick={() => setSelFalta(null)}>
                          VOLVER
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CARRITO DE TRUEQUE RESUMEN */}
            {(carritoTrueque.dando.length > 0 || carritoTrueque.recibiendo.length > 0) && (
              <div className="card" style={{ border: '2px solid var(--electric-cyan)', padding: '1.5rem' }}>
                <h2 className="text-neon" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>MESA DE TRUEQUE</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {carritoTrueque.dando.length > 0 && (
                    <div style={{ padding: '1rem', background: 'rgba(0, 255, 255, 0.05)', borderRadius: '0.5rem' }}>
                      <p style={{ color: 'var(--electric-cyan)', fontWeight: 900, marginBottom: '0.5rem' }}>ENTREGAS ({carritoTrueque.dando.length}):</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {carritoTrueque.dando.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--dark-bg)', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 800 }}>
                            {item.codigo} #{item.num}
                            <button onClick={() => quitarDando(idx)} style={{ background: 'none', border: 'none', color: 'var(--hot-magenta)', cursor: 'pointer', display: 'flex' }}><XCircle size={14}/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {carritoTrueque.recibiendo.length > 0 && (
                    <div style={{ padding: '1rem', background: 'rgba(255, 107, 0, 0.05)', borderRadius: '0.5rem' }}>
                      <p style={{ color: 'var(--energy-orange)', fontWeight: 900, marginBottom: '0.5rem' }}>RECIBES ({carritoTrueque.recibiendo.length}):</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {carritoTrueque.recibiendo.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--dark-bg)', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 800 }}>
                            {item.equipo} #{item.num}
                            <button onClick={() => quitarRecibiendo(idx)} style={{ background: 'none', border: 'none', color: 'var(--hot-magenta)', cursor: 'pointer', display: 'flex' }}><XCircle size={14}/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button className="btn btn-primary" style={{ width: '100%', height: '4rem', fontSize: '1.2rem', marginTop: '1.5rem', background: 'var(--grad-cyan-purple)', boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)' }} onClick={sellarTrueque}>
                  <Zap /> SELLAR TRUEQUE
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── INVENTARIO (GESTOR / ABRIR SOBRES) ── */}
        {tab === 'inventario' && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <LayoutGrid size={20} className="text-neon" />
              <h3 className="text-neon" style={{ fontSize: '1.2rem' }}>Gestor de Inventario</h3>
            </div>
            <p style={{ color: 'var(--muted-text)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              Busca una lámina para corregir su estado o ingresa las nuevas que compraste.
            </p>
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <Search size={20} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--muted-text)' }} />
              <input 
                className="input-field" 
                placeholder="Ej. MEX 8, Catar 20..." 
                style={{ paddingLeft: '3rem' }}
                value={invInput} 
                onChange={e => onChangeInventario(e.target.value)} 
              />
            </div>

            {invInput && (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Panel de Faltantes */}
                {invResFalt ? (
                  <div style={{ padding: '1.5rem', background: 'var(--dark-secondary)', borderRadius: '1rem', borderLeft: '4px solid var(--energy-orange)' }}>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{invResFalt.clave} #{invResFalt.num}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <span style={{ fontWeight: 800, color: invResFalt.esFaltante ? 'var(--energy-orange)' : 'var(--electric-cyan)' }}>
                        {invResFalt.esFaltante ? '❌ TE FALTA' : '✅ YA LA TIENES PEGADA'}
                      </span>
                      <button 
                        className="btn" 
                        style={{ background: 'var(--dark-bg)', border: `2px solid ${invResFalt.esFaltante ? 'var(--electric-cyan)' : 'var(--energy-orange)'}` }}
                        onClick={() => toggleFaltanteInv(invResFalt.clave, invResFalt.num, invResFalt.esFaltante)}
                      >
                        {invResFalt.esFaltante ? 'MARCAR COMO CONSEGUIDA' : 'MARCAR COMO FALTANTE'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>No coincide con nombres de faltantes.</p>
                )}

                {/* Panel de Repetidas */}
                {invResRep ? (
                  <div style={{ padding: '1.5rem', background: 'var(--dark-secondary)', borderRadius: '1rem', borderLeft: '4px solid var(--electric-cyan)' }}>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{invResRep.clave} #{invResRep.num}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <span style={{ fontWeight: 800, color: invResRep.cantidad > 0 ? 'var(--electric-cyan)' : 'var(--muted-text)' }}>
                        {invResRep.cantidad > 0 ? `🔄 TIENES ${invResRep.cantidad} REPETIDAS` : 'NO TIENES REPETIDAS'}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn" 
                          style={{ background: 'var(--dark-bg)', border: '2px solid var(--hot-magenta)', opacity: invResRep.cantidad > 0 ? 1 : 0.5 }}
                          disabled={invResRep.cantidad === 0}
                          onClick={() => restarRepetida(invResRep.clave, invResRep.num)}
                        >
                          - QUITAR
                        </button>
                        <button 
                          className="btn" 
                          style={{ background: 'var(--dark-bg)', border: '2px solid var(--electric-cyan)' }}
                          onClick={() => sumarRepetida(invResRep.clave, invResRep.num)}
                        >
                          + AGREGAR
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>No coincide con códigos de repetidas.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STATS / ESTADO ── */}
        {tab === 'estado' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* SCOREBOARD */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="card" style={{ textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--energy-orange)' }}></div>
                <p style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--muted-text)', letterSpacing: '0.1em' }}>ME FALTAN</p>
                <h2 style={{ fontSize: '4rem', color: 'var(--energy-orange)' }}>{totalFalt}</h2>
              </div>
              <div className="card" style={{ textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--electric-cyan)' }}></div>
                <p style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--muted-text)', letterSpacing: '0.1em' }}>REPETIDAS</p>
                <h2 style={{ fontSize: '4rem', color: 'var(--electric-cyan)' }}>{totalRep}</h2>
              </div>
            </div>

            {/* PROGRESS LIST */}
            {estado.enProgreso.length > 0 && (
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <History size={20} className="text-neon" />
                  <h3>Adquisiciones Activas ({estado.enProgreso.length})</h3>
                </div>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {estado.enProgreso.map((item, idx) => (
                    <div key={idx} className="card" style={{ background: 'var(--dark-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                      <div>
                        <span style={{ fontWeight: 900, fontSize: '1.2rem' }}>#{item.num}</span>
                        <span style={{ marginLeft: '0.75rem', fontWeight: 600, color: 'var(--muted-text)' }}>{item.equipo}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" style={{ padding: '0.5rem', background: 'rgba(255,0,0,0.2)', color: '#ff4444' }} onClick={() => deshacerProgreso(idx)}>
                          <XCircle size={20} />
                        </button>
                        <button className="btn btn-primary" style={{ padding: '0.5rem' }} onClick={() => pegarLamina(idx)}>
                          <CheckCircle2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRADES HISTORY */}
            {estado.entregadas.length > 0 && (
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <Send size={20} style={{ color: 'var(--hot-magenta)' }} />
                  <h3>Cambios Exitosos ({estado.entregadas.length})</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {estado.entregadas.map((item, idx) => (
                    <div key={idx} style={{ padding: '1rem', background: 'rgba(255, 0, 110, 0.05)', borderLeft: '4px solid var(--hot-magenta)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 900 }}>#{item.num} {item.codigo}</span>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--hot-magenta)', fontWeight: 800, cursor: 'pointer', fontSize: '0.7rem' }} onClick={() => deshacerEntrega(idx)}>
                        DESHACER
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RAW DATA GRIDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="card">
                <h3>Lista de Faltantes</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '1rem', fontSize: '0.8rem' }}>
                  {Object.entries(estado.faltantes).filter(([_, l]) => l.length > 0).map(([eq, lams]) => (
                    <div key={eq} style={{ marginBottom: '0.5rem', padding: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                      <span style={{ color: 'var(--energy-orange)', fontWeight: 900 }}>{eq}:</span> {lams.join(', ')}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3>Mis Repetidas</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '1rem', fontSize: '0.8rem' }}>
                  {Object.entries(estado.repetidas).filter(([_, l]) => l.length > 0).map(([cod, lams]) => (
                    <div key={cod} style={{ marginBottom: '0.5rem', padding: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                      <span style={{ color: 'var(--electric-cyan)', fontWeight: 900 }}>{cod}:</span> {lams.join(', ')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CHECKLIST ── */}
        {tab === 'checklist' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button 
                className={`btn ${checklistTipo === 'faltantes' ? 'btn-primary' : ''}`} 
                style={{ flex: 1, border: checklistTipo !== 'faltantes' ? '2px solid var(--glass-border)' : 'none', background: checklistTipo !== 'faltantes' ? 'transparent' : 'var(--grad-orange-pink)' }}
                onClick={() => setChecklistTipo('faltantes')}
              >
                FALTANTES
              </button>
              <button 
                className={`btn ${checklistTipo === 'repetidas' ? 'btn-primary' : ''}`} 
                style={{ flex: 1, border: checklistTipo !== 'repetidas' ? '2px solid var(--glass-border)' : 'none', background: checklistTipo !== 'repetidas' ? 'transparent' : 'var(--grad-cyan-purple)' }}
                onClick={() => setChecklistTipo('repetidas')}
              >
                REPETIDAS
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {checklistTipo === 'faltantes' ? (
                Object.entries(estado.faltantes).filter(([_, l]) => l.length > 0).map(([eq, lams]) => (
                  <div key={eq} className="card">
                    <h4 style={{ color: 'var(--energy-orange)', marginBottom: '1rem' }}>{eq}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {lams.map(l => {
                        const key = `faltante|${eq}|${l}`;
                        const marcada = !!pendientes[key];
                        return (
                          <button key={l} onClick={() => togglePendiente(key)} className={`sticker sticker-faltante ${marcada ? 'active' : ''}`}>
                            #{l}{marcada ? ' ✓' : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                Object.entries(estado.repetidas).filter(([_, l]) => l.length > 0).map(([cod, lams]) => (
                  <div key={cod} className="card">
                    <h4 className="text-neon" style={{ marginBottom: '1rem' }}>{cod}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {lams.map(l => {
                        const key = `repetida|${cod}|${l}`;
                        const marcada = !!pendientes[key];
                        return (
                          <button key={l} onClick={() => togglePendiente(key)} className={`sticker sticker-repetida ${marcada ? 'active' : ''}`}>
                            #{l}{marcada ? ' ✓' : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* CONFIRM BAR */}
            {pendientesActivos.length > 0 && (
              <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '600px', zIndex: 1000, animation: 'float 4s ease-in-out infinite' }}>
                <button className="btn btn-primary" style={{ width: '100%', height: '4rem', fontSize: '1.2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }} onClick={() => setMostrarConfirmar(true)}>
                  <Zap /> CONFIRMACIÓN EN MASA ({pendientesActivos.length} ITEMS)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL CONFIRMACIÓN */}
      {mostrarConfirmar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(5px)' }}>
          <div className="card" style={{ width: '100%', maxWidth: 450, padding: '2rem', border: '2px solid var(--electric-cyan)' }}>
            <h2 className="text-neon" style={{ marginBottom: '1.5rem' }}>Confirmar Operaciones</h2>
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendientesActivos.map(([key]) => {
                const [tipo, clave, num] = key.split('|');
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '0.75rem', background: 'var(--dark-secondary)', borderLeft: `4px solid ${tipo === 'faltante' ? 'var(--energy-orange)' : 'var(--electric-cyan)'}` }}>
                    <span style={{ fontWeight: 900 }}>#{num} {clave}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: tipo === 'faltante' ? 'var(--energy-orange)' : 'var(--electric-cyan)' }}>
                      {tipo === 'faltante' ? 'COLECCIONADA' : 'ENTREGADA'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn" style={{ flex: 1, background: 'transparent', border: '2px solid var(--glass-border)' }} onClick={() => setMostrarConfirmar(false)}>CANCELAR</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={confirmarCambios}>CONFIRMAR</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER BROADCAST OVERLAY */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '0.5rem 1.5rem', background: 'var(--dark-secondary)', borderTop: '2px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, fontSize: '0.7rem', fontWeight: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="text-neon">FIFA WORLD CUP 2026™</span>
          <span style={{ color: 'var(--muted-text)' }}>|</span>
          <span>RASTREADOR PANINI LIVE</span>
        </div>
        <div style={{ color: 'var(--hot-magenta)' }}>
          ● CONEXIÓN EN VIVO
        </div>
      </div>
    </div>
  );
}
