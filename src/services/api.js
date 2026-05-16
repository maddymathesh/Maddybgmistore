/**
 * Generic API layer for interacting with Google Apps Script Web App.
 * Handles fetching, inserting, updating, and deleting data from Google Sheets.
 */

const API_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
const API_KEY = import.meta.env.VITE_APPS_SCRIPT_API_KEY || 'mbs_secure_api_key_2026_xyz';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Network response was not ok');
  }
  const result = await response.json();
  if (result.status === 'error') {
    throw new Error(result.message || 'API Error');
  }
  return result.data || result;
};

export const getTransactions = async (sheet, params = {}, retries = 3) => {
  const queryParams = new URLSearchParams({ sheet, apiKey: API_KEY, ...params }).toString();

  for (let i = 0; i < retries; i++) {
    try {
      // Use credentials: 'omit' to prevent browser from sending cookies that trigger CORS
      const response = await fetch(`${API_URL}?${queryParams}`, {
        method: 'GET',
        credentials: 'omit',
        mode: 'cors'
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      if (i === retries - 1) throw error;
      // Wait before retrying (exponential backoff)
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
    }
  }
};

export const createTransaction = async (sheet, data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    // Flatten data into the root object so your script can find the column names
    body: JSON.stringify({ sheet, action: 'create', apiKey: API_KEY, ...data }),
  });
  const result = await handleResponse(res);
  return result;
};

export const updateTransaction = async (sheet, id, data) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    mode: "cors",
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ sheet, action: 'update', id, apiKey: API_KEY, ...data }),
  });
  const result = await handleResponse(response);
  return result;
};

export const deleteTransaction = async (sheet, id) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    mode: "cors",
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ sheet, action: 'delete', id, apiKey: API_KEY }),
  });
  const result = await handleResponse(response);
  return result;
};

export const searchTransactions = async (sheet, query) => {
  const queryParams = new URLSearchParams({ sheet, action: 'search', q: query, apiKey: API_KEY }).toString();
  const response = await fetch(`${API_URL}?${queryParams}`);
  return handleResponse(response);
};

// Generic helper for any sheet
export const api = {
  get: getTransactions,
  create: createTransaction,
  update: updateTransaction,
  delete: deleteTransaction,
  search: searchTransactions,
};
