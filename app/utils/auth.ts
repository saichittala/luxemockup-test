// ---- app/utils/auth.ts ----
export const VALID_EMAIL = "sai.chittala@gmail.com";

export const login = (email: string) => {
  if (email === VALID_EMAIL) {
    if (typeof window !== "undefined") {
      localStorage.setItem("loggedIn", "true");
    }
    return true;
  }
  return false;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("loggedIn");
  }
};

export const isLoggedIn = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("loggedIn") === "true";
  }
  return false;
};