export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem("token");
    return new Response(
      JSON.stringify({ message: "Session expirée. Veuillez vous reconnecter." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return response;
};