import { createTerminalAction } from "@/utils/common/terminal.util";

// 상수 정의
const PING_INTERVAL_MS = 5000;
const INITIAL_TERMINAL_SIZE = -1;

// 타입 정의
type WorkerMessageType =
  | "CONNECT"
  | "DISCONNECT"
  | "SEND"
  | "RESIZE"
  | "COMMAND";

type ConnectPayload = {
  url: string;
  workspaceId: string;
  workloadId: string;
  workloadType: string;
};

type ResizePayload = {
  columns?: number;
  rows?: number;
};

interface WorkerMessage {
  type: WorkerMessageType;
  payload?: ConnectPayload | ResizePayload | string | Record<string, unknown>;
}

type TerminalPayloadType =
  | "TERMINAL_PRINT"
  | "TERMINAL_ALERT"
  | "TERMINAL_LOG"
  | "TERMINAL_INIT";

type TerminalPayload = {
  type: TerminalPayloadType;
  text?: string;
};

type SendType =
  | "TERMINAL_HOST"
  | "TERMINAL_INIT"
  | "TERMINAL_COMMAND"
  | "TERMINAL_RESIZE"
  | "TERMINAL_HELP";

type PostMessageType = "INIT" | "ALERT" | "PRINT" | "DISCONNECTED" | "ERROR";

interface PostMessage {
  type: PostMessageType;
  payload?: string;
}

// 상태 변수
let socket: WebSocket | null = null;
let pingInterval: NodeJS.Timeout | null = null;
let columns = INITIAL_TERMINAL_SIZE;
let rows = INITIAL_TERMINAL_SIZE;
let workspace = "";
let workload = "";
let workloadType = "";

// 메인 스레드에서 온 메시지 처리
self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  switch (type) {
    case "CONNECT": {
      const connectPayload = payload as ConnectPayload;
      workspace = connectPayload.workspaceId;
      workload = connectPayload.workloadId;
      workloadType = connectPayload.workloadType;
      initializeWebSocket(connectPayload.url);
      break;
    }
    case "DISCONNECT":
      closeWebSocket();
      break;
    case "RESIZE": {
      const resizePayload = payload as ResizePayload;
      if (resizePayload.columns !== undefined) {
        columns = resizePayload.columns;
      }
      if (resizePayload.rows !== undefined) {
        rows = resizePayload.rows;
      }
      sendMessage("TERMINAL_RESIZE", {
        columns,
        rows,
      });
      break;
    }
    case "COMMAND":
      sendMessage("TERMINAL_COMMAND", payload);
      break;
    default:
      console.error("Unknown message type:", type);
  }
});

// WebSocket 이벤트 핸들러
function handleSocketOpen(): void {
  startPing();
  console.log("WEBSOCKET_OPEN");

  sendMessage("TERMINAL_HOST", { workspace, workload, workloadType });
  sendMessage("TERMINAL_INIT");
}

function handleSocketMessage(data: string): void {
  try {
    const payload = JSON.parse(data) as TerminalPayload;

    switch (payload.type) {
      case "TERMINAL_INIT":
        sendMessage("TERMINAL_RESIZE", { columns, rows });
        postMessageToClient({ type: "INIT" });
        break;
      case "TERMINAL_ALERT":
        postMessageToClient({ type: "ALERT" });
        break;
      case "TERMINAL_PRINT":
        postMessageToClient({
          type: "PRINT",
          payload: payload.text,
        });
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Failed to parse socket message:", error);
    postMessageToClient({
      type: "ERROR",
      payload: "Failed to parse message",
    });
  }
}

function handleSocketClose(event: CloseEvent): void {
  if (event.wasClean) {
    console.log("[close] 커넥션이 정상적으로 종료되었습니다");
  } else {
    console.log("[close] 커넥션이 비정상적으로 종료되었습니다");
  }
  closeWebSocket();
  postMessageToClient({ type: "DISCONNECTED" });
}

function handleSocketError(event: Event): void {
  const errorMessage =
    event instanceof ErrorEvent ? event.message : "Unknown error";
  console.error("WebSocket error:", errorMessage);
  postMessageToClient({ type: "ERROR", payload: errorMessage });
}

// WebSocket 초기화
function initializeWebSocket(url: string): void {
  socket = new WebSocket(url);

  socket.onopen = handleSocketOpen;
  socket.onmessage = (event: MessageEvent) => {
    handleSocketMessage(event.data as string);
  };
  socket.onclose = handleSocketClose;
  socket.onerror = handleSocketError;
}

// WebSocket 종료
function closeWebSocket(): void {
  if (socket) {
    stopPing();
    socket.close();
    socket = null;
  }
}

// 클라이언트로 메시지 전송
function postMessageToClient(message: PostMessage): void {
  self.postMessage(message);
}

// WebSocket으로 메시지 전송
function sendMessage(
  type: SendType,
  payload?: Record<string, unknown> | string,
): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(createTerminalAction(type, payload));
  } else {
    console.warn(`WebSocket is not connected, request type: ${type}`);
  }
}

// Ping 관리
function startPing(): void {
  if (pingInterval) {
    return;
  }

  pingInterval = setInterval(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      sendMessage("TERMINAL_HELP");
    }
  }, PING_INTERVAL_MS);
}

function stopPing(): void {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
}
