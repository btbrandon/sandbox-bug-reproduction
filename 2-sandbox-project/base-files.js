export const baseFiles = [
  {
    path: "package.json",
    content: `{
  "name": "direct-project",
  "private": true,
  "sideEffects": false,
  "type": "module",
  "scripts": {
    "build": "remix vite:build",
    "dev": "remix vite:dev"
  },
  "dependencies": {
    "@remix-run/cloudflare": "^2.17.0",
    "@remix-run/cloudflare-pages": "^2.17.0",
    "@remix-run/react": "^2.17.0",
    "isbot": "^4.1.0",
    "maplibre-gl": "^5.6.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-map-gl": "^8.0.4"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250724.0",
    "@remix-run/dev": "^2.17.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^6.7.4",
    "@typescript-eslint/parser": "^6.7.4",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.38.0",
    "eslint-import-resolver-typescript": "^3.6.1",
    "eslint-plugin-import": "^2.28.1",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.1.6",
    "vite": "^6.0.0",
    "vite-tsconfig-paths": "^4.2.1",
    "wrangler": "^3.114.11"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}`,
  },
  {
    path: "tailwind.config.ts",
    content: `import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;`,
  },
  {
    path: "postcss.config.js",
    content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
  },
  {
    path: "vite.config.ts",
    content: `import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
});`,
  },
  {
    path: ".eslintrc.cjs",
    content: `/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  ignorePatterns: ["!**/.server", "!**/.client"],

  extends: ["eslint:recommended"],

  overrides: [
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      plugins: ["react", "jsx-a11y"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
      ],
      settings: {
        react: {
          version: "detect",
        },
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
        "import/resolver": {
          typescript: {},
        },
      },
    },

    {
      files: ["**/*.{ts,tsx}"],
      plugins: ["@typescript-eslint", "import"],
      parser: "@typescript-eslint/parser",
      settings: {
        "import/internal-regex": "^~/",
        "import/resolver": {
          node: {
            extensions: [".ts", ".tsx"],
          },
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
      ],
    },

    {
      files: [".eslintrc.cjs"],
      env: {
        node: true,
      },
    },
  ],
};`,
  },
  {
    path: "app/root.tsx",
    content: `import type { LinksFunction } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.css",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}`,
  },
  {
    path: "app/tailwind.css",
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  @apply bg-white dark:bg-gray-950;
  margin: 0;
  padding: 0;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    color-scheme: dark;
  }
}

/* Prevent any transitions or animations on map container */
.maplibregl-canvas-container,
.maplibregl-canvas {
  animation: none !important;
  transition: none !important;
  transform: none !important;
}`,
  },
  {
    path: "app/entry.client.tsx",
    content: `import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "./tailwind.css";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});`,
  },
  {
    path: "app/entry.server.tsx",
    content: `import type { AppLoadContext, EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);

  const body = await renderToReadableStream(
    <RemixServer
      context={remixContext}
      url={request.url}
      abortDelay={ABORT_DELAY}
    />,
    {
      signal: controller.signal,
      onError(error: unknown) {
        if (!controller.signal.aborted) {
          // Log streaming rendering errors from inside the shell
          console.error(error);
        }
        responseStatusCode = 500;
      },
    }
  );

  body.allReady.then(() => clearTimeout(timeoutId));

  if (isbot(request.headers.get("user-agent") || "")) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}`,
  },
  {
    path: "app/routes/_index.tsx",
    content: `import type { MetaFunction } from "@remix-run/cloudflare";
import { MapComponent } from "../components/Map";

export const meta: MetaFunction = () => {
  return [
    { title: "World Landmarks Map" },
    {
      name: "description",
      content:
        "Explore the tallest towers, largest waterfalls, and the 7 wonders of the world on an interactive map.",
    },
  ];
};

const INITIAL_VIEW_STATE = {
  longitude: 10,
  latitude: 20,
  zoom: 2,
  pitch: 0,
  bearing: 0,
};

export default function Index() {
  return (
    <div className="relative w-full h-screen font-sans">
      <MapComponent initialViewState={INITIAL_VIEW_STATE} />
      <div className="absolute top-6 right-6 z-20 bg-white/80 dark:bg-gray-900/80 rounded-lg px-5 py-3 shadow border border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-1">World Towers Map</h1>
      </div>
    </div>
  );
}

export const loader = () => {
  return new Response(null);
};`,
  },
  {
    path: "app/components/Map.tsx",
    content: `import Map, { Marker } from "react-map-gl/maplibre";

const TALLEST_TOWERS = [
  {
    name: "Burj Khalifa",
    latitude: 25.1972,
    longitude: 55.2744,
    details: "Dubai, UAE — 828m (2,717 ft)",
  },
  {
    name: "Shanghai Tower",
    latitude: 31.2336,
    longitude: 121.5055,
    details: "Shanghai, China — 632m (2,073 ft)",
  },
  {
    name: "Abraj Al-Bait Clock Tower",
    latitude: 21.4187,
    longitude: 39.8256,
    details: "Mecca, Saudi Arabia — 601m (1,972 ft)",
  },
  {
    name: "Ping An Finance Center",
    latitude: 22.5333,
    longitude: 114.0556,
    details: "Shenzhen, China — 599m (1,965 ft)",
  },
  {
    name: "Lotte World Tower",
    latitude: 37.5131,
    longitude: 127.1028,
    details: "Seoul, South Korea — 555m (1,819 ft)",
  },
];

interface MapComponentProps {
  mapStyle?: string;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
}

export function MapComponent({
  mapStyle = "https://demotiles.maplibre.org/style.json",
  initialViewState,
}: MapComponentProps) {
  return (
    <div className="relative w-full h-screen">
      <Map
        initialViewState={initialViewState}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
      >
        {TALLEST_TOWERS.map((item, idx) => (
          <Marker
            key={idx}
            longitude={item.longitude}
            latitude={item.latitude}
            anchor="bottom"
          >
            <span
              className="block w-4 h-4 rounded-full border-2 shadow-lg cursor-pointer"
              style={{ backgroundColor: "#2563eb", borderColor: "#fff" }}
              title={item.name}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
}`,
  },
  {
    path: "tsconfig.json",
    content: `{
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/.server/**/*.ts",
    "**/.server/**/*.tsx",
    "**/.client/**/*.ts",
    "**/.client/**/*.tsx"
  ],
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "types": [
      "@cloudflare/workers-types/2023-07-01",
      "@remix-run/cloudflare",
      "vite/client"
    ],
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "target": "ES2022",
    "strict": true,
    "allowJs": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"]
    },

    "noEmit": true
  }
}`,
  },
  {
    path: "functions/[[path]].ts",
    content: `import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

import * as build from "../build/server";

export const onRequest = createPagesFunctionHandler({ build });

    `,
  },
];
