import Map, { Marker, Popup } from "react-map-gl/maplibre";
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
                key={`${layer.id}-${idx}`}
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
}
