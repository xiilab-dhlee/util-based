import type { IconProps } from "xiilab-ui";
import { Icon } from "xiilab-ui";

import { AstragoIcon } from "@/components/common/icon/astrago-icon";
import { BuiltinIcon } from "@/components/common/icon/builtin-icon";
import { GuideIcon } from "@/components/common/icon/guide-icon";
import { JupyterIcon } from "@/components/common/icon/jupyter-icon";
import { MigIcon } from "@/components/common/icon/mig-icon";
import { MpsIcon } from "@/components/common/icon/mps-icon";
import { PytorchIcon } from "@/components/common/icon/pytorch-icon";
import { StorageIcon } from "@/components/common/icon/storage-icon";
import { ArrowIcon } from "./arrow-icon";
import { CirclePlusIcon } from "./circle-plus-icon";

interface MyIconProps extends IconProps {}

/**
 * @deprecated MyIcon은 deprecated되었습니다.
 * - 특별한 아이콘 (pytorch, jupyter, astrago, storage, guide, mig, mps, customArrow, circlePlus 등)은 해당 아이콘 컴포넌트를 직접 사용하세요.
 * - 일반 아이콘은 xiilab-ui의 Icon 컴포넌트를 직접 사용하세요.
 *
 * @example
 * // 특별한 아이콘 사용
 * import { AstragoIcon } from "@/components/common/icon/astrago-icon";
 * <AstragoIcon fill={color} width={width} height={height} />
 *
 * @example
 * // 일반 아이콘 사용
 * import { Icon } from "xiilab-ui";
 * <Icon name="Plus" color={color} size={size} />
 */
export function MyIcon({ name, color, width, height, ...props }: MyIconProps) {
  if (name === "pytorch") {
    return <PytorchIcon />;
  } else if (name === "jupyter") {
    return <JupyterIcon />;
  } else if (name === "builtin") {
    return <BuiltinIcon />;
  } else if (name === "hub") {
    return <BuiltinIcon />;
  } else if (name === "custom") {
    return <BuiltinIcon />;
  } else if (name === "astrago") {
    return <AstragoIcon fill={color} width={width} height={height} />;
  } else if (name === "storage") {
    return <StorageIcon fill={color} width={width} height={height} />;
  } else if (name === "guide") {
    return <GuideIcon />;
  } else if (name === "mig") {
    return <MigIcon />;
  } else if (name === "mps") {
    return <MpsIcon />;
  } else if (name === "customArrow") {
    return <ArrowIcon />;
  } else if (name === "circlePlus") {
    return <CirclePlusIcon />;
  }

  return (
    <Icon name={name} color={color} width={width} height={height} {...props} />
  );
}
