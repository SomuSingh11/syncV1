/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ai from "../ai.js";
import type * as chat from "../chat.js";
import type * as departments from "../departments.js";
import type * as http from "../http.js";
import type * as projectConflictChat from "../projectConflictChat.js";
import type * as projectConflicts from "../projectConflicts.js";
import type * as projects from "../projects.js";
import type * as resourceAllocation from "../resourceAllocation.js";
import type * as resourceRequests from "../resourceRequests.js";
import type * as resources from "../resources.js";
import type * as testData from "../testData.js";
import type * as testProjects from "../testProjects.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  chat: typeof chat;
  departments: typeof departments;
  http: typeof http;
  projectConflictChat: typeof projectConflictChat;
  projectConflicts: typeof projectConflicts;
  projects: typeof projects;
  resourceAllocation: typeof resourceAllocation;
  resourceRequests: typeof resourceRequests;
  resources: typeof resources;
  testData: typeof testData;
  testProjects: typeof testProjects;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
