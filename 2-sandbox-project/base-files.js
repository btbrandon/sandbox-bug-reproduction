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
    "dev": "remix vite:dev",
    "lint": "eslint --ignore-path .gitignore --cache --cache-location ./node_modules/.cache/eslint .",
    "start": "wrangler pages dev ./build/client",
    "typecheck": "tsc",
    "typegen": "wrangler types",
    "preview": "npm run build && wrangler pages dev",
    "cf-typegen": "wrangler types"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-icons": "^1.3.2",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-portal": "^1.1.9",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toolbar": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@remix-run/cloudflare": "^2.16.8",
    "@remix-run/cloudflare-pages": "^2.16.8",
    "@remix-run/react": "^2.16.8",
    "isbot": "^4.1.0",
    "maplibre-gl": "^5.6.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^5.5.0",
    "react-map-gl": "^8.0.4"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250724.0",
    "@remix-run/dev": "^2.16.8",
    "@types/react": "^18.2.20",
    "@types/react-dom": "^18.2.7",
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
import { useState } from "react";
import { MapComponent, MapLayer } from "../components/Map";
import { LayerPanel } from "../components/LayerPanel";

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

const TALLEST_TOWERS: MapLayer = {
  id: "towers",
  name: "Tallest Towers",
  color: "#2563eb",
  description: "The world's tallest towers.",
  data: [
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
  ],
};

const LARGEST_WATERFALLS: MapLayer = {
  id: "waterfalls",
  name: "Largest Waterfalls",
  color: "#0ea5e9",
  description: "The world's largest waterfalls by flow or height.",
  data: [
    {
      name: "Angel Falls",
      latitude: 5.967,
      longitude: -62.5356,
      details: "Venezuela — 979m (3,212 ft), tallest uninterrupted waterfall.",
    },
    {
      name: "Victoria Falls",
      latitude: -17.9243,
      longitude: 25.8572,
      details: "Zambia/Zimbabwe — 1,708m wide, 108m high.",
    },
    {
      name: "Niagara Falls",
      latitude: 43.0799,
      longitude: -79.0747,
      details: "Canada/USA — 51m high, 2,407m³/s average flow.",
    },
    {
      name: "Iguazu Falls",
      latitude: -25.6953,
      longitude: -54.4367,
      details: "Argentina/Brazil — 82m high, 2,700m³/s average flow.",
    },
    {
      name: "Yosemite Falls",
      latitude: 37.7565,
      longitude: -119.5967,
      details: "USA — 739m (2,425 ft), tallest in North America.",
    },
  ],
};

const SEVEN_WONDERS: MapLayer = {
  id: "wonders",
  name: "7 Wonders",
  color: "#f59e42",
  description: "The New 7 Wonders of the World.",
  data: [
    {
      name: "Great Wall of China",
      latitude: 40.4319,
      longitude: 116.5704,
      details: "China — Ancient series of walls and fortifications.",
    },
    {
      name: "Petra",
      latitude: 30.3285,
      longitude: 35.4444,
      details: "Jordan — Archaeological city famous for rock-cut architecture.",
    },
    {
      name: "Christ the Redeemer",
      latitude: -22.9519,
      longitude: -43.2105,
      details: "Brazil — Iconic statue overlooking Rio de Janeiro.",
    },
    {
      name: "Machu Picchu",
      latitude: -13.1631,
      longitude: -72.545,
      details: "Peru — Incan citadel set high in the Andes Mountains.",
    },
    {
      name: "Chichen Itza",
      latitude: 20.6843,
      longitude: -88.5678,
      details: "Mexico — Large pre-Columbian archaeological site.",
    },
    {
      name: "Roman Colosseum",
      latitude: 41.8902,
      longitude: 12.4922,
      details: "Italy — Ancient Roman gladiatorial arena.",
    },
    {
      name: "Taj Mahal",
      latitude: 27.1751,
      longitude: 78.0421,
      details: "India — White marble mausoleum in Agra.",
    },
  ],
};

const ALL_LAYERS: MapLayer[] = [
  TALLEST_TOWERS,
  LARGEST_WATERFALLS,
  SEVEN_WONDERS,
];

export default function Index() {
  const [visibleLayerIds, setVisibleLayerIds] = useState<string[]>(
    ALL_LAYERS.map((l) => l.id)
  );

  function handleToggleLayer(id: string) {
    setVisibleLayerIds((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id]
    );
  }

  const panelLayers = ALL_LAYERS.map((layer) => ({
    id: layer.id,
    name: layer.name,
    color: layer.color,
    checked: visibleLayerIds.includes(layer.id),
    description: layer.description,
  }));

  return (
    <div className="relative w-full h-screen font-sans">
      <MapComponent
        initialViewState={INITIAL_VIEW_STATE}
        layers={ALL_LAYERS}
        visibleLayerIds={visibleLayerIds}
      />
      <LayerPanel layers={panelLayers} onToggle={handleToggleLayer} />
      <div className="absolute top-6 right-6 z-20 bg-white/80 dark:bg-gray-900/80 rounded-lg px-5 py-3 shadow border border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-1">World Landmarks Map</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Explore the tallest towers, largest waterfalls, and the 7 wonders of
          the world.
        </p>
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
    content: `import Map, { Marker, Popup } from "react-map-gl/maplibre";
import { useState } from "react";

export interface MapLayer {
  id: string;
  name: string;
  color: string;
  description: string;
  data: {
    name: string;
    latitude: number;
    longitude: number;
    details: string;
  }[];
}

interface MapComponentProps {
  mapStyle?: string;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
  layers: MapLayer[];
  visibleLayerIds: string[];
}

export function MapComponent({
  mapStyle = "https://demotiles.maplibre.org/style.json",
  initialViewState,
  layers,
  visibleLayerIds,
}: MapComponentProps) {
  const [popup, setPopup] = useState<{
    latitude: number;
    longitude: number;
    name: string;
    details: string;
  } | null>(null);

  return (
    <div className="relative w-full h-screen">
      <Map
        initialViewState={initialViewState}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        attributionControl={true}
      >
        {layers
          .filter((layer) => visibleLayerIds.includes(layer.id))
          .flatMap((layer) =>
            layer.data.map((item, idx) => (
              <Marker
                key={\`\${layer.id}-\${idx}\`}
                longitude={item.longitude}
                latitude={item.latitude}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setPopup({
                    latitude: item.latitude,
                    longitude: item.longitude,
                    name: item.name,
                    details: item.details,
                  });
                }}
              >
                <span
                  className="block w-4 h-4 rounded-full border-2 shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: layer.color,
                    borderColor: "#fff",
                  }}
                  title={item.name}
                />
              </Marker>
            ))
          )}
        {popup && (
          <Popup
            longitude={popup.longitude}
            latitude={popup.latitude}
            anchor="top"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setPopup(null)}
            offset={12}
            maxWidth="240px"
          >
            <div>
              <div className="font-bold text-base mb-1">{popup.name}</div>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                {popup.details}
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}`,
  },
  {
    path: "app/components/LayerPanel.tsx",
    content: `import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

interface LayerPanelProps {
  layers: {
    id: string;
    name: string;
    color: string;
    checked: boolean;
    description: string;
  }[];
  onToggle: (id: string) => void;
}

export function LayerPanel({ layers, onToggle }: LayerPanelProps) {
  return (
    <aside
      className="absolute top-6 left-6 z-20 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg p-6 w-80 flex flex-col gap-4 border border-gray-200 dark:border-gray-800"
      style={{ backdropFilter: "blur(6px)" }}
    >
      <h2 className="text-xl font-bold mb-2">Map Layers</h2>
      <div className="flex flex-col gap-3">
        {layers.map((layer) => (
          <label
            key={layer.id}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <Checkbox.Root
              checked={layer.checked}
              onCheckedChange={() => onToggle(layer.id)}
              className="w-5 h-5 rounded border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-colors"
              id={\`layer-checkbox-\${layer.id}\`}
            >
              <Checkbox.Indicator>
                <CheckIcon className="text-white w-4 h-4" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: layer.color }}
                aria-hidden
              />
              <span className="font-medium">{layer.name}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Toggle layers to show or hide points of interest on the map.
      </div>
    </aside>
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
    path: "load-context.ts",
    content: `import { type PlatformProxy } from "wrangler";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
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
