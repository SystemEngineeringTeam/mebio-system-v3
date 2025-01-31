import type { Brand, Entries } from '@/types/utils';
import type { Result } from 'neverthrow';
import type { ZodError } from 'zod';
import { TYPES } from '@/consts/member';
import { err, ok } from 'neverthrow';
import { string } from 'zod';

export function toTypeName(key: string) {
  const type = TYPES.find((t) => t.key === key);
  return type?.name;
}

export function toUncapitalize<T extends string>(str: T): Uncapitalize<T> {
  return str.charAt(0).toLowerCase() + str.slice(1) as Uncapitalize<T>;
}

export function toBrand<T extends string>(str: string): Brand<T, string> {
  return str as Brand<T, string>;
}

export function parseUuid<K extends string>(uuid: string): Result<Brand<K, string>, ZodError<string>> {
  const zUuid = string().uuid();
  const { success, data, error } = zUuid.safeParse(uuid);

  if (!success) {
    return err(error);
  }

  return ok(data as Brand<K, string>);
}

export async function waitMs(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getKeys<T extends Record<string, unknown>>(
  obj: T,
): Array<keyof T> {
  return Object.keys(obj);
}
export function getValues<T extends Record<string, any>>(
  obj: T,
): Array<T[keyof T]> {
  return Object.values(obj);
}
export function getEntries<T extends Record<string, unknown>>(
  obj: T,
): Entries<T> {
  return Object.entries(obj) as Entries<T>;
}
export function fromEntries<T extends Record<string, unknown>>(
  entries: Entries<T>,
): T {
  return Object.fromEntries(entries) as T;
}
