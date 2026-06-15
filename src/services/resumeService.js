const BASE_URL = "http://localhost:8080/api/v1/resume";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

const parseResponse = async (response) => {
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

export const getResumeConfig = async () => {
  const response = await fetch(BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
};

export const saveResumeTemplate = async (templateId) => {
  const response = await fetch(`${BASE_URL}/template`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ templateId }),
  });

  return parseResponse(response);
};

export const uploadResumePdf = async (file, templateId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("templateId", templateId);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  return parseResponse(response);
};

export const getResumeDownloadUrl = async () => {
  const response = await fetch(`${BASE_URL}/download-url`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
};