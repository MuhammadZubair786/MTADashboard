import axios from 'axios';

// For Staging
const baseUrl = 'https://api.gymstaapp.com/api/v1/';
export const imgURL = 'https://api.gymstafitness.app/';

// below is for live

// const baseUrl= "https://gymsta-api.jumppace.com:9000/api/v1/"
// export const imgURL = "https://gymsta-api.jumppace.com:9000/";

// for localHost
// const baseUrl = "http://localhost:9000/api/v1/"
// export const imgURL = "http://localhost:9000/"

const Action = axios.create({
  baseURL: baseUrl,
  headers: {
    // "Content-Type": "application/json",
  },
});

// Request interceptor to add the Authorization header
Action.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      // config.headers.Authorization = `Bearer ${token}`
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { Action };

// import axios from "axios"

// // for staging
// const baseUrl ="https://gymsta-api-dev.thesuitchstaging.com:9000/api/v1/"

// // below is for live
// // const baseUrl= "https://gymsta-api.jumppace.com:9000/api/v1/"
// export const imgURL = "https://gymsta-api.jumppace.com:9000/"

// // const baseUrl = "http://localhost:9000/api/v1/"
// // export const imgURL = "http://localhost:9000/"

// export const Action  = axios.create({
//     baseURL: baseUrl,
//     "Content-Type": "application/json",
//     headers: {
//         Authorization:`${JSON.parse(localStorage.getItem("token"))}`
//     }
//   });
