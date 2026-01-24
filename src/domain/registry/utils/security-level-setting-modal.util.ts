type Listener = () => void;

class SecurityLevelSettingModalController {
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  open(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const securityLevelSettingModal =
  new SecurityLevelSettingModalController();
