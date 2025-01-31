import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { $MemberBase } from '@/models/member/base';
import type { $MemberSensitive } from '@/models/member/sensitive';
import type { $MemberStatus } from '@/models/member/status';
import type { $Payment } from '@/models/payment';
import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelSchemaRawOf, ModeWithDefault, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Brand, Nullable, Override } from '@/types/utils';
import type { MemberDetail } from '@/utils/member';
import type {
  Prisma,
  PrismaClient,
  Member as SchemaRaw,
} from '@prisma/client';
import { Database } from '@/services/database.server';
import { parseUuid, toBrand } from '@/utils';
import { toMemberDetail } from '@/utils/member';
import { includeKeys2select, matchWithDefault, matchWithResolved } from '@/utils/model';
import { errAsync } from 'neverthrow';
import { z } from 'zod';

/// Metadata ///

const metadata = {
  displayName: '部員',
  modelName: 'member',
  primaryKeyName: 'id',
} as const satisfies ModelMetadata<'member'>;

/// Custom Types ///

export type MemberId = Brand<'memberId', string>;
export const MemberId = {
  from: parseUuid<'memberId'>,
};

export type Subject = Brand<'subject', string>;
export const Subject = {
  from: toBrand<'subject'>,
};

/**
 * セキュリティーロール – 上に行くほど権限が強いです.
 */
export const SECURITY_ROLE = [
  'DEFAULT',
  'MEMBER',
  'READ',
  'PAYMENT_APPROVE',
  'OWNER',
] as const;
const zSecurityRoles = z.enum(SECURITY_ROLE);
type SecurityRole = ArrayElem<typeof SECURITY_ROLE>;

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    id: MemberId;
    subject: Subject;
    securityRole: SecurityRole;
  }
>;

type IncludeKey = keyof Prisma.MemberInclude;
const includeKeys = ['MemberBase', 'MemberSensitive', 'MemberActive', 'MemberActiveInternal', 'MemberActiveExternal', 'MemberAlumni', 'MemberStatus', 'MemberStatusAsUpdaterToHasDeleted', 'MemberStatusAsUpdaterToLastRenewalDate', 'PaymentAsPayer', 'PaymentAsReceiver', 'PaymentAsApprover'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  MemberBase: ModelSchemaRawOf<$MemberBase>;
  MemberStatus: ModelSchemaRawOf<$MemberStatus>;
  MemberSensitive: ModelSchemaRawOf<$MemberSensitive>;
  MemberActive: Nullable<ModelSchemaRawOf<$MemberActive>>;
  MemberActiveInternal: Nullable<ModelSchemaRawOf<$MemberActiveInternal>>;
  MemberActiveExternal: Nullable<ModelSchemaRawOf<$MemberActiveExternal>>;
  MemberAlumni: Nullable<ModelSchemaRawOf<$MemberAlumni>>;
  MemberStatusAsUpdaterToHasDeleted: Array<ModelSchemaRawOf<$MemberStatus>>;
  MemberStatusAsUpdaterToLastRenewalDate: Array<ModelSchemaRawOf<$MemberStatus>>;
  PaymentAsPayer: Array<ModelSchemaRawOf<$Payment>>;
  PaymentAsReceiver: Array<ModelSchemaRawOf<$Payment>>;
  PaymentAsApprover: Array<ModelSchemaRawOf<$Payment>>;
}

interface SchemaResolved {
  _referenced: {
    paymentsAs: {
      Payer: () => Array<ModelEntityOf<$Payment>>;
      Receiver: () => Array<ModelEntityOf<$Payment>>;
      Approver: () => Array<ModelEntityOf<$Payment>>;
    };
    memberStatusAsUpdaterTo: {
      HasDeleted: () => Array<ModelEntityOf<$MemberStatus>>;
      LastRenewalDate: () => Array<ModelEntityOf<$MemberStatus>>;
    };
  };
  member: {
    Status: () => ModelEntityOf<$MemberStatus>;
    Base: () => ModelEntityOf<$MemberBase>;
    Sensitive: () => ModelEntityOf<$MemberSensitive>;
    detail: MemberDetail;
  };
}

/// Model ///

export const __Member = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class Member<Mode extends ModelMode = M> {
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
      id: MemberId.from(__raw.id)._unsafeUnwrap(),
      subject: Subject.from(__raw.subject),
      securityRole: zSecurityRoles.parse(__raw.securityRole),
    };

    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _referenced: {
          paymentsAs: {
            // `map` のコールバックを Tear-off しようとしたそこのキミ！  このコンストラクターはオーバーロードされていて複数受け入れるから無理なんだな.
            Payer: () => r.PaymentAsPayer.map((p) => new this.models.Payment(p)),
            Receiver: () => r.PaymentAsReceiver.map((p) => new this.models.Payment(p)),
            Approver: () => r.PaymentAsApprover.map((p) => new this.models.Payment(p)),
          },
          memberStatusAsUpdaterTo: {
            HasDeleted: () => r.MemberStatusAsUpdaterToHasDeleted.map((m) => new this.models.member.Status(m)),
            LastRenewalDate: () => r.MemberStatusAsUpdaterToLastRenewalDate.map((m) => new this.models.member.Status(m)),
          },
        },
        member: {
          Base: () => new this.models.member.Base(r.MemberBase),
          Status: () => new this.models.member.Status(r.MemberStatus),
          Sensitive: () => new this.models.member.Sensitive(r.MemberSensitive),
          detail: toMemberDetail(client, { MemberAlumni: r.MemberAlumni, MemberActive: r.MemberActive, MemberActiveExternal: r.MemberActiveExternal, MemberActiveInternal: r.MemberActiveInternal }),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static from(id: MemberId): DatabaseResult<Member<'DEFAULT'>> {
    return Database.transformResult(
      client.member.findUniqueOrThrow({
        where: { id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new Member(data));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<Member<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.member.findUniqueOrThrow({
        where: { id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(
        (
          { MemberStatus, MemberBase, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover, ...rest },
        ) => new Member(
          rest,
          { MemberStatus: MemberStatus!, MemberBase: MemberBase!, MemberSensitive: MemberSensitive!, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover },
        ),
      );
  }

  public resolveRelation(): ModeWithDefault<Mode, DatabaseResult<Member<'WITH_RESOLVED'>>> {
    return matchWithDefault(
      this.__rawResolved,
      () => Database.transformResult(
        client.member.findUniqueOrThrow({
          where: { id: this.data.id },
          include: includeKeys2select(includeKeys),
        }),
      )
        .mapErr(this.dbError.transform('resolveRelation'))
        .map(
          (
            { MemberBase, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatus, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover, ...rest },
          ) => new Member(
            rest,
            { MemberBase: MemberBase!, MemberSensitive: MemberSensitive!, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatus: MemberStatus!, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover },
          ),
        ),
    );
  }

  public update(operator: Member<'DEFAULT'>, data: Partial<Schema>): DatabaseResult<Member> {
    // TODO: 後で権限ロジックの外部化をする
    if (operator.data.securityRole !== 'OWNER') {
      return errAsync(this.dbError.create('update')({
        type: 'PERMISSION_DENIED',
        _raw: { operator },
      }));
    }

    return Database.transformResult(
      client.member.update({ data, where: { id: this.data.id } }),
    )
      .mapErr(this.dbError.transform('update'))
      .map((m) => new Member(m));
  }

  public delete(_operator: Member): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $Member<M extends ModelMode = 'DEFAULT'> = typeof __Member<M> & ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
