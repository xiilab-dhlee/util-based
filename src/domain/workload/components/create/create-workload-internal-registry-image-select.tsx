"use client";

import { useAtom, useSetAtom } from "jotai";
import { Dropdown } from "xiilab-ui";

import { useGetInternalRegistryImageOptions } from "@/domain/internal-registry-image/hooks/use-get-internal-registry-image-options";
import { useSelect } from "@/shared/hooks/use-select";
import { imageIdAtom, imageTagIdAtom } from "../../state/create-workload.atom";

export function CreateWorkloadInternalRegistryImageSelect() {
  const [imageId, setImageId] = useAtom(imageIdAtom);
  const setImageTagId = useSetAtom(imageTagIdAtom);
  /** 내부 레지스트리 이미지 옵션 목록 조회 */
  const { data } = useGetInternalRegistryImageOptions();

  const image = useSelect(null, data || []);

  const handleChangeImage = (value: string) => {
    setImageId(value);
    setImageTagId(null);
  };

  return (
    <Dropdown
      placeholder="내부 레지스트리 이미지를 선택해 주세요."
      options={image.options}
      value={imageId}
      onChange={handleChangeImage}
      width="100%"
    />
  );
}
