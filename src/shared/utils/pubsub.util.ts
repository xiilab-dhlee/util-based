type EventHandler<T = unknown> = (data: T) => void;

interface EventSubscription {
  id: string;
  handler: EventHandler;
}

class PubSubUtil {
  private events: Map<string, EventSubscription[]> = new Map();
  private subscriptionIdCounter = 0;

  /**
   * 이벤트를 구독
   * @param eventName 구독할 이벤트 이름
   * @param handler 이벤트 발생 시 실행될 핸들러 함수
   * @returns 구독 ID (구독 해제 시 사용)
   */
  subscribe<T = unknown>(eventName: string, handler: EventHandler<T>): string {
    const subscriptionId = `sub_${++this.subscriptionIdCounter}`;
    const subscription: EventSubscription = {
      id: subscriptionId,
      handler: handler as EventHandler,
    };

    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const eventList = this.events.get(eventName);
    if (eventList) {
      eventList.push(subscription);
    }
    return subscriptionId;
  }

  /**
   * 이벤트 구독을 해제합니다.
   * @param eventName 구독 해제할 이벤트 이름
   * @param subscriptionId 구독 ID
   */
  unsubscribe(eventName: string, subscriptionId: string): void {
    const subscriptions = this.events.get(eventName);
    if (!subscriptions) return;

    const index = subscriptions.findIndex((sub) => sub.id === subscriptionId);
    if (index !== -1) {
      subscriptions.splice(index, 1);
    }

    // 이벤트에 구독자가 없으면 이벤트 맵에서 제거
    if (subscriptions.length === 0) {
      this.events.delete(eventName);
    }
  }

  /**
   * 특정 이벤트의 모든 구독을 해제합니다.
   * @param eventName 구독 해제할 이벤트 이름
   */
  unsubscribeAll(eventName: string): void {
    this.events.delete(eventName);
  }

  /**
   * 이벤트를 발행합니다.
   * @param eventName 발행할 이벤트 이름
   * @param data 이벤트와 함께 전달할 데이터
   */
  publish<T = unknown>(eventName: string, data?: T): void {
    const subscriptions = this.events.get(eventName);
    if (!subscriptions) return;

    // 구독자들에게 이벤트 데이터를 전달
    subscriptions.forEach((subscription) => {
      try {
        subscription.handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error);
      }
    });
  }

  /**
   * 특정 이벤트의 구독자 수를 반환합니다.
   * @param eventName 이벤트 이름
   * @returns 구독자 수
   */
  getSubscriberCount(eventName: string): number {
    const subscriptions = this.events.get(eventName);
    return subscriptions ? subscriptions.length : 0;
  }

  /**
   * 모든 이벤트의 구독을 해제합니다.
   */
  clear(): void {
    this.events.clear();
  }

  /**
   * 현재 등록된 모든 이벤트 이름을 반환합니다.
   * @returns 이벤트 이름 배열
   */
  getEventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

// 싱글톤 인스턴스 생성
export const pubsubUtil = new PubSubUtil();
