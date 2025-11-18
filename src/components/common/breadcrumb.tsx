"use client";

import { Breadcrumb } from "antd";
import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";

import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import { MyIcon } from "./icon";

interface MyBreadcrumbProps {
  items: CoreBreadcrumbItem[];
}

export function MyBreadcrumb({ items }: MyBreadcrumbProps) {
  const params = useParams();
  const searchParams = useSearchParams();

  const mapToItems = items.map((item) => {
    const result = {
      ...item,
      title: (
        <TitleWrapper>
          {item.icon && (
            <TitleIconWrapper>
              <MyIcon name={item.icon} size={16} color="var(--icon-fill)" />
            </TitleIconWrapper>
          )}
          <span>{item.title}</span>
        </TitleWrapper>
      ),
    };

    // href가 존재하는 경우에만 동적 파라미터 처리
    if (item.href) {
      let processedHref = item.href;

      // [id] 파라미터 처리 (useParams 사용)
      if (item.href.includes("[id]") && params.id) {
        processedHref = processedHref.replace("[id]", params.id as string);
      }

      // 다른 동적 파라미터 처리 (useCustomSearchParams 사용)
      // 예: [workspaceId], [volumeId] 등
      const dynamicParamRegex = /\[(\w+)\]/g;
      const matches = item.href.match(dynamicParamRegex);

      if (matches) {
        matches.forEach((match) => {
          const paramName = match.slice(1, -1); // [workspaceId] -> workspaceId

          // [id]가 아닌 경우 searchParams에서 값 가져오기
          if (paramName !== "id") {
            const paramValue = searchParams.get(paramName);
            if (paramValue) {
              processedHref = processedHref.replace(match, paramValue);
            }
          }
        });
      }

      result.href = processedHref;
    }

    return result;
  });

  return (
    <StyledBreadcrumb
      separator={
        <NextIconWrapper>
          <MyIcon name="Front" size={12} color="var(--icon-fill)" />
        </NextIconWrapper>
      }
      items={mapToItems}
    />
  );
}

const StyledBreadcrumb = styled(Breadcrumb)`
  & .ant-breadcrumb-separator {
    margin-inline: 6px;
  }

  & a.ant-breadcrumb-link {
    font-weight: 400;
    color: #6f707c;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
  }

  & span.ant-breadcrumb-link {
    font-weight: 500;
  }

  & li {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const TitleWrapper = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  font-size: 12px;
`;

const TitleIconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  --icon-fill: #6f707c;
`;

const NextIconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  --icon-fill: #b2b2b2;
`;
