import GroupCrumbs from '@/components/group-view/breadcrumbs';
import { fetchGroupUsers, getGroupById, fetchUsers } from '@/lib/data';
import EditGroupForm from '../../../components/groups/edit-group-form';

type Props = { params: { id: string } };

async function Page({ params }: Props) {
  const group_id = params.id;
  const group = await getGroupById(group_id);
  const users = await fetchUsers();
  const groupUsers = await fetchGroupUsers(group_id);
  // console.log(groupUsers);
  return (
    <div className='flex flex-col p-3 gap-3 h-full last:mt-auto'>
      <GroupCrumbs name={group?.name} />
      <div>Group name: {group?.name}</div>
      <EditGroupForm users={users} groupUsers={groupUsers} />
    </div>
  );
}

export default Page;
