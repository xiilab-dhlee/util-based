import type { TabsSeparatedItem } from "xiilab-ui";

const NETWORK_ADAPTER_TABS: TabsSeparatedItem[] = [
  {
    key: "port",
    label: "Network Ports",
  },
  {
    key: "device",
    label: "Network Devices",
  },
];

const DEMO_BMC_INFO = {
  id: 1,
  nodeIp: "192.168.1.100",
  bmcIp: "192.168.1.100",
  bmcUserName: "test",
  bmcPassword: "xiirocks",
};

const DEMO_SYSTEMS_INFO = {
  Members: [
    {
      "@odata.id": "/redfish/v1/Systems/admin",
    },
  ],
};

const DEMO_CHASSIS_INFO = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  Model: `Chassis ${index + 1}`,
  SerialNumber: `SGH420J9F${index + 1}`,
  PowerState: "Enabled",
  ChassisType: "RackMount",
  Status: {
    Health: "OK",
    State: "Enabled",
  },
  powerState: "On",
  Manufacturer: "HPE",
  SKU: "P5643-342",
}));

const DEMO_POWER_SUPPLY_INFO = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  Name: `Power Supply ${index + 1}`,
  Model: `Power Model ${index + 1}`,
  PowerSupplyType: "Unknown",
  PowerCapacityWatts: 10000,
  AveragePowerOutputWatts: 10000,
  LastPowerOutputWatts: 10000,
  LineInputVoltage: 10000,
  LineInputVoltageType: "Unknown",
  SerialNumber: `SGH420J9F${index + 1}`,
  SparePartNumber: "Unknown",
  Manufacturer: "HPE",
  FirmwareVersion: "Unknown",
  Status: {
    Health: "OK",
    State: "Enabled",
  },
  Oem: {
    Hpe: {
      MaxPowerOutputWatts: 10000,
    },
  },
}));

const DEMO_THERMAL_INFO = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  Name: "Embedded Video Controller",
  Location: "Unknown",
  Reading: 100,
  Status: {
    Health: "OK",
    State: "Enabled",
  },
  Oem: {
    Name: "Unknown",
    Hpe: {
      Location: "Unknown",
    },
  },
}));

const DEMO_PROCESSORS_INFO = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  Name: "Embedded Video Controller",
  Model: "Unknown",
  ProcessorType: "Unknown",
  Status: {
    Health: "OK",
    State: "Enabled",
  },
  Socket: "Unknown",
  TotalCores: "Unknown",
  TotalThreads: "Unknown",
  MaxSpeedMHz: 10000,
  Manufacturer: "Unknown",
  InstructionSet: "Unknown",
  Oem: {
    Hpe: {
      PartNumber: "922551-B21",
      SerialNumber: "Unknown",
    },
  },
}));

const DEMO_FIRMWARE_INFO = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  Name: "Embedded Video Controller",
  Version: "V.2.00",
  Description: "Unknown",
  Manufacturer: "Unknown",
  Oem: {
    Hpe: {
      DeviceContext: "922551-B21",
    },
  },
}));

const DEMO_MEMORY_INFO = {
  Oem: {
    Hpe: {
      AmpModeActive: "Unknown",
      AmpModeStatus: "Unknown",
      MinimumVoltageVoltsX10: 10000,
      Attributes: ["Unknown"],
      MemoryList: [
        {
          // MB
          BoardTotalMemorySize: 1000,
          // MHz
          BoardOperationalFrequency: 25600,
          BoardOperationalVoltage: 10000,
        },
      ],
    },
  },
  members: Array.from({ length: 3 }, (_, index) => ({
    id: index + 1,
    Name: "Embedded Video Controller",
    Version: "V.2.00",
    Description: "Unknown",
    Manufacturer: "Unknown",
    PartNumber: "Unknown",
    DeviceLocator: "Unknown",
    MemoryType: "Unknown",
    MemoryDeviceType: "Unknown",
    OperatingSpeedMhz: 25600,
    CapacityMiB: 1000,
    RankCount: "Unknown",
    ErrorCorrection: "Unknown",
    DataWidthBits: "Unknown",
    BusWidthBits: "Unknown",
    MemoryLocation: {
      Channel: "Unknown",
      MemoryController: "Unknown",
      Slot: "Unknown",
    },
    Status: {
      Health: "OK",
      State: "Enabled",
    },
  })),
};

const DEMO_NETWORK_ADAPTER_INFO = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  Name: "Unknown",
  Id: "Unknown",
  UefiDevicePath: "Unknown",
  MACAddress: "Unknown",
  LinkStatus: "Unknown",
  SpeedMbps: 20000,
  Status: {
    Health: "OK",
    State: "Enabled",
  },
}));

const DEMO_LOG_INFO = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  Severity: "OK",
  Message: "HP FlexFabric 10GB 2port 534FLR-SFP+Adapter Conne...",
  Created: "2025-01-01T00:00:00Z",
  Oem: {
    Hpe: {
      RecommendedAction: `Here’s a long example sentence in English for a technical "Node Recommend" system:\n"The Node Recommend module operates within a large-scale distributed environment by leveraging real-time user behavior logs and multidimensional feature data, integrating deep learning
models with collaborative filtering algorithms to deliver personalized, optimized content recommendations for each user, and is implemented via a modular architecture that utilizes the latest GPU`,
      Categories: ["Health", "Performance", "Security"],
    },
  },
}));

const redfishConstants = {
  demoBmcInfo: DEMO_BMC_INFO,
  demoSystemsInfo: DEMO_SYSTEMS_INFO,
  demoChassisInfo: DEMO_CHASSIS_INFO,
  demoProcessorsInfo: DEMO_PROCESSORS_INFO,
  demoFirmwareInfo: DEMO_FIRMWARE_INFO,
  demoMemoryInfo: DEMO_MEMORY_INFO,
  demoNetworkAdapterInfo: DEMO_NETWORK_ADAPTER_INFO,
  networkAdapterTabs: NETWORK_ADAPTER_TABS,
  demoPowerSupplyInfo: DEMO_POWER_SUPPLY_INFO,
  demoThermalInfo: DEMO_THERMAL_INFO,
  demoLogInfo: DEMO_LOG_INFO,
};

export default redfishConstants;
