import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelSchemaRawOf, ModeWithDefault, ModeWithResolved } from '@/types/model';
import type { Brand, Nullable, Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  Payment as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { parseUuid } from '@/utils';
import { includeKeys2select, matchWithDefault, matchWithResolved } from '@/utils/model';

/// Metadata ///

const metadata = {
  displayName: '支払い',
  modelName: 'payment',
  primaryKeyName: 'id',
} as const satisfies ModelMetadata<'payment'>;

/// Custom Types ///

type PaymentId = Brand<'payment', string>;
const PaymentId = {
  from: parseUuid<'payment'>,
};

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    id: PaymentId;
    payerId: MemberId;
    receiverId: MemberId;
    approverId: Nullable<MemberId>;
  }
>;

type IncludeKey = keyof Prisma.PaymentInclude;
const includeKeys = ['MemberAsPayer', 'MemberAsReceiver', 'MemberAsApprover'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Payer: ModelSchemaRawOf<$Member>;
  Receiver: ModelSchemaRawOf<$Member>;
  Approver: Nullable<ModelSchemaRawOf<$Member>>;
}

interface SchemaResolved {
  member: {
    Payer: () => ModelEntityOf<$Member>;
    Receiver: () => ModelEntityOf<$Member>;
    Approver: () => Nullable<ModelEntityOf<$Member>>;
  };
}

/// Model ///

export const __Payment = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class Payment<Mode extends ModelMode = M> {
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
      id: PaymentId.from(__raw.id)._unsafeUnwrap(),
      payerId: MemberId.from(__raw.payerId)._unsafeUnwrap(),
      receiverId: MemberId.from(__raw.receiverId)._unsafeUnwrap(),
      approverId: __raw.approverId != null ? MemberId.from(__raw.approverId)._unsafeUnwrap() : null,
    };

    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        member: {
          Payer: () => new this.models.Member(r.Payer),
          Receiver: () => new this.models.Member(r.Receiver),
          Approver: () => r.Approver != null ? new this.models.Member(r.Approver) : null,
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static from(id: PaymentId): DatabaseResult<Payment<'DEFAULT'>> {
    return Database.transformResult(
      client.payment.findUniqueOrThrow({
        where: { id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new Payment(data));
  }

  public static fromWithResolved(id: PaymentId): DatabaseResult<Payment<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.payment.findUniqueOrThrow({
        where: { id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map((
        { MemberAsApprover, MemberAsPayer, MemberAsReceiver, ...rest },
      ) => new Payment(rest, { Payer: MemberAsPayer, Receiver: MemberAsReceiver, Approver: MemberAsApprover }));
  }

  public resolveRelation(): ModeWithDefault<Mode, DatabaseResult<Payment<'WITH_RESOLVED'>>> {
    return matchWithDefault(
      this.__rawResolved,
      () => Database.transformResult(
        client.payment.findUniqueOrThrow({
          where: { id: this.data.id },
          include: includeKeys2select(includeKeys),
        }),
      )
        .mapErr(Database.dbErrorWith(metadata).transform('resolveRelation'))
        .map(
          (
            { MemberAsApprover, MemberAsPayer, MemberAsReceiver, ...rest },
          ) => new Payment(
            rest,
            { Payer: MemberAsPayer, Receiver: MemberAsReceiver, Approver: MemberAsApprover },
          ),
        ),
    );
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<Payment> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}
) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $Payment<M extends ModelMode = 'DEFAULT'> = typeof __Payment<M> & ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
