import { onRequestGet as __api_atlas_data_js_onRequestGet } from "C:\\Users\\k1ltr0\\Documents\\SolidCoreSolutions\\Atlas_Post_Extractivismo\\atlas-react\\functions\\api\\atlas-data.js"

export const routes = [
    {
      routePath: "/api/atlas-data",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_atlas_data_js_onRequestGet],
    },
  ]