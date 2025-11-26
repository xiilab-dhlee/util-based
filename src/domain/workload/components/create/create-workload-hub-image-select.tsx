"use client";

import { useAtom, useSetAtom } from "jotai";
import { Dropdown } from "xiilab-ui";

import { useGetHubOptions } from "@/domain/hub/hooks/use-get-hub-options";
import { useSelect } from "@/shared/hooks/use-select";
import { imageIdAtom, imageTagIdAtom } from "../../state/create-workload.atom";

export function CreateWorkloadHubImageSelect() {
  const [imageId, setImageId] = useAtom(imageIdAtom);
  const setImageTagId = useSetAtom(imageTagIdAtom);
  /** 허브 이미지 옵션 목록 조회 */
  const { data } = useGetHubOptions();

  const image = useSelect(null, data || []);

  const handleChangeImage = (value: string) => {
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
