import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { Breadcrumbs } from "../../shared/ui/Breadcrumbs";
import { InteractiveMap } from "../../shared/ui/InteractiveMap";
import { RotatingHotspot } from "../../shared/ui/RotatingHotspot";
import { ZoneDecoration } from "../../shared/ui/ZoneDecoration";
import { DescriptionModal } from "../../shared/ui/DescriptionModal";
import { FilterPanel } from "./FilterPanel";
import { useZoomNavigation } from "../../shared/hooks/useZoomNavigation.jsx";
import { CaseStudiesService } from "../services/caseStudiesService";
import { inMemoryCaseStudiesRepository } from "../repo/caseStudiesRepository";

const detailVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 18 },
  },
};

export function CaseStudyDetailPage() {
  const { caseStudyId } = useParams();
  const zoomNavigate = useZoomNavigation();
  const service = useMemo(
    () =>
      new CaseStudiesService({
        caseStudiesRepository: inMemoryCaseStudiesRepository,
      }),
    []
  );

  const [caseStudy, setCaseStudy] = useState(null);
  const [status, setStatus] = useState("loading");
  const [activeFilter, setActiveFilter] = useState(null);
  const [hoveredZoneId, setHoveredZoneId] = useState(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setStatus("loading");
      const data = await service.getById(caseStudyId);
      if (isMounted) {
        setCaseStudy(data);
        setStatus(data ? "ready" : "empty");
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [caseStudyId, service]);

  const breadcrumbItems = [
    { label: "Inicio", to: "/" },
    { label: caseStudy ? caseStudy.title : "Provincia" },
  ];

  if (status === "loading") {
    return (
      <motion.section
        className="relative min-h-screen"
        initial="hidden"
        animate="visible"
        variants={detailVariants}
      >
        <Breadcrumbs
          className="absolute left-4 top-16 sm:left-10 sm:top-20 lg:top-24"
          items={breadcrumbItems}
        />
        <div className="absolute inset-0 bg-token-divider" />
      </motion.section>
    );
  }

  if (!caseStudy) {
    return (
      <motion.section
        className="mx-auto flex w-[92%] max-w-4xl flex-col gap-6 pb-16"
        initial="hidden"
        animate="visible"
        variants={detailVariants}
      >
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-20 rounded-3xl border border-token-divider bg-token-surface p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-token-primary">
            Caso de estudio no encontrado
          </h2>
          <p className="mt-2 text-sm text-token-muted">
            Verifica el enlace o regresa al mapa global para seleccionar un
            punto disponible.
          </p>
          <button
            type="button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const origin = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              };
              zoomNavigate("/casos-de-estudio", { origin });
            }}
            className="mt-6 inline-flex items-center rounded-full bg-token-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-token-primary-strong"
          >
            Volver al mapa global
          </button>
        </div>
      </motion.section>
    );
  }

  const { detailMap } = caseStudy;

  if (!detailMap) {
    return (
      <motion.section
        className="mx-auto flex w-[92%] max-w-4xl flex-col gap-6 pb-16"
        initial="hidden"
        animate="visible"
        variants={detailVariants}
      >
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-20 rounded-3xl border border-token-divider bg-token-surface p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-token-primary">
            Mapa detallado no disponible
          </h2>
          <p className="mt-2 text-sm text-token-muted">
            Este caso de estudio aún no tiene un mapa detallado configurado.
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={detailVariants}
    >
      {/* Mapa con hotspots giratorios usando InteractiveMap */}
      <InteractiveMap
        imageSrc={detailMap.image}
        imageAlt={`Mapa de ${caseStudy.title}`}
        intensity={18}
        className="h-screen"
        objectFit="contain"
        blurredBackground={true}
        blurAmount={20}
        frame={false}
        overfill={1.28}
      >
        {detailMap.zones.map((zone) => (
          <RotatingHotspot
            key={zone.id}
            left={zone.position.left}
            top={zone.position.top}
            label={zone.name}
            active={!activeFilter} // Simplified active logic for now
            parallaxFactor={0.15}
            onMouseEnter={() => setHoveredZoneId(zone.id)}
            onMouseLeave={() => setHoveredZoneId(null)}
            onSelect={(event) => {
              if (!zone.id) return;
              const rect = event.currentTarget.getBoundingClientRect();
              const origin = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              };
              zoomNavigate(`/zonas/${zone.id}`, { origin });
            }}
          />
        ))}

        {/* Decoraciones de zonas */}
        {detailMap.decorations?.map((decoration) => {
          // Mostrar decoración si:
          // 1. Su zona está en hover, O
          // 2. El filtro activo coincide con su tipo
          const isVisible =
            hoveredZoneId === decoration.zoneId ||
            activeFilter === decoration.type;

          return (
            <ZoneDecoration
              key={decoration.id}
              image={decoration.image}
              tooltip={decoration.tooltip}
              position={decoration.position}
              type={decoration.type}
              visible={isVisible}
              parallaxFactor={0.15}
              widthVw={decoration.widthVw}
            />
          );
        })}
      </InteractiveMap>

      <Breadcrumbs
        className="absolute left-4 top-16 sm:left-10 sm:top-20 lg:top-24"
        items={breadcrumbItems}
      />

      <button
        onClick={() => setIsDescriptionModalOpen(true)}
        className="absolute top-28 right-12 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg transition hover:bg-white hover:scale-110 hover:shadow-xl"
        aria-label="Ver descripción de la provincia"
        title="Ver descripción"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <FilterPanel
        filterDescriptions={detailMap.filterDescriptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <DescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        title={caseStudy.title}
        description={caseStudy.summary}
      />
    </motion.section>
  );
}
