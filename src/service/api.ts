const refreshAccessToken = async () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  const user = JSON.parse(storedUser);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: user.refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      // Mettre à jour le token dans le localStorage
      user.accessToken = data.accessToken;
      localStorage.setItem("user", JSON.stringify(user));
      return data.accessToken;
    } else {
      throw new Error("Échec du rafraîchissement du token");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) throw new Error("Token non trouvé");

  const user = JSON.parse(storedUser);

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${user.accessToken}`);

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Si le token a expiré, rafraîchissons-le
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      // Refaire la requête avec le nouveau token
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      return fetch(url, { ...options, headers });
    }
  }

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response;
};
