import type { DatabaseResult } from '@/types/database';
import type { Prisma, PrismaClient } from '@prisma/client';

export interface ModelMetadata<
  M extends Uncapitalize<Prisma.ModelName>,
  V extends 'CATCH_ALL' | 'DEFAULT' = 'DEFAULT',
> {
  modelName: M;
  displayName: string;
  primaryKeyName: V extends 'CATCH_ALL' ? any : keyof PrismaClient[M]['fields'];
}

export type ModelMode = 'DEFAULT' | 'WITH_RESOLVED';
export type ModeWithDefault<Mode extends ModelMode, T> = Mode extends 'DEFAULT' ? T : never;
export type ModeWithResolved<Mode extends ModelMode, T> = Mode extends 'WITH_RESOLVED' ? T : undefined;

export interface Model<
  Mode extends ModelMode,
  _Metadata extends NoInfer<ModelMetadata<any, 'CATCH_ALL'>>,
  SchemaRaw,
  Schema,
  SchemaResolvedRaw,
  SchemaResolved,
> {
  __raw: SchemaRaw;
  data: Schema;
  __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  resolveRelation?: () => DatabaseResult<unknown>;
  update?: (...args: any[]) => DatabaseResult<AnyModel>;
  delete?: (...args: any[]) => DatabaseResult<void>;
}

/**
 * __M = (client) => M のときの M
 */
export type ModelGenerator<
  Mode extends ModelMode,
  Metadata extends ModelMetadata<any, 'CATCH_ALL'>,
  SchemaRaw,
  Schema,
  SchemaResolvedRaw,
  SchemaResolved,
> = (client: PrismaClient) => {
  new(__raw: SchemaRaw, __rawResolved?: ModeWithResolved<Mode, any>): Model<Mode, Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

  // static methods //

  __prisma: PrismaClient;
  from: (id: any) => DatabaseResult<Model<'DEFAULT', Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>;
  fromWithResolved?: (id: any) => DatabaseResult<Model<'WITH_RESOLVED', Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>;
};

export type AnyModelGenerator = ModelGenerator<any, ModelMetadata<any, 'CATCH_ALL'>, any, any, any, any>;
export type AnyModel = Model<any, ModelMetadata<any, 'CATCH_ALL'>, any, any, any, any>;

/**
 * __M = (client) => M のときの M のインスタンス
 * ただし, M 単体のときでも適用可能
 */
export type ModelEntityOf<T>
  = T extends AnyModelGenerator
    ? InstanceType<ReturnType<T>>
    : T extends AnyModel
      ? T
      : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw> のときの Mode
 */
export type ModelModeOf<T>
  = T extends ModelGenerator<infer M, any, any, any, any, any>
    ? M
    : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw> のときの Metadata
 */
export type ModelMetadataOf<T>
  = T extends ModelGenerator<any, infer M, any, any, any, any>
    ? M
    : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw> のときの SchemaRaw
 */
export type ModelSchemaRawOf<T>
  = T extends ModelGenerator<any, any, infer SR, any, any, any>
    ? SR
    : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw, Schema> のときの Schema
 */
export type ModelSchemaOf<T>
  = T extends ModelGenerator<any, any, any, infer S, any, any>
    ? S
    : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw, Schema, SchemaResolvedRaw> のときの S
 */
export type ModelSchemaResolvedRawOf<T>
  = T extends ModelGenerator<any, any, any, any, infer RR, any>
    ? RR
    : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved> のときの S
 */
export type ModelSchemaResolvedOf<T>
  = T extends ModelGenerator<any, any, any, any, any, infer R>
    ? R
    : never;
