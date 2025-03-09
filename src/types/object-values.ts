/**
 * ObjectValues<T> is a utility type that extracts a union type of all value types in an object
 *
 * For example, in the AppInfo use case:
 * const AppInfo = {
 *   APP_NAME: string,
 *   APP_DESCRIPTION: string,
 *   PRODUCTION: boolean,
 *   VERSION: string
 * } as const
 *
 * type AppInfo = ObjectValues<typeof AppInfo>
 * equals to: type AppInfo = string | boolean
 *
 * How it works:
 * 1. keyof T gets the union of all keys in object T
 * 2. T[keyof T] uses indexed access to get all value types
 *
 * Benefits:
 * - Automatically extracts all possible value types from an object
 * - Makes type definitions more precise and automated
 * - Reduces manual type maintenance work
 */
export type ObjectValues<T> = T[keyof T];
