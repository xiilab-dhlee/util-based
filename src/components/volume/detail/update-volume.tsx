"use client";

import { format } from "date-fns";
import { useAtomValue } from "jotai";
import { useRef, useState } from "react";
import styled from "styled-components";
import { Button, Input, Tag } from "xiilab-ui";

import { volumeSelectedAtom } from "@/atoms/volume/volume-list.atom";
import { SecurityLevelText } from "@/components/common/text/security-status-text";
import pubsubConstants from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetVolume } from "@/hooks/volume/use-get-volume";
import { useUpdateVolume } from "@/hooks/volume/use-update-volume";
import { ListPageFooter } from "@/layouts/list/list-page-footer";
import { workloadListMock } from "@/mocks/workload.mock";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleForm,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleRow,
  AsideDetailArticleRowItem,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
  AsideDetailFooter,
} from "@/styles/layers/aside-detail-layers.styled";
import type { UpdateVolumePayload } from "@/types/volume/volume.type";
import { EmptyVolumeWorkload } from "./empty-volume-workload";
import { VolumeWorkloadCard } from "./volume-workload-card";

/**
 * 볼륨 수정 컴포넌트
 *
 * 기존 볼륨의 상세 정보를 조회하고 수정할 수 있는 컴포넌트입니다.
 * 읽기 전용 모드와 수정 모드를 전환할 수 있으며, 볼륨 정보, 설정 내용, 사용중인 워크로드 등을 관리합니다.
 *
 * 주요 기능:
 * - 볼륨 상세 정보 조회 (읽기 전용)
 * - 볼륨 정보 수정 (수정 모드)
 * - 볼륨 보안 검증 상태 표시
 * - 마운트 경로 및 라벨 관리
 * - 사용중인 워크로드 목록 조회
 * - 볼륨 삭제 (PubSub을 통한 모달 열기)
 * - 읽기 전용/수정 모드 전환
 *
 * @returns 볼륨 수정 UI를 포함한 JSX 요소
 */
export function UpdateVolume() {
  const selectedVolume = useAtomValue(volumeSelectedAtom);

  const { data } = useGetVolume(selectedVolume || "");

  const formRef = useRef<HTMLFormElement>(null);
  const [workloadPage, setWorkloadPage] = useState(1);

  // Next.js 라우터 인스턴스 - 현재 경로 및 쿼리 파라미터 접근

  // PubSub 퍼블리셔 - 이벤트 발행을 위한 훅
  const publish = usePublish();

  // 수정 뮤테이션 훅
  const updateVolume = useUpdateVolume();

  // 읽기 전용 여부 - true: 읽기 전용 모드, false: 수정 모드
  const [isReadOnly, setIsReadOnly] = useState(true);
  /**
   * 수정 모드 전환 핸들러
   *
   * 읽기 전용 모드에서 수정 모드로 전환합니다.
   * 수정 모드에서는 입력 필드가 활성화되고 수정이 가능해집니다.
   */
  const handleModify = () => {
    if (isReadOnly) {
      setIsReadOnly(false);
    } else {
      // TODO: 수정 로직 추가
      const payload = createPayload();

      if (payload) {
        // TODO: validation 추가 필요
        updateVolume.mutate(payload);
      }
    }
  };

  /**
   * 볼륨 삭제 핸들러
   *
   * PubSub을 통해 삭제 모달을 열도록 이벤트를 발행합니다.
   * 현재 라우터의 쿼리에서 볼륨 ID를 가져와 삭제 대상으로 전달합니다.
   */
  const handleDelete = () => {
    // 삭제 모달 열기 - PubSub 이벤트 발행
    publish(pubsubConstants.volume.sendDeleteVolume, [
      { uid: selectedVolume || "" },
    ]);
  };

  /**
   * 수정 취소 핸들러
   *
   * 수정 모드에서 읽기 전용 모드로 되돌립니다.
   * 사용자가 수정을 취소하고 원래 상태로 복원할 때 사용됩니다.
   */
  const handleCancel = () => {
    setIsReadOnly(true);
  };

  /**
   * 폼 데이터를 수집하여 API 요청용 페이로드 생성
   *
   * 폼의 모든 입력 필드에서 데이터를 수집하고, UpdateVolumePayload 형태로 변환합니다.
   * 볼륨 이름과 마운트 경로 등의 기본 정보를 수집합니다.
   *
   * @returns UpdateVolumePayload 객체 또는 null (폼 참조가 없는 경우)
   */
  const createPayload = (): UpdateVolumePayload | null => {
    if (!formRef.current) return null;

    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    // 기본 필드들 수집
    const volumeName = formData.get("volumeName") as string;
    const defaultPath = formData.get("defaultPath") as string;

    return {
      volumeName,
      defaultPath,
    };
  };

  return (
    <>
      {/* 첫 번째 아티클 - 볼륨 기본 정보 */}
      <AsideDetailArticleForm ref={formRef}>
        <AsideDetailArticleBody>
          {/* 기본 정보 섹션 */}
          <AsideDetailArticleItem>
            <AsideDetailArticleHeader>
              <AsideDetailArticleTitle>기본 정보</AsideDetailArticleTitle>
            </AsideDetailArticleHeader>
            {isReadOnly && (
              <AsideDetailArticleColumn>
                <AsideDetailArticleRow>
                  <AsideDetailArticleRowItem>
                    <AsideDetailArticleColumn>
                      <AsideDetailArticleKey>볼륨 이름</AsideDetailArticleKey>
                      <AsideDetailArticleValue className="truncate">
                        {data?.name}
                      </AsideDetailArticleValue>
                    </AsideDetailArticleColumn>
                  </AsideDetailArticleRowItem>
                  <AsideDetailArticleRowItem>
                    <AsideDetailArticleColumn>
                      <AsideDetailArticleKey>
                        스토리지 타입
                      </AsideDetailArticleKey>
                      <AsideDetailArticleValue className="truncate">
                        <span style={{ textTransform: "capitalize" }}>
                          {data?.storageType.toLowerCase()} Storage
                        </span>
                      </AsideDetailArticleValue>
                    </AsideDetailArticleColumn>
                  </AsideDetailArticleRowItem>
                </AsideDetailArticleRow>
              </AsideDetailArticleColumn>
            )}
            {!isReadOnly && (
              <>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>볼륨 이름</AsideDetailArticleKey>
                  <AsideDetailArticleValue></AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                {!isReadOnly && (
                  <div style={{ marginTop: 8, marginBottom: 14 }}>
                    <Input
                      placeholder="볼륨 이름을 입력해주세요."
                      width="100%"
                      name="volumeName"
                      autoComplete="off"
                      defaultValue={data?.name}
                    />
                  </div>
                )}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>스토리지 타입</AsideDetailArticleKey>
                  <AsideDetailArticleValue className="truncate">
                    <span style={{ textTransform: "capitalize" }}>
                      {data?.storageType.toLowerCase()} Storage
                    </span>
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </>
            )}

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>보안 검증</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                <SecurityStatuses>
                  <SecurityLevelText status="CRITICAL">
                    <SecurityCount>7,777개</SecurityCount>
                  </SecurityLevelText>
                  <SecurityLevelText status="HIGH">
                    <SecurityCount>7,777개</SecurityCount>
                  </SecurityLevelText>
                  <SecurityLevelText status="LOW">
                    <SecurityCount>7,777개</SecurityCount>
                  </SecurityLevelText>
                </SecurityStatuses>
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>
            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>마운트 경로</AsideDetailArticleKey>
              {/* 읽기 전용 모드일 때만 표시 */}
              {isReadOnly && (
                <AsideDetailArticleValue className="truncate">
                  {data?.mountPath || "-"}
                </AsideDetailArticleValue>
              )}
            </AsideDetailArticleColumn>
            {/* 수정 모드일 때만 마운트 경로 입력 필드 표시 */}
            {!isReadOnly && (
              <div style={{ marginTop: 8, marginBottom: 14 }}>
                <Input
                  placeholder="기본 마운트 경로를 입력해주세요."
                  width="100%"
                  name="defaultPath"
                  autoComplete="off"
                  defaultValue={data?.mountPath}
                />
              </div>
            )}
            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>라벨</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                <Tags>
                  {data?.labels.map((label: string) => (
                    <Tag variant="purple" style={{ height: 20 }} key={label}>
                      {label}
                    </Tag>
                  ))}
                </Tags>
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>
          </AsideDetailArticleItem>
          {/* 생성자 정보 섹션 */}
          <AsideDetailArticleItem>
            <AsideDetailArticleRow>
              <AsideDetailArticleRowItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>설정 내용</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>
                {/* 생성자 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>스토리지</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    skybox storage
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>

                {/* 생성일 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>파일 용량</AsideDetailArticleKey>
                  <AsideDetailArticleValue>10 Bytes</AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </AsideDetailArticleRowItem>
              <AsideDetailArticleRowItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>생성 정보</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>
                {/* 생성자 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성자</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.creatorName}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>

                {/* 생성일 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성일</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.creatorDate &&
                      format(data?.creatorDate, "yyyy.MM.dd")}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </AsideDetailArticleRowItem>
            </AsideDetailArticleRow>
          </AsideDetailArticleItem>
        </AsideDetailArticleBody>
      </AsideDetailArticleForm>
      <SecondaryArticle>
        <AsideDetailArticleHeader>
          <AsideDetailArticleTitle>사용중인 워크로드</AsideDetailArticleTitle>
        </AsideDetailArticleHeader>
        <SecondaryArticleBody>
          <WorkloadList>
            {/* 임시로 1페이지에서 워크로드 카드 표시 */}
            {workloadPage === 1 &&
              workloadListMock
                .slice(0, 8)
                .map((workload) => (
                  <VolumeWorkloadCard key={workload.id} {...workload} />
                ))}
            {/* 임시로 2페이지에서 빈 컴포넌트 표시 */}
            {workloadPage === 2 && <EmptyVolumeWorkload />}
          </WorkloadList>
          <ListPageFooter
            total={20}
            page={workloadPage}
            pageSize={10}
            onChange={setWorkloadPage}
          />
        </SecondaryArticleBody>
      </SecondaryArticle>

      {/* 하단 버튼 영역 */}
      <AsideDetailFooter>
        {/* 좌측 버튼 - 읽기 전용/수정 모드에 따라 다르게 표시 */}
        <div style={{ width: 112 }}>
          {isReadOnly ? (
            // 읽기 전용 모드: 삭제 버튼
            <Button width="100%" variant="outlined" onClick={handleDelete}>
              삭제
            </Button>
          ) : (
            // 수정 모드: 취소 버튼
            <Button width="100%" variant="outlined" onClick={handleCancel}>
              취소
            </Button>
          )}
        </div>
        {/* 우측 버튼 - 읽기 전용/수정 모드에 따라 다르게 표시 */}
        <Button
          color="primary"
          icon={isReadOnly ? "Edit01" : "Check"}
          iconPosition="left"
          iconSize={20}
          size="medium"
          variant={isReadOnly ? "outlined" : "gradient"}
          width="100%"
          onClick={handleModify}
        >
          상세 정보 {isReadOnly ? "수정" : "저장"}
        </Button>
      </AsideDetailFooter>
    </>
  );
}

const SecondaryArticle = styled(AsideDetailArticle)`
  flex: 1;
  margin-top: 10px;
  overflow: hidden;
`;

const SecurityStatuses = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  padding-left: 10px;
`;

const SecurityCount = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #22212a;
  margin-left: 4px;
`;

const Tags = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const SecondaryArticleBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const WorkloadList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 12px;
`;
