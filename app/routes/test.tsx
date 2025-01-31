import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { useLoaderData } from '@remix-run/react';

export async function loader({ context }: LoaderFunctionArgs) {
  const { Member } = context.db.models;

  // Actions の request とかから持ってくる
  const memberIdInput = '0188c0f2-8e47-11ec-b909-0242ac120002';

  const memberId = MemberId
    // 文字列か & UUID かは Zod が確認してくれる.
    .from(memberIdInput)
    // UUID ですらないカスの文字列かもしれないので...
    .match(
      // OK のとき. そのまま返しても, ここで加工してもおｋ.
      (id) => id,
      // Err のとき. ここでエラーハンドリングをする. コールバックの引数には型付きエラーが入っている. 別に使わなくても良い.
      () => {
        throw new Response('不正な部員 ID です', { status: 400 });
      },
    );

  const member = await Member
    // そのモデルの主キーからモデルを取得する (全モデル共通)
    .from(memberId)
    // これもエラー起きるかもなので...
    .match(
      // OK のとき. そのまま返しても, ここで加工してもおｋ
      (m) => m,
      // ここでエラーハンドリングをする.  コールバックの引数は全モデル共通の DatabaseError である.
      // 毎回 DatabaseError ごとに, Response を当てるのは面倒なので, `unwrapToResponse` というメソッドを用意したよ.
      // 本当は (e) => Database.unwrapToResponse(e) だけど, 以下のように Tear-off できる.
      Database.unwrapToResponse,
    );

  // `match` を書かなければ `member` は `Result<Member, DatabaseError>` になるので, フロント側でエラーハンドリングしても良いと思います.
  /* ちなみに, `match` が慣れなければ, if 使ってもおｋです.

    const member = await Member.from(memberId);

    if (member.isErr()) {
      throw Database.unwrapToResponse(member.error);
    }

    return { member: member.value.data };

  */

  return { member: member.data };
}

export default function Index() {
  const { member } = useLoaderData<typeof loader>();

  return (
    <div>
      <div>test</div>
      <textarea
        defaultValue={JSON.stringify(member, null, 2)}
        style={{
          width: '100%',
          minHeight: '10lh',
          // @ts-expect-error お NEW なプロパティ
          fieldSizing: 'content',
        }}
      />
    </div>
  );
}
