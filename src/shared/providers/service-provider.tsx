"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { CredentialService } from "@/domain/credential/api/credential.service";
import { GroupService } from "@/domain/group/api/group.service";
import { HubService } from "@/domain/hub/api/hub.service";
import { MonitoringService } from "@/domain/monitoring-notification/api/monitoring.service";
import { NodeService } from "@/domain/node/api/node.service";
import { RedfishService } from "@/domain/node/api/redfish.service";
import { RedfishBmcService } from "@/domain/node/api/redfish-bmc.service";
import { NotificationService } from "@/domain/notification/api/notification.service";
import { PrivateRegistryService } from "@/domain/private-registry/api/private-registry.service";
import { AdminPrivateRegistryImageService } from "@/domain/private-registry-image/api/admin-private-registry-image.service";
import { PrivateRegistryImageService } from "@/domain/private-registry-image/api/private-registry-image.service";
import { RequestImageService } from "@/domain/request-image/api/request-image.service";
import { SourcecodeService } from "@/domain/sourcecode/api/sourcecode.service";
import { StorageService } from "@/domain/storage/api/storage.service";
import { UserService } from "@/domain/user/api/user.service";
import { VolumeService } from "@/domain/volume/api/volume.service";
import { AdminWorkloadService } from "@/domain/workload/api/admin-workload.service";
import { WorkloadService } from "@/domain/workload/api/workload.service";
import { WorkspaceService } from "@/domain/workspace/api/workspace.service";

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
  privateRegistryImageService: PrivateRegistryImageService;
  adminPrivateRegistryImageService: AdminPrivateRegistryImageService;
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
    privateRegistryImageService: new PrivateRegistryImageService(),
    adminPrivateRegistryImageService: new AdminPrivateRegistryImageService(),
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}
