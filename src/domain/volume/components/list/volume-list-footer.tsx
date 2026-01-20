"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { toast } from "react-toastify";

import { VOLUME_PAGE_SIZE } from "@/domain/volume/constants/volume.constant";
import {
  volumeCheckedListAtom,
  volumePageAtom,
} from "@/domain/volume/state/volume.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface VolumeListFooterProps {
  total: number;
  loading: boolean;
}

export function VolumeListFooter({ total, loading }: VolumeListFooterProps) {
  const publish = usePublish();

  const [page, setPage] = useAtom(volumePageAtom);
  const checkedList = useAtomValue(volumeCheckedListAtom);
  const resetCheckedList = useResetAtom(volumeCheckedListAtom);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    resetCheckedList();
  };

  const handleClickDelete = () => {
    if (checkedList.size === 0) {
      toast.error("삭제할 볼륨을 선택해 주세요.");
      return;
    }

    publish(VOLUME_EVENTS.openDeleteModal, Array.from(checkedList).map(Number));
  };

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={VOLUME_PAGE_SIZE}
      onChange={handlePageChange}
      isLoading={loading}
      rightChildren={
        <ListDeleteButton
          onClick={handleClickDelete}
          disabled={checkedList.size === 0}
        />
      }
    />
  );
}
