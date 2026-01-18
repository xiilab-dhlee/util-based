import { delay, HttpResponse, http } from "msw";

import { getGetAccountDetailResponseMock } from "@/api/generated/admin-account-management/admin-account-management.msw";

export const adminAccountDetailOverrideHandlers = [
  http.get("*/api/v1/admin/accounts/:accountId/detail", async ({ params }) => {
    await delay(1000);

    const accountId = Array.isArray(params.accountId)
      ? (params.accountId[0] ?? "")
      : (params.accountId ?? "");

    const base = getGetAccountDetailResponseMock();
    if (!base.data) {
      return HttpResponse.json(base, { status: 200 });
    }

    return HttpResponse.json(
      {
        ...base,
        data: {
          ...base.data,
          accountId: accountId.length ? accountId : base.data.accountId,
        },
      },
      { status: 200 },
    );
  }),
];
