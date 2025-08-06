import * as Checkbox from "@radix-ui/react-checkbox";
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
              id={`layer-checkbox-${layer.id}`}
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
}
