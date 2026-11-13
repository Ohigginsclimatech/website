import { useState, type FormEvent } from 'react';
import { comunas, waLink } from '../data/site';
import { WhatsApp } from './icons';
import s from './QuoteForm.module.css';

const servicios = ['Comprar e instalar un equipo', 'Solo instalación', 'Mantención', 'Diagnóstico / reparación', 'Otra consulta'];

export default function QuoteForm() {
  const [nombre, setNombre] = useState('');
  const [comuna, setComuna] = useState<string>(comunas[0]);
  const [servicio, setServicio] = useState(servicios[0]);
  const [detalle, setDetalle] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const msg = [
      `Hola Olivar Clima, soy ${nombre.trim() || 'un cliente'}.`,
      `Servicio: ${servicio}.`,
      `Comuna: ${comuna}.`,
      detalle.trim() && `Detalle: ${detalle.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(waLink(msg), '_blank', 'noopener');
  };

  return (
    <form className={s.form} onSubmit={submit}>
      <div className={s.row}>
        <label>
          <span>Tu nombre</span>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: María González" autoComplete="name" required />
        </label>
        <label>
          <span>Comuna</span>
          <select value={comuna} onChange={(e) => setComuna(e.target.value)}>
            {comunas.map((c) => <option key={c}>{c}</option>)}
            <option>Otra comuna</option>
          </select>
        </label>
      </div>
      <label>
        <span>¿Qué necesitas?</span>
        <select value={servicio} onChange={(e) => setServicio(e.target.value)}>
          {servicios.map((x) => <option key={x}>{x}</option>)}
        </select>
      </label>
      <label>
        <span>Cuéntanos un poco más (opcional)</span>
        <textarea
          rows={3}
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          placeholder="Ej: dormitorio de 15 m² en segundo piso, me interesa inverter"
        />
      </label>
      <button className="btn btn-wa" type="submit">
        <WhatsApp /> Enviar por WhatsApp
      </button>
      <p className={s.hint}>Se abrirá WhatsApp con tu mensaje listo. Respondemos a la brevedad.</p>
    </form>
  );
}
