import { useSelector } from "react-redux";

const useAuth = () => {
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = Boolean(user);

  return { user, isLoggedIn };
};

export default useAuth;
