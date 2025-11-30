export const groupKeys = {
  default: ["group"],
  allList: () => [...groupKeys.default, "all-list"],
  detail: (groupId: string) => [...groupKeys.default, "detail", groupId],
};
