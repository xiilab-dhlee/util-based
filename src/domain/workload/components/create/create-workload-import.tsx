"use client";

import { useAtomValue } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import type { GetMyWorkloadsParams } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getWorkloadCloneData,
  useGetMyWorkloads,
} from "@/api/generated/workload/workload";
import { mapCloneDataToAtoms } from "@/domain/workload/utils/map-clone-data-to-atoms";
import { resetAllWorkloadAtoms } from "@/domain/workload/utils/reset-workload-atoms";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import {
  openCreateWorkloadDrawerAtom,
  openSelectWorkloadModalAtom,
} from "@/shared/state/modal.atom";

export function CreateWorkloadImport() {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const { onOpen } = useGlobalModal(openSelectWorkloadModalAtom);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  // 최근 워크로드 1개만 가져오기
  const recentWorkloadParams: GetMyWorkloadsParams = {
    pageNo: 0,
    pageSize: 1,
  };

  const { data: recentWorkloadData, isLoading } = useGetMyWorkloads(
    selectedWorkspace?.workspaceId ?? 0,
    recentWorkloadParams,
    {
      query: {
        enabled: Boolean(selectedWorkspace?.workspaceId),
      },
    },
  );

  const handleClickRecentWorkload = useAtomCallback(
    useCallback(
      async (_get, set) => {
        if (!selectedWorkspace) {
          toast.error("워크스페이스를 선택해주세요.");
          return;
        }

        if (isLoading) {
          return;
        }

        const recentWorkload = recentWorkloadData?.content?.[0];
        if (!recentWorkload) {
          toast.error("복제할 수 있는 워크로드가 없습니다.");
          return;
        }

        try {
          setIsLoadingRecent(true);

          const cloneData = await getWorkloadCloneData(
            selectedWorkspace.workspaceId,
            recentWorkload.workloadResourceName,
          );

          resetAllWorkloadAtoms(set);

          if (cloneData) {
            mapCloneDataToAtoms(cloneData, set);
          }

          set(openCreateWorkloadDrawerAtom, true);
        } catch (error) {
          console.error("Failed to load recent workload clone data:", error);
          toast.error("최근 워크로드 복제 데이터를 가져오는데 실패했습니다.");
        } finally {
          setIsLoadingRecent(false);
        }
      },
      [selectedWorkspace, recentWorkloadData, isLoading],
    ),
  );

  const handleClickLoadWorkload = () => {
    onOpen();
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>워크스페이스</HeaderTitle>
        <WorkspaceName>{selectedWorkspace?.workspaceName || "-"}</WorkspaceName>
      </Header>
      <Body>
        <BodyTitle>기존 워크로드 정보 가져오기</BodyTitle>
        <Buttons>
          <Button
            data-testid={WORKLOAD_SELECTOR.CREATE_RECENT_IMPORT_BUTTON}
            onClick={handleClickRecentWorkload}
            disabled={isLoadingRecent || isLoading}
          >
            <Typography.Text variant="button-1" color="var(--color-gray-01)">
              최근 워크로드 가져오기
            </Typography.Text>
          </Button>
          <Button
            data-testid={WORKLOAD_SELECTOR.CREATE_LIST_IMPORT_BUTTON}
            onClick={handleClickLoadWorkload}
          >
            <Typography.Text variant="button-1" color="var(--color-gray-01)">
              워크로드 목록에서 가져오기
            </Typography.Text>
          </Button>
        </Buttons>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid var(--color-gray-10);
  background: var(--color-gray-17);
  padding: 14px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 14px;
`;

const HeaderTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 100%;
  color: #000;
  margin-bottom: 4px;
`;

const WorkspaceName = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: #000;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 100%;
  color: #000;
  margin-bottom: 8px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  flex: 1;
  height: 30px;
  background: var(--color-gray-17);
  border: 1px solid var(--color-gray-09);
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 1px 2px 0px rgba(127, 140, 166, 0.12);

  &:hover {
    background: var(--color-gray-15);
  }

  &:active {
    background: var(--color-gray-13);
  }
`;
