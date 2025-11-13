import type { CorePaginate } from "../common/api.interface";

export interface CreateBmcPayload {
  bmcIp: string;
  bmcUserName: string;
  bmcPassword: string;
  nodeIp: string;
}

export interface UpdateBmcPayload extends CreateBmcPayload {
  id: number;
}

export type RedfishSystem = {
  id: string;
};

export type RedfishLog = {
  id: string;
};

export type RedfishAccordianProps = {
  systemId: string;
  bmcIp: string;
};

export type RedfishPowerType = "ForceRestart" | "ForceOff" | "On";

export interface RedfishSetPowerPayload {
  bmcIp: string;
  systemId: string;
  resetType: RedfishPowerType;
}

export type GetRedfishSystemsPayload = Pick<CorePaginate, "page">;
