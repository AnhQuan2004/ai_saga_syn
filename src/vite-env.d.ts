/// <reference types="vite/client" />

interface Window {
  ethereum?: any;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
