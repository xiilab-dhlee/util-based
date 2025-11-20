import { Icon } from "xiilab-ui";

import type { PageKey } from "@/constants/page-meta";
import { getBreadcrumbItems } from "@/utils/get-breadcrumb";

export const BreadcrumbItems = (
  pageKey: PageKey,
  params?: Record<string, string>,
) => {
  const rawItems = getBreadcrumbItems(pageKey, params);

  return rawItems.map((item, index) => {
    if (index === 0 && item.iconName) {
      return {
        ...item,
        title: (
          <>
            <Icon name={item.iconName} size={14} />
            <span>{item.title}</span>
          </>
        ),
      };
    }

    return {
      ...item,
      title: item.title,
    };
  });
};
