import { useAtomValue } from "jotai";
import Image from "next/image";
import styled from "styled-components";

import { REGISTRY_QUICK_MENUS } from "@/domain/registry/constants/registry.constant";
import { userWaitingRequestImageListSearchTextAtom } from "@/domain/registry/state/registry.atom";
import { useGetWaitingRequestImages } from "@/domain/request-image/hooks/use-get-waiting-request-images";
import { UserMonitoringQuickMenu } from "@/domain/user-monitoring/components/user-monitoring-quick-menu";
import { createRequestImageColumn } from "@/shared/components/column/create-request-image-column";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { UserMonitoringSectionTitle } from "@/styles/layers/user-monitoring-layers.styled";
import { RequestImageStatusCard } from "./request-image-status-card";
import { UserRequestImageWaitingListFilter } from "./request-image-waiting-list-filter";

export function RegistryMainSection() {
  const searchText = useAtomValue(userWaitingRequestImageListSearchTextAtom);

  const { data } = useGetWaitingRequestImages({
    searchText,
  });

  return (
    <Container>
      <Left>
        <Thumbnail>
          <Image
            src="/images/registry-quick-menu-guide.png"
            alt="Quick Menu Guide"
            layout="fill"
          />
        </Thumbnail>
        <QuickMenus>
          {REGISTRY_QUICK_MENUS.map((menu) => (
            <UserMonitoringQuickMenu key={menu.title} height={120} {...menu} />
          ))}
        </QuickMenus>
      </Left>
      <Right>
        <SectionTitle className="no-line">이미지 사용 요청 관리</SectionTitle>
        <RightBody>
          <RequestImage>
            <MySearchFilter
              title="이미지 사용 승인 여부"
              darkMode
              showTotal={false}
            />
            <RequestImageBody>
              <RequestImageStatusCard status="APPROVE" count={9999} />
              <RequestImageStatusCard status="WAITING" count={9999} />
              <RequestImageStatusCard status="REJECT" count={9999} />
            </RequestImageBody>
          </RequestImage>
          <WaitRequestImage>
            <UserRequestImageWaitingListFilter />
            <WaitRequestImageBody>
              <CustomizedTable
                columns={createRequestImageColumn([
                  { dataIndex: "imageName" },
                  { dataIndex: "imageTag" },
                  { dataIndex: "security" },
                  { dataIndex: "creatorName" },
                ])}
                data={data?.content || []}
                activePadding
                darkMode
              />
            </WaitRequestImageBody>
          </WaitRequestImage>
        </RightBody>
      </Right>
    </Container>
  );
}

/**
 * 관리자 대시보드 섹션의 메인 컨테이너
 *
 * 3단 레이아웃을 구성하는 메인 컨테이너로, 어두운 배경과 그림자 효과를 가집니다.
 * flexbox를 사용하여 왼쪽, 중앙, 오른쪽 영역을 균등하게 배치합니다.
 */
const Container = styled.section`
  border-radius: 10px;
  height: var(--user-monitoring-main-section-height);
  padding: 23px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden;
  margin-bottom: var(--user-monitoring-main-section-margin-bottom);
  background-color: #070913;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);

  --primary-border-color: #3a4561;
  --secondary-border-color: #2a3041;
`;

/**
 * 왼쪽 영역 스타일
 *
 * 빠른 메뉴와 가이드 이미지를 포함하는 영역입니다.
 * 고정 너비(634px)를 가지며 세로 방향으로 배치됩니다.
 */
const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

/**
 * 중앙 영역 스타일
 *
 * 클러스터 자원 정보 차트들을 표시하는 영역입니다.
 * flex: 1을 사용하여 남은 공간을 모두 차지하며 세로 방향으로 배치됩니다.
 */
const Right = styled.div`
  width: 862px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/**
 * 콘텐츠 헤더 스타일
 *
 * 각 섹션의 제목을 표시하는 헤더 영역입니다.
 * 좌측 패딩을 적용하여 시각적 정렬을 맞춥니다.
 */
const SectionTitle = styled(UserMonitoringSectionTitle)`
  margin-bottom: 20px;
`;

/**
 * 썸네일 이미지 컨테이너
 *
 * 빠른 메뉴 가이드 이미지를 표시하는 컨테이너입니다.
 * 고정 높이(184px)를 가지며 이미지가 컨테이너를 완전히 채웁니다.
 */
const Thumbnail = styled.div`
  width: 100%;
  height: 260px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
`;

/**
 * 빠른 메뉴 그리드 컨테이너
 *
 * 4열 그리드로 빠른 메뉴들을 배치하는 컨테이너입니다.
 * flex: 1을 사용하여 남은 공간을 모두 차지합니다.
 */
const QuickMenus = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

/**
 * 중앙 영역 본문 컨테이너
 *
 * 클러스터 자원 정보 차트들을 2열 그리드로 배치하는 컨테이너입니다.
 * flex: 1을 사용하여 남은 공간을 모두 차지합니다.
 */
const RightBody = styled.div`
  flex: 1;
  background-color: #171b26;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
`;

const RequestImage = styled.div`
  width: 236px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-right: 20px;
`;

const RequestImageBody = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 16px;
  border-right: 1px solid #2a3041;
`;

const WaitRequestImage = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const WaitRequestImageBody = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
