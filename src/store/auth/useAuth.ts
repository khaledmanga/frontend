import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../rootReducer";
import type { AppDispatch } from "../store";
import {
  loginRequest,
  logoutRequest,
  registerRequest,
} from "./authActions";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  return {
    ...auth,
    login: (email: string, password: string) =>
      dispatch(loginRequest(email, password)),
    register: (name: string, email: string, password: string) =>
      dispatch(registerRequest(name, email, password)),
    logout: () => dispatch(logoutRequest()),
  };
}
