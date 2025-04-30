export const TableHeadLg = () => {
  return (
    <thead>
      <tr className='bg-gray-200'>
        <th className='border p-2 text-center'>Title</th>
        <th className='border p-2 text-center'>Mode</th>
        <th className='border p-2 text-center'>Assigned user</th>
        <th className='border p-2 text-center'>Activation date</th>
        <th className='border p-2 text-center'></th> {/* Edit */}
        <th className='border p-2 text-center'></th> {/* Delete */}
      </tr>
    </thead>
  );
};
