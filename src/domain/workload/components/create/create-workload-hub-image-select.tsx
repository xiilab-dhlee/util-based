"use client";

import { useAtom, useSetAtom } from "jotai";
import { useMemo } from "react";
import { Dropdown } from "xiilab-ui";

import { useFindHubSummaries } from "@/api/generated/hub/hub";
import {
  imageIdAtom,
  imageTagIdAtom,
} from "@/domain/workload/state/create-workload.atom";
import { useSelect } from "@/shared/hooks/use-select";

export function CreateWorkloadHubImageSelect() {
  const [imageId, setImageId] = useAtom(imageIdAtom);
  const setImageTagId = useSetAtom(imageTagIdAtom);
  /** 허브 이미지 옵션 목록 조회 */
  const { data } = useFindHubSummaries({ workloadJobType: "BATCH" });

  const options = useMemo(() => {
    return (
      data?.map((item) => ({
        label: item.hubName,
        value: String(item.hubId),
      })) || []
    );
  }, [data]);

  const image = useSelect(null, options);

  const handleChangeImage = (value: string | null) => {
    setImageId(value);
    setImageTagId(null);
  };

  return (
    <Dropdown
      placeholder="허브 이미지를 선택해 주세요."
      options={image.options}
      value={imageId}
      onChange={handleChangeImage}
      width="100%"
    />
  );
}
