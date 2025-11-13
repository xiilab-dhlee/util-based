const redfishKeys = {
  default: ["redfish"],
  list: (bmcIp: string) => [...redfishKeys.default, "list", bmcIp],
  detail: (bmcIp: string, systemId: string) => [
    ...redfishKeys.default,
    "detail",
    bmcIp,
    systemId,
  ],
  maxPowerInfo: (bmcIp: string, systemId: string) => [
    ...redfishKeys.default,
    "max-power",
    bmcIp,
    systemId,
  ],
  chassisInfo: (bmcIp: string) => [...redfishKeys.default, "chassis", bmcIp],
  firmwareInfo: (bmcIp: string) => [...redfishKeys.default, "firmware", bmcIp],
  memoryInfo: (bmcIp: string, systemId: string) => [
    ...redfishKeys.default,
    "memory",
    bmcIp,
    systemId,
  ],
  networkAdapterInfo: (bmcIp: string, systemId: string) => [
    ...redfishKeys.default,
    "network-adapter",
    bmcIp,
    systemId,
  ],
  processorsInfo: (bmcIp: string, systemId: string) => [
    ...redfishKeys.default,
    "processors",
    bmcIp,
    systemId,
  ],
  logInfo: (bmcIp: string, systemId: string, page: number, size: number) => [
    ...redfishKeys.default,
    "log",
    bmcIp,
    systemId,
    page,
    size,
  ],
};

export default redfishKeys;
