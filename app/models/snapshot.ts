import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode } from '@/types/model';
import type { Brand, Override } from '@/types/utils';
import type {
  PrismaClient,
  Snapshot as SchemaRaw,
} from '@prisma/client';
import { Database } from '@/services/database.server';
import { parseUuid } from '@/utils';

/// Metadata ///

const metadata = {
  displayName: 'スナップショット',
  modelName: 'snapshot',
  primaryKeyName: 'id',
} as const satisfies ModelMetadata<'snapshot'>;

/// Custom Types ///

export type SnapshotId = Brand<'snapshotId', string>;
export const SnapshotId = {
  from: parseUuid<'snapshotId'>,
};

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    id: SnapshotId;
    body: JSON;
  }
>;

interface SchemaResolvedRaw {
}

interface SchemaResolved {
}

/// Model ///

export const __Snapshot = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class Snapshot<_Mode extends ModelMode = M> {
  public static __prisma = client;
  private dbError = Database.dbErrorWith(metadata);
  private models = new Database(client).models;

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: undefined;
  public dataResolved: undefined;

  public constructor(__raw: SchemaRaw, __rawResolved?: SchemaResolvedRaw) {
    this.__raw = __raw;
    this.data = {
      ...__raw,
      id: SnapshotId.from(__raw.id)._unsafeUnwrap(),
      body: JSON.parse(__raw.body),
    };
  }

  public static from(id: SnapshotId): DatabaseResult<Snapshot<'DEFAULT'>> {
    return Database.transformResult(
      client.snapshot.findUniqueOrThrow({
        where: { id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new Snapshot(data));
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<Snapshot> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $Snapshot<M extends ModelMode = 'DEFAULT'> = typeof __Snapshot<M> & ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
