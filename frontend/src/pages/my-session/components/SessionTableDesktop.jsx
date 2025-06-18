export const SessionTableDesktop = ({ sessionLogData }) => {
  const { session } = sessionLogData;
  const { exercises } = session;
  const maxSets = Math.max(...exercises.map((ex) => ex.sets));
  console.log({ sessionLogData });
  return <div className='mx-2 overflow-auto rounded-lg border p-4'></div>;
};
