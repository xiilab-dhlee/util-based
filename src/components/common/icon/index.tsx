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
