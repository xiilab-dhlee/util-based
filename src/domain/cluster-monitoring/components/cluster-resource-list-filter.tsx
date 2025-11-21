"use client";

import type { FormEvent } from "react";

import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

export function ClusterResourceListFilter() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert("준비 중입니다.");
  };

  return (
    <MySearchFilter title="리소스 리스트" showTotal={false}>
      <form onSubmit={handleSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
