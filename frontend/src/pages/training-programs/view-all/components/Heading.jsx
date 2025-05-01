export const Heading = ({ totalPrograms, trainingProgramsData }) => {
  const programsCounter =
    totalPrograms !== undefined ? totalPrograms : trainingProgramsData?.length;
  const isPlural = programsCounter !== 1;
  const programsDescription = `${programsCounter} program${isPlural ? 's' : ''} available`;

  return (
    <div className='flex flex-col'>
      <h1 className='flex justify-center p-4 text-2xl font-bold md:text-3xl'>
        All Programs
      </h1>
      <p className='w-full text-center text-gray-600 lg:mx-auto dark:text-gray-300'>
        {trainingProgramsData && programsDescription}
      </p>
    </div>
  );
};
