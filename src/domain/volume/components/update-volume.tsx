"use client";

import { format } from "date-fns";
import { useRef, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Dropdown,
  Input,
  //  Tag
} from "xiilab-ui";

import type { UpdateVolumeRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  useGetVolumeDetail,
  useUpdateVolume,
} from "@/api/generated/volume/volume";
import { workloadListMock } from "@/mocks/data/workload.mock";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { SecurityLevelText } from "@/shared/components/text/security-status-text";
import { VISIBILITY_STATUS_OPTIONS } from "@/shared/constants/core.constant";
import { useSelect } from "@/shared/hooks/use-select";
// import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
// import { usePublish } from "@/shared/hooks/use-pub-sub";
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
import { SourcecodeFormFieldControl } from "@/styles/layers/sourcecode-form-layers.styled";
import { customScrollbar } from "@/styles/mixins/scrollbar";
import {
  getVolumeStatusInfo,
  getVolumeStorageTypeInfo,
} from "../utils/volume.util";
import { EmptyVolumeWorkload } from "./empty-volume-workload";
import { VolumeWorkloadCard } from "./volume-workload-card";

interface UpdateVolumeProps {
  volumeId: number;
  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => void;
}

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
export function UpdateVolume({
  volumeId,
  readOnly,
  setReadOnly,
}: UpdateVolumeProps) {
  const { data } = useGetVolumeDetail(volumeId, {
    query: { enabled: !Number.isNaN(volumeId) },
  });

  const formRef = useRef<HTMLFormElement>(null);
  const [workloadPage, setWorkloadPage] = useState(1);

  const status = useSelect(
    data?.isPublic ? "PUBLIC" : "PRIVATE",
    VISIBILITY_STATUS_OPTIONS,
  );

  // Next.js 라우터 인스턴스 - 현재 경로 및 쿼리 파라미터 접근

  // PubSub 퍼블리셔 - 이벤트 발행을 위한 훅
  // const publish = usePublish();

  // 수정 뮤테이션 훅 (orval)
  const updateVolume = useUpdateVolume();

  const { text } = getVolumeStorageTypeInfo(data?.volumeType || "ASTRAGO");
  const { text: statusText } = getVolumeStatusInfo(data?.isPublic ?? false);

  /**
   * 수정 모드 전환 핸들러
   *
   * 읽기 전용 모드에서 수정 모드로 전환합니다.
   * 수정 모드에서는 입력 필드가 활성화되고 수정이 가능해집니다.
   */
  const handleUpdate = () => {
    const payload = createPayload();

    if (payload) {
      // TODO: validation 추가 필요
      updateVolume.mutate({
        volumeId,
        data: payload,
      });
    }
  };

  /**
   * 수정 취소 핸들러
   *
   * 수정 모드에서 읽기 전용 모드로 되돌립니다.
   * 사용자가 수정을 취소하고 원래 상태로 복원할 때 사용됩니다.
   */
  const handleCancel = () => {
    setReadOnly(true);
  };

  /**
   * 폼 데이터를 수집하여 API 요청용 페이로드 생성
   *
   * 폼의 모든 입력 필드에서 데이터를 수집하고, UpdateVolumeRequest 형태로 변환합니다.
   * 볼륨 이름과 마운트 경로 등의 기본 정보를 수집합니다.
   *
   * @returns UpdateVolumeRequest 객체 또는 null (폼 참조가 없는 경우)
   */
  const createPayload = (): UpdateVolumeRequest | null => {
    if (!formRef.current) return null;

    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    // 기본 필드들 수집
    const volumeName = formData.get("volumeName") as string;
    const mountPath = formData.get("mountPath") as string;

    return {
      volumeName,
      mountPath,
      isPublic: status.value === "PUBLIC",
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
            {readOnly && (
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>볼륨 이름</AsideDetailArticleKey>
                <AsideDetailArticleValue className="truncate">
                  {data?.volumeName}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>
            )}
            {readOnly && (
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>스토리지 타입</AsideDetailArticleKey>
                <AsideDetailArticleValue className="truncate">
                  {text}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>
            )}
            {!readOnly && (
              <>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>볼륨 이름</AsideDetailArticleKey>
                  <AsideDetailArticleValue></AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                {!readOnly && (
                  <div style={{ marginTop: 8, marginBottom: 14 }}>
                    <Input
                      placeholder="볼륨 이름을 입력해주세요."
                      width="100%"
                      name="volumeName"
                      autoComplete="off"
                      defaultValue={data?.volumeName}
                    />
                  </div>
                )}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>스토리지 타입</AsideDetailArticleKey>
                  <AsideDetailArticleValue className="truncate">
                    <span style={{ textTransform: "capitalize" }}>{text}</span>
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </>
            )}

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>보안검사 결과</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                <SecurityStatuses>
                  <SecurityLevelText type="engText" status="CRITICAL">
                    <SecurityCount>7,777개</SecurityCount>
                  </SecurityLevelText>
                  <SecurityLevelText type="engText" status="HIGH">
                    <SecurityCount>7,777개</SecurityCount>
                  </SecurityLevelText>
                  <SecurityLevelText type="engText" status="MEDIUM">
                    <SecurityCount>7,777개</SecurityCount>
                  </SecurityLevelText>
                  <SecurityLevelText type="engText" status="LOW">
                    <SecurityCount>7,777개</SecurityCount>
                  </SecurityLevelText>
                </SecurityStatuses>
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>
            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>공개 설정</AsideDetailArticleKey>
              {readOnly && (
                <AsideDetailArticleValue>{statusText}</AsideDetailArticleValue>
              )}
            </AsideDetailArticleColumn>
            {!readOnly && (
              <SourcecodeFormFieldControl
                style={{ marginTop: 8, marginBottom: 16 }}
              >
                <Dropdown
                  options={status.options}
                  onChange={status.setValue}
                  value={status.value}
                  width="100%"
                  placeholder="공개 설정을 선택해 주세요."
                />
              </SourcecodeFormFieldControl>
            )}
            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>Mount Path</AsideDetailArticleKey>
              {/* 읽기 전용 모드일 때만 표시 */}
              {readOnly && (
                <AsideDetailArticleValue className="truncate">
                  {data?.mountPath || "-"}
                </AsideDetailArticleValue>
              )}
            </AsideDetailArticleColumn>
            {/* 수정 모드일 때만 마운트 경로 입력 필드 표시 */}
            {!readOnly && (
              <div style={{ marginTop: 8 }}>
                <Input
                  placeholder="기본 마운트 경로를 입력해주세요."
                  width="100%"
                  name="mountPath"
                  autoComplete="off"
                  defaultValue={data?.mountPath || ""}
                />
              </div>
            )}
            {/* TODO: 라벨 기능 추가 시 활성화 */}
            {/* <AsideDetailArticleColumn>
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
            </AsideDetailArticleColumn> */}
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
                    {data?.storageName || "-"}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>

                {/* 생성일 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>파일 용량</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.fileSizeByte
                      ? `${data.fileSizeByte} Bytes`
                      : "0 Bytes"}
                  </AsideDetailArticleValue>
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
                    {data?.createdAt && format(data?.createdAt, "yyyy.MM.dd")}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </AsideDetailArticleRowItem>
            </AsideDetailArticleRow>
          </AsideDetailArticleItem>
        </AsideDetailArticleBody>
      </AsideDetailArticleForm>
      {readOnly && (
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
      )}

      {/* 하단 버튼 영역 */}
      {!readOnly && (
        <Footer>
          {/* 좌측 버튼 - 읽기 전용/수정 모드에 따라 다르게 표시 */}
          <Button width={112} variant="outlined" onClick={handleCancel}>
            취소
          </Button>

          {/* 우측 버튼 - 읽기 전용/수정 모드에 따라 다르게 표시 */}
          <Button
            color="primary"
            icon="Check"
            iconPosition="left"
            iconSize={20}
            size="medium"
            variant="gradient"
            width="100%"
            onClick={handleUpdate}
          >
            상세 정보 저장
          </Button>
        </Footer>
      )}
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
`;

const SecurityCount = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #22212a;
  margin-left: 4px;
`;

// const Tags = styled.div`
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   gap: 4px;
// `;

const SecondaryArticleBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

const WorkloadList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 12px;
  overflow-y: auto;

  ${customScrollbar()}
`;

const Footer = styled(AsideDetailFooter)`
  align-items: flex-end;
  flex: 1;
`;
