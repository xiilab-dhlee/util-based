"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import {
  VOLUME_DEFAULT_SORT,
  VOLUME_SORT_OPTIONS,
} from "@/domain/volume/constants/volume.constant";
import {
  volumePageAtom,
  volumeSortAtom,
} from "@/domain/volume/state/volume.atom";

interface VolumeSortFilterProps {
  disabled?: boolean;
}

export function VolumeSortFilter({ disabled }: VolumeSortFilterProps) {
  const [sort, setSort] = useAtom(volumeSortAtom);
  const resetPage = useResetAtom(volumePageAtom);

  const handleChange = (value: string | null) => {
    resetPage();
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
