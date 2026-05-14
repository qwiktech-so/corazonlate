import { useState } from 'react';

type FormData = {
  nombre: string;
  edad: string;
  telefono: string;
  correo: string;
  disponibilidad: string[];
  areas: string[];
  motivacion: string;
  talentos: string;
  compromiso: boolean;
};

const initialData: FormData = {
  nombre: '',
  edad: '',
  telefono: '',
  correo: '',
  disponibilidad: [],
  areas: [],
  motivacion: '',
  talentos: '',
  compromiso: false,
};

const DISPONIBILIDAD_OPTIONS = [
  'Fines de Semana',
  'Días de Semana en la mañana',
  'Días de semana en la tarde',
  'Eventos Especiales',
];

const AREAS_OPTIONS = [
  'Niñez (Enseñanza, juegos, dinámicas)',
  'Adolescencia (Memoria, charlas, acompañamiento)',
  'Apoyo Logístico (organización, montaje, transporte)',
  'Danza / música / arte',
  'Comunicación y redes sociales',
  'Otra',
];

const WEBHOOK_URL = import.meta.env.PUBLIC_N8N_WEBHOOK ?? '';

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-brand-gold inline mr-2">
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
    </svg>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
            i < current ? 'bg-brand-terracotta' : i === current ? 'bg-brand-terracotta' : 'bg-brand-border'
          }`}
        />
      ))}
    </div>
  );
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map(opt => (
        <label
          key={opt}
          className="flex items-center gap-3 p-3 rounded-xl border border-brand-border bg-white cursor-pointer hover:border-brand-terracotta transition-colors"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onChange(opt)}
            className="w-4 h-4 accent-brand-terracotta"
          />
          <span className="text-sm text-brand-text">{opt}</span>
        </label>
      ))}
    </div>
  );
}

export default function VolunteerForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const TOTAL_STEPS = 5;

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function toggleArray(key: 'disponibilidad' | 'areas', value: string) {
    setData(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }));
  }

  function validateStep1(): boolean {
    const errs: typeof errors = {};
    if (!data.nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (!data.telefono.trim()) errs.telefono = 'El teléfono es requerido';
    if (!data.correo.trim()) errs.correo = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) errs.correo = 'Correo inválido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit() {
    if (!data.compromiso) return;
    setSubmitting(true);
    setSubmitError(false);

    const payload = { ...data, timestamp: new Date().toISOString() };

    try {
      localStorage.setItem('cl_volunteer_backup', JSON.stringify(payload));
    } catch {}

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
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 px-6">
        <div className="text-6xl mb-4 animate-bounce">❤️</div>
        <h2 className="text-2xl font-serif font-bold text-brand-red mb-3">
          ¡Gracias por querer ser parte!
        </h2>
        <p className="text-brand-text/80 max-w-sm mx-auto">
          Hemos recibido tu solicitud. Pronto nos comunicaremos contigo para darte más información.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-[400px]">
      {/* Hero image strip */}
      <div className="w-full h-40 bg-brand-red overflow-hidden relative">
        <img
          src="/images/hero-form.jpg"
          alt="Corazón Late"
          className="w-full h-full object-cover object-top opacity-60"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/images/logo-white.png"
            alt="Logo"
            className="h-20 w-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        <StepIndicator current={step} total={TOTAL_STEPS} />

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div>
            <p className="text-xs font-semibold text-brand-terracotta uppercase tracking-widest mb-2">
              Formulario de Voluntariado
            </p>
            <h2 className="text-xl font-serif font-bold text-brand-text mb-1">
              ¡Gracias por tu interés en ser voluntario de{' '}
              <span className="text-brand-terracotta">Fundación Corazón Late!</span> ❤️
            </h2>
            <p className="text-sm text-brand-text/80 mt-4 mb-4 leading-relaxed">
              Nuestra misión es abrazar a la niñez y adolescencia con el amor de Dios, sembrando
              esperanza y formando vidas con fe, amor y servicio.
            </p>
            <p className="text-sm text-brand-text/80 mb-4">Como voluntario tendrás la oportunidad de:</p>
            <ul className="space-y-2 mb-6">
              {[
                'Acompañar y guiar a niños y adolescentes.',
                'Servir en actividades educativas, recreativas y espirituales.',
                'Poner tus talentos al servicio de otros.',
                'Ser parte de una comunidad que late al ritmo del amor de Dios.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-brand-text/80">
                  <HeartIcon />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-brand-text/80 leading-relaxed">
              Completa este formulario para conocerte mejor y asignarte al área donde puedas aportar
              más. ¡Tu corazón también puede latir junto al nuestro!
            </p>
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-brand-terracotta mb-5">Información Personal</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nombre y Apellido*"
                  value={data.nombre}
                  onChange={e => set('nombre', e.target.value)}
                  className={`w-full rounded-full border px-5 py-3 text-sm outline-none focus:border-brand-terracotta bg-white ${errors.nombre ? 'border-red-400' : 'border-brand-border'}`}
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1 pl-2">{errors.nombre}</p>}
              </div>
              <input
                type="number"
                placeholder="¿Cuántos años tienes?"
                value={data.edad}
                onChange={e => set('edad', e.target.value)}
                className="w-full rounded-full border border-brand-border px-5 py-3 text-sm outline-none focus:border-brand-terracotta bg-white"
              />
              <div>
                <input
                  type="tel"
                  placeholder="Teléfono de Contacto*"
                  value={data.telefono}
                  onChange={e => set('telefono', e.target.value)}
                  className={`w-full rounded-full border px-5 py-3 text-sm outline-none focus:border-brand-terracotta bg-white ${errors.telefono ? 'border-red-400' : 'border-brand-border'}`}
                />
                {errors.telefono && <p className="text-red-500 text-xs mt-1 pl-2">{errors.telefono}</p>}
              </div>
              <div>
                <div className={`flex items-center rounded-full border px-5 py-3 bg-white ${errors.correo ? 'border-red-400' : 'border-brand-border'} focus-within:border-brand-terracotta`}>
                  <svg className="w-4 h-4 text-brand-terracotta mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    placeholder="Correo electrónico*"
                    value={data.correo}
                    onChange={e => set('correo', e.target.value)}
                    className="flex-1 text-sm outline-none bg-transparent"
                  />
                </div>
                {errors.correo && <p className="text-red-500 text-xs mt-1 pl-2">{errors.correo}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Availability + Areas */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-brand-terracotta mb-3">
                ¿Has participado antes en voluntariados?
              </h3>
              <div className="space-y-2">
                {['Sí', 'No'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-brand-border bg-white cursor-pointer hover:border-brand-terracotta transition-colors">
                    <input
                      type="radio"
                      name="voluntariado_previo"
                      value={opt}
                      className="accent-brand-terracotta"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-brand-terracotta mb-3">
                Disponibilidad de tiempo <span className="font-normal text-brand-text/60">(puedes marcar varias)</span>
              </h3>
              <CheckboxGroup
                options={DISPONIBILIDAD_OPTIONS}
                selected={data.disponibilidad}
                onChange={v => toggleArray('disponibilidad', v)}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-brand-terracotta mb-3">
                Áreas de interés para servir <span className="font-normal text-brand-text/60">(puedes marcar varias)</span>
              </h3>
              <CheckboxGroup
                options={AREAS_OPTIONS}
                selected={data.areas}
                onChange={v => toggleArray('areas', v)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Motivation */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-brand-terracotta mb-3">
                ¿Por qué deseas ser parte de Corazón Late como voluntario?
              </h3>
              <textarea
                placeholder="¿Por qué deseas ser parte de Corazón Late como voluntario?"
                value={data.motivacion}
                onChange={e => set('motivacion', e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-brand-border px-5 py-3 text-sm outline-none focus:border-brand-terracotta bg-white resize-none"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-terracotta mb-3">
                ¿Tienes algún talento, habilidad o don que quieras compartir?
              </h3>
              <textarea
                placeholder="¿Tienes algún talento, habilidad o don que quieras compartir?"
                value={data.talentos}
                onChange={e => set('talentos', e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-brand-border px-5 py-3 text-sm outline-none focus:border-brand-terracotta bg-white resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Commitment */}
        {step === 4 && (
          <div>
            <p className="text-sm text-brand-terracotta font-medium leading-relaxed mb-5">
              Me comprometo a servir con responsabilidad y amor, siguiendo los valores de la Fundación Corazón Late.
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.compromiso}
                onChange={e => set('compromiso', e.target.checked)}
                className="w-5 h-5 accent-brand-terracotta"
              />
              <span className="text-sm font-medium text-brand-text">Si me comprometo.</span>
            </label>
            {submitError && (
              <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-xl p-3">
                Hubo un error al enviar. Tus datos fueron guardados localmente. Por favor intenta de nuevo.
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <button
              onClick={back}
              className="flex items-center gap-1 text-sm font-medium text-white bg-brand-terracotta rounded-full px-5 py-3 hover:bg-brand-red transition-colors"
            >
              ← Atras
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={next}
              className="flex items-center gap-1 text-sm font-semibold text-white bg-brand-terracotta rounded-full px-6 py-3 hover:bg-brand-red transition-colors ml-auto"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!data.compromiso || submitting}
              className="text-sm font-bold text-white bg-brand-terracotta rounded-full px-8 py-3 hover:bg-brand-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {submitting ? 'Enviando...' : 'ENVIAR'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
