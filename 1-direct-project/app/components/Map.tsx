import Map, { Marker } from "react-map-gl/maplibre";

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
}
