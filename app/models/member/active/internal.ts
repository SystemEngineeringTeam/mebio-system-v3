import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelSchemaRawOf, ModeWithDefault, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberActiveInternal as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { includeKeys2select, matchWithDefault, matchWithResolved } from '@/utils/model';
import { z } from 'zod';

/// Metadata ///

const metadata = {
  displayName: '現役部員 (内部) の情報',
  modelName: 'memberActiveInternal',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberActiveInternal'>;

/// Custom Types ///

const ROLE = ['CHAIRPERSON', 'VICE_CHAIRPERSON', 'TREASURER', 'GENERAL_AFFAIRS', 'PUBLIC_RELATIONS', 'SECRETARY', 'TREASURER_ASSISTANT', 'GENERAL_AFFAIRS_ASSISTANT', 'PUBLIC_RELATIONS_ASSISTANT', 'SECRETARY_ASSISTANT'] as const;
const zRole = z.enum(ROLE);
type Role = ArrayElem<typeof ROLE>;

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    role: Role;
  }
>;

type IncludeKey = keyof Prisma.MemberActiveInternalInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
}

interface SchemaResolved {
  _parent: {
    Member: () => ModelEntityOf<$Member>;
  };
}

/// Model ///

export const __MemberActiveInternal = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberActiveInternal<Mode extends ModelMode = M> {
  public static __prisma = client;
  private dbError = Database.dbErrorWith(metadata);
  private models = new Database(client).models;

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  public dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  public constructor(__raw: SchemaRaw, __rawResolved?: SchemaResolvedRaw) {
    this.__raw = __raw;
    this.data = {
      ...__raw,
      memberId: MemberId.from(__raw.memberId)._unsafeUnwrap(),
      role: zRole.parse(__raw.role),
    };

    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _parent: {
          Member: () => new this.models.Member(r.Member),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static from(id: MemberId): DatabaseResult<MemberActiveInternal<'DEFAULT'>> {
    return Database.transformResult(
      client.memberActiveInternal.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new MemberActiveInternal(data));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<MemberActiveInternal<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.memberActiveInternal.findUniqueOrThrow({
        where: { memberId: id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(({ Member, ...rest }) => new MemberActiveInternal(rest, { Member: Member! }));
  }

  public resolveRelation(): ModeWithDefault<Mode, DatabaseResult<MemberActiveInternal<'WITH_RESOLVED'>>> {
    return matchWithDefault(
      this.__rawResolved,
      () => Database.transformResult(
        client.memberActiveInternal.findUniqueOrThrow({
          where: { memberId: this.data.memberId },
          include: includeKeys2select(includeKeys),
        }),
      )
        .mapErr(this.dbError.transform('resolveRelation'))
        .map(({ Member, ...rest }) => new MemberActiveInternal(rest, { Member: Member! })),
    );
  }

  public update(_operator: ModelEntityOf<ModelEntityOf<$Member>>, _data: Partial<Schema>): DatabaseResult<MemberActiveInternal> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<ModelEntityOf<$Member>>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $MemberActiveInternal<M extends ModelMode = 'DEFAULT'> = typeof __MemberActiveInternal<M> & ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
