import { Action } from "./config";

export const getPost = async () => {
    const data = await Action.get(`/admin/post`);
    return data.data;
  };
  export const deletepost = async(id)=>{
    console.log(id)
    const data = await Action.delete(`/admin/post/${id}`);
    console.log(data.data)
    return data.data;
  }