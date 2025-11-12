// === @flick/comms/src/channel.ts ===
import { type FlickId, type WorkerToMainCommand } from "./types";

// --- ID Generation ---
let nextId = 0;
export const createFlickId = (): FlickId => (nextId++).toString(36);

// --- Command Queuing (The Batching Logic) ---
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

/** Adds a command to the queue and schedules a microtask to send the batch. */
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

/** Stores a user's event handler function. */
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
