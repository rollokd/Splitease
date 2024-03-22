import GroupCrumbs from '@/components/group-view/breadcrumbs';
import { fetchGroupUsers, getGroupById, fetchUsers } from '@/lib/data';
import EditGroupForm from '@/components/groups/edit-group-form';
import { getUserId } from '@/lib/actions';

type Props = { params: { id: string } };

async function Page({ params }: Props) {
  const group_id = params.id;
  const group = await getGroupById(group_id);
  const users = await fetchUsers();
  const groupUsers = await fetchGroupUsers(group_id);
  const userID = (await getUserId()) as string;
  return (
    <div className='flex flex-col p-3 gap-3 h-full last:mt-auto'>
      <strong className='gap-3 mb-4 mt-2 p-3'>
        <GroupCrumbs name={group?.name} group_id={group_id} type='edit' />
      </strong>
      <EditGroupForm users={users} groupUsers={groupUsers} userID={userID} />
    </div>
  );
}

export default Page;
