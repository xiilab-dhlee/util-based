import type { IconProps } from "xiilab-ui";
import { Icon } from "xiilab-ui";

import { AstragoIcon } from "@/components/common/icons/astrago-icon";
import { BuiltinIcon } from "@/components/common/icons/builtin-icon";
import { GuideIcon } from "@/components/common/icons/guide-icon";
import { JupyterIcon } from "@/components/common/icons/jupyter-icon";
import { MigIcon } from "@/components/common/icons/mig-icon";
import { MpsIcon } from "@/components/common/icons/mps-icon";
import { PytorchIcon } from "@/components/common/icons/pytorch-icon";
import { StorageIcon } from "@/components/common/icons/storage-icon";
import { ArrowIcon } from "./arrow-icon";
import { CirclePlusIcon } from "./circle-plus-icon";

interface MyIconProps extends IconProps {}

export function MyIcon({ name, ...props }: MyIconProps) {
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
    return <AstragoIcon />;
  } else if (name === "local") {
    return <StorageIcon />;
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

  return <Icon name={name} {...props} />;
}
