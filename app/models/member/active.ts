import type { $Member } from '@/models/member';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Nullable, Override } from '@/types/utils';
import type { MemberDetailActive } from '@/utils/member';
import type {
  PrismaClient,
  MemberActive as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { toMemberDetailActive } from '@/utils/member';
import { includeKeys2select, matchWithResolved } from '@/utils/model';
import { ResultAsync } from 'neverthrow';
import { z } from 'zod';

/// Metadata ///

const metadata = {
  displayName: '現役部員の情報',
  modelName: 'memberActive',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberActive'>;

/// Custom Types ///

export const GRADES = ['B1', 'B2', 'B3', 'B4', 'M1', 'M2', 'D1', 'D2', 'D3'] as const;
export const zGrades = z.enum(GRADES);
export type Grade = ArrayElem<typeof GRADES>;

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    grade: Grade;
  }
>;

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
  MemberActiveInternal: Nullable<ModelSchemaRawOf<$MemberActiveInternal>>;
  MemberActiveExternal: Nullable<ModelSchemaRawOf<$MemberActiveExternal>>;
}

type SchemaResolved = {
  _parent: {
    Member: ModelEntityOf<$Member>;
  };
} & MemberDetailActive;

/// Model ///

export const __MemberActive = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberActive<Mode extends ModelMode = M> {
  public static __prisma = client;
  private dbError = Database.dbErrorWith(metadata);
  private models = new Database(client).models;

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  public dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  public constructor(__raw: SchemaRaw, __rawResolved?: ModeWithResolved<Mode, SchemaResolvedRaw>) {
    this.__raw = __raw;
    this.data = {
      ...__raw,
      memberId: MemberId.from(__raw.memberId)._unsafeUnwrap(),
      grade: zGrades.parse(__raw.grade),
    };

    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _parent: {
          Member: new this.models.Member(r.Member),
        },
        ...toMemberDetailActive(client, { MemberActiveInternal: r.MemberActiveInternal, MemberActiveExternal: r.MemberActiveExternal }),
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static from(id: MemberId): DatabaseResult<MemberActive<'DEFAULT'>> {
    return Database.transformResult(
      client.memberActive.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new MemberActive(data));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<MemberActive<'WITH_RESOLVED'>> {
    return ResultAsync.combine([
      Database.transformResult(
        client.memberActive.findUniqueOrThrow({
          where: { memberId: id },
        }),
      ),
      Database.transformResult(
        client.member.findUniqueOrThrow({
          where: { id },
          include: includeKeys2select(['MemberActiveInternal', 'MemberActiveExternal']),
        }),
      ),
    ])
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(
        (
          [memberActive, { MemberActiveInternal, MemberActiveExternal, ...Member }],
        ) => new MemberActive(
          memberActive,
          { Member, MemberActiveInternal, MemberActiveExternal },
        ),
      );
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<MemberActive> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $MemberActive<M extends ModelMode = 'DEFAULT'> = typeof __MemberActive<M> & ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
