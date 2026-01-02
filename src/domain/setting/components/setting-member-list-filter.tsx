"use client";

import { Button } from "xiilab-ui";

import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface SettingMemberListFilterProps {
  /** 전체 구성원 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 설정 멤버 목록 필터 컴포넌트
 *
 * 구성원 목록의 상단 필터 영역을 표시합니다.
 * (제목, 총 개수, 검색, 추가 버튼)
 */
export function SettingMemberListFilter({
  total,
  loading,
}: SettingMemberListFilterProps) {
  const publish = usePublish();

  /**
   * 구성원 추가 버튼 클릭 핸들러
   * PubSub을 통해 워크스페이스 구성원 추가 모달에 데이터를 전달합니다.
   */
  const handleAddMember = () => {
    // TODO: 현재 구성원 목록을 selectedAccounts로 전달 필요
    publish(SETTING_EVENTS.sendAddWorkspaceMember, {
      selectedAccounts: [],
    });
  };

  return (
    <MySearchFilter title="구성원 관리" total={total}>
      <Button
        color="primary"
        icon="Plus"
        iconPosition="left"
        variant="gradient"
        width={110}
        height={30}
        onClick={handleAddMember}
        disabled={loading}
      >
        구성원 추가
      </Button>
    </MySearchFilter>
  );
}
