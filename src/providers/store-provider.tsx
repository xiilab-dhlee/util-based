"use client";

import { createStore, Provider } from "jotai";
import type { PropsWithChildren } from "react";

// jotai store 생성
const jotaiStore = createStore();

export function StoreProvider({ children }: PropsWithChildren) {
  return <Provider store={jotaiStore}>{children}</Provider>;
}
