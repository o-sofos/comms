export type FlickId = string;
export const FLICK_ROOT_ID: FlickId = "__FLICK_ROOT__";

// --- Worker to Main Thread (Commands) ---

type CreateElementCommand = {
  type: "create";
  id: FlickId;
  tag: string;
  ns?: "svg";
};
type SetTextCommand = { type: "text"; id: FlickId; value: string };
type SetStyleCommand = {
  type: "style";
  id: FlickId;
  prop: string;
  value: string | number;
};
type SetAttributeCommand = {
  type: "attribute";
  id: FlickId;
  name: string;
  value: string | number;
};
type ListenCommand = { type: "listen"; id: FlickId; event: string };
type DestroyElementCommand = { type: "destroy"; id: FlickId };
type MoveElementCommand = {
  type: "move";
  id: FlickId;
  parentId: FlickId;
  beforeId: FlickId | null;
};
type AppendChildCommand = {
  type: "append";
  parentId: FlickId;
  childId: FlickId;
  beforeId: FlickId | null;
};
type HostCallPayload = {
  type: "host-call";
  callId: FlickId;
  service: string;
  args: any[];
};

/** Batched commands sent from Worker to Main Thread. */
export type WorkerToMainCommand =
  | CreateElementCommand
  | SetTextCommand
  | SetStyleCommand
  | SetAttributeCommand
  | ListenCommand
  | DestroyElementCommand
  | MoveElementCommand
  | AppendChildCommand
  | HostCallPayload;

// --- Main Thread to Worker (Messages) ---

type InitPayload = { type: "init" };
type EventPayload = { type: "event"; id: FlickId; event: string; payload: any };
type HostResponsePayload = {
  type: "host-response";
  callId: FlickId;
  result: any;
  isError: boolean;
};

/** Messages sent from Main Thread to Worker. */
export type MainToWorkerMessage =
  | InitPayload
  | EventPayload
  | HostResponsePayload;
