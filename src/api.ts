import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const token = 'your_token_here';

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