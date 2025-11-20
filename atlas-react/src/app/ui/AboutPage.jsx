const heroParagraphs = [
  'El proyecto Atlas del Post-Extractivismo entre Norte y Sur Global propone la creación de un dispositivo digital capaz de comunicar, de manera visual e interactiva, los ensamblajes que configuran la red de vida -humana y más-que-humana- en territorios extractivos. El proyecto se inscribe en la investigación-artística interdisciplinaria Artifacts of Entanglement: In the Web of Extractive Urbanization (2024), financiada por el Fondo Centenario de la Pontificia Universidad Católica de Valparaíso, cuyo propósito ha sido examinar críticamente cómo los procesos contemporáneos de urbanización están constituidos por ensamblajes extractivos que articulan agenciamientos entre materias primas, agua, energía, infraestructuras y comunidades humanas y más-que-humanas.',
  'Hoy, el extractivismo, con sus procesos globales impactan redes de vida, produciendo desigualdades socio-ecológicas que reproducen nuevos regímenes de poder entre Norte y Sur Global, manifestados en nuevos paisajes operacionales del Antropoceno/Capitaloceno.',
]

const teamSections = [
  {
    title: 'Diseño gráfico e interacción',
    description:
      'Encargados de visualizar la información del caso de estudio como una narrativa exploratoria desde la gráfica, procuran una correcta navegación inmersiva no lineal propuesta desde el dibujo y la oportunidad de diseño del manejo material como forma de contextualizar y comunicar el territorio estudiado, realizan trabajo de categorización de afectaciones en gráficas situadas en zonas y tipos de afectaciones.',
    members: [
      {
        name: 'Valentina Leiva',
        role: 'Diseño web, ilustraciones, estilo gráfico',
        imageSrc: '/img/sobre-el-proyecto/Valentina-Leiva.jpg',
      },
      {
        name: 'Arturo Céspedes',
        role: 'Diseño web, navegación y arquitectura de información',
        imageSrc: '/img/sobre-el-proyecto/Arturo-Cespedes.jpg',
      },
      {
        name: 'Michèle Wilkomirsky',
        role: 'Directora de diseño de atlas',
        imageSrc: '/img/sobre-el-proyecto/Michele-wilkomirsky.jpg',
      },
    ],
  },
  {
    title: 'Investigación, arquitectura y urbanismo',
    description:
      'Miembros del proyecto “Artifacts of Entanglement: In the Web of Extractive Urbanization (2024)” equipo que da el encargo de realizar el atlas que aborde la temática del post extractivismo, acompañan y orientan mientras se realiza el proceso de diseño y desarrollo de la plataforma, revisan la narrativa, fuentes e información recolectada y proyectan la continuidad del atlas como una posibilidad de visualizar múltiples casos de estudio a nivel mundial que aborden esta temática.',
    members: [
      {
        name: 'Álvaro Mercado',
        role: 'Director de proyecto “Artefactos relacionales”',
        imageSrc: '/img/sobre-el-proyecto/Alvaro-Mercado-Jara.jpg',
      },
      {
        name: 'Carla Saavedra',
        role: 'Investigadora caso de estudio',
        imageSrc: '/img/sobre-el-proyecto/Carla-Saavedra.jpg',
      },
      {
        name: 'Mia-Sue Carrère',
        role: 'Investigadora caso de estudio',
        imageSrc: '/img/sobre-el-proyecto/Mia-Sue-Carrere.jpg',
      },
    ],
  },
  {
    title: 'Apoyo de desarrollo',
    description:
      'Equipo encargado del desarrollo del producto mínimo viable del proyecto, apoya en las áreas de financiamiento, programación e ilustración del atlas. Una vez definida la propuesta de diseño, este equipo trabaja en la formalización del atlas, elaborando un primer prototipo navegable disponible en la web y avanzando de manera más profunda en la visualización del caso de estudio.',
    members: [
      {
        name: 'Sofía Rojas',
        role: 'Apoyo en ilustraciones',
        imageSrc: '/img/sobre-el-proyecto/Sofia-Rojas.jpg',
      },
      {
        name: 'SolidCore Solutions',
        role: 'Desarrollo web',
        imageSrc: '/img/sobre-el-proyecto/logo_solidcore.png',
        isLogo: false,
      },
      {
        name: 'VINCI PUCV',
        role: 'Financiamiento de proyecto',
        imageSrc: '/img/sobre-el-proyecto/VINCI.png',
        isLogo: true,
      },
    ],
  },
]

const serifHeadingClass = 'font-["Baskervville",serif]'

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-36 lg:px-12">
        <header className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div>
            <p className="uppercase tracking-[0.55em] text-xs text-slate-400">
              Sobre el proyecto
            </p>
            <h1
              className={`mt-4 text-4xl leading-tight text-slate-900 lg:text-5xl ${serifHeadingClass}`}
            >
              Atlas del Post-Extractivismo
            </h1>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate-700">
              {heroParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="flex w-full items-center justify-center lg:justify-end">
            <div className="relative h-[260px] w-[260px] sm:h-[320px] sm:w-[320px]">
              <img
                src="/img/ISOTIPO.png"
                alt="Isotipo Atlas del Post-Extractivismo"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </header>

        <section className="mt-20">
          <p className="uppercase tracking-[0.45em] text-xs text-slate-400">
            Equipo de trabajo
          </p>
          <h2
            className={`mt-4 text-3xl text-slate-900 lg:text-4xl ${serifHeadingClass}`}
          >
            Proyecto de creación interdisciplinaria
          </h2>
        </section>

        <div className="mt-14 space-y-16">
          {teamSections.map((section) => (
            <TeamSection key={section.title} section={section} />
          ))}
        </div>
      </section>
    </div>
  )
}

function TeamSection({ section }) {
  return (
    <section className="rounded-[36px] border border-slate-100 bg-white/60 p-6 shadow-lg shadow-slate-100/60 backdrop-blur lg:p-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div>
          <h3 className={`text-2xl text-slate-900 ${serifHeadingClass}`}>
            {section.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {section.description}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {section.members.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamMemberCard({ member }) {
  return (
    <article className="flex flex-col items-center rounded-3xl border border-slate-200/80 bg-white/80 p-5 text-center shadow-sm shadow-slate-200/60">
      <div className="flex h-32 w-full items-center justify-center">
        {member.imageSrc ? (
          <img
            src={member.imageSrc}
            alt={member.name}
            className={`border border-slate-100 shadow ${member.isLogo ? 'h-20 w-auto max-w-[9rem] rounded-2xl bg-white object-contain px-4 py-3' : 'h-28 w-28 rounded-full object-cover'}`}
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xl font-semibold text-slate-500 shadow-inner">
            {member.initials ?? member.name.charAt(0)}
          </div>
        )}
      </div>
      <p className="mt-4 text-base font-semibold text-slate-900">{member.name}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        {member.role}
      </p>
    </article>
  )
}
