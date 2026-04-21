const BASE_URL = "http://localhost:8080/api/v1/profile";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createProfile = async (profileData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  const text = await response.text();

  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      (typeof data === "object" && data?.message) ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

export const getProfile = async () => {
  const response = await fetch(BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      (typeof data === "object" && data?.message) ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};