"use client";

import type { Dispatch, SetStateAction } from "react";
import { Dropdown } from "xiilab-ui";

import { useGetVolumeOptions } from "../hooks/use-get-volume-options";
import type { VolumeIdType, VolumeListType } from "../schemas/volume.schema";

interface VolumeSelectProps {
  value: VolumeListType | null;
  setValue: Dispatch<SetStateAction<VolumeListType | null>>;
}

export function VolumeSelect({ value, setValue }: VolumeSelectProps) {
  const { data } = useGetVolumeOptions();

  const handleChange = (next: VolumeIdType | null) => {
    const selectedOption = data?.find((v) => v.origin.uid === next);

    if (selectedOption) {
      setValue(selectedOption.origin);
    }
  };

  return (
    <Dropdown
      placeholder="볼륨을 선택해 주세요."
      options={data || []}
      value={value?.uid || null}
      onChange={handleChange}
      width="100%"
    />
  );
}
