import { getAuthMode } from "../../../auth.js";
import comicsIndex from "../../../../server/comics";

export function GET() {
  return Response.json({
    authMode: getAuthMode(),
    indexReady: comicsIndex.isReady,
  });
}
