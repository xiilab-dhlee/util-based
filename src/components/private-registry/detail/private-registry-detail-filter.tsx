"use client";

import { Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Dropdown, Icon } from "xiilab-ui";

import { SearchInput } from "@/components/common/input/search-input";
import { AddTagModal } from "@/components/private-registry/modal/add-tag-modal";
import { UsageRequestModal } from "@/components/private-registry/modal/usage-request-modal";
import { VerificationErrorModal } from "@/components/private-registry/modal/verification-error-modal";
import { MySearchFilter } from "@/layouts/common/search-filter";

interface PrivateRegistryDetailFilterProps {
  /** 선택된 태그 수 */
  selectedTagsCount?: number;
}

/**
 * 내부 레지스트리 상세 페이지 상단 필터 컴포넌트
 *
 * 태그 목록 상단의 제목, 개수, 드롭다운, 검색, 액션 버튼들을 포함합니다.
 */
export function PrivateRegistryDetailFilter({
  selectedTagsCount = 0,
}: PrivateRegistryDetailFilterProps) {
  const router = useRouter();

  // TODO: 실제 태그 개수로 변경
  const totalCount = 124;

  // 태그 추가 모달 상태
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);

  // 사용 요청 모달 상태
  const [isUsageRequestModalOpen, setIsUsageRequestModalOpen] = useState(false);

  // 검증 오류 모달 상태
  const [isVerificationErrorModalOpen, setIsVerificationErrorModalOpen] =
    useState(false);

  // 태그 추가 핸들러
  const handleAddTag = () => {
    // 다른 모달들을 먼저 닫고 태그 추가 모달을 연다
    setIsUsageRequestModalOpen(false);
    setIsAddTagModalOpen(true);
  };

  const handleSubmitTag = (tag: string) => {
    console.log("새 태그 추가:", tag);
    // TODO: API 호출하여 태그 추가
  };

  // 사용 요청 핸들러
  const handleUsageRequest = () => {
    // 다른 모달들을 먼저 닫고 사용 요청 모달을 연다
    setIsAddTagModalOpen(false);
    setIsUsageRequestModalOpen(true);
  };

  const handleSubmitUsageRequest = (reason: string, selectedTags: string[]) => {
    console.log("사용 요청:", { reason, selectedTags });
    // TODO: API 호출하여 사용 요청 제출
  };

  // 검증하기 핸들러 - 선택된 태그 수에 따라 분기 처리
  const handleVerify = () => {
    // 태그가 선택되지 않았거나 여러 개가 선택된 경우 에러 모달 표시
    if (selectedTagsCount === 0 || selectedTagsCount > 1) {
      setIsVerificationErrorModalOpen(true);
      return;
    }

    // 태그가 정확히 하나 선택된 경우에만 검증 진행
    // TODO: 선택된 태그로 이동
    router.push("/standard/private-registry/tag/1?verifying=true");
  };

  const tooltipContent = (
    <div style={{ maxWidth: 300 }}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>태그 목록</div>
      <div style={{ fontSize: 12, color: "#666", lineHeight: "1.4" }}>
        컨테이너 이미지의 버전별 태그 목록입니다. 각 태그는 취약점 검사 결과와
        상태 정보를 포함하고 있습니다. 태그를 선택하여 상세한 검증 결과를
        확인하거나 사용 요청을 할 수 있습니다.
      </div>
    </div>
  );

  return (
    <>
      <MySearchFilter
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            태그 목록
            <Tooltip title={tooltipContent} placement="rightTop">
              <Icon
                name="Tooltip"
                size={16}
                style={{ color: "#666", cursor: "help" }}
              />
            </Tooltip>
          </div>
        }
        total={totalCount}
      >
        <Dropdown
          height={30}
          width={80}
          options={[
            { label: "최신순", value: "latest" },
            { label: "오래된순", value: "oldest" },
            { label: "이름순", value: "name" },
          ]}
          placeholder="최신순"
          status="default"
          theme="light"
        />
        <SearchInput placeholder="태그를 검색해 주세요." />
        <Button
          width={100}
          height={30}
          variant="gradient"
          color="primary"
          icon="Request"
          iconSize={18}
          iconPosition="left"
          style={{ fontSize: "14px" }}
          onClick={handleUsageRequest}
        >
          사용 요청
        </Button>
        <Button
          width={100}
          height={30}
          variant="gradient"
          color="primary"
          icon="Verification01"
          iconSize={18}
          iconPosition="left"
          style={{ fontSize: "14px" }}
          onClick={handleVerify}
        >
          검증하기
        </Button>
        <Button
          width={100}
          height={30}
          variant="gradient"
          color="primary"
          icon="Plus"
          iconSize={18}
          iconPosition="left"
          style={{ fontSize: "14px" }}
          onClick={handleAddTag}
        >
          태그 추가
        </Button>
      </MySearchFilter>

      {/* 태그 추가 모달 */}
      <AddTagModal
        open={isAddTagModalOpen}
        onClose={() => setIsAddTagModalOpen(false)}
        onSubmit={handleSubmitTag}
      />

      {/* 사용 요청 모달 */}
      <UsageRequestModal
        open={isUsageRequestModalOpen}
        onClose={() => setIsUsageRequestModalOpen(false)}
        onConfirm={handleSubmitUsageRequest}
      />

      {/* 검증 오류 모달 */}
      <VerificationErrorModal
        open={isVerificationErrorModalOpen}
        onClose={() => setIsVerificationErrorModalOpen(false)}
      />
    </>
  );
}

