import { useState, useEffect } from 'react';

import { Heading, SearchAndFilterTrigger } from './components';
import { fetchTrainingProgramData } from './helpersViewAll';
import {
  ActionButton,
  MobileTabs,
  MobileTabVariant,
} from '@/components/buttons';
import { useTitle } from '@/hooks';
import { Pill, Spinner } from '@/components/common';
import { capitalize, toUtcMidnightDateString } from '@/utils';
import { Table } from '@/components/table';
import { useNavigate } from 'react-router-dom';

const INITIAL_OFFSET = 0;
const ITEMS_PER_PAGE = 10;
export const defaultViewAllFilters = {
  searchQuery: '',
  filterMode: null,
  filterUser: null,
  filterStatus: null,
  filterStartDate: null,
  filterEndDate: null,
};
const defaultPagination = {
  offset: INITIAL_OFFSET,
  hasMore: true,
  loadMore: false,
};

export const ViewAllPage = () => {
  useTitle('All Programs');
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [trainingProgramsData, setTrainingProgramsData] = useState([]);
  const [filters, setFilters] = useState(defaultViewAllFilters);
  const [pagination, setPagination] = useState(defaultPagination);

  const navigate = useNavigate();

  useEffect(() => {
    loadTrainingProgramsData();
  }, [filters]);

  const loadTrainingProgramsData = async (offset) => {
    const currentOffset = offset ?? INITIAL_OFFSET;
    setIsLoading(true);

    try {
      const data = await fetchTrainingProgramData({
        searchQuery: filters.searchQuery,
        filterMode: filters.filterMode,
        filterUser: filters.filterUser,
        filterStatus: filters.filterStatus,
        filterStartDate: toUtcMidnightDateString(filters.filterStartDate),
        filterEndDate: toUtcMidnightDateString(filters.filterEndDate),
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentOffset,
      });
      setTotalPrograms(data.total_count);
      setTrainingProgramsData(data.training_programs);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFilters(defaultViewAllFilters);
    setPagination(defaultPagination);
  };

  const navigateToEdit = (programId) => {
    navigate(`/training-programs/edit/${programId}`);
  };

  const tableHeadings = [
    'Title',
    'Mode',
    'Assigned User',
    'Status',
    'Activation Date',
    'Action',
  ];

  const pillVariants = {
    create: 'status',
    template: 'warning',
    current: 'success',
    scheduled: 'highlight',
    archived: 'default',
  };

  const tableRows = trainingProgramsData.map((program) => {
    const cells = [
      {
        id: 'title',
        text: program.program_title,
      },
      {
        id: 'mode',
        text: (
          <Pill
            text={capitalize(program.mode)}
            variant={pillVariants[program.mode]}
          />
        ),
      },
      {
        id: 'assigned_user',
        text: program.assigned_user__username,
      },
      {
        id: 'status',
        text: program.status ? (
          <Pill
            text={capitalize(program.status)}
            variant={pillVariants[program.status]}
          />
        ) : null,
      },
      {
        id: 'activation_date',
        text: program.activation_date,
      },
      {
        id: 'delete',
        text: <ActionButton> Delete </ActionButton>,
      },
    ];

    return {
      id: program.id,
      cells,
    };
  });

  return (
    <>
      <Heading
        totalPrograms={totalPrograms}
        trainingProgramsData={trainingProgramsData}
      />
      <SearchAndFilterTrigger
        filters={filters}
        setFilters={setFilters}
        onReset={handleReset}
      />
      <Table
        columns={tableHeadings}
        rows={tableRows}
        onRowClick={navigateToEdit}
      />

      {!isLoading && trainingProgramsData.length === 0 && (
        <div className='flex flex-col items-center justify-center py-16 text-gray-500'>
          <p className='text-lg'>No training programs found</p>
          <p className='mt-1'>
            Try adjusting your filters or create a new program
          </p>
        </div>
      )}
    </>
  );
};
