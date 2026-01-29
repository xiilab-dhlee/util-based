"use client";

import { useAtom, useSetAtom } from "jotai";
import { Dropdown } from "xiilab-ui";

import { useFindHubSummaries } from "@/api/generated/hub/hub";
import { WORKLOAD_JOB_TYPES } from "@/domain/workload/constants/workload.constant";
import {
  harborImageNameAtom,
  imageTagNameAtom,
} from "@/domain/workload/state/create-workload.atom";

interface CreateWorkloadHubImageSelectProps {
  onHarborImageNameChange: (value: string) => void;
  onImageTagNameChange: (value: string) => void;
}

export function CreateWorkloadHubImageSelect({
  onHarborImageNameChange,
  onImageTagNameChange,
}: CreateWorkloadHubImageSelectProps) {
  const [harborImageName, setHarborImageName] = useAtom(harborImageNameAtom);
  const setImageTagName = useSetAtom(imageTagNameAtom);
  /** 허브 이미지 옵션 목록 조회 */
  const { data, isLoading } = useFindHubSummaries({
    workloadJobType: WORKLOAD_JOB_TYPES.BATCH,
  });

  const options =
    data?.map((item) => ({
      label: item.hubName,
      value: item.hubName,
    })) || [];

  const handleChangeImage = (value: string | null) => {
    const selectedHub = data?.find((item) => item.hubName === value);
    const nextHarborImageName = value ?? "";
    const nextImageTagName = selectedHub?.imageTagId
      ? String(selectedHub.imageTagId)
      : "";

    onHarborImageNameChange(nextHarborImageName);
    onImageTagNameChange(nextImageTagName);
    setHarborImageName(nextHarborImageName);
    setImageTagName(nextImageTagName);
  };

  return (
    <Dropdown
      placeholder="허브 이미지를 선택해 주세요."
      options={options}
      value={harborImageName || null}
      onChange={handleChangeImage}
      width="100%"
      loading={isLoading}
    />
  );
}
