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

  // ============================================
  // Image Job
  // ============================================
  restartImageJob: "restartImageJob",
  deleteImageJob: "deleteImageJob",

  // ============================================
  // Volume
  // ============================================
  updateVolume: "updateVolume",
  deleteVolume: "deleteVolume",
  createFolder: "createFolder",
  deleteFiles: "deleteFiles",
  decompress: "decompress",
  compress: "compress",
  registerOnPremiseVolume: "registerOnPremiseVolume",
  registerAstragoVolume: "registerAstragoVolume",
} as const;

export type MutationKey = (typeof MUTATION_KEYS)[keyof typeof MUTATION_KEYS];

const MUTATION_KEY_VALUES = new Set<string>(Object.values(MUTATION_KEYS));

export function isMutationKey(value: unknown): value is MutationKey {
  return isString(value) && MUTATION_KEY_VALUES.has(value);
}
