import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext();

const readStoredAuth = () => {
  try {
    const rawUser = localStorage.getItem("user");
    const rawToken = localStorage.getItem("token");

    if (!rawUser || !rawToken) {
      return { user: null, token: null };
    }

    return {
      user: JSON.parse(rawUser),
      token: rawToken,
    };
  } catch {
    return { user: null, token: null };
  }
};

export const AuthProvider = ({
  children,
}) => {
  const [{ user, token }, setAuthState] = useState(
    readStoredAuth
  );

  useEffect(() => {
    if (user && token) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
      localStorage.setItem("token", token);
      return;
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, [user, token]);

  const login = (userData) => {
    const nextUser = { ...userData };
    const nextToken = nextUser.token;

    setAuthState({
      user: nextUser,
      token: nextToken,
    });
  };

  const logout = () => {
    setAuthState({
      user: null,
      token: null,
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "admin",
      login,
      logout,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);