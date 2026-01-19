import {
  getGetGroupChildrenMockHandler,
  getGetGroupDetailMockHandler,
  getGetRootGroupsMockHandler,
  getGetUngroupedAccountsMockHandler,
  getSearchMockHandler,
} from "@/api/generated/group/group.msw";

export const groupHandlers = [
  getGetRootGroupsMockHandler(),
  getSearchMockHandler(),
  getGetUngroupedAccountsMockHandler(),
  getGetGroupDetailMockHandler(),
  getGetGroupChildrenMockHandler(),
];
