/**
 * PubSub 관련 타입 정의
 */

export type EventHandler<T = unknown> = (data: T) => void;

export interface UsePubSubReturn {
  subscribe: <T = unknown>(eventName: string, handler: EventHandler<T>) => void;
  unsubscribe: (eventName: string) => void;
  publish: <T = unknown>(eventName: string, data?: T) => void;
}

export interface EventSubscription {
  id: string;
  handler: EventHandler;
}
