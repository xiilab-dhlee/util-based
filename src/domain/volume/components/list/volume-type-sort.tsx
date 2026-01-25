"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import type { GetVolumeListVolumeType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { VOLUME_TYPE_OPTIONS } from "@/domain/volume/constants/volume.constant";
import {
  volumePageAtom,
  volumeTypeSortAtom,
} from "@/domain/volume/state/volume.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";

interface VolumeTypeSortProps {
  disabled?: boolean;
}

export function VolumeTypeSort({ disabled }: VolumeTypeSortProps) {
  const [volumeType, setVolumeType] = useAtom(volumeTypeSortAtom);
  const resetPage = useResetAtom(volumePageAtom);

  const handleChange = (value: GetVolumeListVolumeType | null) => {
    resetPage();
    setVolumeType(value);
  };

  return (
    <Dropdown
      options={[ALL_OPTION, ...VOLUME_TYPE_OPTIONS]}
      placeholder="볼륨 타입"
      onChange={handleChange}
      value={volumeType}
      width={120}
      height={30}
      disabled={disabled}
    />
  );
}
