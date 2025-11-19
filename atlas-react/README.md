# Atlas React

Aplicación React + Vite para el Atlas del (Post) Extractivismo. Incluye funciones de Cloudflare Pages ( `/functions` ) y una base de datos D1.

## Scripts principales

* `npm run dev` &rarr; Vite dev server sin funciones de Cloudflare.
* `wrangler pages dev --d1 atlas-db` &rarr; Servir `dist/` + Functions + D1 local.
* `npm run build` &rarr; Construye `dist/`.
* `npm run preview` &rarr; Sirve el build estatico de Vite.

## D1 (local y remoto)

Generamos un archivo `database/d1-seed.sql` a partir de `src/shared/data/atlasContent.js` y lo inyectamos a la base D1:

* `npm run d1:generate-seed` &rarr; Regenera `database/d1-seed.sql`.
* `npm run d1:seed` &rarr; Regenera el SQL y lo ejecuta contra la instancia local usada por `wrangler dev`.
* `npm run d1:seed:remote` &rarr; Igual que el anterior pero contra la base remota (requiere credenciales con `wrangler login`).

> Tip: si corres `npm run dev` (solo Vite) el endpoint `/api/atlas-data` no tendr�� acceso a D1, por lo que volver�� a los datos est��ticos. Para probar la API con D1 usa `wrangler pages dev --d1 atlas-db --kv atlas-...` (ver `wrangler.jsonc` ).
