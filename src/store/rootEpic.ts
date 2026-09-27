import { combineEpics } from "redux-observable";
import {
  loginEpic,
  logoutEpic,
  registerEpic,
  sessionCheckEpic,
} from "./auth/authEpics";

export const rootEpic = combineEpics(
  loginEpic,
  registerEpic,
  sessionCheckEpic,
  logoutEpic,
);
