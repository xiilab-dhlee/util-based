import type { TabsSeparatedItem } from "xiilab-ui";

import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const TITLE = "노드 자원 상세정보 · 리소스 정보";

// 노드 상세 정보 데모 데이터
const DEMO_NODE = {
  nodeName: "master-x3250m5-1",
  ip: "10.61.3.12",
  hostName: "master-x3250m5-1",
  role: "control-plane",
  creationTimestamp: "2025-05-12T08:28:59Z",
  nodeCondition: [
    {
      lastHeartbeatTime: "2025-05-12T08:30:19Z",
      lastTransitionTime: "2025-05-12T08:30:19Z",
      message: "Calico is running on this node",
      reason: "CalicoIsUp",
      status: "False",
      type: "NetworkUnavailable",
    },
    {
      lastHeartbeatTime: "2025-09-26T06:21:12Z",
      lastTransitionTime: "2025-05-12T08:28:59Z",
      message: "kubelet has sufficient memory available",
      reason: "KubeletHasSufficientMemory",
      status: "False",
      type: "MemoryPressure",
    },
    {
      lastHeartbeatTime: "2025-09-26T06:21:12Z",
      lastTransitionTime: "2025-05-12T08:28:59Z",
      message: "kubelet has no disk pressure",
      reason: "KubeletHasNoDiskPressure",
      status: "False",
      type: "DiskPressure",
    },
    {
      lastHeartbeatTime: "2025-09-26T06:21:12Z",
      lastTransitionTime: "2025-05-12T08:28:59Z",
      message: "kubelet has sufficient PID available",
      reason: "KubeletHasSufficientPID",
      status: "False",
      type: "PIDPressure",
    },
    {
      lastHeartbeatTime: "2025-09-26T06:21:12Z",
      lastTransitionTime: "2025-05-12T08:30:18Z",
      message: "kubelet is posting ready status",
      reason: "KubeletReady",
      status: "True",
      type: "Ready",
    },
  ],
  nodeSystemInfo: {
    architecture: "amd64",
    bootID: "dd056faf-d9fe-4205-a3cb-df8faf3dfc59",
    containerRuntimeVersion: "cri-o://1.31.0",
    kernelVersion: "5.4.0-208-generic",
    kubeProxyVersion: "v1.31.4",
    kubeletVersion: "v1.31.4",
    machineID: "ff72ce3cc98d4d90be5e42b7c30a924a",
    operatingSystem: "linux",
    osImage: "Ubuntu 20.04.6 LTS",
    systemUUID: "c1c9f548-44a2-11e4-a50b-6cae8b5b3ca8",
  },
};

const DEMO_RESOURCES = {
  gpuType: null,
  gpuCount: null,
  gpuMem: null,
  gpuDriverVersion: null,
  capacity: {
    capacityCpu: "8",
    capacityEphemeralStorage: "2875316976Ki",
    capacityHugepages1Gi: "0",
    capacityHugepages2Mi: "0",
    capacityMemory: "16213504Ki",
    capacityPods: "110",
    capacityGpu: "0",
  },
  allocatable: {
    allocatableCpu: "7400m",
    allocatableEphemeralStorage: "2648843544695",
    allocatableHugepages1Gi: "0",
    allocatableHugepages2Mi: "0",
    allocatableMemory: "15324672Ki",
    allocatablePods: "110",
    allocatableGpu: "0",
  },
  requests: {
    cpu: 1230,
    memory: 500772,
    gpu: 0,
    cpuPercent: 4,
    memoryPercent: 1,
    gpuPercent: 0,
  },
  limits: {
    cpu: 1000,
    memory: 2132825,
    gpu: 0,
    cpuPercent: 4,
    memoryPercent: 4,
    gpuPercent: 0,
  },
};

// 탭 목록
const TABS: TabsSeparatedItem[] = [
  {
    key: "",
    label: TITLE,
    // icon: "Shield",
  },
  {
    key: "redfish",
    label: "하드웨어 장치 및 구성 정보",
    icon: "CirclesExt",
  },
  {
    key: "log",
    label: "로그",
    icon: "Alarm",
  },
];

// 브레드크럼 항목들
const BREADCRUMB: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/admin",
  },
  { title: "노드 관리", href: "/admin/node" },
  { title: "노드 정보" },
];

const nodeDetailConstants = {
  // 노드 상세 데모 데이터
  demoNode: DEMO_NODE,
  // 브레드크럼 항목들
  breadcrumb: BREADCRUMB,
  // 탭 목록
  tabs: TABS,
  // 타이틀
  title: TITLE,
  // 노드 자원 상세 데모 데이터
  demoResources: DEMO_RESOURCES,
};

export default nodeDetailConstants;
