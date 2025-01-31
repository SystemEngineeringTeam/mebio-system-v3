import type { ModelMetadata } from '@/types/model';
import type { PartialNullable } from '@/types/utils';
import { __Member } from '@/models/member';
import { __MemberActive } from '@/models/member/active';
import { __MemberActiveExternal } from '@/models/member/active/external';
import { __MemberActiveInternal } from '@/models/member/active/internal';
import { __MemberAlumni } from '@/models/member/alumni';
import { __MemberBase } from '@/models/member/base';
import { __MemberSensitive } from '@/models/member/sensitive';
import { __MemberStatus } from '@/models/member/status';
import { __Payment } from '@/models/payment';
import { clientKnownErrorCode, type DatabaseError, type DatabaseErrorDetail, type PrismaClientError } from '@/types/database';
import { getEntries } from '@/utils';
import { Prisma, type PrismaClient } from '@prisma/client';
import { ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

export class Database {
  public models;

  public constructor(protected client: PrismaClient) {
    this.models = {
      Member: __Member(client),
      member: {
        Status: __MemberStatus(client),
        Base: __MemberBase(client),
        Sensitive: __MemberSensitive(client),
        Active: __MemberActive(client),
        active: {
          Internal: __MemberActiveInternal(client),
          External: __MemberActiveExternal(client),
        },
        Alumni: __MemberAlumni(client),
      },
      Payment: __Payment(client),
    };
  }

  public static createError(
    metadata: ModelMetadata<any, 'CATCH_ALL'>,
    caller: string,
    detail: DatabaseErrorDetail,
    { message, hint }: PartialNullable<{ message: string; hint: string }> = {},
  ): DatabaseError {
    const _default
      = match(detail)
        .returnType<{ message: string; hint?: string }>()
        .with(
          { type: 'PERMISSION_DENIED' },
          ({ _raw: { operator } }) => (
            {
              message: 'この操作は許可されていません',
              hint: `操作者 ${operator.data.id} の権限が不足しています`,
            }
          ),
        )
        .with({ type: 'NO_ROWS_FOUND' }, () => ({ message: `この${metadata.displayName}は見つかりませんでした` }))
        .with({ type: 'ALREADY_EXISTS' }, () => ({ message: `この${metadata.displayName}は既に存在します` }))
        .with({ type: 'DATA_VALIDATION_FAILED' }, () => ({ message: `この${metadata.displayName}のデータが不正です` }))
        .otherwise(() => ({ message: `${metadata.displayName}のデータの処理中にエラーが発生しました` }));

    return {
      metadata,
      caller,
      message: message ?? _default.message,
      hint: hint ?? _default.hint,
      ...detail,
    };
  }

  public static transformError(
    metadata: ModelMetadata<any, 'CATCH_ALL'>,
    caller: string,
    error: unknown,
    { message, hint }: PartialNullable<{ message: string; hint: string }> = {},
  ): DatabaseError {
    const detail
      = match(error)
        .returnType<DatabaseErrorDetail>()
        .when(
          (e) => e instanceof Prisma.PrismaClientKnownRequestError,
          (e) => ({
            type: getEntries(clientKnownErrorCode).find(([, code]) => code === e.code)?.[0] ?? 'UNKNOWN_REQUEST_ERROR',
            _raw: e,
          }),
        )
        .when(
          (e) => e instanceof Prisma.PrismaClientValidationError,
          (e) => ({ type: 'DATA_VALIDATION_FAILED', _raw: e }),
        )
        .when(
          (e) => e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientUnknownRequestError,
          (e) => ({ type: 'UNKNOWN_REQUEST_ERROR', _raw: e }),
        )
        .when(
          (e) => e instanceof Prisma.PrismaClientRustPanicError || e instanceof Prisma.PrismaClientInitializationError,
          (e) => ({ type: 'UNKNOWN_ERROR', _raw: e }),
        )
        .otherwise(
          () => ({ type: 'UNEXPECTED_ERROR', _raw: new Error('Unknown error', { cause: error }) }),
        );

    return Database.createError(metadata, caller, detail, {
      message,
      hint,
    });
  }

  public static unwrapToResponse(error: DatabaseError): never {
    throw new Response(
      error.message,
      {
        status: match(error.type)
          .with('NO_ROWS_FOUND', () => 404)
          .with('ALREADY_EXISTS', () => 409)
          .with('DATA_VALIDATION_FAILED', () => 400)
          .otherwise(() => 500),
      },
    );
  }

  public static transformResult<S>(fn: Promise<S>): ResultAsync<S, PrismaClientError> {
    return ResultAsync.fromPromise(fn, (e) => e as PrismaClientError);
  }

  public static dbErrorWith(metadata: ModelMetadata<any, 'CATCH_ALL'>) {
    type CreateRest = Parameters<typeof Database.createError> extends [any, any, ...infer R] ? R : never;
    type TransformRest = Parameters<typeof Database.transformError> extends [any, any, ...infer R] ? R : never;

    return {
      /**
       * {@link Database.createError} の部分適用.
       * `Model` を継承しているので, 最初の引数を省略できる.
       */
      create: (caller: string) => (...rest: CreateRest) => Database.createError(metadata, caller, ...rest),

      /**
       * {@link Database.transformError} の部分適用.
       * `Model` を継承しているので, 最初の引数を省略できる.
       */
      transform: (caller: string) => (...rest: TransformRest) => Database.transformError(metadata, caller, ...rest),
    };
  }
}
