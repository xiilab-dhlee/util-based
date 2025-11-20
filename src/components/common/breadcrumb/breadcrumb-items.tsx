import styled from "styled-components";
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
          <BreadcrumbIconTitle>
            <Icon name={item.iconName} size={14} />
            <span>{item.title}</span>
          </BreadcrumbIconTitle>
        ),
      };
    }

    return {
      ...item,
      title: item.title,
    };
  });
};

const BreadcrumbIconTitle = styled.span`
  display:flex;
  align-items: center;
  column-gap: 2px;
`;
