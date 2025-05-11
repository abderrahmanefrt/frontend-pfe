// src/hooks/useFetchPrivate.ts
import { useAuth } from "../context/AuthContext";
import useRefreshToken from "./useRefreshToken";

const useFetchPrivate = () => {
  const { user } = useAuth();
  const refresh = useRefreshToken();

  const secureFetch = async (url: string, options: RequestInit = {}, retry = true): Promise<Response> => {
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${user?.accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 401 && retry) {
      const newAccessToken = await refresh();
      if (newAccessToken) {
        const newHeaders = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return fetch(url, {
          ...options,
          headers: newHeaders,
          credentials: "include",
        });
      }
    }

    return response;
  };

  return secureFetch;
};

export default useFetchPrivate;
