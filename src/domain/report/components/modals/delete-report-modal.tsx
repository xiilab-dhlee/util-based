"use client";

import { useResetAtom } from "jotai/utils";
import { useRouter } from "next/navigation";
import type { Key } from "react";
import { useCallback, useState } from "react";
import { Modal } from "xiilab-ui";

import {
  openDeleteReportModalAtom,
  reportCheckedListAtom,
} from "@/domain/report/state/report.atom";
import { REPORT_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 리포트 삭제 모달 컴포넌트
 *
 * 선택한 리포트를 삭제할 수 있는 모달입니다.
 */
export function DeleteReportModal() {
  const router = useRouter();

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openDeleteReportModalAtom);

  // 체크박스 초기화
  const resetCheckedList = useResetAtom(reportCheckedListAtom);

  // 삭제할 리포트 ID 목록
  const [deleteReportIds, setDeleteReportIds] = useState<Key[]>([]);

  /**
   * 리포트 삭제 요청 수신 핸들러
   *
   * 단일 ID (Key) 또는 여러 ID (Key[])를 배열로 정규화한 뒤
   * 삭제 대상 ID 상태를 설정하고 모달을 연다.
   */
  const handleReceiveDeleteReport = useCallback(
    (reportIds: Key | Key[]) => {
      const ids = Array.isArray(reportIds) ? reportIds : [reportIds];

      setDeleteReportIds(ids);
      onOpen();
    },
    [onOpen],
  );

  /**
   * 폼 제출 처리 함수
   *
   * 리포트 삭제를 실행하고 모달을 닫습니다.
   */
  const handleOk = () => {
    if (deleteReportIds.length === 0) return;

    // TODO: 삭제 API 연동
    console.log("Delete reports:", deleteReportIds);

    // 삭제 성공 후 상태 클리어 (모달 닫기 전)
    setDeleteReportIds([]);

    // 체크박스 초기화
    resetCheckedList();
    // 모달 닫기
    onClose();
    // 목록 페이지로 이동
    router.replace(ROUTES.ADMIN_REPORT);
  };

  /**
   * 리포트 삭제 모달 데이터 구독
   * 단일 ID (string) 또는 여러 ID (string[])를 받을 수 있음
   */
  useSubscribe(REPORT_EVENTS.sendDeleteReport, handleReceiveDeleteReport);

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="리포트 삭제"
      centered
    >
      <div>삭제된 리포트는 복구할 수 없습니다.</div>
      <div>리포트를 삭제하시겠습니까?</div>
    </Modal>
  );
}
