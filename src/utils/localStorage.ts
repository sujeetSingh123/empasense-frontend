
const tokenKey = "empasenseToken";

const refreshTokenKey = "empasenseRefreshToken";


export const setToken = (token: string) => {
  localStorage.setItem(tokenKey, token);
};




export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem(refreshTokenKey, refreshToken);
};



export const getToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(tokenKey);
};

export const getLocalStorageRefreshToken = () => {
  const token = localStorage.getItem(refreshTokenKey);

  return token;
};

export const clearStorage = () => {
  localStorage.clear();
};

