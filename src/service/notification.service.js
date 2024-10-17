import { Action } from './config';

export const sendToAllNotification = async (body) => {
  const data = await Action.post(`/admin/sendNotification`, body);

  return data.data;
};
