import type { RedfishPowerType } from "@/domain/node/types/redfish.type";
import { AxiosService } from "@/shared/api/axios";

export class RedfishService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/redfish";

  public getSystems(bmcIp: string) {
    return this.getAxios().get(`${this.BASE_URL}/Systems`, {
      params: { bmcIp },
    });
  }

  public getSystem(bmcIp: string, systemId: string) {
    return this.getAxios().get(`${this.BASE_URL}/Systems/${systemId}`, {
      params: { bmcIp },
    });
  }

  public getSystemMaxPower(bmcIp: string, systemId: string) {
    return this.getAxios().get(`${this.BASE_URL}/Chassis/${systemId}/Power`, {
      params: { bmcIp },
    });
  }

  public async getSystemChassis(bmcIp: string) {
    return this.getAxios().get(`${this.BASE_URL}/Chassis`, {
      params: { bmcIp, role: "chassis" },
    });
  }

  public getSystemFirmware(bmcIp: string) {
    return this.getAxios().get(
      `${this.BASE_URL}/UpdateService/FirmwareInventory`,
      {
        params: { bmcIp, role: "parent" },
      },
    );
  }

  public getSystemMemory(bmcIp: string, systemId: string) {
    return this.getAxios().get(`${this.BASE_URL}/Systems/${systemId}/Memory`, {
      params: { bmcIp, role: "parent" },
    });
  }

  public getSystemNetworkAdaptor(bmcIp: string, systemId: string) {
    return this.getAxios().get(
      `${this.BASE_URL}/Systems/${systemId}/EthernetInterfaces`,
      {
        params: { bmcIp, role: "parent" },
      },
    );
  }

  public async getSystemProcessors(bmcIp: string, systemId: string) {
    return this.getAxios().get(
      `${this.BASE_URL}/Systems/${systemId}/Processors`,
      {
        params: { bmcIp, role: "parent" },
      },
    );
  }

  public getSystemLogs(
    bmcIp: string,
    systemId: string,
    page: number,
    size: number,
  ) {
    return this.getAxios().get(
      `${this.BASE_URL}/Systems/${systemId}/LogServices`,
      {
        params: { bmcIp, role: "log", page, size },
      },
    );
  }

  public setSystemPower(
    bmcIp: string,
    systemId: string,
    ResetType: RedfishPowerType,
  ) {
    return this.getAxios().post(
      `${this.BASE_URL}/Systems/${systemId}/Actions/ComputerSystem.Reset`,
      {
        bmcIp,
        ResetType,
      },
    );
  }
}
