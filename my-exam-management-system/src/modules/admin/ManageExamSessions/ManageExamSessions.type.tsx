export type SessionType = {
  id: string | number;
  name: string;
  status?: boolean;
  timeStart: string;
  timeEnd: string;
};
export type SessionFormMode = "add" | "update";
