"use client";

import { format } from "date-fns";
import { useAtomValue } from "jotai";
import { useRef, useState } from "react";
import { Button, Input } from "xiilab-ui";

import { notificationSelectedAtom } from "@/atoms/notification.atom";
import { useGetNotification } from "@/hooks/notification/use-get-notification";
import {
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
import type { UpdateNotificationPayload } from "@/types/notification/notification.type";

/**
 * 알림 수정 컴포넌트
 *
 * 기존 알림의 상세 정보를 조회하고 수정할 수 있는 컴포넌트입니다.
 * 읽기 전용 모드와 수정 모드를 전환할 수 있으며, 알림 정보를 관리합니다.
 *
 * 주요 기능:
 * - 알림 상세 정보 조회 (읽기 전용)
 * - 알림 정보 수정 (수정 모드)
 * - 읽기 전용/수정 모드 전환
 *
 * @returns 알림 수정 UI를 포함한 JSX 요소
 */
export function UpdateNotification() {
  const selectedNotification = useAtomValue(notificationSelectedAtom);

  const { data } = useGetNotification(selectedNotification || "");

  const formRef = useRef<HTMLFormElement>(null);

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
        // updateNotification.mutate(payload);
      }
    }
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
   * 폼의 모든 입력 필드에서 데이터를 수집하고, UpdateNotificationPayload 형태로 변환합니다.
   *
   * @returns UpdateNotificationPayload 객체 또는 null (폼 참조가 없는 경우)
   */
  const createPayload = (): UpdateNotificationPayload | null => {
    if (!formRef.current) return null;

    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    // 기본 필드들 수집
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    return {
      title,
      content,
    };
  };

  // 알림 타입 한글 변환
  const getNotificationTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      INFO: "정보",
      WARNING: "경고",
      ERROR: "에러",
      SUCCESS: "성공",
    };
    return typeMap[type] || type;
  };

  // 우선순위 한글 변환
  const getPriorityLabel = (priority: string) => {
    const priorityMap: Record<string, string> = {
      LOW: "낮음",
      MEDIUM: "중간",
      HIGH: "높음",
    };
    return priorityMap[priority] || priority;
  };

  return (
    <>
      {/* 첫 번째 아티클 - 알림 기본 정보 */}
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
                      <AsideDetailArticleKey>알림 제목</AsideDetailArticleKey>
                      <AsideDetailArticleValue className="truncate">
                        {data?.title}
                      </AsideDetailArticleValue>
                    </AsideDetailArticleColumn>
                  </AsideDetailArticleRowItem>
                  <AsideDetailArticleRowItem>
                    <AsideDetailArticleColumn>
                      <AsideDetailArticleKey>알림 타입</AsideDetailArticleKey>
                      <AsideDetailArticleValue className="truncate">
                        {data?.type && getNotificationTypeLabel(data.type)}
                      </AsideDetailArticleValue>
                    </AsideDetailArticleColumn>
                  </AsideDetailArticleRowItem>
                </AsideDetailArticleRow>
              </AsideDetailArticleColumn>
            )}
            {!isReadOnly && (
              <>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>알림 제목</AsideDetailArticleKey>
                  <AsideDetailArticleValue></AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                <div style={{ marginTop: 8, marginBottom: 14 }}>
                  <Input
                    placeholder="알림 제목을 입력해주세요."
                    width="100%"
                    name="title"
                    autoComplete="off"
                    defaultValue={data?.title}
                  />
                </div>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>알림 타입</AsideDetailArticleKey>
                  <AsideDetailArticleValue className="truncate">
                    {data?.type && getNotificationTypeLabel(data.type)}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </>
            )}

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>우선순위</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                {data?.priority && getPriorityLabel(data.priority)}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>읽음 여부</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                {data?.isRead ? "읽음" : "읽지 않음"}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>내용</AsideDetailArticleKey>
              {isReadOnly && (
                <AsideDetailArticleValue>
                  {data?.content}
                </AsideDetailArticleValue>
              )}
            </AsideDetailArticleColumn>
            {!isReadOnly && (
              <div style={{ marginTop: 8, marginBottom: 14 }}>
                <Input
                  placeholder="알림 내용을 입력해주세요."
                  width="100%"
                  name="content"
                  autoComplete="off"
                  defaultValue={data?.content}
                />
              </div>
            )}
          </AsideDetailArticleItem>

          {/* 생성 정보 섹션 */}
          <AsideDetailArticleItem>
            <AsideDetailArticleRow>
              <AsideDetailArticleRowItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>생성 정보</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성자</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.creatorName}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>

                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성일</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.createdDate &&
                      format(data?.createdDate, "yyyy.MM.dd HH:mm:ss")}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </AsideDetailArticleRowItem>
            </AsideDetailArticleRow>
          </AsideDetailArticleItem>
        </AsideDetailArticleBody>
      </AsideDetailArticleForm>

      {/* 하단 버튼 영역 */}
      <AsideDetailFooter>
        {/* 좌측 버튼 - 수정 모드일 때만 취소 버튼 표시 */}
        <div style={{ width: 112 }}>
          {!isReadOnly && (
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
