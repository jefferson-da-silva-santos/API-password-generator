import NodeCache from "node-cache";

export const commonPasswordCache = new NodeCache({ stdTTL: 3600 });
export const passwordsGeneratedCache = new NodeCache({ stdTTL: 3600 });