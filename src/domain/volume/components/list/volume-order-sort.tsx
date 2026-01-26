"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import {
  VOLUME_DEFAULT_SORT,
  VOLUME_SORT_OPTIONS,
} from "@/domain/volume/constants/volume.constant";
import {
  volumeCheckedListAtom,
  volumeOrderSortAtom,
  volumePageAtom,
} from "@/domain/volume/state/volume.atom";

interface VolumeOrderSortProps {
  disabled?: boolean;
}

export function VolumeOrderSort({ disabled }: VolumeOrderSortProps) {
  const [sort, setSort] = useAtom(volumeOrderSortAtom);
  const resetPage = useResetAtom(volumePageAtom);
  const resetCheckedList = useResetAtom(volumeCheckedListAtom);

  const handleChange = (value: string | null) => {
    resetPage();
    resetCheckedList();
    setSort(value ?? VOLUME_DEFAULT_SORT);
  };

  return (
    <Dropdown
      options={VOLUME_SORT_OPTIONS}
      placeholder="정렬"
      onChange={handleChange}
      value={sort}
      width={120}
      height={30}
      disabled={disabled}
    />
  );
}
