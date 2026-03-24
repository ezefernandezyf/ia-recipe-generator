import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

type PrivacyPageView = ReactElement;

const PrivacyPage = (): PrivacyPageView => {
  return (
    <main className="min-h-full bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.12),transparent_30%),linear-gradient(180deg,#f8f5ef_0%,#f3efe6_100%)] px-4 py-8 text-stone-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-3xl border border-stone-200 bg-white/85 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            <span className="rounded-full bg-secondary px-3 py-1 text-white">Privacidad simple</span>
            <span>Uso responsable de tus datos</span>
          </div>
          <div className="mt-4 space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950 md:text-4xl">Política de privacidad</h1>
            <p className="max-w-3xl text-sm leading-6 text-stone-600">Esta página resume de forma simple qué datos usamos cuando generás una receta y cómo los tratamos dentro de la aplicación.</p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <h2 className="text-lg font-semibold text-stone-950">Qué datos recibimos</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
              <li>Ingredientes, cantidades, unidades y notas que escribís en el formulario.</li>
              <li>La cantidad de porciones y las preferencias que agregás antes de generar la receta.</li>
              <li>Mensajes de error o eventos técnicos mínimos necesarios para que la app funcione.</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <h2 className="text-lg font-semibold text-stone-950">Para qué se usan</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
              <li>Para construir el pedido que se envía al modelo de IA configurado.</li>
              <li>Para devolver una receta ajustada a lo que cargaste en pantalla.</li>
              <li>Para detectar fallas y corregir problemas de funcionamiento del servicio.</li>
            </ul>
          </article>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <h2 className="text-lg font-semibold text-stone-950">Compartición y almacenamiento</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
            <p>La información que escribís se envía al proveedor de IA configurado para poder generar la receta. No se usa para crear una cuenta ni para venderte productos.</p>
            <p>La app no está pensada para guardar un historial permanente de tus recetas desde la interfaz pública. Si el hosting registra logs técnicos, esos logs se manejan según la configuración del proveedor de infraestructura.</p>
            <p>Si querés pedir aclaraciones o reportar algo, usá el enlace de GitHub del pie de página.</p>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-white/90 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <Link className="rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90" to="/">
            Volver al generador
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPage;