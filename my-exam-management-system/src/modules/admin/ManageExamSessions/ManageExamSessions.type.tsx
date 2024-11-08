export type SessionType = {
  id: string | number;
  name: string;
  status?: boolean | undefined;
  time_start: string;
  time_end: string;
};
export type SessionFormMode = "add" | "update";
