export const atlasContent = {
  hero: {
    title: "Atlas del (Post) Extractivismo",
    subtitle: "Entre norte y sur global",
    description:
      "Explora esta plataforma digital, recorre paisajes y dinámicas marcadas por la extracción de materias primas, descubre cómo estas prácticas han reconfigurado ecosistemas terrestres y marinos. Te invitamos a comprender el extractivismo desde la experiencia y el territorio.",
    image_path: "/img/GLOBAL HOME AZUL NEGRO-100.jpg",
  },
  caseOfStudies: [
    {
      id: "provincia-choapa",
      title: "Provincia de Choapa",
      summary:
        'La minería en el norte de Chile enfrenta una crisis hídrica que ha llevado una nueva era de plantas desalinizadoras que extraen agua del océano Pacífico. Aunque la desalinización ofrece una propuesta "verde", mira como su sostenimiento puede generar controversias socio-ecológicas.',
      image_path: "/img/choapaoficial-1000.jpg",
      detail_image_path: "/img/mapa-global-de-cobre-T.jpg",
      position_left: 29,
      position_top: 65,
      color: "#d57a00",
      variant: "default",
      navigateTo: "/casos-de-estudio/provincia-choapa",
      filterDescriptions: {
        biotic: {
          title: "Paisajes bioticos",
          text: "Transformaciones que impactan seres vivos del ecosistema como flora, fauna, microorganismos o comunidades mas que humanas.",
        },
        anthropic: {
          title: "Paisajes antropicos",
          text: "Consecuencias generadas por la intervencion humana en el territorio, ya sea por accion directa o indirecta.",
        },
        physical: {
          title: "Paisajes fisicos",
          text: "Transformaciones del suelo y relieve originadas por la accion extractiva sobre el territorio.",
        },
      },
      zones: [
        {
          id: "tranque-el-mauro",
          title: "Tranque el Mauro",
          image_path: null,
          position_left: 70,
          position_top: 55,
          escenes: [],
          decorations: [
            {
              id: "decoracion-caimanes",
              image_path: "/img/caimanes.webp",
              position_left: 61,
              position_top: 56,
              widthVw: 7,
              type: "anthropic",
              tooltip: "Arraigo y terrateniencia",
            },
            {
              id: "decoracion-quebrada",
              image_path: "/img/quebrada.webp",
              position_left: 82,
              position_top: 57,
              widthVw: 12,
              type: "biotic",
              tooltip: "Santuario de la naturaleza",
            },
            {
              id: "decoracion-petroglifos",
              image_path: "/img/petroglifos.webp",
              position_left: 73,
              position_top: 46.5,
              widthVw: 9,
              type: "anthropic",
              tooltip: "Ecosistema Tranque",
            },
          ],
        },
        {
          id: "yacimiento-minero",
          title: "Yacimiento Minero",
          image_path: null,
          position_left: 37,
          position_top: 26,
          escenes: [],
          decorations: [
            {
              id: "decoracion-chacay",
              image_path: "/img/chacay.webp",
              position_left: 47,
              position_top: 32,
              widthVw: 8,
              type: "anthropic",
              tooltip: "Área Chacay",
            },
            {
              id: "decoracion-hualtatas",
              image_path: "/img/hualtatas.webp",
              position_left: 33.5,
              position_top: 24,
              widthVw: 10,
              type: "biotic",
              tooltip: "Botadero las Hualtatas",
            },
            {
              id: "decoracion-glaciares",
              image_path: "/img/glaciaress_1.png",
              position_left: 39.1,
              position_top: 19.1,
              widthVw: 12,
              type: "physical",
              tooltip: "Glaciares",
            },
          ],
        },
        {
          id: "puerto-punta-chungo",
          title: "Puerto Punta Chungo",
          image_path: "/img/VistaPuertodefiniva.png",
          position_left: 50,
          position_top: 81,
          escenes: [
            {
              id: "perturbacion-aerea",
              title: "Perturbacion aerea",
              image_path: "/img/Ecosistema aereo actualizado.PNG",
              position_left: 59.5,
              position_top: 70,
              escene_type: {
                id: 1,
                name: "anthropic",
              },
              elements: [
                {
                  id: "jilguero",
                  title: "Jilguero (Sicalis luteola)",
                  description:
                    "El jilguero destaca dentro de la zona como una de las especies mas abundantes y distribuidas en diversos ambientes. Se encuentra mayormente en matorral costero (6,11 ind/ha), pradera costera (4,81 ind/ha) y plantaciones (2,11 ind/ha).",
                  source:
                    "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulo 4.4, pp. 860-861). SEA, Chile.",
                  image_path: "/img/jilguero-100.jpg",
                  position_left: 24.5,
                  position_top: 32,
                  affectation_type: {
                    id: "afectacion-biotica",
                    name: "Afectacion biotica",
                  },
                  keywords: [
                    { id: "tag-fauna", name: "fauna" },
                    { id: "tag-aves", name: "aves" },
                    { id: "tag-biotico", name: "biotico" },
                  ],
                },
                {
                  id: "jote",
                  title: "Jote de cabeza negra (Coragyps atratus)",
                  description:
                    "En el area de Puerto Punta Chungo, las lineas electricas de 220 kV afectan a las aves por riesgo de electrocucion y colision, interrumpiendo sus rutas de vuelo. Una de las especies mas afectadas es el jote de cabeza negra, con 67 individuos registrados (8,21 %). Para mitigar el impacto se instalan dispositivos anticolision visibles incluso para aves nocturnas.",
                  source:
                    "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulo 4, p. 796). SEA, Chile.",
                  image_path: "/img/jotefondo-100.jpg",
                  position_left: 47.5,
                  position_top: 34.5,
                  affectation_type: {
                    id: "afectacion-biotica",
                    name: "Afectacion biotica",
                  },
                  keywords: [
                    { id: "tag-fauna", name: "fauna" },
                    { id: "tag-aves", name: "aves" },
                    { id: "tag-infraestructura", name: "infraestructura" },
                  ],
                },
                {
                  id: "diuca",
                  title: "Diuca",
                  description:
                    "Aunque no es una especie directamente impactada segun los estudios evaluados, su presencia en zonas intervenidas por infraestructura extractiva como luminarias o tendido electrico indica familiaridad con ambientes tecnificados. Esta ave se registra como una de las especies con mayor presencia en la zona.",
                  source:
                    "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulo 3.15, pp. 285-287). SEA, Chile.",
                  image_path: "/img/diucafondo-100.jpg",
                  position_left: 74,
                  position_top: 28,
                  affectation_type: {
                    id: "afectacion-biotica",
                    name: "Afectacion biotica",
                  },
                  keywords: [
                    { id: "tag-fauna", name: "fauna" },
                    { id: "tag-aves", name: "aves" },
                    { id: "tag-biotico", name: "biotico" },
                  ],
                },
                {
                  id: "eucalipto",
                  title: "Bosques de evapotranspiracion",
                  description:
                    "En Puerto Punta Chungo las plantaciones de Eucalyptus globulus cubren 109,13 hectareas (43,8 % del area de influencia), siendo la vegetacion dominante, con un indice de artificializacion de 9,4. Su riego por microaspersor en primavera-verano intensifica la evapotranspiracion junto al puerto.",
                  source:
                    "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulos 3.13 y 4). SEA, Chile.",
                  image_path: "/img/eucaliptofondo-100.jpg",
                  position_left: 52,
                  position_top: 78,
                  affectation_type: {
                    id: "afectacion-antropica",
                    name: "Afectacion antropica",
                  },
                  keywords: [
                    { id: "tag-flora", name: "flora" },
                    { id: "tag-infraestructura", name: "infraestructura" },
                    { id: "tag-antropico", name: "antropico" },
                  ],
                },
                {
                  id: "luminaria",
                  title: "Luz del puerto",
                  description:
                    "Se reemplazaron 1.912 luminarias distribuidas en varias areas del proyecto, incluyendo Puerto Punta Chungo. La potencia total instalada en esta zona es de 27,15 kW. La iluminacion en el puerto genera impacto visual nocturno y contribuye a la contaminacion luminica que altera patrones de fauna local.",
                  source:
                    "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulo 3.5, p. 3-15). SEA, Chile.",
                  image_path: "/img/luminariafondo-100.jpg",
                  position_left: 36.7,
                  position_top: 45,
                  affectation_type: {
                    id: "afectacion-antropica",
                    name: "Afectacion antropica",
                  },
                  keywords: [
                    { id: "tag-infraestructura", name: "infraestructura" },
                    { id: "tag-energia", name: "energia" },
                    { id: "tag-antropico", name: "antropico" },
                  ],
                },
                {
                  id: "electricidad",
                  title: "Lineas de transmision electrica",
                  description:
                    "El tendido electrico en Puerto Punta Chungo incluye lineas de transmision de 220 kV en doble circuito, esenciales para operar la planta desaladora. Su instalacion afecta rutas de vuelo de aves marinas y genera campos electromagneticos de baja intensidad en zonas ecologicas.",
                  source:
                    "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulo 4.4, pp. 243-245). SEA, Chile.",
                  image_path: "/img/electricidadfondo-100.jpg",
                  position_left: 84,
                  position_top: 48,
                  affectation_type: {
                    id: "afectacion-antropica",
                    name: "Afectacion antropica",
                  },
                  keywords: [
                    { id: "tag-infraestructura", name: "infraestructura" },
                    { id: "tag-energia", name: "energia" },
                    { id: "tag-antropico", name: "antropico" },
                  ],
                },
              ],
            },
            {
              id: "contaminacion-por-desalacion",
              title: "Contaminacion por desalacion",
              image_path: null,
              position_left: 86,
              position_top: 36,
              escene_type: {
                id: 1,
                name: "anthropic",
              },
              elements: [],
            },
            {
              id: "vibraciones-submarinas",
              title: "Vibraciones submarinas",
              image_path: null,
              position_left: 75.5,
              position_top: 73,
              escene_type: {
                id: 1,
                name: "biotic",
              },
              elements: [],
            },
            {
              id: "santuario-de-la-naturaleza",
              title: "Santuario de la naturaleza",
              image_path: null,
              position_left: 17,
              position_top: 84,
              escene_type: {
                id: 1,
                name: "biotic",
              },
              elements: [],
            },
          ],
          decorations: [
            {
              id: "decoracion-islahuevos",
              image_path: "/img/islahuevos.webp",
              position_left: 67,
              position_top: 86,
              widthVw: 7,
              type: "biotic",
              tooltip: "Isla Huevo",
            },
            {
              id: "decoracion-salmuera",
              image_path: "/img/salmuera.webp",
              position_left: 55.5,
              position_top: 89.8,
              widthVw: 10,
              type: "anthropic",
              tooltip: "Salmuera",
            },
            {
              id: "decoracion-santuario",
              image_path: "/img/santuario.webp",
              position_left: 41,
              position_top: 82,
              widthVw: 9,
              type: "biotic",
              tooltip: "Santuario de la naturaleza",
            },
            {
              id: "decoracion-bosques",
              image_path: "/img/bosques.webp",
              position_left: 56,
              position_top: 71,
              widthVw: 10,
              type: "anthropic",
              tooltip: "Perturbación aérea",
            },
          ],
        },
      ],
    },
    {
      id: "congo",
      title: "Kolwezi – Congo",
      summary:
        "En las últimas dos décadas, Kolwezi, ciudad minera de la República Democrática del Congo, enfrenta tensiones entre la minería, la degradación ambiental y la rápida urbanización que reconfigura los paisajes como rastros extractivos, minas expuestas, escombreras y sitios abandonados.",
      image_path: "/img/mapa-global-de-cobalto-T.jpg",
      detail_image_path: "/img/mapa-global-de-cobalto-T.jpg",
      position_left: 29.5,
      position_top: 43,
      color: "#443ad4ff",
      variant: "blue",
      navigateTo: null,
      zones: [],
    },
    {
      id: "indonesia",
      title: "Sumatera Utara – Indonesia",
      summary:
        "Una de las regiones de aceite de palma más productivas del mundo ha configurado un paisaje de extracción agroindustrial, donde los ciclos de siembra y resiembra desplazan comunidades, reordenan los ecosistemas y consolidan un régimen de monocultivo.",
      image_path: "/img/mapa-global-de-aceite-T.jpg",
      detail_image_path: "/img/mapa-global-de-aceite-T.jpg",
      position_left: 35.7,
      position_top: 42,
      color: "#e4db66ff",
      variant: "yellow",
      navigateTo: null,
      zones: [],
    },
    {
      id: "charleroi",
      title: "Charleroi – Bélgica",
      summary:
        "El carbón en la década de los 90 era líder mundial en Bélgica. Hoy en día, Charleroi es un territorio post-extractivista en transición, donde el patrimonio industrial se cruza con la reconversión económica y social.",
      image_path: "/img/mapa-global-de-carbon-T.jpg",
      detail_image_path: "/img/mapa-global-de-carbon-T.jpg",
      position_left: 27.5,
      position_top: 34,
      color: "#1a1a1a",
      variant: "black",
      navigateTo: null,
      zones: [],
    },
  ],
};
