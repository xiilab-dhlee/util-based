import type { CheckboxChangeEvent } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import { Checkbox, Input } from "xiilab-ui";

import {
  usePinWorkspace,
  useUnpinWorkspace,
} from "@/api/generated/account/account";
import type { WorkspaceResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ActiveOutsideClick } from "@/shared/components/active-outside-click";
import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { ArrowIcon } from "@/shared/components/icon/arrow-icon";
import { useWorkspaceSelect } from "@/shared/components/select/workspace-select/use-workspace-select";
import { WorkspaceSelectOption } from "@/shared/components/select/workspace-select/workspace-select-option";
import { MySpinner } from "@/shared/components/spinner";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openCreateWorkspaceModalAtom } from "@/shared/state/modal.atom";
import { getSessionAccountId } from "@/shared/utils/auth.util";
import { customScrollbar } from "@/styles/mixins/scrollbar";

export function WorkspaceSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen } = useGlobalModal(openCreateWorkspaceModalAtom);
  const { data: session } = useSession();
  const accountId = getSessionAccountId(session);

  const [isMyWorkspaceChecked, setIsMyWorkspaceChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const {
    selectedWorkspace,
    workspaces,
    isLoading,
    handleSelectWorkspace,
    refetchWorkspaces,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWorkspaceSelect(searchKeyword, isMyWorkspaceChecked);

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: "150px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && isOpen) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isOpen, fetchNextPage]);

  const { mutate: pinWorkspace } = usePinWorkspace();
  const { mutate: unpinWorkspace } = useUnpinWorkspace();

  const handleDropdownToggle = () => {
    setIsOpen((prev) => {
      if (!prev) {
        setInputValue("");
        setSearchKeyword("");
      }
      return !prev;
    });
  };

  const handleClickOption = (workspace: WorkspaceResponse) => {
    handleClose();
    handleSelectWorkspace(workspace);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
    setSearchKeyword("");
    setIsMyWorkspaceChecked(false);
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleCreateWorkspace = () => {
    handleClose();
    onOpen();
  };

  const handleChangeMyWorkspace = (e: CheckboxChangeEvent) => {
    setIsMyWorkspaceChecked(e.target.checked);
  };

  const handlePinClick = (
    e: React.MouseEvent,
    workspace: WorkspaceResponse,
  ) => {
    e.stopPropagation();
    if (!accountId) return;

    if (workspace.isPinned) {
      unpinWorkspace(
        { accountId, workspaceId: workspace.workspaceId },
        {
          onSuccess: () => {
            refetchWorkspaces();
          },
        },
      );
    } else {
      pinWorkspace(
        { accountId, workspaceId: workspace.workspaceId },
        {
          onSuccess: () => {
            refetchWorkspaces();
          },
        },
      );
    }
  };

  return (
    <>
      {isLoading && (
        <LoadingOverlay>
          <MySpinner />
        </LoadingOverlay>
      )}
      <ActiveOutsideClick onClick={handleClose}>
        <Container>
          <ActiveOption onClick={handleDropdownToggle}>
            {selectedWorkspace ? (
              <ValueWrapper>
                {selectedWorkspace.isDefault && <Badge>Default</Badge>}
                <Value
                  className="truncate"
                  data-testid={SELECTOR.WORKSPACE_SELECT_VALUE}
                >
                  {selectedWorkspace.workspaceName}
                </Value>
              </ValueWrapper>
            ) : (
              <Placeholder data-testid={SELECTOR.WORKSPACE_SELECT_PLACEHOLDER}>
                Select Workspace
              </Placeholder>
            )}
            <IconWrapper className={isOpen ? "open" : ""}>
              <ArrowIcon />
            </IconWrapper>
          </ActiveOption>
          {isOpen && (
            <Overlay>
              <OverlayBody>
                <Input.Search
                  placeholder="워크스페이스 검색"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onSearch={handleSearch}
                  autoComplete="off"
                  width={188}
                  height={30}
                  darkMode={true}
                />
                <Menu>
                  {searchKeyword && workspaces.length === 0 ? (
                    <EmptyMessage>조회된 결과가 없습니다.</EmptyMessage>
                  ) : (
                    <>
                      {workspaces.map((workspace: WorkspaceResponse) => (
                        <WorkspaceSelectOption
                          key={workspace.workspaceId}
                          workspace={workspace}
                          isSelected={
                            selectedWorkspace?.workspaceId ===
                            workspace.workspaceId
                          }
                          onSelect={handleClickOption}
                          onPinToggle={handlePinClick}
                        />
                      ))}
                      {hasNextPage && <SentinelDiv ref={sentinelRef} />}
                    </>
                  )}
                </Menu>
              </OverlayBody>
              <Footer>
                <FooterLeft>
                  <Checkbox
                    id="my-workspace"
                    size="small"
                    darkMode
                    checked={isMyWorkspaceChecked}
                    onChange={handleChangeMyWorkspace}
                  />
                  <CheckboxLabel htmlFor="my-workspace">
                    나의 워크스페이스
                  </CheckboxLabel>
                </FooterLeft>
                <div>
                  <CreateModelButton
                    className="dark"
                    onClick={handleCreateWorkspace}
                    title="생성"
                  />
                </div>
              </Footer>
            </Overlay>
          )}
        </Container>
      </ActiveOutsideClick>
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 2px;
  border: 1px solid #3A3C4A;
  padding: 6px;
`;

const ActiveOption = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 4px;
`;

const ValueWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  font-weight: 500;
  font-size: 10px;
  color: #f5f5f5;
  overflow: hidden;
`;

const Value = styled.span``;

const Placeholder = styled(Value)`
  color: #808080;
`;

const Overlay = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  width: 100%;
  max-height: 296px;
  background-color: #171B26;
  border: 1px solid #515E80B2;
  border-radius: 4px;
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

const OverlayBody = styled.div`
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Menu = styled.div`
  max-height: 210px;
  overflow-y: auto;

  ${customScrollbar("#515E80")}
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  border: 1px solid #515E8080;
  width: 18px;
  height: 18px;
  background-color: #2d3041;

  --icon-fill: rgba(245, 245, 245, 0.9);

  &.open {
    transform: rotate(180deg);
  }
`;

const Footer = styled.div`
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #242b3c;
  padding: 0 8px;
`;

const FooterLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
`;

const CheckboxLabel = styled.label`
  font-size: 11px;
  color: #c6c6c7;
`;

const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #808080;
  font-size: 12px;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const Badge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 4px 7px;
  background-color: #1c325e;
  border-radius: 2px;
  font-weight: 500;
  color: #f5f5f5;
  margin-right: 4px;
`;

const SentinelDiv = styled.div`
  height: 1px;
  width: 100%;
`;
