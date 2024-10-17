import { Action } from './config';

export const AdminLogin = async (body) => {
  const data = await Action.post('/admin/login', body);

  console.log(data);
  return data.data;
};
export const getUsers = async () => {
  const data = await Action.get('/admin/user');

  return data.data;
};
export const deleteSelectedUser = async (id) => {

  const data = await Action.post(`/admin/deleteuser/${id}`);


  return data.data;
};

export const getTerms = async () => {
  const data = await Action.get(`/admin/terms`);
  return data.data.data;
};

export const getPrivacy = async () => {
  const data = await Action.get(`/admin/privacy`);
  return data.data.data;
};
export const updateTerms = async (id, payload) => {
  const data = await Action.put(`/admin/terms/${id}`, payload);
  return data.data;
};

export const updatePrivacy = async (id, payload) => {
  const data = await Action.put(`/admin/privacy/${id}`, payload);
  return data.data;
};
export const getdashboard = async () => {
  const data = await Action.get(`/admin/dashboard`);
  return data.data;
};
