import { Action } from "./config";

export const getRoutine = async()=>{
    const data = await Action.get(`/admin/routine`);
    return data.data;
}
