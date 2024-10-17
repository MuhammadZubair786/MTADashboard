import { Action } from "./config";


export const paymentData = async (page, limit) => {

      const data = await Action.get(`admin/paymentData?limit=${limit}&page=${page}`);
      return data.data;
   
  };

