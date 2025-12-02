"use client";

import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import { Icon, Modal } from "xiilab-ui";

import { useGetRecentWorkloads } from "@/domain/workload/hooks/use-get-recent-workloads";
import { useGetWorkloadLazy } from "@/domain/workload/hooks/use-get-workload";
import { selectedWorkloadAtom } from "@/domain/workload/state/workload.atom";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { openSelectWorkloadModalAtom } from "@/shared/state/modal.atom";

export function SelectWorkloadModal() {
  const publish = usePublish();

  const { open, onClose } = useGlobalModal(openSelectWorkloadModalAtom);
  const [selectedWorkload, setSelectedWorkload] = useAtom(selectedWorkloadAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const [page, setPage] = useState(1);

  const { data } = useGetRecentWorkloads({
    page: page,
    size: 8,
    searchText: "",
  });

  const { execute } = useGetWorkloadLazy();

  const handleOk = async () => {
    if (!selectedWorkload) return;
    if (!selectedWorkspace) return;

    try {
      const workloadDetail = await execute({
        workloadId: selectedWorkload,
        workspaceId: selectedWorkspace.id,
      });

      if (workloadDetail) {
        publish(WORKLOAD_EVENTS.sendCreateWorkload, workloadDetail);
        onClose();
      }
    } catch {
      toast.error("워크로드 정보를 가져오는 중에 오류가 발생했습니다.");
    }
  };

  const handleAfterClose = () => {
    setSelectedWorkload(null);
    setPage(1);
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
        disabled: !selectedWorkload,
      }}
      afterClose={handleAfterClose}
    >
      <CustomizedTable
        columns={createWorkloadColumn([
          { dataIndex: "select" },
          {
            dataIndex: "workloadName",
            title: "워크로드 이름",
            width: 130,
            ellipsis: true,
          },
          { dataIndex: "jobType", title: "잡 타입" },
          { dataIndex: "creatorName" },
          { dataIndex: "status" },
          { dataIndex: "elapsedTime" },
        ])}
        data={data?.content || []}
        pagination={{
          current: page,
          pageSize: 8,
          total: data?.totalSize || 0,
          onChange: (page) => setPage(page),
        }}
        columnHeight={40}
      />
    </Modal>
  );
}
