import { useState, useEffect } from 'react';

import { fetchTrainingFilterData } from '../helpersViewAll';

export const useTrainingProgramFilterData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modesData, setModesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [statusesData, setStatusesData] = useState([]);

  useEffect(() => {
    const loadTrainingProgramFilterData = async () => {
      setIsLoading(true);

      try {
        const data = await fetchTrainingFilterData();

        const transformedModesData = Object.values(data.modes).map((mode) => ({
          label: mode[1],
          value: mode[0],
        }));

        const transformedUserData = Object.values(data.users).map((user) => ({
          label: `${user.last_name}, ${user.first_name} (${user.username})`,
          value: user.id,
        }));

        const transformedStatusData = Object.values(data.statuses).map(
          (status) => ({
            label: status[1],
            value: status[0],
          }),
        );

        setModesData(transformedModesData);
        setUsersData(transformedUserData);
        setStatusesData(transformedStatusData);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainingProgramFilterData();
  }, []);

  return {
    modesData,
    usersData,
    statusesData,
    isLoading,
  };
};
