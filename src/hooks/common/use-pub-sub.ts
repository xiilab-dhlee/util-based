"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  EventHandler,
  UsePubSubReturn,
} from "@/types/common/pubsub.interface";
import { pubsubUtil } from "@/utils/common/pubsub.util";

/**
 * React 컴포넌트에서 pubsubUtil을 사용하기 위한 훅
 * 컴포넌트가 언마운트될 때 자동으로 구독을 해제합니다.
 */
export const usePubSub = (): UsePubSubReturn => {
  const subscriptionsRef = useRef<Map<string, string>>(new Map());

  // 컴포넌트 언마운트 시 모든 구독 해제
  useEffect(() => {
    const subscriptions = subscriptionsRef.current;

    return () => {
      subscriptions.forEach((subscriptionId, eventName) => {
        pubsubUtil.unsubscribe(eventName, subscriptionId);
      });
      subscriptions.clear();
    };
  }, []);

  /**
   * 이벤트를 구독합니다.
   * 같은 이벤트에 대해 여러 번 호출하면 이전 구독을 해제하고 새로운 구독으로 교체합니다.
   */
  const subscribe = useCallback(
    <T = unknown>(eventName: string, handler: EventHandler<T>) => {
      // 기존 구독이 있다면 해제
      const existingSubscriptionId = subscriptionsRef.current.get(eventName);
      if (existingSubscriptionId) {
        pubsubUtil.unsubscribe(eventName, existingSubscriptionId);
      }

      // 새로운 구독 생성
      const subscriptionId = pubsubUtil.subscribe(eventName, handler);
      subscriptionsRef.current.set(eventName, subscriptionId);
    },
    [],
  );

  /**
   * 특정 이벤트의 구독을 해제합니다.
   */
  const unsubscribe = useCallback((eventName: string) => {
    const subscriptionId = subscriptionsRef.current.get(eventName);
    if (subscriptionId) {
      pubsubUtil.unsubscribe(eventName, subscriptionId);
      subscriptionsRef.current.delete(eventName);
    }
  }, []);

  /**
   * 이벤트를 발행합니다.
   */
  const publish = useCallback(<T = unknown>(eventName: string, data?: T) => {
    pubsubUtil.publish(eventName, data);
  }, []);

  return {
    subscribe,
    unsubscribe,
    publish,
  };
};

/**
 * 특정 이벤트를 구독하는 전용 훅 (최적화된 버전)
 * @param eventName 구독할 이벤트 이름
 * @param handler 이벤트 핸들러
 */
export const useSubscribe = <T = unknown>(
  eventName: string,
  handler: EventHandler<T>,
) => {
  const subscriptionsRef = useRef<Map<string, string>>(new Map());

  // 컴포넌트 언마운트 시 구독 해제
  useEffect(() => {
    const subscriptions = subscriptionsRef.current;

    return () => {
      const subscriptionId = subscriptions.get(eventName);
      if (subscriptionId) {
        pubsubUtil.unsubscribe(eventName, subscriptionId);
        subscriptions.delete(eventName);
      }
    };
  }, [eventName]);

  // 이벤트 구독
  useEffect(() => {
    const subscriptions = subscriptionsRef.current;

    // 기존 구독이 있다면 해제
    const existingSubscriptionId = subscriptions.get(eventName);
    if (existingSubscriptionId) {
      pubsubUtil.unsubscribe(eventName, existingSubscriptionId);
    }

    // 새로운 구독 생성
    const subscriptionId = pubsubUtil.subscribe(eventName, handler);
    subscriptions.set(eventName, subscriptionId);

    // 클린업 함수
    return () => {
      pubsubUtil.unsubscribe(eventName, subscriptionId);
      subscriptions.delete(eventName);
    };
  }, [eventName, handler]); // handler를 의존성에 추가하여 핸들러 변경 시 재구독
};

/**
 * 이벤트 발행 전용 훅 (최적화된 버전)
 * @returns publish 함수
 */
export const usePublish = () => {
  return useCallback(<T = unknown>(eventName: string, data?: T) => {
    pubsubUtil.publish(eventName, data);
  }, []);
};

/**
 * 특정 이벤트의 구독자 수를 확인하는 훅
 * @param eventName 이벤트 이름
 * @returns 구독자 수
 */
export const useSubscriberCount = (eventName: string) => {
  const [count, setCount] = useState(() =>
    pubsubUtil.getSubscriberCount(eventName),
  );

  useEffect(() => {
    const updateCount = () =>
      setCount(pubsubUtil.getSubscriberCount(eventName));

    // 초기 카운트 설정
    updateCount();

    // 이벤트 발행 시 카운트 업데이트를 위한 구독
    const subscriptionId = pubsubUtil.subscribe(eventName, updateCount);

    return () => {
      pubsubUtil.unsubscribe(eventName, subscriptionId);
    };
  }, [eventName]);

  return count;
};

/**
 * 모든 이벤트 구독을 해제하는 훅
 * @returns clear 함수
 */
export const useClearAllSubscriptions = () => {
  return useCallback(() => {
    pubsubUtil.clear();
  }, []);
};
