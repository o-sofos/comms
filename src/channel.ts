// === @flick/comms/src/channel.ts ===
import { type FlickId, type WorkerToMainCommand } from "./types";

// --- ID Generation ---
let nextId = 0;
export const createFlickId = (): FlickId => (nextId++).toString(36);

// --- State and Command Queue ---
let commandQueue: WorkerToMainCommand[] = [];
let isBatchQueued = false;

function sendBatch() {
  if (commandQueue.length === 0) {
    isBatchQueued = false;
    return;
  }
  self.postMessage(commandQueue);
  commandQueue = [];
  isBatchQueued = false;
}

export function queueCommand(command: WorkerToMainCommand) {
  commandQueue.push(command);
  if (!isBatchQueued) {
    isBatchQueued = true;
    queueMicrotask(sendBatch);
  }
}

// --- Event Listener Registry ---
export const workerEventListenerRegistry = new Map<
  FlickId,
  Map<string, (payload: any) => void>
>();

export function registerWorkerListener(
  id: FlickId,
  event: string,
  handler: (payload: any) => void
) {
  if (!workerEventListenerRegistry.has(id)) {
    workerEventListenerRegistry.set(id, new Map());
  }
  workerEventListenerRegistry.get(id)!.set(event, handler);
}
