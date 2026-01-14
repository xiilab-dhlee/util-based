import { compact, isString } from "es-toolkit";
import type { ResponsiveColumnType } from "xiilab-ui";

import type { CoreCreateColumnConfig } from "@/shared/types/core.model";

function applyEllipsisTooltip<TRecord>(
  column: ResponsiveColumnType<TRecord>,
): ResponsiveColumnType<TRecord> {
  if (!column.ellipsis) {
    return column;
  }

  const originalRender = column.render;
  return {
    ...column,
    render: (title, record, index) => {
      const content = originalRender
        ? originalRender(title, record, index)
        : title;

      return (
        <div className="truncate" data-tooltip={title}>
          {content}
        </div>
      );
    },
  };
}

export function applyColumnConfigs<TRecord>(
  columns: ResponsiveColumnType<TRecord>[],
  configs?: CoreCreateColumnConfig[],
): ResponsiveColumnType<TRecord>[] {
  if (!configs || configs.length === 0) {
    return columns.map(applyEllipsisTooltip);
  }

  const columnMap = new Map<string, ResponsiveColumnType<TRecord>>();
  columns.forEach((column) => {
    if (isString(column.key)) {
      columnMap.set(column.key, column);
    }
  });

  const mappedColumns = configs.map((config) => {
    if (!isString(config.key) || !config.key) {
      console.warn(
        `Column config missing required 'key' property. Received:`,
        config,
      );
      return null;
    }

    const column = columnMap.get(config.key);
    if (!column) {
      console.warn(
        `Column with key "${config.key}" not found in column definitions`,
      );
      return null;
    }

    const mergedColumn: ResponsiveColumnType<TRecord> = {
      ...column,
      ...config,
    };

    return applyEllipsisTooltip(mergedColumn);
  });

  return compact(mappedColumns);
}
