const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const api = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;

    // Automatically include cookies for auth
    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, defaultOptions);

    if (response.status === 401) {
      // If unauthorized, we might want to redirect to login
      // However, it's usually better to handle this at the context level
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      // Only log server errors (5xx) to console. Client errors (4xx) like validation 
      // failures should just be handled by the UI (e.g. via toast) without polluting the terminal.
      if (response.status >= 500) {
        console.error("API call failed:", url, response.status, response.statusText);
      }

      let message = 'API Error';
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch (e) {
        // Not JSON
      }
      throw new Error(message);
    }

    // Attempt to return parsed JSON
    try {
      const data = await response.json();
      return data.data !== undefined ? data.data : data; // Assuming our API returns { success, data }
    } catch (e) {
      return null; // For empty responses like 204 or non-JSON
    }
  },

  get(endpoint: string, options?: RequestInit) {
    return this.fetch(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint: string, body: any, options?: RequestInit) {
    return this.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(endpoint: string, body: any, options?: RequestInit) {
    return this.fetch(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint: string, options?: RequestInit) {
    return this.fetch(endpoint, { ...options, method: 'DELETE' });
  },

  async upload(endpoint: string, formData: FormData, options?: RequestInit) {
    const url = `${BASE_URL}${endpoint}`;

    // We don't set Content-Type here because fetch will automatically set it 
    // with the correct boundary when body is FormData.
    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: {
        ...options?.headers,
      },
      ...options,
      method: 'POST',
      body: formData,
    };

    const response = await fetch(url, defaultOptions);

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      if (response.status >= 500) {
        console.error("API call failed:", url, response.status, response.statusText);
      }
      let message = 'API Error';
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch (e) {
        // Not JSON
      }
      throw new Error(message);
    }

    try {
      const data = await response.json();
      return data.data !== undefined ? data.data : data;
    } catch (e) {
      return null;
    }
  }
};
