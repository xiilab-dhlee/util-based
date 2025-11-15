"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { NotificationService } from "@/services/notification/notification.service";
import { CredentialService } from "@/services/credential/credential.service";
import { GroupService } from "@/services/group/group.service";
import { HubService } from "@/services/hub/hub.service";
import { MonitoringService } from "@/services/monitoring/monitoring.service";
import { NodeService } from "@/services/node/node.service";
import { RedfishService } from "@/services/node/redfish.service";
import { RedfishBmcService } from "@/services/node/redfish-bmc.service";
import { PrivateRegistryService } from "@/services/registry/private-registry.service";
import { RequestImageService } from "@/services/request-image/request-image.service";
import { SourcecodeService } from "@/services/sourcecode/sourcecode.service";
import { StorageService } from "@/services/storage/storage.service";
import { UserService } from "@/services/user/user.service";
import { VolumeService } from "@/services/volume/volume.service";
import { AdminWorkloadService } from "@/services/workload/admin-workload.service";
import { WorkloadService } from "@/services/workload/workload.service";
import { WorkspaceService } from "@/services/workspace/workspace.service";

// 서비스 컨텍스트 타입 정의
interface ServiceContextType {
  workspaceService: WorkspaceService;
  workloadService: WorkloadService;
  sourcecodeService: SourcecodeService;
  credentialService: CredentialService;
  volumeService: VolumeService;
  storageService: StorageService;
  hubService: HubService;
  userService: UserService;
  groupService: GroupService;
  notificationService: NotificationService;
  monitoringService: MonitoringService;
  adminWorkloadService: AdminWorkloadService;
  nodeService: NodeService;
  redfishBmcService: RedfishBmcService;
  redfishService: RedfishService;
  requestImageService: RequestImageService;
  privateRegistryService: PrivateRegistryService;
}

// 서비스 컨텍스트 생성
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// 서비스 컨텍스트 사용을 위한 훅
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
};

interface ServiceProviderProps {
  children: ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const services: ServiceContextType = {
    workspaceService: new WorkspaceService(),
    workloadService: new WorkloadService(),
    sourcecodeService: new SourcecodeService(),
    credentialService: new CredentialService(),
    volumeService: new VolumeService(),
    storageService: new StorageService(),
    hubService: new HubService(),
    userService: new UserService(),
    groupService: new GroupService(),
    notificationService: new NotificationService(),
    monitoringService: new MonitoringService(),
    adminWorkloadService: new AdminWorkloadService(),
    nodeService: new NodeService(),
    redfishBmcService: new RedfishBmcService(),
    redfishService: new RedfishService(),
    requestImageService: new RequestImageService(),
    privateRegistryService: new PrivateRegistryService(),
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}
