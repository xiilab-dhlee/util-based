import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import {
  bmcInfoSchema,
  chassisInfoSchema,
  firmwareInfoSchema,
  logInfoSchema,
  memoryInfoSchema,
  networkAdapterInfoSchema,
  powerSupplyInfoSchema,
  processorInfoSchema,
  systemsInfoSchema,
  thermalInfoSchema,
} from "@/schemas/redfish.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * BMC 정보 모킹 데이터
 */
export const bmcInfoMock = makeMock(bmcInfoSchema);

/**
 * Systems 정보 모킹 데이터
 */
export const systemsInfoMock = makeMock(systemsInfoSchema);

/**
 * Chassis 정보 모킹 데이터 (3개)
 */
export const chassisInfoMock = Array.from({ length: 3 }, () =>
  makeMock(chassisInfoSchema),
);

/**
 * Power Supply 정보 모킹 데이터 (3개)
 */
export const powerSupplyInfoMock = Array.from({ length: 3 }, () =>
  makeMock(powerSupplyInfoSchema),
);

/**
 * Thermal 정보 모킹 데이터 (3개)
 */
export const thermalInfoMock = Array.from({ length: 3 }, () =>
  makeMock(thermalInfoSchema),
);

/**
 * Processor 정보 모킹 데이터 (3개)
 */
export const processorInfoMock = Array.from({ length: 3 }, () =>
  makeMock(processorInfoSchema),
);

/**
 * Firmware 정보 모킹 데이터 (3개)
 */
export const firmwareInfoMock = Array.from({ length: 3 }, () =>
  makeMock(firmwareInfoSchema),
);

/**
 * Memory 정보 모킹 데이터
 */
export const memoryInfoMock = makeMock(memoryInfoSchema);

/**
 * Network Adapter 정보 모킹 데이터 (3개)
 */
export const networkAdapterInfoMock = Array.from({ length: 3 }, () =>
  makeMock(networkAdapterInfoSchema),
);

/**
 * Log 정보 모킹 데이터 (3개)
 */
export const logInfoMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(logInfoSchema),
);
