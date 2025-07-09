import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const token = 'c88f69b89f1e478a9cf32be8720d54d7ab3ff6f4b9272f6f';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getURLs = async () => {
  const res = await instance.get('/urls');
  return res.data;
};

export const submitURL = async (url: string) => {
  await instance.post('/urls', { url });
};