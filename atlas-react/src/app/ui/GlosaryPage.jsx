import { useMemo, useState } from 'react'

const serifHeadingClass = 'font-["Baskervville",serif]'

const glossaryTerms = [
  {
    term: 'Afectación socio-ecológica',
    category: 'Impactos',
    definition:
      'Relaciones de daño o transformación que operan simultáneamente sobre sistemas ecológicos y tejidos sociales, generando reconfiguraciones materiales, simbólicas y políticas.',
    tags: ['impacto', 'territorio', 'conflicto'],
    related: ['Post-extractivismo', 'Comunidades de cuidado'],
  },
  {
    term: 'Comunidades de cuidado',
    category: 'Prácticas',
    definition:
      'Redes de colaboración entre comunidades humanas y más-que-humanas que movilizan estrategias para sostener la vida frente a procesos extractivos.',
    tags: ['comunidad', 'justicia climática'],
    related: ['Afectación socio-ecológica'],
  },
  {
    term: 'Desalinización',
    category: 'Tecnología',
    definition:
      'Proceso industrial que extrae sales y minerales del agua de mar para hacerla utilizable. En el atlas se observa como infraestructura que desplaza conflictos hídricos hacia ecosistemas costeros y marinos.',
    tags: ['agua', 'infraestructura', 'energía'],
    related: ['Infraestructura crítica'],
  },
  {
    term: 'Ensamblaje',
    category: 'Metodología',
    definition:
      'Dispositivo analítico que reconoce la interdependencia de materiales, cuerpos, infraestructuras y relatos. Permite describir cómo se componen las redes de vida en contextos extractivos.',
    tags: ['metodología', 'redes'],
    related: ['Paisaje operacional'],
  },
  {
    term: 'Gobernanza multiescalar',
    category: 'Política',
    definition:
      'Articulación de normativas, acuerdos y actores que operan desde lo local a lo global para regular territorios extractivos, muchas veces reproduciendo asimetrías entre Norte y Sur Global.',
    tags: ['política', 'regulación'],
    related: ['Regímenes de poder'],
  },
  {
    term: 'Infraestructura crítica',
    category: 'Territorio',
    definition:
      'Conjunto de obras, redes o dispositivos tecnológicos indispensables para sostener operaciones extractivas, como ductos, puertos, plantas desalinizadoras o tranques de relave.',
    tags: ['infraestructura', 'riesgo'],
    related: ['Paisaje operacional'],
  },
  {
    term: 'Línea base comunitaria',
    category: 'Metodología',
    definition:
      'Proceso participativo que registra las condiciones del territorio desde el punto de vista de sus habitantes para contrastarlo con los relatos oficiales de impacto.',
    tags: ['comunidad', 'documentación'],
    related: ['Observatorio territorial'],
  },
  {
    term: 'Más-que-humano',
    category: 'Ecologías',
    definition:
      'Perspectiva que incorpora organismos, paisajes y materialidades no humanas como agentes activos en la construcción de territorios y resistencias.',
    tags: ['ecología', 'agencia'],
    related: ['Ensamblaje'],
  },
  {
    term: 'Observatorio territorial',
    category: 'Metodología',
    definition:
      'Espacio colaborativo de monitoreo que levanta datos, testimonios y visualizaciones para dar seguimiento a las transformaciones de un territorio.',
    tags: ['datos', 'cartografía'],
    related: ['Línea base comunitaria'],
  },
  {
    term: 'Paisaje operacional',
    category: 'Territorio',
    definition:
      'Paisaje extendido mediante el cual operan las industrias extractivas, integrando puertos, campamentos, rutas y sistemas digitales que exceden el área de concesión.',
    tags: ['territorio', 'logística'],
    related: ['Infraestructura crítica'],
  },
  {
    term: 'Post-extractivismo',
    category: 'Marco conceptual',
    definition:
      'Horizonte político y cultural que busca superar la dependencia de economías basadas en la extracción intensiva de recursos, proponiendo transiciones socio-ecológicas justas.',
    tags: ['transición', 'economía', 'justicia'],
    related: ['Afectación socio-ecológica', 'Regímenes de poder'],
  },
  {
    term: 'Regímenes de poder',
    category: 'Política',
    definition:
      'Estructuras de decisión y financiamiento que configuran quién define el uso del territorio, qué cuerpos se exponen al riesgo y quién se beneficia de la extracción.',
    tags: ['política', 'desigualdad'],
    related: ['Gobernanza multiescalar'],
  },
  {
    term: 'Sensorías del territorio',
    category: 'Tecnología',
    definition:
      'Dispositivos comunitarios o artesanales que capturan sonidos, vibraciones y texturas para evidenciar impactos no visibles de la extracción.',
    tags: ['sensorialidad', 'comunidad'],
    related: ['Observatorio territorial'],
  },
]

const totalTerms = glossaryTerms.length
const categoriesCount = new Set(glossaryTerms.map((t) => t.category)).size

export function GlosaryPage() {
  const [query, setQuery] = useState('')

  const filteredTerms = useMemo(() => {
    if (!query.trim()) {
      return glossaryTerms
    }
    const normalized = query.toLowerCase()
    return glossaryTerms.filter((item) => {
      return (
        item.term.toLowerCase().includes(normalized) ||
        item.definition.toLowerCase().includes(normalized) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalized)) ||
        (item.related?.some((rel) => rel.toLowerCase().includes(normalized)) ??
          false)
      )
    })
  }, [query])

  const groupedTerms = useMemo(() => {
    const groups = filteredTerms
      .slice()
      .sort((a, b) => a.term.localeCompare(b.term))
      .reduce((acc, item) => {
        const letter = item.term.charAt(0).toUpperCase()
        if (!acc[letter]) {
          acc[letter] = []
        }
        acc[letter].push(item)
        return acc
      }, {})

    return Object.keys(groups)
      .sort()
      .map((letter) => ({ letter, terms: groups[letter] }))
  }, [filteredTerms])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-36 lg:px-12">
        <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="uppercase tracking-[0.55em] text-xs text-slate-400">
              Glosario
            </p>
            <h1
              className={`mt-4 text-4xl leading-tight text-slate-900 lg:text-5xl ${serifHeadingClass}`}
            >
              Conceptos para navegar el atlas
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              Este glosario reúne términos clave que emergen del trabajo
              colaborativo entre investigación, comunidades y diseño. Usa el
              buscador para filtrar conceptos y comprender mejor cada caso de
              estudio.
            </p>
          </div>
          <div className="rounded-[32px] border border-slate-100 bg-white/70 p-6 shadow-lg shadow-slate-100/60">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
              Búsqueda
            </p>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Impactos, paisajes, metodologías..."
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-400 focus:outline-none"
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <GlossaryStat label="Términos" value={totalTerms} />
              <GlossaryStat label="Categorías" value={categoriesCount} />
            </div>
          </div>
        </header>

        <div className="mt-14 space-y-10">
          {groupedTerms.length === 0 ? (
            <div className="rounded-[32px] border border-slate-100 bg-white/60 p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">
                Sin resultados para “{query}”
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Ajusta tu búsqueda o revisa otra palabra clave relacionada con
                el territorio, la investigación o las afectaciones.
              </p>
            </div>
          ) : (
            groupedTerms.map((group) => (
              <div key={group.letter}>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-semibold text-slate-300">
                    {group.letter}
                  </div>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {group.terms.map((item) => (
                    <GlossaryCard key={item.term} item={item} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function GlossaryCard({ item }) {
  return (
    <article className="rounded-[32px] border border-slate-100 bg-white/70 p-6 shadow-sm shadow-slate-100/70">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className={`text-2xl text-slate-900 ${serifHeadingClass}`}>
          {item.term}
        </h3>
        <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
          {item.category}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        {item.definition}
      </p>
      {item.related && item.related.length > 0 && (
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">
          Relacionado: {item.related.join(', ')}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}

function GlossaryStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-3 text-center shadow-sm">
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
        {label}
      </p>
    </div>
  )
}
