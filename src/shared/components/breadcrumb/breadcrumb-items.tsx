import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { PageKey } from "@/shared/constants/page-meta";
import { getBreadcrumbItems } from "@/shared/utils/get-breadcrumb";

export const BreadcrumbItems = (
  pageKey: PageKey,
  params?: Record<string, string>,
) => {
  const rawItems = getBreadcrumbItems(pageKey, params);

  return rawItems.map((item, index) => {
    const isLastItem = index === rawItems.length - 1;

    let baseItem = item;

    if (isLastItem) {
      const { href: _href, ...itemWithoutHref } = item;
      baseItem = itemWithoutHref;
    }

    if (index === 0 && item.iconName) {
      return {
        ...baseItem,
        title: (
          <BreadcrumbIconTitle>
            <Icon name={item.iconName} size={14} />
            <span>{item.title}</span>
          </BreadcrumbIconTitle>
        ),
      };
    }

    return {
      ...baseItem,
      title: item.title,
    };
  });
};

const BreadcrumbIconTitle = styled.span`
  display: flex;
  align-items: center;
  column-gap: 2px;
`;
