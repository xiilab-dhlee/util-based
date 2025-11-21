"use client";

import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";
import { Breadcrumb, Icon } from "xiilab-ui";

import { BreadcrumbItems } from "@/shared/components/breadcrumb/breadcrumb-items";
import {
  PAGE_META,
  type PageItemMeta,
  type PageKey,
} from "@/shared/constants/page-meta";
import { getBackPathname } from "@/shared/utils/router.util";

interface PageHeaderProps {
  /** 이 페이지를 식별하는 메타 키 (title, icon, breadcrumb 모두 여기서 유도) */
  pageKey: PageKey;
  /** 동적 라우트/메타에 필요한 파라미터 (id, workspaceId 등) */
  pageParams?: Record<string, string>;
  /** 헤더에서만 사용할 부가 설명 텍스트 */
  description?: string;
}

// 페이지 헤더 영역
export function PageHeader({
  pageKey,
  pageParams,
  description,
}: PageHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 1) 메타 정보 (title, iconName)를 PAGE_META에서 읽기
  const pageMeta = PAGE_META[pageKey] as PageItemMeta;
  const title = pageMeta.title;
  const iconName = pageMeta.iconName;

  // 2) breadcrumb 생성
  const breadcrumbItems = BreadcrumbItems(pageKey, pageParams);
  const hasBreadcrumb = breadcrumbItems.length > 1;

  // 3) breadcrumb 기반 back 대상 (마지막에서 두 번째 아이템)
  const backHref =
    hasBreadcrumb && breadcrumbItems[breadcrumbItems.length - 2]?.href
      ? (breadcrumbItems[breadcrumbItems.length - 2].href as string)
      : undefined;

  // 4) 뒤로가기: breadcrumb > getBackPathname 순으로 fallback
  const handleBack = () => {
    if (backHref) {
      router.replace(backHref);
      return;
    }

    router.replace(getBackPathname(pathname));
  };

  return (
    <Container>
      <Left>
        {/* breadcrumb가 2 depth 이상이면 Back 아이콘, 아니면 페이지 아이콘 */}
        {hasBreadcrumb ? (
          <BackIconWrapper onClick={handleBack}>
            <Icon name="Back" color="var(--icon-fill)" size={24} />
            <span className="sr-only">뒤로가기</span>
          </BackIconWrapper>
        ) : (
          iconName && (
            <IconWrapper>
              <Icon name={iconName} color="var(--icon-fill)" size={16} />
            </IconWrapper>
          )
        )}
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
      </Left>
      {hasBreadcrumb && (
        <Right>
          <Breadcrumb items={breadcrumbItems} />
        </Right>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  flex-shrink: 0;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: relative;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #000;
  margin-right: 6px;
  overflow: hidden;

  --icon-fill: #fff;

  & > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
  }
`;

const BackIconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  // transform: rotate(90deg);
  margin-right: 6px;
  border: none;
  background-color: transparent;

  --icon-fill: #000;
`;

const Title = styled.h1`
  font-weight: 700;
  line-height: 1.5;
  margin-right: 6px;
  letter-spacing: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
`;

const Description = styled.div`
  padding-left: 6px;
  font-weight: 400;
  line-height: 1.5;
  color: #6f707c;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 14px;

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 50%;
    content: "";
    width: 1px;
    background-color: #ced3d8;
  }
`;
