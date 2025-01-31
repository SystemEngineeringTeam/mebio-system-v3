export type Override<T, U extends { [Key in keyof T]?: unknown }> = Omit<
  T,
  keyof U
> &
U;

export type Entries<T> = Array<
  keyof T extends infer U ? (U extends keyof T ? [U, T[U]] : never) : never
>;

export type ArrayElem<ArrayType extends readonly unknown[]> =
  ArrayType extends ReadonlyArray<infer ElementType> ? ElementType : never;

export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Nullable<T = any> = T | null | undefined;

export type PartialNullable<T> = {
  [K in keyof T]?: Nullable<T[K]>;
};

// ref: https://zenn.dev/ourly_tech_blog/articles/branded_type_20240726#3.-branded-type%E3%81%AE%E5%AE%9F%E8%A3%85%E6%96%B9%E6%B3%95
declare const __brand: unique symbol;
export type Brand<K, T> = K & { [__brand]: T };

// ref: https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
