import { useTitle } from '@/hooks/useTitle.hook';

import { Heading, SearchAndFilterTrigger } from './components';

export const ViewAllPage = () => {
  useTitle('All Programs');

  return (
    <>
      <Heading />
      <SearchAndFilterTrigger />

      <div className='flex flex-col lg:flex-row'></div>
    </>
  );
};
