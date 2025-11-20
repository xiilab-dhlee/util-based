import { HttpResponse, http } from "msw";

import {
  bmcInfoMock,
  chassisInfoMock,
  firmwareInfoMock,
  logInfoMock,
  memoryInfoMock,
  networkAdapterInfoMock,
  powerSupplyInfoMock,
  processorInfoMock,
  systemsInfoMock,
  thermalInfoMock,
} from "@/mocks/data/redfish.mock";

/**
 * Redfish API 핸들러
 *
 * BMC(Baseboard Management Controller)를 통한 서버 하드웨어 관리 API
 * - Systems: 시스템 정보
 * - Chassis: 섀시, 전원, 열 관리
 * - Processors: 프로세서 정보
 * - Memory: 메모리 정보
 * - Network: 네트워크 어댑터 정보
 * - Firmware: 펌웨어 정보
 * - Logs: 시스템 로그
 */
export const redfishHandlers = [
  // BMC 정보 조회
  http.get("/core-api/v1/core/redfish/bmc/:nodeIp", () => {
    return HttpResponse.json(bmcInfoMock);
  }),
  // Systems 목록 조회
  http.get("/core-api/v1/core/redfish/Systems", () => {
    return HttpResponse.json(systemsInfoMock);
  }),

  // System 상세 조회
  http.get("/core-api/v1/core/redfish/Systems/:systemId", () => {
    return HttpResponse.json({
      Id: "1",
      Name: "System",
      PowerState: "On",
      Status: {
        Health: "OK",
        State: "Enabled",
      },
    });
  }),

  // Chassis 전원 정보 조회
  http.get("/core-api/v1/core/redfish/Chassis/:systemId/Power", () => {
    return HttpResponse.json({
      PowerControl: [
        {
          PowerConsumedWatts: 245,
          PowerCapacityWatts: 800,
          PowerMetrics: {
            AverageConsumedWatts: 250,
            MaxConsumedWatts: 400,
            MinConsumedWatts: 100,
          },
        },
      ],
    });
  }),

  // Chassis 정보 조회 (Chassis, Power Supplies, Thermals 포함)
  http.get("/core-api/v1/core/redfish/Chassis", () => {
    return HttpResponse.json({
      members: chassisInfoMock,
      powerSupplies: powerSupplyInfoMock,
      thermals: thermalInfoMock,
    });
  }),

  // Firmware 인벤토리 조회
  http.get("/core-api/v1/core/redfish/UpdateService/FirmwareInventory", () => {
    return HttpResponse.json({
      members: firmwareInfoMock,
    });
  }),

  // Memory 정보 조회
  http.get("/core-api/v1/core/redfish/Systems/:systemId/Memory", () => {
    return HttpResponse.json(memoryInfoMock);
  }),

  // Network Adapter (Ethernet Interfaces) 정보 조회
  http.get(
    "/core-api/v1/core/redfish/Systems/:systemId/EthernetInterfaces",
    () => {
      return HttpResponse.json({
        members: networkAdapterInfoMock,
      });
    },
  ),

  // Processor 정보 조회
  http.get("/core-api/v1/core/redfish/Systems/:systemId/Processors", () => {
    return HttpResponse.json({
      members: processorInfoMock,
    });
  }),

  // Log Services 조회
  http.get("/core-api/v1/core/redfish/Systems/:systemId/LogServices", () => {
    return HttpResponse.json({
      logs: {
        Members: logInfoMock,
      },
    });
  }),

  // System 전원 제어 (Reset)
  http.post(
    "/core-api/v1/core/redfish/Systems/:systemId/Actions/ComputerSystem.Reset",
    async ({ request }) => {
      const body = (await request.json()) as {
        bmcIp: string;
        ResetType: string;
      };

      // ResetType 검증
      const validResetTypes = [
        "On",
        "ForceOff",
        "GracefulShutdown",
        "GracefulRestart",
        "ForceRestart",
        "Nmi",
        "ForceOn",
        "PushPowerButton",
      ];

      if (!validResetTypes.includes(body.ResetType)) {
        return HttpResponse.json(
          {
            error: {
              code: "Base.1.0.GeneralError",
              message: `Invalid ResetType: ${body.ResetType}`,
            },
          },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        success: true,
        message: `System reset command sent: ${body.ResetType}`,
        ResetType: body.ResetType,
      });
    },
  ),
];
