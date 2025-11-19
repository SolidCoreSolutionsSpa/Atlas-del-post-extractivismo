import { atlasContent as staticAtlasContent } from "../../src/shared/data/atlasContent.js";

export async function onRequestGet(context) {
  const db = context.env["atlas-db"];

  try {
    if (!db) {
      console.warn(
        "[atlas-data] atlas-db binding not found. Serving static atlas data."
      );
      return Response.json(staticAtlasContent, {
        status: 200,
        headers: { "X-Atlas-Data-Source": "static" },
      });
    }

    // Query all tables in parallel
    const [
      caseStudiesResult,
      zonesResult,
      scenesResult,
      elementsResult,
      affectationTypesResult,
      tagsResult,
      elementTagsResult,
    ] = await Promise.all([
      db.prepare("SELECT * FROM CaseOfStudies WHERE is_published = 1").all(),
      db.prepare("SELECT * FROM Zones").all(),
      db.prepare("SELECT * FROM Scenes").all(),
      db.prepare("SELECT * FROM Elements").all(),
      db.prepare("SELECT * FROM AffectationTypes").all(),
      db.prepare("SELECT * FROM Tags").all(),
      db.prepare("SELECT * FROM ElementTags").all(),
    ]);

    const caseStudies = caseStudiesResult.results;
    const zones = zonesResult.results;
    const scenes = scenesResult.results;
    const elements = elementsResult.results;
    const affectationTypes = affectationTypesResult.results;
    const tags = tagsResult.results;
    const elementTags = elementTagsResult.results;

    // Build lookup maps for efficient joining
    const affectationTypeById = new Map(
      affectationTypes.map((at) => [at.id, at])
    );
    const tagById = new Map(tags.map((t) => [t.id, t]));

    // Build element tags lookup: element_id -> array of tag names
    const elementTagsMap = new Map();
    for (const et of elementTags) {
      if (!elementTagsMap.has(et.element_id)) {
        elementTagsMap.set(et.element_id, []);
      }
      const tag = tagById.get(et.tag_id);
      if (tag) {
        elementTagsMap.get(et.element_id).push(tag.name);
      }
    }

    // Build elements lookup: scene_id -> array of elements
    const elementsBySceneId = new Map();
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
        tags: elementTagsMap.get(element.id) || [],
      });
    }

    // Build scenes lookup: zone_id -> array of scenes
    const scenesByZoneId = new Map();
    for (const scene of scenes) {
      if (!scenesByZoneId.has(scene.zone_id)) {
        scenesByZoneId.set(scene.zone_id, []);
      }
      const affectationType = affectationTypeById.get(scene.affectation_type_id);
      scenesByZoneId.get(scene.zone_id).push({
        id: scene.id,
        slug: scene.slug,
        title: scene.title,
        image_path: scene.image_path,
        position_left: scene.position_left,
        position_top: scene.position_top,
        affectation_type_id: affectationType ? affectationType.slug : null,
        decoration_image_path: scene.decoration_image_path,
        decoration_position_left: scene.decoration_position_left,
        decoration_position_top: scene.decoration_position_top,
        decoration_width_vw: scene.decoration_width_vw,
        decoration_tooltip: scene.decoration_tooltip,
        elements: elementsBySceneId.get(scene.id) || [],
      });
    }

    // Build zones lookup: case_study_id -> array of zones
    const zonesByCaseStudyId = new Map();
    for (const zone of zones) {
      if (!zonesByCaseStudyId.has(zone.case_study_id)) {
        zonesByCaseStudyId.set(zone.case_study_id, []);
      }
      zonesByCaseStudyId.get(zone.case_study_id).push({
        id: zone.id,
        slug: zone.slug,
        title: zone.title,
        image_path: zone.image_path,
        position_left: zone.position_left,
        position_top: zone.position_top,
        scenes: scenesByZoneId.get(zone.id) || [],
      });
    }

    // Build the final atlasContent structure
    const atlasContent = {
      hero: {
        title: "Atlas del (Post) Extractivismo",
        subtitle: "Entre norte y sur global",
        description:
          "Explora esta plataforma digital, recorre paisajes y dinámicas marcadas por la extracción de materias primas, descubre cómo estas prácticas han reconfigurado ecosistemas terrestres y marinos. Te invitamos a comprender el extractivismo desde la experiencia y el territorio.",
        image_path: "/img/mapa-global.jpg",
      },
      affectationTypes: affectationTypes.map((at) => ({
        id: at.id,
        slug: at.slug,
        name: at.name,
        description: at.description,
        icon_path: at.icon_path,
      })),
      tags: tags.map((t) => ({
        id: t.id,
        name: t.name,
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
        zones: zonesByCaseStudyId.get(cs.id) || [],
      })),
    };

    console.log("[atlas-data] Successfully fetched atlas data from D1.");

    return Response.json(atlasContent, {
      status: 200,
      headers: { "X-Atlas-Data-Source": "d1" },
    });
  } catch (error) {
    console.error("[atlas-data] Error fetching atlas data from D1:", error);
    console.warn("[atlas-data] Falling back to static atlasContent data.");

    return Response.json(staticAtlasContent, {
      status: 200,
      headers: { "X-Atlas-Data-Source": "static-fallback" },
    });
  }
}
