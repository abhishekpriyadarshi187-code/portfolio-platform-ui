const BASE_URL = "http://localhost:8080/api/v1/profile";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const parseResponseData = async (response) => {
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

const normalizeProfileData = (data) => {
  if (!data || typeof data !== "object") {
    return data;
  }

  return {
    ...data,
    profileImageUrl: data.profileImageUrl || "",
    profilePhoto: data.profileImageUrl || "",
  };
};

export const createProfile = async (profileData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  const data = await parseResponseData(response);
  return normalizeProfileData(data);
};

export const getProfile = async () => {
  const response = await fetch(BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await parseResponseData(response);
  return normalizeProfileData(data);
};

export const uploadProfileImage = async (file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/image`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await parseResponseData(response);
  return normalizeProfileData(data);
};

export const getProfileImageBase64 = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/image/base64`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return text;
};
