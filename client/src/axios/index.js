import axios from 'axios';

// const baseURL  = 'http://192.168.60.127:3000/api';
const instance = axios.create({
  withCredentials:true,    
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers:{
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS', 
  }
});

export default instance;