import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "server/dist/**",
      "test-results/**",
      "playwright-report/**",
      "next-env.d.ts"
    ]
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      "@next/next/no-img-element": "off"
    }
  }
];

export default config;
