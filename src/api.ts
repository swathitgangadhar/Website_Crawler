const API_BASE = 'http://localhost:8080/api';
const token = 'c88f69b89f1e478a9cf32be8720d54d7ab3ff6f4b9272f6f'; 

// get all URLs
export const getURLs = async () => {
  const res = await fetch(`${API_BASE}/urls`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch URLs');
  return await res.json();
};

// submit a new URL
export const submitURL = async (url: string) => {
  const res = await fetch(`${API_BASE}/urls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error('Failed to submit URL');
};

// get details of a specific URL by ID
export const getURLDetail = async (id: string | number) => {
  const res = await fetch(`${API_BASE}/urls/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch URL details');
  return await res.json();
};

// delete URLs by their IDs
export const deleteURLs = async (ids: number[]) => {
  await fetch(`${API_BASE}/urls/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ids }),
  });
};
