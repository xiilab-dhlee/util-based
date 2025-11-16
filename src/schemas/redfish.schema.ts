import { z } from "zod";

// 공통 Status 스키마
const statusSchema = z.object({
  /** 건강 상태 (OK, Warning, Critical 등) */
  Health: z.enum(["OK", "Warning", "Critical", "Disabled"]),
  /** 작동 상태 (Enabled, Disabled 등) */
  State: z.enum(["Enabled", "Disabled"]),
});

// BMC 정보 스키마
export const bmcInfoSchema = z.object({
  /** BMC ID */
  id: z.number(),
  /** 노드 IP 주소 */
  nodeIp: z.string(),
  /** BMC IP 주소 */
  bmcIp: z.string(),
  /** BMC 사용자 이름 */
  bmcUserName: z.string(),
  /** BMC 비밀번호 */
  bmcPassword: z.string(),
});

// Systems 정보 스키마
export const systemsInfoSchema = z.object({
  /** 시스템 멤버 목록 */
  Members: z.array(
    z.object({
      /** OData ID */
      "@odata.id": z.string(),
    }),
  ),
});

// Chassis 정보 스키마
export const chassisInfoSchema = z.object({
  /** Chassis ID */
  id: z.number(),
  /** 모델명 */
  Model: z.string(),
  /** 시리얼 번호 */
  SerialNumber: z.string(),
  /** 전원 상태 */
  PowerState: z.string(),
  /** Chassis 타입 */
  ChassisType: z.string(),
  /** 상태 정보 */
  Status: statusSchema,
  /** 전원 상태 (소문자) */
  powerState: z.string(),
  /** 제조사 */
  Manufacturer: z.string(),
  /** SKU */
  SKU: z.string(),
});

// Power Supply 정보 스키마
export const powerSupplyInfoSchema = z.object({
  /** Power Supply ID */
  id: z.number(),
  /** 이름 */
  Name: z.string(),
  /** 모델명 */
  Model: z.string(),
  /** 전원 공급 장치 타입 */
  PowerSupplyType: z.string(),
  /** 전원 용량 (Watts) */
  PowerCapacityWatts: z.number(),
  /** 평균 전력 출력 (Watts) */
  AveragePowerOutputWatts: z.number(),
  /** 마지막 전력 출력 (Watts) */
  LastPowerOutputWatts: z.number(),
  /** 입력 전압 */
  LineInputVoltage: z.number(),
  /** 입력 전압 타입 */
  LineInputVoltageType: z.string(),
  /** 시리얼 번호 */
  SerialNumber: z.string(),
  /** 예비 부품 번호 */
  SparePartNumber: z.string(),
  /** 제조사 */
  Manufacturer: z.string(),
  /** 펌웨어 버전 */
  FirmwareVersion: z.string(),
  /** 상태 정보 */
  Status: statusSchema,
  /** OEM 정보 */
  Oem: z.object({
    /** HPE 관련 정보 */
    Hpe: z.object({
      /** 최대 전력 출력 (Watts) */
      MaxPowerOutputWatts: z.number(),
    }),
  }),
});

// Thermal 정보 스키마
export const thermalInfoSchema = z.object({
  /** Thermal ID */
  id: z.number(),
  /** 이름 */
  Name: z.string(),
  /** 위치 */
  Location: z.string(),
  /** 읽기 값 (%) */
  Reading: z.number(),
  /** 상태 정보 */
  Status: statusSchema,
  /** OEM 정보 */
  Oem: z.object({
    /** 이름 */
    Name: z.string(),
    /** HPE 관련 정보 */
    Hpe: z.object({
      /** 위치 */
      Location: z.string(),
    }),
  }),
});

// Processor 정보 스키마
export const processorInfoSchema = z.object({
  /** Processor ID */
  id: z.number(),
  /** 이름 */
  Name: z.string(),
  /** 모델명 */
  Model: z.string(),
  /** 프로세서 타입 */
  ProcessorType: z.string(),
  /** 상태 정보 */
  Status: statusSchema,
  /** 소켓 정보 */
  Socket: z.string(),
  /** 총 코어 수 */
  TotalCores: z.union([z.string(), z.number()]),
  /** 총 스레드 수 */
  TotalThreads: z.union([z.string(), z.number()]),
  /** 최대 속도 (MHz) */
  MaxSpeedMHz: z.number(),
  /** 제조사 */
  Manufacturer: z.string(),
  /** 인스트럭션 세트 */
  InstructionSet: z.string(),
  /** OEM 정보 */
  Oem: z.object({
    /** HPE 관련 정보 */
    Hpe: z.object({
      /** 부품 번호 */
      PartNumber: z.string(),
      /** 시리얼 번호 */
      SerialNumber: z.string(),
    }),
  }),
});

// Firmware 정보 스키마
export const firmwareInfoSchema = z.object({
  /** Firmware ID */
  id: z.number(),
  /** 이름 */
  Name: z.string(),
  /** 버전 */
  Version: z.string(),
  /** 설명 */
  Description: z.string(),
  /** 제조사 */
  Manufacturer: z.string(),
  /** OEM 정보 */
  Oem: z.object({
    /** HPE 관련 정보 */
    Hpe: z.object({
      /** 디바이스 컨텍스트 */
      DeviceContext: z.string(),
    }),
  }),
});

// Memory Location 스키마
const memoryLocationSchema = z.object({
  /** 채널 */
  Channel: z.string(),
  /** 메모리 컨트롤러 */
  MemoryController: z.string(),
  /** 슬롯 */
  Slot: z.string(),
});

// Memory 멤버 스키마
const memoryMemberSchema = z.object({
  /** Memory ID */
  id: z.number(),
  /** 이름 */
  Name: z.string(),
  /** 버전 */
  Version: z.string(),
  /** 설명 */
  Description: z.string(),
  /** 제조사 */
  Manufacturer: z.string(),
  /** 부품 번호 */
  PartNumber: z.string(),
  /** 디바이스 위치 */
  DeviceLocator: z.string(),
  /** 메모리 타입 */
  MemoryType: z.string(),
  /** 메모리 디바이스 타입 */
  MemoryDeviceType: z.string(),
  /** 작동 속도 (MHz) */
  OperatingSpeedMhz: z.number(),
  /** 용량 (MiB) */
  CapacityMiB: z.number(),
  /** 랭크 수 */
  RankCount: z.string(),
  /** 에러 정정 */
  ErrorCorrection: z.string(),
  /** 데이터 폭 (Bits) */
  DataWidthBits: z.string(),
  /** 버스 폭 (Bits) */
  BusWidthBits: z.string(),
  /** 메모리 위치 */
  MemoryLocation: memoryLocationSchema,
  /** 상태 정보 */
  Status: statusSchema,
});

// Memory 정보 스키마 (전체)
export const memoryInfoSchema = z.object({
  /** OEM 정보 */
  Oem: z.object({
    /** HPE 관련 정보 */
    Hpe: z.object({
      /** AMP 모드 활성화 */
      AmpModeActive: z.string(),
      /** AMP 모드 상태 */
      AmpModeStatus: z.string(),
      /** 최소 전압 (Volts X 10) */
      MinimumVoltageVoltsX10: z.number(),
      /** 속성 */
      Attributes: z.array(z.string()),
      /** 메모리 목록 */
      MemoryList: z.array(
        z.object({
          /** 보드 총 메모리 크기 (MB) */
          BoardTotalMemorySize: z.number(),
          /** 보드 작동 주파수 (MHz) */
          BoardOperationalFrequency: z.number(),
          /** 보드 작동 전압 */
          BoardOperationalVoltage: z.number(),
        }),
      ),
    }),
  }),
  /** 메모리 멤버 목록 */
  members: z.array(memoryMemberSchema),
});

// Network Adapter 정보 스키마
export const networkAdapterInfoSchema = z.object({
  /** Network Adapter ID */
  id: z.number(),
  /** 이름 */
  Name: z.string(),
  /** ID */
  Id: z.string(),
  /** UEFI 디바이스 경로 */
  UefiDevicePath: z.string(),
  /** MAC 주소 */
  MACAddress: z.string(),
  /** 링크 상태 */
  LinkStatus: z.string(),
  /** 속도 (Mbps) */
  SpeedMbps: z.number(),
  /** 상태 정보 */
  Status: statusSchema,
});

// Log 정보 스키마
export const logInfoSchema = z.object({
  /** Log ID */
  id: z.number(),
  /** 심각도 */
  Severity: z.enum(["OK", "Warning", "Critical", "Disabled"]),
  /** 메시지 */
  Message: z.string(),
  /** 생성 시간 */
  Created: z.string().datetime(),
  /** OEM 정보 */
  Oem: z.object({
    /** HPE 관련 정보 */
    Hpe: z.object({
      /** 권장 조치 */
      RecommendedAction: z.string(),
      /** 카테고리 */
      Categories: z.array(z.string()),
    }),
  }),
});

// Type exports
export type BmcInfoType = z.infer<typeof bmcInfoSchema>;
export type SystemsInfoType = z.infer<typeof systemsInfoSchema>;
export type ChassisInfoType = z.infer<typeof chassisInfoSchema>;
export type PowerSupplyInfoType = z.infer<typeof powerSupplyInfoSchema>;
export type ThermalInfoType = z.infer<typeof thermalInfoSchema>;
export type ProcessorInfoType = z.infer<typeof processorInfoSchema>;
export type FirmwareInfoType = z.infer<typeof firmwareInfoSchema>;
export type MemoryInfoType = z.infer<typeof memoryInfoSchema>;
export type MemoryMemberType = z.infer<typeof memoryMemberSchema>;
export type NetworkAdapterInfoType = z.infer<typeof networkAdapterInfoSchema>;
export type LogInfoType = z.infer<typeof logInfoSchema>;
