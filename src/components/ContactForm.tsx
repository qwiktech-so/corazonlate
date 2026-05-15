import { useState } from 'react';

const WEBHOOK_URL = import.meta.env.PUBLIC_N8N_CONTACTO ?? '';

export default function ContactForm() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    const payload = { nombre, correo, mensaje, timestamp: new Date().toISOString() };

    try {
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
        <div className="text-4xl mb-3">❤️</div>
        <h3 className="font-serif font-bold text-xl text-brand-red mb-2">¡Mensaje recibido!</h3>
        <p className="text-sm text-brand-text/70">Nos comunicaremos contigo pronto.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <h3 className="font-serif font-bold text-xl text-brand-red mb-6">Envíanos un mensaje</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tu nombre*"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
          className="w-full rounded-full border border-brand-border px-5 py-3 text-sm outline-none focus:border-brand-terracotta"
        />
        <input
          type="email"
          placeholder="Tu correo*"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          required
          className="w-full rounded-full border border-brand-border px-5 py-3 text-sm outline-none focus:border-brand-terracotta"
        />
        <textarea
          placeholder="Tu mensaje*"
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          required
          rows={5}
          className="w-full rounded-2xl border border-brand-border px-5 py-3 text-sm outline-none focus:border-brand-terracotta resize-none"
        />
        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl p-3">
            Hubo un error al enviar. Por favor intenta de nuevo.
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>
    </div>
  );
}
