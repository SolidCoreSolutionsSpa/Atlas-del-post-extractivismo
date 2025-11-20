const serifHeadingClass = 'font-["Baskervville",serif]'

const description = `El proyecto Atlas del Post-Extractivismo se encuentra en la etapa de desarrollo de un producto mínimo viable, con proyecciones de seguir avanzando durante 2026. Uno de los próximos objetivos es incorporar un espacio participativo dentro de la plataforma que permita colaborar directamente en el atlas. Estamos profundamente comprometidos con integrar esta dimensión participativa para ampliar las perspectivas sobre cómo visualizar y comprender el territorio.`

export function ColaboratePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-24 pt-36 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="max-w-xl">
          <p className="uppercase tracking-[0.55em] text-xs text-slate-400">
            Sitio en desarrollo
          </p>
          <h1
            className={`mt-4 text-4xl leading-tight text-slate-900 lg:text-5xl ${serifHeadingClass}`}
          >
            Colabora al atlas
          </h1>
          <p className="mt-6 text-base leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        <div className="flex w-full items-center justify-center lg:max-w-md">
          <div className="relative h-[300px] w-[300px] sm:h-[360px] sm:w-[360px]">
            <img
              src="/img/ISOTIPO.png"
              alt="Isotipo Atlas del Post-Extractivismo"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
