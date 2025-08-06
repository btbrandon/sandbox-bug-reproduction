import type { MetaFunction } from "@remix-run/cloudflare";
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
};
