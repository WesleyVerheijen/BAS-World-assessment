export const BASE_URL = import.meta.env.VITE_BASE_URL || `http://${location.hostname}` || "http://localhost";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api`;

/**
 * Retrieves the JWT token from localStorage.
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Handles API requests using the Fetch API, including JWT token authorization.
 * @param endpoint API endpoint (e.g., "/test-db")
 * @param options Additional fetch options (optional)
 * @returns JSON response
 */
const fetchRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add Authorization header if token exists
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("🔒 Unauthorized: Redirecting to login.");
        localStorage.removeItem("token"); // Optional: Logout if unauthorized
        // location.reload();
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ API Request Failed (${endpoint}):`, error);
    // throw error;
  }
};

/**
 * GET request with JWT authentication
 */
export const getRequest = <T>(endpoint: string): Promise<T> =>
  fetchRequest<T>(endpoint, { method: "GET" });

/**
 * POST request with JWT authentication
 */
export const postRequest = <T, R>(endpoint: string, data: T): Promise<R> =>
  fetchRequest<R>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });

/**
 * PUT request with JWT authentication
 */
export const putRequest = <T, R>(endpoint: string, data: T): Promise<R> =>
  fetchRequest<R>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });

/**
 * PATCH request with JWT authentication
 */
export const patchRequest = <T, R>(endpoint: string, data: T): Promise<R> =>
  fetchRequest<R>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

/**
 * DELETE request with JWT authentication
 */
export const deleteRequest = <T>(endpoint: string): Promise<T> =>
  fetchRequest<T>(endpoint, { method: "DELETE" });

export default {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
};
