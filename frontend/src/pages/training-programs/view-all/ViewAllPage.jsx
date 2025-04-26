import { useTitle } from '@/hooks/useTitle.hook';

import { Heading, SearchAndFilters } from './components';

export const ViewAllPage = () => {
  useTitle('All Programs');

  return (
    <>
      <Heading />
      <SearchAndFilters />

      <div className='flex flex-col lg:flex-row'></div>
    </>
  );
};
