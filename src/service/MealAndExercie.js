import { Action } from "./config";


export const addMeal = async (payload) => {
    const data = await Action.post(`/admin/meal`,payload);
    return data.data;
  };
  export const updateMeal = async (id, payload) => {
    const data = await Action.put(`/admin/meal/${id}`, payload);
    return data.data;
  };
  

export const getMeal = async () => {
    const data = await Action.get(`/mealbyadmin`);
    return data.data;
  };
  export const deleteMeal = async (id) => {
    const data = await Action.delete(`/admin/meal/${id}`);
    return data.data;
  };
  

export const addExercise = async (payload) => {
    const data = await Action.post(`/admin/exercise`,payload);
    return data.data.data;
  };
  export const updateExercise = async (id, payload) => {
    const data = await Action.put(`/admin/exercise/${id}`, payload);
    console.log(data.data)
    return data.data;
  };
  

export const getExercise = async () => {
    const data = await Action.get(`/exercise`);
    
    return data.data;
  };
  export const deleteExercise = async (id) => {
    const data = await Action.delete(`/admin/exercise/${id}`);
    return data.data;
  };