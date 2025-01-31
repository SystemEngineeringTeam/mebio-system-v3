import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberActiveExternal as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { includeKeys2select, matchWithResolved } from '@/utils/model';

/// Metadata ///

const metadata = {
  displayName: '現役部員 (外部) の情報',
  modelName: 'memberActiveExternal',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberActiveExternal'>;

/// Custom Types ///

/* TODO */

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
  }
>;

type IncludeKey = keyof Prisma.MemberActiveExternalInclude;
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

export const __MemberActiveExternal = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberActiveExternal<Mode extends ModelMode = M> {
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

  public static from(id: MemberId): DatabaseResult<MemberActiveExternal<'DEFAULT'>> {
    return Database.transformResult(
      client.memberActiveExternal.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new MemberActiveExternal(data));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<MemberActiveExternal<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.memberActiveExternal.findUniqueOrThrow({
        where: { memberId: id },
        // TODO: `MemberBase` と `Member` を一緒に JOIN する書き方を考える.  一旦, 1:1 の `Member` だけ include.
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(({ Member, ...rest }) => new MemberActiveExternal(rest, { Member: Member! }));
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<MemberActiveExternal> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }

  public static hoge() { }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $MemberActiveExternal<M extends ModelMode = 'DEFAULT'> = typeof __MemberActiveExternal<M> & ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
