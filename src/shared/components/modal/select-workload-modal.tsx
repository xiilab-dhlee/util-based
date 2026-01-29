"use client";

import { useAtom, useAtomValue } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import type { ResponsiveColumnType } from "xiilab-ui";
import { Icon, Modal } from "xiilab-ui";

import type {
  GetMyWorkloadsParams,
  MyWorkloadItem,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getWorkloadCloneData,
  useGetMyWorkloads,
} from "@/api/generated/workload/workload";
import { SELECT_WORKLOAD_MODAL_PAGE_SIZE } from "@/domain/workload/constants/workload.constant";
import { selectedWorkloadAtom } from "@/domain/workload/state/workload.atom";
import { mapCloneDataToAtoms } from "@/domain/workload/utils/map-clone-data-to-atoms";
import { resetAllWorkloadAtoms } from "@/domain/workload/utils/reset-workload-atoms";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import {
  openCreateWorkloadDrawerAtom,
  openSelectWorkloadModalAtom,
} from "@/shared/state/modal.atom";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

export function SelectWorkloadModal() {
  const { open, onClose } = useGlobalModal(openSelectWorkloadModalAtom);
  const [selectedWorkload, setSelectedWorkload] = useAtom(selectedWorkloadAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const [page, setPage] = useState(1);
  const [isCloning, setIsCloning] = useState(false);

  const params: GetMyWorkloadsParams = {
    pageNo: page - 1,
    pageSize: SELECT_WORKLOAD_MODAL_PAGE_SIZE,
  };

  const {
    data,
    isLoading: isListLoading,
    isError,
  } = useGetMyWorkloads(selectedWorkspace?.workspaceId ?? 0, params, {
    query: {
      enabled: open && Boolean(selectedWorkspace?.workspaceId),
    },
  });

  const handleOk = useAtomCallback(
    useCallback(
      async (_get, set) => {
        if (!selectedWorkload || !selectedWorkspace) return;

        try {
          setIsCloning(true);

          const cloneData = await getWorkloadCloneData(
            selectedWorkspace.workspaceId,
            selectedWorkload,
          );

          resetAllWorkloadAtoms(set);

          if (cloneData) {
            mapCloneDataToAtoms(cloneData, set);
          }

          set(openCreateWorkloadDrawerAtom, true);
          onClose();
        } catch (error) {
          console.error("Failed to load workload clone data:", error);
          toast.error("워크로드 복제 데이터를 가져오는데 실패했습니다.");
        } finally {
          setIsCloning(false);
        }
      },
      [selectedWorkload, selectedWorkspace, onClose],
    ),
  );

  const clearSelectionAndSetPage = (nextPage: number) => {
    setSelectedWorkload(null);
    setPage(nextPage);
  };

  const handleAfterClose = () => {
    clearSelectionAndSetPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    clearSelectionAndSetPage(nextPage);
  };

  return (
    <Modal
      title="워크로드 정보 가져오기"
      open={open}
      onCancel={onClose}
      modalWidth={600}
      centered
      type="primary"
      icon={<Icon name="Copy" size={20} color="#FFF" />}
      okText="가져오기"
      cancelText="취소"
      onOk={handleOk}
      okButtonProps={{
        disabled: !selectedWorkload || isError,
        loading: isCloning,
      }}
      afterClose={handleAfterClose}
    >
      <Container>
        <TableWrap>
          <CustomizedTable
            columns={[
              ...createWorkloadColumn([
                { key: "select" },
                {
                  key: "workloadName",
                  title: "워크로드 이름",
                  width: "35%",
                  ellipsis: true,
                  sorter: false,
                },
                {
                  key: "jobType",
                  width: "15%",
                },
                {
                  key: "creatorName",
                  title: "생성자",
                  width: "15%",
                  ellipsis: true,
                },
              ]),
              {
                key: "createdAt",
                dataIndex: "createdAt",
                title: "생성일시",
                width: "35%",
                render: (createdAt: string) => {
                  return <span>{formatDateTimeSafely(createdAt)}</span>;
                },
              } satisfies ResponsiveColumnType<MyWorkloadItem>,
            ]}
            data={data?.content || []}
            loading={isListLoading}
          />
        </TableWrap>
        <ListPageFooter
          total={data?.totalSize ?? 0}
          page={page}
          pageSize={SELECT_WORKLOAD_MODAL_PAGE_SIZE}
          onChange={handlePageChange}
          isLoading={isListLoading}
        />
      </Container>
    </Modal>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
`;

const TableWrap = styled.div`
  flex: 1;
  min-height: 0;
`;
