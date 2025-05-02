import { useState, useEffect } from 'react';

import { fetchTrainingFilterData } from '../helpersViewAll';

export const useTrainingProgramFilterData = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTrainingProgramFilterData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTrainingFilterData();
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainingProgramFilterData();
  }, []);

  return <div>useTrainingProgramFilterData</div>;
};
