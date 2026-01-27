import { isString } from "es-toolkit";

/**
 * Mutation Keys Registry
 *
 * Orval이 생성한 mutation key들을 중앙 집중화
 * toast-messages.ts 등에서 타입 안전하게 참조 가능
 */

export const MUTATION_KEYS = {
  // ============================================
  // Account Management (Admin)
  // ============================================
  updateAccount: "updateAccount",
  updateAdminNotificationSet: "updateAdminNotificationSet",
  updateAccountEnabled: "updateAccountEnabled",
  rejectSignupRequests: "rejectSignupRequests",
  approveSignupRequests: "approveSignupRequests",
  resetPasswordByAdmin: "resetPasswordByAdmin",
  deleteAccount: "deleteAccount",

  // ============================================
  // Account (User)
  // ============================================
  updateNotificationSet: "updateNotificationSet",
  updateProfile: "updateProfile",
  markNotificationAsRead: "markNotificationAsRead",
  resetPassword: "resetPassword",
  pinWorkspace: "pinWorkspace",
  unpinWorkspace: "unpinWorkspace",
  signup: "signup",
  requestPasswordReset: "requestPasswordReset",
  verifyPasswordResetCode: "verifyPasswordResetCode",

  // ============================================
  // Group Management
  // ============================================
  updateGroup: "updateGroup",
  deleteGroup: "deleteGroup",
  createGroup: "createGroup",
  removeUserFromGroup: "removeUserFromGroup",

  // ============================================
  // Workspace
  // ============================================
  updateWorkspace: "updateWorkspace",
  deleteWorkspace: "deleteWorkspace",
  setDefaultWorkspace: "setDefaultWorkspace",
  updateMemberRole: "updateMemberRole",
  createWorkspace: "createWorkspace",
  createResourceRequest: "createResourceRequest",
  addWorkspaceMembers: "addWorkspaceMembers",
  deleteWorkspaceMembers: "deleteWorkspaceMembers",
  leaveWorkspace: "leaveWorkspace",
  cancelResourceRequest: "cancelResourceRequest",

  // ============================================
  // Workspace Management (Admin)
  // ============================================
  updateWorkspaceResource: "updateWorkspaceResource",
  rejectResourceRequest: "rejectResourceRequest",
  approveResourceRequest: "approveResourceRequest",
  updatePolicySet: "updatePolicySet",
  deleteWorkspaces: "deleteWorkspaces",

  // ============================================
  // Credential
  // ============================================
  createCredential: "createCredential",
  deleteCredential: "deleteCredential",

  // ============================================
  // License
  // ============================================
  createLicense: "createLicense",

  // ============================================
  // SMTP Settings
  // ============================================
  registerSmtpSet: "registerSmtpSet",
  deleteSmtpSet: "deleteSmtpSet",

  // ============================================
  // Registry (Private)
  // ============================================
  updatePrivateImageTag: "updatePrivateImageTag",
  createPrivateExternalImage: "createPrivateExternalImage",
  addPrivateImageTag: "addPrivateImageTag",
  scanPrivateImageTag: "scanPrivateImageTag",
  deletePrivateImageTags: "deletePrivateImageTags",
  deletePrivateImages: "deletePrivateImages",

  // ============================================
  // Registry (Public)
  // ============================================
  updatePublicImageTag: "updatePublicImageTag",
  createPublicExternalImage: "createPublicExternalImage",
  addPublicImageTag: "addPublicImageTag",
  scanPublicImageTag: "scanPublicImageTag",
  deletePublicImageTags: "deletePublicImageTags",
  deletePublicImages: "deletePublicImages",

  // ============================================
  // Image Tag Usage Request
  // ============================================
  createUsageRequest: "createUsageRequest",

  // ============================================
  // Image Job
  // ============================================
  restartImageJob: "restartImageJob",
  deleteImageJob: "deleteImageJob",

  // ============================================
  // Storage (Admin)
  // ============================================
  registerStorage: "registerStorage",
  updateStorage: "updateStorage",
  deleteStorage: "deleteStorage",

  // ============================================
  // Volume
  // ============================================
  updateVolume: "updateVolume",
  deleteVolume: "deleteVolume",
  registerOnPremiseVolume: "registerOnPremiseVolume",
  registerAstragoVolume: "registerAstragoVolume",

  // ============================================
  // Sourcecode
  // ============================================
  registerSourceCode: "registerSourceCode",
  updateSourceCode: "updateSourceCode",
  deleteSourceCode: "deleteSourceCode",
  deleteSourceCodes: "deleteSourceCodes",
  adminUpdateSourceCode: "adminUpdateSourceCode",
  adminDeleteSourceCode: "adminDeleteSourceCode",
  adminDeleteSourceCodes: "adminDeleteSourceCodes",

  // ============================================
  // Workload Reclaim Policy
  // ============================================
  updateReclaimPolicy: "updateReclaimPolicy",
  updateReclaimPolicyEnabled: "updateReclaimPolicyEnabled",

  // ============================================
  // Node (Admin Cluster)
  // ============================================
  applyMigConfiguration: "applyMigConfiguration",
  updateNodeScheduling: "updateNodeScheduling",

  // ============================================
  // Volume TUS Upload
  // ============================================
  createUpload: "createUpload",
  cancelUpload: "cancelUpload",
  getUploadStatus: "getUploadStatus",
  uploadChunk: "uploadChunk",

  // ============================================
  // Admin Resource Preset
  // ============================================
  updatePreset: "updatePreset",
  deletePreset: "deletePreset",
  createPreset: "createPreset",
  deletePresets: "deletePresets",

  // ============================================
  // Image Tag Usage Request (Admin)
  // ============================================
  cancelUsageRequest: "cancelUsageRequest",
  rejectUsageRequest: "rejectUsageRequest",
  updateDecisionReason: "updateDecisionReason",
  approveUsageRequest: "approveUsageRequest",

  // ============================================
  // Cluster Resource
  // ============================================
  checkResourceAvailability: "checkResourceAvailability",

  // ============================================
  // Workload Reclaim Webhook
  // ============================================
  executeReclaim: "executeReclaim",

  // ============================================
  // Vulnerability Policy (Admin)
  // ============================================
  updateScanPolicy: "updateScanPolicy",
  updateLevelPolicy: "updateLevelPolicy",
  updateAstragoOnlyPolicy: "updateAstragoOnlyPolicy",

  // ============================================
  // Account Notification
  // ============================================
  deleteNotifications: "deleteNotifications",

  // ============================================
  // Registry (Private) - Snapshot
  // ============================================
  createPrivateSnapshotImage: "createPrivateSnapshotImage",

  // ============================================
  // Registry (Public) - Snapshot
  // ============================================
  createPublicSnapshotImage: "createPublicSnapshotImage",

  // ============================================
  // Admin Volume
  // ============================================
  adminUpdateVolume: "adminUpdateVolume",
  adminDeleteVolume: "adminDeleteVolume",
  adminCreateFolder: "adminCreateFolder",
  adminDownload: "adminDownload",
  adminDeleteFiles: "adminDeleteFiles",
  adminDecompress: "adminDecompress",
  adminCompress: "adminCompress",
  adminDeleteVolumes: "adminDeleteVolumes",

  // ============================================
  // Volume File
  // ============================================
  downloadFiles: "downloadFiles",
  decompressFile: "decompressFile",
  compressFiles: "compressFiles",

  // ============================================
  // Admin Queue
  // ============================================
  removeWorkloadFromUrgentStandby: "removeWorkloadFromUrgentStandby",
  updateUrgentStandbyOrder: "updateUrgentStandbyOrder",
  addWorkloadToUrgentStandby: "addWorkloadToUrgentStandby",

  // ============================================
  // Admin Monitoring Notification
  // ============================================
  updateMonitoringNotificationSet: "updateMonitoringNotificationSet",
  deleteMonitoringNotificationSet: "deleteMonitoringNotificationSet",
  updateMonitoringNotificationSetEnabled:
    "updateMonitoringNotificationSetEnabled",
  createMonitoringNotificationSet: "createMonitoringNotificationSet",

  // ============================================
  // Workload
  // ============================================
  updateWorkload: "updateWorkload",
  deleteWorkload: "deleteWorkload",
  updateResourcePreset: "updateResourcePreset",
  createWorkload: "createWorkload",
  workloadCreateFolder: "workloadCreateFolder",
  workloadDeleteFiles: "workloadDeleteFiles",
  workloadDecompressFile: "workloadDecompressFile",
  workloadCompressFiles: "workloadCompressFiles",
  terminateWorkload: "terminateWorkload",
  restartWorkload: "restartWorkload",

  // ============================================
  // Volume (Admin)
  // ============================================
  deleteVolumes: "deleteVolumes",

  // ============================================
  // Monitoring Notification Webhook
  // ============================================
  receiveAlert: "receiveAlert",
} as const;

export type MutationKey = (typeof MUTATION_KEYS)[keyof typeof MUTATION_KEYS];

const MUTATION_KEY_VALUES = new Set<string>(Object.values(MUTATION_KEYS));

export function isMutationKey(value: unknown): value is MutationKey {
  return isString(value) && MUTATION_KEY_VALUES.has(value);
}
