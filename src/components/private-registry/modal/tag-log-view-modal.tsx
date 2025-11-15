// "use client";

// import { FitAddon } from "@xterm/addon-fit";
// import { Terminal as XTerminal } from "@xterm/xterm";
// import { useEffect, useRef } from "react";
// import styled from "styled-components";
// import { Icon, InfoModal } from "xiilab-ui";
// import { Arthur } from "xterm-theme";

// // import { openTagLogViewModalAtom } from "@/atoms/private-registry/private-registry-modal.atom";
// import { useGlobalModal } from "@/hooks/common/use-global-modal";

// /**
//  * TagLogViewModal 컴포넌트
//  *
//  * 태그 상세 페이지에서 로그 보기 버튼을 클릭했을 때 나타나는 모달입니다.
//  * 실제 xterm.js 터미널을 사용하여 로그 정보를 표시합니다.
//  */
// export function TagLogViewModal() {
//   // const { open, onClose } = useGlobalModal(openTagLogViewModalAtom);
//   const termRef = useRef<HTMLDivElement>(null);
//   const term = useRef<XTerminal | null>(null);
//   const fitAddon = useRef<FitAddon>(new FitAddon());

//   // 터미널 초기화
//   useEffect(() => {
//     if (open && termRef.current && !term.current) {
//       const terminal = new XTerminal({
//         theme: Arthur,
//         fontSize: 12,
//         fontFamily: "Pretendard, Consolas, Monaco, monospace",
//         cols: 80,
//         rows: 24,
//         allowTransparency: true,
//         scrollback: 1000,
//         disableStdin: true, // 입력 비활성화 (읽기 전용)
//       });

//       terminal.loadAddon(fitAddon.current);
//       terminal.open(termRef.current);

//       // 터미널 크기 조정
//       setTimeout(() => {
//         try {
//           fitAddon.current.fit();
//         } catch (error) {
//           console.warn("FitAddon fit failed:", error);
//         }
//       }, 100);

//       // 샘플 로그 데이터 출력
//       const logData = [
//         "Epoch  #3,      Step   #4930        Loss: 0.000313",
//         "Epoch  #3,      Step   #4940        Loss: 0.006849",
//         "Epoch  #3,      Step   #4950        Loss: 0.000313",
//         "Epoch  #3,      Step   #4960        Loss: 0.006849",
//         "Epoch  #3,      Step   #4970        Loss: 0.000313",
//         "Epoch  #3,      Step   #4980        Loss: 0.006849",
//         "Epoch  #3,      Step   #4990        Loss: 0.000313",
//         "Epoch  #4,      Step   #0           Loss: 0.006849",
//         "Epoch  #4,      Step   #10          Loss: 0.000313",
//         "Epoch  #4,      Step   #20          Loss: 0.006849",
//         "Epoch  #4,      Step   #30          Loss: 0.000313",
//         "Epoch  #4,      Step   #40          Loss: 0.006849",
//         "Epoch  #4,      Step   #50          Loss: 0.000313",
//       ];

//       setTimeout(() => {
//         logData.forEach((line, index) => {
//           setTimeout(() => {
//             terminal.writeln(line);
//           }, index * 100); // 순차적으로 출력
//         });
//       }, 200);

//       term.current = terminal;
//     }

//     // 모달이 닫힐 때 터미널 정리
//     if (!open && term.current) {
//       term.current.dispose();
//       term.current = null;
//     }
//   }, [open]);

//   return (
//     <InfoModal
//       type="primary"
//       modalWidth={800}
//       icon={
//         <IconWrapper>
//           <IconBlur />
//           <IconCircle>
//             <Icon name="SourceCode" color="#fff" size={14} />
//           </IconCircle>
//         </IconWrapper>
//       }
//       open={open}
//       closable
//       onClose={onClose}
//       title="로그"
//       centered
//     >
//       <TerminalContainer ref={termRef} />
//     </InfoModal>
//   );
// }

// const IconWrapper = styled.div`
//   position: relative;
//   width: 30px;
//   height: 30px;
// `;

// const IconBlur = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 30px;
//   height: 30px;
//   background-color: #3744f9;
//   border-radius: 20px;
//   opacity: 0.1;
// `;

// const IconCircle = styled.div`
//   position: absolute;
//   top: 3px;
//   left: 3px;
//   width: 24px;
//   height: 24px;
//   background-color: #3744f9;
//   border-radius: 16px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   box-shadow: 0px 1px 2px 0px rgba(92, 88, 136, 0.15);
// `;

// const TerminalContainer = styled.div`
//   width: 100%;
//   height: 526px;
//   background-color: #17171f;
//   border-radius: 4px;
//   overflow: hidden;

//   /* xterm.js 스타일 커스터마이징 */
//   .xterm {
//     padding: 20px;
//   }

//   .xterm-viewport {
//     overflow-y: scroll;
//     overflow-x: hidden;

//     &::-webkit-scrollbar {
//       width: 5px;
//     }

//     &::-webkit-scrollbar-thumb {
//       min-height: 20px;
//       background-color: #9a9ba0;
//       border-radius: 20px;
//     }

//     &::-webkit-scrollbar-track {
//       background-color: transparent;
//     }
//   }
// `;
