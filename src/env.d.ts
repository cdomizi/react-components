/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_BASE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
