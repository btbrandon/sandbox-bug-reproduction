import type { MetaFunction } from "@remix-run/cloudflare";
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
};
