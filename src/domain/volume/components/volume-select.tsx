"use client";

import type { Dispatch, SetStateAction } from "react";
import { Dropdown } from "xiilab-ui";

import type { VolumeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetVolumeList } from "@/api/generated/volume/volume";
import type { CoreDropdownOption } from "@/shared/types/core.model";

interface VolumeSelectProps {
  value: VolumeListResponse | null;
  setValue: Dispatch<SetStateAction<VolumeListResponse | null>>;
}

export function VolumeSelect({ value, setValue }: VolumeSelectProps) {
  const { data: options } = useGetVolumeList(
    { pageNo: 0, pageSize: 100 },
    {
      query: {
        select: (response) =>
          response.content?.map(
            (volume): CoreDropdownOption<VolumeListResponse> => ({
              label: volume.volumeName,
              value: volume.volumeId,
              origin: volume,
            }),
          ) ?? [],
      },
    },
  );

  const handleChange = (next: number | null) => {
    if (next === null) {
      setValue(null);
      return;
    }

    const selectedOption = options?.find((v) => v.origin.volumeId === next);

    if (selectedOption) {
      setValue(selectedOption.origin);
    }
  };

  return (
    <Dropdown
      placeholder="볼륨을 선택해 주세요."
      options={options || []}
      value={value?.volumeId || null}
      onChange={handleChange}
      width="100%"
    />
  );
}
