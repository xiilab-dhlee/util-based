"use client";

import { useAtom, useSetAtom } from "jotai";
import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Input, Modal } from "xiilab-ui";

import {
  closeDeleteSingleWorkspaceModalAtom,
  deleteSingleWorkspaceModalDataAtom,
  openDeleteSingleWorkspaceModalAtom,
} from "@/atoms/workspace/workspace-modal.atom";
import { useDeleteWorkspace } from "@/hooks/workspace/use-delete-workspace";

/**
 * 워크스페이스 삭제 확인 모달 컴포넌트
 *
 * 워크스페이스를 삭제하기 전에 사용자에게 확인을 받는 모달입니다.
 * 설정 페이지에서 사용되는 모달입니다.
 */
export function DeleteSingleWorkspaceModal() {
  // 모달 상태 관리
  const [open] = useAtom(openDeleteSingleWorkspaceModalAtom);
  const [modalData] = useAtom(deleteSingleWorkspaceModalDataAtom);
  const closeModal = useSetAtom(closeDeleteSingleWorkspaceModalAtom);

  // 입력된 워크스페이스 이름
  const [inputWorkspaceName, setInputWorkspaceName] = useState("");
  // 에러 메시지 표시 상태
  const [showValidationError, setShowValidationError] = useState(false);

  const deleteWorkspace = useDeleteWorkspace();

  /**
   * 삭제 확인 처리 함수
   *
   * 워크스페이스 삭제를 실행하고 모달을 닫습니다.
   */
  const handleDelete = () => {
    if (!modalData?.id) {
      toast.error("삭제할 워크스페이스 정보가 없습니다.");
      return;
    }

    // 입력한 워크스페이스 이름이 실제 이름과 일치하는지 확인
    if (inputWorkspaceName.trim() !== modalData.name) {
      setShowValidationError(true);
      return;
    }

    // validation 통과 시 에러 상태 초기화
    setShowValidationError(false);

    deleteWorkspace.mutate([modalData.id], {
      onSuccess: () => {
        toast.success("워크스페이스가 성공적으로 삭제되었습니다.");
        closeModal();
        // 상태 초기화
        setInputWorkspaceName("");
        setShowValidationError(false);
        // TODO: 삭제 후 목록 새로고침 또는 다른 페이지로 이동
      },
      onError: (error) => {
        toast.error("워크스페이스 삭제에 실패했습니다.");
        console.error("Workspace delete error:", error);
      },
    });
  };

  /**
   * 모달 취소 처리 함수
   */
  const handleCancel = () => {
    closeModal();
    // 상태 초기화
    setInputWorkspaceName("");
    setShowValidationError(false);
  };

  /**
   * Input 변경 처리 함수
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputWorkspaceName(e.target.value);
    // 사용자가 다시 입력하기 시작하면 에러 메시지 제거
    if (showValidationError) {
      setShowValidationError(false);
    }
  };

  return (
    <Modal
      type="danger"
      variant="delete"
      modalWidth={300}
      open={open}
      closable
      title="워크스페이스 삭제"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="삭제"
      onOk={handleDelete}
      centered
      okButtonProps={{
        disabled: deleteWorkspace.isPending,
        loading: deleteWorkspace.isPending,
      }}
      style={{
        height: "230px",
        maxHeight: "230px",
      }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 안내 메시지 */}
        <p
          style={{
            color: "#000",
            fontFamily: "Pretendard",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "18px",
            marginBottom: "10px",
          }}
        >
          한번 삭제한 워크스페이스는 복구할 수 없습니다.
          <br />
          해당 워크스페이스를 삭제하시겠습니까?
        </p>

        {/* 워크스페이스 이름 입력 필드 */}
        <div style={{ marginBottom: "4px" }}>
          <Input
            type="text"
            placeholder="삭제할 워크스페이스의 이름을 입력해 주세요."
            value={inputWorkspaceName}
            onChange={handleInputChange}
            width="100%"
          />
        </div>

        {/* 워크스페이스 이름 표시 또는 에러 메시지 */}
        {modalData && (
          <div
            style={{
              color: showValidationError ? "#FF4D4F" : "#333",
              fontFamily: "Pretendard",
              fontSize: "11px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: showValidationError ? "#FF4D4F" : "#333",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            ></span>
            {showValidationError ? (
              "워크스페이스를 잘못 입력하셨습니다. 다시 입력해 주세요."
            ) : (
              <>
                내 워크스페이스 :{" "}
                <span style={{ color: "#333", fontWeight: 400 }}>
                  {modalData.name}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

