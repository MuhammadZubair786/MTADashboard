import { Action } from "./config";

export const getNutrition = async()=>{
    const data = await Action.get(`/admin/nutrition`);
    return data.data;
}
export const getDiet = async()=>{
    const data = await Action.get(`/admin/diet`);
    return data.data;
}