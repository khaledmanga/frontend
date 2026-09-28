import { applyMiddleware, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import type { AuthAction } from "@/@types/auth";
import { rootEpic } from "./rootEpic";
import { type RootState, rootReducer } from "@/reducer/rootReducer";

const epicMiddleware = createEpicMiddleware<
  AuthAction,
  AuthAction,
  RootState
>();

export const store = createStore<RootState, AuthAction>(
  rootReducer,
  applyMiddleware(epicMiddleware),
);
epicMiddleware.run(rootEpic);
export type AppDispatch = typeof store.dispatch;
