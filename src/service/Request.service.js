import { Action } from "./config";

export const getReuqest = async () => {
    const data = await Action.get(`/admin/request`);
    return data.data;
  };
  