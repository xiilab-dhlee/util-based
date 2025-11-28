"use client";

import { useAtom } from "jotai";
import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useGetWorkloadLazy } from "@/domain/workload/hooks/use-get-workload";
import { selectedWorkloadAtom } from "@/domain/workload/state/workload.atom";
import { workloadListMock } from "@/mocks/data/workload.mock";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { openSelectWorkloadModalAtom } from "@/shared/state/modal.atom";
import { createWorkloadColumn } from "../column/create-workload-column";
import { CustomizedTable } from "../table/customized-table";

export function SelectWorkloadModal() {
  const publish = usePublish();

  const { open, onClose } = useGlobalModal(openSelectWorkloadModalAtom);
  const [selectedWorkload, setSelectedWorkload] = useAtom(selectedWorkloadAtom);
  const [page, setPage] = useState(1);

  const { execute } = useGetWorkloadLazy();

  const handleOk = async () => {
    if (!selectedWorkload) return;

    const workloadDetail = await execute({
      workloadId: selectedWorkload,
      // 임시
      workspaceId: "test",
    });

    if (workloadDetail) {
      publish(WORKLOAD_EVENTS.sendCloneWorkload, selectedWorkload);
      onClose();
    }
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
      afterClose={() => setSelectedWorkload(null)}
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
        data={workloadListMock}
        pagination={{
          current: page,
          pageSize: 8,
          total: 100,
          onChange: (page) => setPage(page),
        }}
        columnHeight={40}
      />
    </Modal>
  );
}
