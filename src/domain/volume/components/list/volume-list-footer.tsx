"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";

import { VOLUME_PAGE_SIZE } from "@/domain/volume/constants/volume.constant";
import {
  openDeleteVolumeModalAtom,
  volumeCheckedListAtom,
  volumePageAtom,
} from "@/domain/volume/state/volume.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface VolumeListFooterProps {
  total: number;
  loading: boolean;
}

export function VolumeListFooter({ total, loading }: VolumeListFooterProps) {
  const [page, setPage] = useAtom(volumePageAtom);
  const checkedList = useAtomValue(volumeCheckedListAtom);
  const openDeleteModal = useSetAtom(openDeleteVolumeModalAtom);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleClickDelete = () => {
    if (checkedList.size === 0) {
      toast.error("삭제할 볼륨을 선택해 주세요.");
      return;
    }

    openDeleteModal(true);
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
