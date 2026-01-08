const STORAGE_KEY = "astrago:selected-workspace";

const isClient = () =>
  typeof window !== "undefined" && typeof sessionStorage !== "undefined";

export function getStoredWorkspaceId(): number | undefined {
  if (!isClient()) return undefined;

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return undefined;

  try {
    const parsed = JSON.parse(stored);
    if (typeof parsed !== "number") {
      clearStoredWorkspaceId();
      return undefined;
    }
    return parsed;
  } catch {
    clearStoredWorkspaceId();
    return undefined;
  }
}

export function setStoredWorkspaceId(workspaceId: number) {
  if (!isClient()) return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceId));
  } catch (error) {
    console.error("[WorkspaceStorage] Failed to save:", error);
  }
}

export function clearStoredWorkspaceId() {
  if (!isClient()) return;

  sessionStorage.removeItem(STORAGE_KEY);
}
