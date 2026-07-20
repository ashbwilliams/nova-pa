"use client";

import { useMemo, useState } from "react";
import { HubMediaSlotEditor } from "@/components/hub-media-slot-editor";
import type { MediaSlotDefinition, ResolvedMediaSlot } from "@/lib/nova-media";

type MediaLibraryItem = {
  definition: MediaSlotDefinition;
  media: ResolvedMediaSlot;
};

export function HubMediaLibrary({
  items,
  storageConfigured,
}: {
  items: MediaLibraryItem[];
  storageConfigured: boolean;
}) {
  const [activeGroup, setActiveGroup] = useState("All");
  const groups = useMemo(
    () => [...new Set(items.map((item) => item.definition.group))],
    [items],
  );
  const visibleGroups = activeGroup === "All" ? groups : [activeGroup];

  return (
    <>
      <div className="hub-media-filters" aria-label="Filter photo placements by page">
        {["All", ...groups].map((group) => {
          const count = group === "All"
            ? items.length
            : items.filter((item) => item.definition.group === group).length;
          return (
            <button
              type="button"
              className={activeGroup === group ? "active" : undefined}
              aria-pressed={activeGroup === group}
              onClick={() => setActiveGroup(group)}
              key={group}
            >
              {group} <span>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="hub-media-groups">
        {visibleGroups.map((group) => (
          <section className="hub-media-group" key={group}>
            <div className="hub-media-group-heading">
              <h3>{group}</h3>
              <span>
                {items.filter((item) => item.definition.group === group).length}
                {" placements"}
              </span>
            </div>
            <div className="hub-media-grid">
              {items
                .filter((item) => item.definition.group === group)
                .map(({ definition, media }) => (
                  <HubMediaSlotEditor
                    definition={definition}
                    media={media}
                    storageConfigured={storageConfigured}
                    key={`${definition.key}:${media.updatedAt ?? "built-in"}`}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
