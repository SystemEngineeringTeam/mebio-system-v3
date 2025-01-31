import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberStatus as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { includeKeys2select, matchWithResolved } from '@/utils/model';

/// Metadata ///

const metadata = {
  displayName: '部員のステータス',
  modelName: 'memberStatus',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberStatus'>;

/// Custom Types ///

/* TODO */

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    updatedHasDeletedById: MemberId;
    updatedLastRenewalDateById: MemberId;
  }
>;

type IncludeKey = keyof Prisma.MemberStatusInclude;
const includeKeys = ['Member', 'UpdatedHasDeletedBy', 'UpdatedLastRenewalDateBy'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
  UpdatedHasDeletedBy: ModelSchemaRawOf<$Member>;
  UpdatedLastRenewalDateBy: ModelSchemaRawOf<$Member>;
}

interface SchemaResolved {
  _parent: {
    Member: ModelEntityOf<$Member>;
  };
  updaterTo: {
    hasDeleted: ModelEntityOf<$Member>;
    lastRenewalDate: ModelEntityOf<$Member>;
  };
}

/// Model ///

export const __MemberStatus = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberStatus<Mode extends ModelMode = M> {
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
      updatedHasDeletedById: MemberId.from(__raw.updatedHasDeletedById)._unsafeUnwrap(),
      updatedLastRenewalDateById: MemberId.from(__raw.updatedLastRenewalDateById)._unsafeUnwrap(),
    };

    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _parent: {
          Member: new this.models.Member(r.Member),
        },
        updaterTo: {
          hasDeleted: new this.models.Member(r.UpdatedHasDeletedBy),
          lastRenewalDate: new this.models.Member(r.UpdatedLastRenewalDateBy),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static from(id: MemberId): DatabaseResult<MemberStatus<'DEFAULT'>> {
    return Database.transformResult(
      client.memberStatus.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new MemberStatus(data));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<MemberStatus<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.memberStatus.findUniqueOrThrow({
        where: { memberId: id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(
        (
          { Member, UpdatedHasDeletedBy, UpdatedLastRenewalDateBy, ...rest },
        ) => new MemberStatus(
          rest,
          { Member: Member!, UpdatedHasDeletedBy: UpdatedHasDeletedBy!, UpdatedLastRenewalDateBy: UpdatedLastRenewalDateBy! },
        ),
      );
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<MemberStatus<'DEFAULT'>> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $MemberStatus<M extends ModelMode = 'DEFAULT'> = typeof __MemberStatus<M> & ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
