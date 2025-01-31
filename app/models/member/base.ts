import type { $Member } from '@/models/member';
import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { $MemberSensitive } from '@/models/member/sensitive';
import type { $MemberStatus } from '@/models/member/status';
import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { Nullable, Override } from '@/types/utils';
import type { MemberDetail } from '@/utils/member';
import type {
  PrismaClient,
  MemberBase as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { toMemberDetail } from '@/utils/member';
import { includeKeys2select, matchWithResolved } from '@/utils/model';
import { ResultAsync } from 'neverthrow';

/// Metadata ///

const metadata = {
  displayName: '部員の基本情報',
  modelName: 'memberBase',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberBase'>;

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    iconUrl: URL;
  }
>;

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
  MemberStatus: ModelSchemaRawOf<$MemberStatus>;
  MemberSensitive: ModelSchemaRawOf<$MemberSensitive>;
  MemberActive: Nullable<ModelSchemaRawOf<$MemberActive>>;
  MemberActiveInternal: Nullable<ModelSchemaRawOf<$MemberActiveInternal>>;
  MemberActiveExternal: Nullable<ModelSchemaRawOf<$MemberActiveExternal>>;
  MemberAlumni: Nullable<ModelSchemaRawOf<$MemberAlumni>>;
}

interface SchemaResolved {
  _parent: {
    Member: () => ModelEntityOf<$Member>;
  };
  member: {
    Status: () => ModelEntityOf<$MemberStatus>;
    Sensitive: () => ModelEntityOf<$MemberSensitive>;
    detail: MemberDetail;
  };
}

/// Model ///

export const __MemberBase = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberBase<Mode extends ModelMode = M> {
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
      iconUrl: new URL(__raw.iconUrl),
    };

    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _parent: {
          Member: () => new this.models.Member(r.Member),
        },
        member: {
          Status: () => new this.models.member.Status(r.MemberStatus),
          Sensitive: () => new this.models.member.Sensitive(r.MemberSensitive),
          detail: toMemberDetail(client, { MemberActive: r.MemberActive, MemberActiveInternal: r.MemberActiveInternal, MemberActiveExternal: r.MemberActiveExternal, MemberAlumni: r.MemberAlumni }),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static from(id: MemberId): DatabaseResult<MemberBase<'DEFAULT'>> {
    return Database.transformResult(
      client.memberBase.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new MemberBase(data));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<MemberBase<'WITH_RESOLVED'>> {
    return ResultAsync.combine([
      Database.transformResult(
        client.memberBase.findUniqueOrThrow({
          where: { memberId: id },
        }),
      ),
      Database.transformResult(
        client.member.findUniqueOrThrow({
          where: { id },
          include: includeKeys2select(['MemberStatus', 'MemberSensitive', 'MemberActive', 'MemberActiveInternal', 'MemberActiveExternal', 'MemberAlumni']),
        }),
      ),
    ])
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map((
        [memberBase, { MemberStatus, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, ...Member }],
      ) => new MemberBase(
        memberBase,
        { Member, MemberStatus: MemberStatus!, MemberSensitive: MemberSensitive!, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni },
      ));
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<MemberBase> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }

  public hoge() { }
}
) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $MemberBase<M extends ModelMode = 'DEFAULT'> = typeof __MemberBase<M> & ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
