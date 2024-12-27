import type { Member } from '@/types/member';
import authUserContext from '@/components/AuthtContext';
import PrivateMemberProperties from '@/components/PrivateMemberProperties';
import PublicMemberProperties from '@/components/PublicMemberProperties';
import useEditMember from '@/hooks/useEditMember';
import { useContext, useMemo } from 'react';

interface Props {
  member: Member;
}

export default function MemberEditPage({ member: initMember }: Props) {
  const { member, setPublicProperty, setPrivateProperty } = useEditMember(initMember);
  const user = useContext(authUserContext);

  const disabledProperty = useMemo(() => user?.isAdmin === true ? ['uuid', 'position'] : ['uuid'], [user?.isAdmin]);
  const publicInfo = { ...initMember.public, ...member.public };
  const privateInfo = { ...initMember.private, ...member.private };

  return (
    <>
      <PublicMemberProperties disabledProperty={disabledProperty} editable publicInfo={publicInfo} setProperty={setPublicProperty} />
      <PrivateMemberProperties editable privateInfo={privateInfo} setProperty={setPrivateProperty} />
    </>
  );
}
