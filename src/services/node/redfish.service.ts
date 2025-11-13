import redfishConstants from "@/constants/node/redfish.constant";
import { RequireAxiosInstance } from "@/decorators/common/axios.decorator";
import type { RedfishPowerType } from "@/types/node/redfish.interface";
import { BasicAuthAxiosService } from "../common/basic-auth";

export class RedfishService extends BasicAuthAxiosService {
  private readonly BASE_URL = "/api/redfish";

  /** 서버 목록 조회 */
  @RequireAxiosInstance()
  public getSystems(bmcIp: string) {
    if (process.env.NEXT_PUBLIC_DEMO_ENABLE === "Y") {
      return { data: redfishConstants.demoSystemsInfo };
    } else {
      return this.getAxios()!.get(`${this.BASE_URL}/Systems`, {
        params: { bmcIp },
      });
    }
  }

  /** 서버 단일 조회 */
  @RequireAxiosInstance()
  public getSystem(bmcIp: string, systemId: string) {
    return this.getAxios()!.get(`${this.BASE_URL}/Systems/${systemId}`, {
      params: { bmcIp },
    });
  }

  /** 서버 최대 전력정보 조회 */
  @RequireAxiosInstance()
  public getSystemMaxPower(bmcIp: string, systemId: string) {
    return this.getAxios()!.get(`${this.BASE_URL}/Chassis/${systemId}/Power`, {
      params: { bmcIp },
    });
  }

  /** 서버 새시 목록 조회 */
  @RequireAxiosInstance()
  public async getSystemChassis(bmcIp: string) {
    if (process.env.NEXT_PUBLIC_DEMO_ENABLE === "Y") {
      return {
        data: {
          members: redfishConstants.demoChassisInfo,
          powerSupplies: redfishConstants.demoPowerSupplyInfo,
          thermals: redfishConstants.demoThermalInfo,
        },
      };
    } else {
      return this.getAxios()!.get(`${this.BASE_URL}/Chassis`, {
        params: { bmcIp, role: "chassis" },
      });
    }
  }

  /** 서버 펌웨어 인벤토리 목록 조회 */
  @RequireAxiosInstance()
  public getSystemFirmware(bmcIp: string) {
    if (process.env.NEXT_PUBLIC_DEMO_ENABLE === "Y") {
      return { data: { members: redfishConstants.demoFirmwareInfo } };
    } else {
      return this.getAxios()!.get(
        `${this.BASE_URL}/UpdateService/FirmwareInventory`,
        {
          params: { bmcIp, role: "parent" },
        },
      );
    }
  }

  /** 서버 메모리 정보 조회 */
  @RequireAxiosInstance()
  public getSystemMemory(bmcIp: string, systemId: string) {
    if (process.env.NEXT_PUBLIC_DEMO_ENABLE === "Y") {
      return { data: redfishConstants.demoMemoryInfo };
    } else {
      return this.getAxios()!.get(
        `${this.BASE_URL}/Systems/${systemId}/Memory`,
        {
          params: { bmcIp, role: "parent" },
        },
      );
    }
  }

  /** 서버 네트워크 어댑터 조회 */
  @RequireAxiosInstance()
  public getSystemNetworkAdaptor(bmcIp: string, systemId: string) {
    if (process.env.NEXT_PUBLIC_DEMO_ENABLE === "Y") {
      return { data: { members: redfishConstants.demoNetworkAdapterInfo } };
    } else {
      return this.getAxios()!.get(
        `${this.BASE_URL}/Systems/${systemId}/EthernetInterfaces`,
        {
          params: { bmcIp, role: "parent" },
        },
      );
    }
  }

  /** 서버의 디바이스 및 프로세스 목록 조회 */
  @RequireAxiosInstance()
  public async getSystemProcessors(bmcIp: string, systemId: string) {
    if (process.env.NEXT_PUBLIC_DEMO_ENABLE === "Y") {
      return { data: { members: redfishConstants.demoProcessorsInfo } };
    } else {
      return this.getAxios()!.get(
        `${this.BASE_URL}/Systems/${systemId}/Processors`,
        {
          params: { bmcIp, role: "parent" },
        },
      );
    }
  }

  /** 서버의 로그 조회 */
  @RequireAxiosInstance()
  public getSystemLogs(
    bmcIp: string,
    systemId: string,
    page: number,
    size: number,
  ) {
    if (process.env.NEXT_PUBLIC_DEMO_ENABLE === "Y") {
      return { data: { logs: { Members: redfishConstants.demoLogInfo } } };
    } else {
      return this.getAxios()!.get(
        `${this.BASE_URL}/Systems/${systemId}/LogServices`,
        {
          params: { bmcIp, role: "log", page, size },
        },
      );
    }
  }

  /** 서버 전원 조작
   * 1. ResetType
   * ForceRestart: 재시작
   * ForceOff: 강제종료
   * On: 시작
   */
  @RequireAxiosInstance()
  public setSystemPower(
    bmcIp: string,
    systemId: string,
    ResetType: RedfishPowerType,
  ) {
    return this.getAxios()!.post(
      `${this.BASE_URL}/Systems/${systemId}/Actions/ComputerSystem.Reset`,
      {
        bmcIp,
        ResetType,
      },
    );
  }
}
