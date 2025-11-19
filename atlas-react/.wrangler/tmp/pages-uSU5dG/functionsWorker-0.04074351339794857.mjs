var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../src/shared/data/atlasContent.js
var atlasContent = {
  hero: {
    title: "Atlas del (Post) Extractivismo",
    subtitle: "Entre norte y sur global",
    description: "Explora esta plataforma digital, recorre paisajes y din\xE1micas marcadas por la extracci\xF3n de materias primas, descubre c\xF3mo estas pr\xE1cticas han reconfigurado ecosistemas terrestres y marinos. Te invitamos a comprender el extractivismo desde la experiencia y el territorio.",
    image_path: "/img/mapa-global.jpg"
  },
  affectationTypes: [
    {
      id: 1,
      slug: "biotic",
      name: "Paisajes bioticos",
      description: "Transformaciones que impactan seres vivos del ecosistema como flora, fauna, microorganismos o comunidades mas que humanas.",
      icon_path: "/img/icono_biotico_negro.svg"
    },
    {
      id: 2,
      slug: "anthropic",
      name: "Paisajes antropicos",
      description: "Consecuencias generadas por la intervencion humana en el territorio, ya sea por accion directa o indirecta.",
      icon_path: "/img/icono_antropico_negro.svg"
    },
    {
      id: 3,
      slug: "physical",
      name: "Paisajes fisicos",
      description: "Transformaciones del suelo y relieve originadas por la accion extractiva sobre el territorio.",
      icon_path: "/img/icono_fisico_negro.svg"
    }
  ],
  tags: [
    { id: 1, name: "fauna" },
    { id: 2, name: "flora" },
    { id: 3, name: "aves" },
    { id: 4, name: "biotico" },
    { id: 5, name: "antropico" },
    { id: 6, name: "fisico" },
    { id: 7, name: "infraestructura" },
    { id: 8, name: "energia" },
    { id: 9, name: "glaciar" },
    { id: 10, name: "suelo" },
    { id: 11, name: "erosion" }
  ],
  caseOfStudies: [
    {
      id: 1,
      slug: "provincia-choapa",
      title: "Provincia de Choapa",
      summary: 'La miner\xEDa en el norte de Chile enfrenta una crisis h\xEDdrica que ha llevado una nueva era de plantas desalinizadoras que extraen agua del oc\xE9ano Pac\xEDfico. Aunque la desalinizaci\xF3n ofrece una propuesta "verde", mira como su sostenimiento puede generar controversias socio-ecol\xF3gicas.',
      image_path: "/img/cases-of-study/provincia-choapa/choapaoficial-1000.jpg",
      detail_image_path: "/img/cases-of-study/provincia-choapa/mapa-global-de-cobre-T.jpg",
      position_left: 29,
      position_top: 65,
      color: "#d57a00",
      is_published: true,
      zones: [
        {
          id: 1,
          slug: "tranque-el-mauro",
          title: "Tranque el Mauro",
          image_path: null,
          position_left: 70,
          position_top: 55,
          scenes: [
            {
              id: 1,
              slug: "arraigo-y-terrateniencia",
              title: "Arraigo y terrateniencia",
              image_path: null,
              position_left: 86,
              position_top: 36,
              affectation_type_id: "anthropic",
              decoration_image_path: "/img/cases-of-study/provincia-choapa/zones/tranque-el-mauro/escenes/arraigo-y-terrateniencia/caimanes.webp",
              decoration_position_left: 61,
              decoration_position_top: 56,
              decoration_width_vw: 7,
              decoration_tooltip: "Arraigo y terrateniencia",
              elements: []
            },
            {
              id: 2,
              slug: "quebrada",
              title: "Quebrada",
              image_path: null,
              position_left: 75.5,
              position_top: 73,
              affectation_type_id: "biotic",
              decoration_image_path: "/img/cases-of-study/provincia-choapa/zones/tranque-el-mauro/escenes/quebrada/quebrada.webp",
              decoration_position_left: 82,
              decoration_position_top: 57,
              decoration_width_vw: 12,
              decoration_tooltip: "Santuario de la naturaleza",
              elements: []
            },
            {
              id: 3,
              slug: "petroglifos",
              title: "Petroglifos",
              image_path: null,
              position_left: 17,
              position_top: 84,
              affectation_type_id: "anthropic",
              decoration_image_path: "/img/cases-of-study/provincia-choapa/zones/tranque-el-mauro/escenes/petroglifos/petroglifos.webp",
              decoration_position_left: 74,
              decoration_position_top: 46.5,
              decoration_width_vw: 9.5,
              decoration_tooltip: "Ecosistema Tranque",
              elements: []
            }
          ]
        },
        {
          id: 2,
          slug: "yacimiento-minero",
          title: "Yacimiento Minero",
          image_path: null,
          position_left: 37,
          position_top: 26,
          scenes: [
            {
              id: 4,
              slug: "area-chacay",
              title: "\xC1rea Chacay",
              image_path: null,
              position_left: 86,
              position_top: 36,
              affectation_type_id: "anthropic",
              decoration_image_path: "/img/cases-of-study/provincia-choapa/zones/yacimiento-minero/escenes/area-chacay/chacay.webp",
              decoration_position_left: 48,
              decoration_position_top: 30,
              decoration_width_vw: 7,
              decoration_tooltip: "\xC1rea Chacay",
              elements: []
            },
            {
              id: 5,
              slug: "botadero-las-hualtatas",
              title: "Botadero las Hualtatas",
              image_path: null,
              position_left: 75.5,
              position_top: 73,
              affectation_type_id: "biotic",
              decoration_image_path: "/img/cases-of-study/provincia-choapa/zones/yacimiento-minero/escenes/botadero-las-hualtatas/hualtatas.webp",
              decoration_position_left: 33.5,
              decoration_position_top: 24,
              decoration_width_vw: 10,
              decoration_tooltip: "Botadero las Hualtatas",
              elements: []
            },
            {
              id: 6,
              slug: "glaciares",
              title: "Glaciares",
              image_path: null,
              position_left: 17,
              position_top: 84,
              affectation_type_id: "physical",
              decoration_image_path: "/img/cases-of-study/provincia-choapa/zones/yacimiento-minero/escenes/glaciares/glaciares.webp",
              decoration_position_left: 39.1,
              decoration_position_top: 19.1,
              decoration_width_vw: 12,
              decoration_tooltip: "Glaciares",
              elements: [
                {
                  id: 1,
                  slug: "retroceso-glaciar",
                  title: "Retroceso glaciar",
                  subtitle: "Retroceso glaciar",
                  description: "El retroceso de los glaciares en la zona es una consecuencia directa de las actividades extractivas que alteran el relieve y la hidrolog\xEDa local. La transformaci\xF3n f\xEDsica del territorio afecta los flujos de agua y la estabilidad del suelo glaciar.",
                  source: "Fuente: Observaciones de cambio clim\xE1tico y actividad extractiva en la zona central de Chile.",
                  image_path: "/img/cases-of-study/provincia-choapa/zones/yacimiento-minero/escenes/glaciares/glaciares.webp",
                  position_left: 35,
                  position_top: 40,
                  affectation_type_id: "physical",
                  tags: ["glaciar", "fisico", "suelo"]
                },
                {
                  id: 2,
                  slug: "erosion-suelo",
                  title: "Erosi\xF3n del suelo",
                  subtitle: "Erosi\xF3n del suelo",
                  description: "Las operaciones mineras generan una transformaci\xF3n profunda del relieve, causando erosi\xF3n acelerada del suelo. La remoci\xF3n de vegetaci\xF3n y la exposici\xF3n de materiales geol\xF3gicos alteran permanentemente la morfolog\xEDa del terreno.",
                  source: "Fuente: Estudios de impacto ambiental de proyectos extractivos en Chile.",
                  image_path: "/img/cases-of-study/provincia-choapa/zones/yacimiento-minero/escenes/glaciares/glaciares.webp",
                  position_left: 60,
                  position_top: 55,
                  affectation_type_id: "physical",
                  tags: ["erosion", "fisico", "suelo"]
                }
              ]
            }
          ]
        },
        {
          id: 3,
          slug: "puerto-punta-chungo",
          title: "Puerto Punta Chungo",
          image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/puerto-punta-chungo.jpg",
          position_left: 50,
          position_top: 81,
          scenes: [
            {
              id: 7,
              slug: "perturbacion-aerea",
              title: "Perturbacion aerea",
              image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/ecosistema-aereo.png",
              position_left: 59.5,
              position_top: 70,
              affectation_type_id: "anthropic",
              decoration_image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/bosques.webp",
              decoration_position_left: 56,
              decoration_position_top: 71,
              decoration_width_vw: 10,
              decoration_tooltip: "Perturbaci\xF3n a\xE9rea",
              elements: [
                {
                  id: 3,
                  slug: "jilguero",
                  title: "Jilguero (Sicalis luteola)",
                  subtitle: "Jilguero",
                  description: "El jilguero destaca dentro de la zona como una de las especies mas abundantes y distribuidas en diversos ambientes. Se encuentra mayormente en matorral costero (6,11 ind/ha), pradera costera (4,81 ind/ha) y plantaciones (2,11 ind/ha).",
                  source: "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulo 4.4, pp. 860-861). SEA, Chile.",
                  image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/jilguero/jilguero.jpg",
                  detail_image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/jilguero/jilguero.png",
                  position_left: 24.5,
                  position_top: 32,
                  affectation_type_id: "biotic",
                  tags: ["fauna", "aves", "biotico"]
                },
                {
                  id: 4,
                  slug: "jote",
                  title: "Jote de cabeza negra (Coragyps atratus)",
                  subtitle: "Jote de cabeza negra",
                  description: "En el area de Puerto Punta Chungo, las lineas electricas de 220 kV afectan a las aves por riesgo de electrocucion y colision, interrumpiendo sus rutas de vuelo. Una de las especies mas afectadas es el jote de cabeza negra, con 67 individuos registrados (8,21 %). Para mitigar el impacto se instalan dispositivos anticolision visibles incluso para aves nocturnas.",
                  source: "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulo 4, p. 796). SEA, Chile.",
                  image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/jote-cabeza-negra/jote-cabeza-negra.jpg",
                  detail_image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/jote-cabeza-negra/jote-cabeza-negra.png",
                  position_left: 47.5,
                  position_top: 34.5,
                  affectation_type_id: "biotic",
                  tags: ["fauna", "aves", "infraestructura"]
                },
                {
                  id: 5,
                  slug: "diuca",
                  title: "Diuca",
                  subtitle: "Diuca",
                  description: "Aunque no es una especie directamente impactada segun los estudios evaluados, su presencia en zonas intervenidas por infraestructura extractiva como luminarias o tendido electrico indica familiaridad con ambientes tecnificados. Esta ave se registra como una de las especies con mayor presencia en la zona.",
                  source: "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulo 3.15, pp. 285-287). SEA, Chile.",
                  image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/diuca/diuca.jpg",
                  detail_image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/diuca/diuca.png",
                  position_left: 74,
                  position_top: 28,
                  affectation_type_id: "biotic",
                  tags: ["fauna", "aves", "biotico"]
                },
                {
                  id: 6,
                  slug: "eucalipto",
                  title: "Bosques de evapotranspiracion",
                  subtitle: "Bosques de evapotranspiraci\xF3n",
                  description: "En Puerto Punta Chungo las plantaciones de Eucalyptus globulus cubren 109,13 hectareas (43,8 % del area de influencia), siendo la vegetacion dominante, con un indice de artificializacion de 9,4. Su riego por microaspersor en primavera-verano intensifica la evapotranspiracion junto al puerto.",
                  source: "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulos 3.13 y 4). SEA, Chile.",
                  image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/bosques-evapotranspiracion/bosques-de-evapotranspiracion.jpg",
                  detail_image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/bosques-evapotranspiracion/eucalipto.png",
                  position_left: 52,
                  position_top: 78,
                  affectation_type_id: "physical",
                  tags: ["flora", "infraestructura", "fisico"]
                },
                {
                  id: 7,
                  slug: "luminaria",
                  title: "Luz del puerto",
                  subtitle: "Luminaria",
                  description: "Se reemplazaron 1.912 luminarias distribuidas en varias areas del proyecto, incluyendo Puerto Punta Chungo. La potencia total instalada en esta zona es de 27,15 kW. La iluminacion en el puerto genera impacto visual nocturno y contribuye a la contaminacion luminica que altera patrones de fauna local.",
                  source: "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulo 3.5, p. 3-15). SEA, Chile.",
                  image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/torres-iluminacion/luz-puerto.jpg",
                  detail_image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/torres-iluminacion/torres-iluminacion.png",
                  position_left: 36.7,
                  position_top: 45,
                  affectation_type_id: "anthropic",
                  tags: ["infraestructura", "energia", "antropico"]
                },
                {
                  id: 8,
                  slug: "electricidad",
                  title: "Lineas de transmision electrica",
                  subtitle: "L\xEDneas de transmisi\xF3n el\xE9ctrica",
                  description: "El tendido electrico en Puerto Punta Chungo incluye lineas de transmision de 220 kV en doble circuito, esenciales para operar la planta desaladora. Su instalacion afecta rutas de vuelo de aves marinas y genera campos electromagneticos de baja intensidad en zonas ecologicas.",
                  source: "Fuente: Minera Los Pelambres (2024). Estudio de Impacto Ambiental (Capitulo 4.4, pp. 243-245). SEA, Chile.",
                  image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/lineas-electricas/cables-electricos.jpg",
                  detail_image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/perturbacion-aerea/elements/lineas-electricas/lineas-electricas.png",
                  position_left: 84,
                  position_top: 48,
                  affectation_type_id: "anthropic",
                  tags: ["infraestructura", "energia", "antropico"]
                }
              ]
            },
            {
              id: 8,
              slug: "contaminacion-por-desalacion",
              title: "Contaminacion por desalacion",
              image_path: null,
              position_left: 86,
              position_top: 36,
              affectation_type_id: "anthropic",
              decoration_image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/contaminacion-por-desalacion/salmuera.webp",
              decoration_position_left: 55.5,
              decoration_position_top: 89.8,
              decoration_width_vw: 10,
              decoration_tooltip: "Salmuera",
              elements: []
            },
            {
              id: 9,
              slug: "vibraciones-submarinas",
              title: "Vibraciones submarinas",
              image_path: null,
              position_left: 75.5,
              position_top: 73,
              affectation_type_id: "biotic",
              decoration_image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/vibraciones-submarinas/isla-huevos.webp",
              decoration_position_left: 67,
              decoration_position_top: 86,
              decoration_width_vw: 7,
              decoration_tooltip: "Isla Huevo",
              elements: []
            },
            {
              id: 10,
              slug: "santuario-de-la-naturaleza",
              title: "Santuario de la naturaleza",
              image_path: null,
              position_left: 17,
              position_top: 84,
              affectation_type_id: "biotic",
              decoration_image_path: "/img/cases-of-study/provincia-choapa/zones/puerto-punta-chungo/escenes/santuario-de-la-naturaleza/santuario.webp",
              decoration_position_left: 41,
              decoration_position_top: 82,
              decoration_width_vw: 9,
              decoration_tooltip: "Santuario de la naturaleza",
              elements: []
            }
          ]
        }
      ]
    },
    {
      id: 2,
      slug: "congo",
      title: "Kolwezi - Congo",
      summary: "En las \xFAltimas dos d\xE9cadas, Kolwezi, ciudad minera de la Rep\xFAblica Democr\xE1tica del Congo, enfrenta tensiones entre la miner\xEDa, la degradaci\xF3n ambiental y la r\xE1pida urbanizaci\xF3n que reconfigura los paisajes como rastros extractivos, minas expuestas, escombreras y sitios abandonados.",
      image_path: "/img/cases-of-study/kolwezi-congo/mapa-global-de-cobalto-T.jpg",
      detail_image_path: "/img/cases-of-study/kolwezi-congo/mapa-global-de-cobalto-T.jpg",
      position_left: 29.5,
      position_top: 43,
      color: "#443ad4ff",
      is_published: false,
      zones: []
    },
    {
      id: 3,
      slug: "indonesia",
      title: "Sumatera Utara - Indonesia",
      summary: "Una de las regiones de aceite de palma m\xE1s productivas del mundo ha configurado un paisaje de extracci\xF3n agroindustrial, donde los ciclos de siembra y resiembra desplazan comunidades, reordenan los ecosistemas y consolidan un r\xE9gimen de monocultivo.",
      image_path: "/img/cases-of-study/sumatera-utara-indonesia/mapa-global-de-aceite-T.jpg",
      detail_image_path: "/img/cases-of-study/sumatera-utara-indonesia/mapa-global-de-aceite-T.jpg",
      position_left: 35.7,
      position_top: 42,
      color: "#e4db66ff",
      is_published: false,
      zones: []
    },
    {
      id: 4,
      slug: "charleroi",
      title: "Charleroi - B\xE9lgica",
      summary: "El carb\xF3n en la d\xE9cada de los 90 era l\xEDder mundial en B\xE9lgica. Hoy en d\xEDa, Charleroi es un territorio post-extractivista en transici\xF3n, donde el patrimonio industrial se cruza con la reconversi\xF3n econ\xF3mica y social.",
      image_path: "/img/cases-of-study/charleroi-b\xE9lgica/mapa-global-de-carbon-T.jpg",
      detail_image_path: "/img/cases-of-study/charleroi-b\xE9lgica/mapa-global-de-carbon-T.jpg",
      position_left: 27.5,
      position_top: 34,
      color: "#1a1a1a",
      is_published: false,
      zones: []
    }
  ]
};

// api/atlas-data.js
async function onRequestGet(context) {
  console.log("[atlas-data] env bindings:", Object.keys(context.env || {}));
  const db = context.env["atlas-db"];
  console.log("[atlas-data] db binding:", !!db);
  try {
    if (!db) {
      throw new Error("D1 binding 'atlas-db' not found in context.env");
    }
    const [
      atlasOverviewResult,
      caseStudiesResult,
      zonesResult,
      scenesResult,
      elementsResult,
      affectationTypesResult,
      tagsResult,
      elementTagsResult
    ] = await Promise.all([
      db.prepare(
        "SELECT * FROM AtlasOverview ORDER BY id DESC LIMIT 1"
      ).all(),
      db.prepare("SELECT * FROM CaseOfStudies").all(),
      db.prepare("SELECT * FROM Zones").all(),
      db.prepare("SELECT * FROM Scenes").all(),
      db.prepare("SELECT * FROM Elements").all(),
      db.prepare("SELECT * FROM AffectationTypes").all(),
      db.prepare("SELECT * FROM Tags").all(),
      db.prepare("SELECT * FROM ElementTags").all()
    ]);
    const atlasOverview = atlasOverviewResult.results;
    const caseStudies = caseStudiesResult.results;
    const zones = zonesResult.results;
    const scenes = scenesResult.results;
    const elements = elementsResult.results;
    const affectationTypes = affectationTypesResult.results;
    const tags = tagsResult.results;
    const elementTags = elementTagsResult.results;
    const affectationTypeById = new Map(
      affectationTypes.map((at) => [at.id, at])
    );
    const tagById = new Map(tags.map((t) => [t.id, t]));
    const elementTagsMap = /* @__PURE__ */ new Map();
    for (const et of elementTags) {
      if (!elementTagsMap.has(et.element_id)) {
        elementTagsMap.set(et.element_id, []);
      }
      const tag = tagById.get(et.tag_id);
      if (tag) {
        elementTagsMap.get(et.element_id).push(tag.name);
      }
    }
    const elementsBySceneId = /* @__PURE__ */ new Map();
    for (const element of elements) {
      if (!elementsBySceneId.has(element.scene_id)) {
        elementsBySceneId.set(element.scene_id, []);
      }
      const affectationType = affectationTypeById.get(element.affectation_type_id);
      elementsBySceneId.get(element.scene_id).push({
        id: element.id,
        slug: element.slug,
        title: element.title,
        subtitle: element.subtitle,
        description: element.description,
        source: element.source,
        image_path: element.image_path,
        detail_image_path: element.detail_image_path,
        position_left: element.position_left,
        position_top: element.position_top,
        affectation_type_id: affectationType ? affectationType.slug : null,
        tags: elementTagsMap.get(element.id) || []
      });
    }
    const scenesByZoneId = /* @__PURE__ */ new Map();
    for (const scene of scenes) {
      if (!scenesByZoneId.has(scene.zone_id)) {
        scenesByZoneId.set(scene.zone_id, []);
      }
      const affectationType = affectationTypeById.get(scene.affectation_type_id);
      scenesByZoneId.get(scene.zone_id).push({
        id: scene.id,
        slug: scene.slug,
        title: scene.title,
        summary: scene.summary,
        image_path: scene.image_path,
        position_left: scene.position_left,
        position_top: scene.position_top,
        affectation_type_id: affectationType ? affectationType.slug : null,
        decoration_image_path: scene.decoration_image_path,
        decoration_position_left: scene.decoration_position_left,
        decoration_position_top: scene.decoration_position_top,
        decoration_width_vw: scene.decoration_width_vw,
        decoration_tooltip: scene.decoration_tooltip,
        elements: elementsBySceneId.get(scene.id) || []
      });
    }
    const zonesByCaseStudyId = /* @__PURE__ */ new Map();
    for (const zone of zones) {
      if (!zonesByCaseStudyId.has(zone.case_study_id)) {
        zonesByCaseStudyId.set(zone.case_study_id, []);
      }
      zonesByCaseStudyId.get(zone.case_study_id).push({
        id: zone.id,
        slug: zone.slug,
        title: zone.title,
        summary: zone.summary,
        image_path: zone.image_path,
        position_left: zone.position_left,
        position_top: zone.position_top,
        scenes: scenesByZoneId.get(zone.id) || []
      });
    }
    const overviewHero = atlasOverview?.[0];
    const hero = overviewHero ? {
      title: overviewHero.title,
      subtitle: overviewHero.subtitle,
      description: overviewHero.description,
      image_path: overviewHero.image_path
    } : atlasContent.hero;
    const atlasContent2 = {
      hero,
      affectationTypes: affectationTypes.map((at) => ({
        id: at.id,
        slug: at.slug,
        name: at.name,
        description: at.description,
        icon_path: at.icon_path
      })),
      tags: tags.map((t) => ({
        id: t.id,
        name: t.name
      })),
      caseOfStudies: caseStudies.map((cs) => ({
        id: cs.id,
        slug: cs.slug,
        title: cs.title,
        summary: cs.summary,
        image_path: cs.image_path,
        detail_image_path: cs.detail_image_path,
        position_left: cs.position_left,
        position_top: cs.position_top,
        color: cs.color,
        is_published: Boolean(cs.is_published),
        zones: zonesByCaseStudyId.get(cs.id) || []
      }))
    };
    console.log("[atlas-data] Successfully fetched atlas data from D1.");
    return Response.json(atlasContent2, {
      status: 200,
      headers: { "X-Atlas-Data-Source": "d1" }
    });
  } catch (error) {
    console.error("[atlas-data] Error fetching atlas data from D1:", error);
    console.warn("[atlas-data] Falling back to static atlasContent data.");
    return Response.json(atlasContent, {
      status: 200,
      headers: { "X-Atlas-Data-Source": "static-fallback" }
    });
  }
}
__name(onRequestGet, "onRequestGet");

// ../.wrangler/tmp/pages-uSU5dG/functionsRoutes-0.5013080389254312.mjs
var routes = [
  {
    routePath: "/api/atlas-data",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-3dFk3j/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-3dFk3j/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.04074351339794857.mjs.map
