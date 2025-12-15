"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { AccountService } from "@/domain/account-management/api/account.service";
import { CredentialService } from "@/domain/credential/api/credential.service";
import { GroupService } from "@/domain/group/api/group.service";
import { HubService } from "@/domain/hub/api/hub.service";
import { InternalRegistryService } from "@/domain/internal-registry/api/internal-registry.service";
import { AdminInternalRegistryImageService } from "@/domain/internal-registry-image/api/admin-internal-registry-image.service";
import { InternalRegistryImageService } from "@/domain/internal-registry-image/api/internal-registry-image.service";
import { MonitoringService } from "@/domain/monitoring-notification/api/monitoring.service";
import { NodeService } from "@/domain/node/api/node.service";
import { RedfishService } from "@/domain/node/api/redfish.service";
import { RedfishBmcService } from "@/domain/node/api/redfish-bmc.service";
import { NotificationService } from "@/domain/notification/api/notification.service";
import { ReportService } from "@/domain/report/api/report.service";
import { ReportReservationService } from "@/domain/report-reservation/api/report-reservation.service";
import { RequestImageService } from "@/domain/request-image/api/request-image.service";
import { RevokeHistoryService } from "@/domain/revoke/api/revoke-history.service";
import { FileSecurityService } from "@/domain/security/api/file-security.service";
import { RegistrySecurityService } from "@/domain/security/api/registry-security.service";
import { SourcecodeService } from "@/domain/sourcecode/api/sourcecode.service";
import { StorageService } from "@/domain/storage/api/storage.service";
import { HpeService } from "@/domain/system-setting/api/hpe.service";
import { LicenseService } from "@/domain/system-setting/api/license.service";
import { SmtpService } from "@/domain/system-setting/api/smtp.service";
import { StorageSettingService } from "@/domain/system-setting/api/storage-setting.service";
import { WorkspaceResourceSettingService } from "@/domain/system-setting/api/workspace-resource-setting.service";
import { VolumeService } from "@/domain/volume/api/volume.service";
import { AdminWorkloadService } from "@/domain/workload/api/admin-workload.service";
import { WorkloadService } from "@/domain/workload/api/workload.service";
import { WorkspaceService } from "@/domain/workspace/api/workspace.service";
import { GpuService } from "@/shared/api/gpu.service";

// 서비스 컨텍스트 타입 정의
interface ServiceContextType {
  workspaceService: WorkspaceService;
  workloadService: WorkloadService;
  sourcecodeService: SourcecodeService;
  credentialService: CredentialService;
  volumeService: VolumeService;
  storageService: StorageService;
  hubService: HubService;
  accountService: AccountService;
  groupService: GroupService;
  notificationService: NotificationService;
  monitoringService: MonitoringService;
  adminWorkloadService: AdminWorkloadService;
  nodeService: NodeService;
  redfishBmcService: RedfishBmcService;
  redfishService: RedfishService;
  requestImageService: RequestImageService;
  reportService: ReportService;
  reportReservationService: ReportReservationService;
  internalregistryService: InternalRegistryService;
  internalregistryImageService: InternalRegistryImageService;
  adminInternalRegistryImageService: AdminInternalRegistryImageService;
  gpuService: GpuService;
  registrySecurityService: RegistrySecurityService;
  fileSecurityService: FileSecurityService;
  revokeHistoryService: RevokeHistoryService;
  hpeService: HpeService;
  licenseService: LicenseService;
  smtpService: SmtpService;
  storageSettingService: StorageSettingService;
  workspaceResourceSettingService: WorkspaceResourceSettingService;
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
    accountService: new AccountService(),
    groupService: new GroupService(),
    notificationService: new NotificationService(),
    monitoringService: new MonitoringService(),
    adminWorkloadService: new AdminWorkloadService(),
    nodeService: new NodeService(),
    redfishBmcService: new RedfishBmcService(),
    redfishService: new RedfishService(),
    requestImageService: new RequestImageService(),
    reportService: new ReportService(),
    reportReservationService: new ReportReservationService(),
    internalregistryService: new InternalRegistryService(),
    internalregistryImageService: new InternalRegistryImageService(),
    adminInternalRegistryImageService: new AdminInternalRegistryImageService(),
    gpuService: new GpuService(),
    registrySecurityService: new RegistrySecurityService(),
    fileSecurityService: new FileSecurityService(),
    revokeHistoryService: new RevokeHistoryService(),
    hpeService: new HpeService(),
    licenseService: new LicenseService(),
    smtpService: new SmtpService(),
    storageSettingService: new StorageSettingService(),
    workspaceResourceSettingService: new WorkspaceResourceSettingService(),
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}
