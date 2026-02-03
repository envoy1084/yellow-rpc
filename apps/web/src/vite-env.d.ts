/// <reference types="vite/client" />
/** biome-ignore-all lint/style/useConsistentTypeDefinitions: needed */

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
