/**
 * Configuration centralisée de l'application
 * Les variables d'environnement avec le préfixe EXPO_PUBLIC_ sont accessibles au runtime
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api";

export const config = {
  api: {
    baseUrl: API_URL,
    timeout: 10000,
  },
} as const;

export default config;
