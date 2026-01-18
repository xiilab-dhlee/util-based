"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import { VOLUME_SORT_OPTIONS } from "@/domain/volume/constants/volume.constant";
import {
  DEFAULT_VOLUME_SORT,
  type VolumeSortValue,
  volumePageAtom,
  volumeSortAtom,
} from "@/domain/volume/state/volume.atom";

interface VolumeSortFilterProps {
  disabled?: boolean;
}

export function VolumeSortFilter({ disabled }: VolumeSortFilterProps) {
  const [sort, setSort] = useAtom(volumeSortAtom);
  const resetPage = useResetAtom(volumePageAtom);

  const handleChange = (value: VolumeSortValue | null) => {
    resetPage();
    setSort(value ?? DEFAULT_VOLUME_SORT);
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
