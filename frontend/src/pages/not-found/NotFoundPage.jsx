import { useNavigate, useLocation } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

import { ActionButton } from '../../components/buttons';
import { useTitle } from '../../hooks/useTitle.hook';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useTitle('404 - Not Found');

  const handleGoBack = () => {
    // Check if previous navigation was within the app
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <section className='flex h-96 flex-col items-center justify-center text-center'>
      <ExclamationTriangleIcon className='mb-4 h-24 w-24 text-yellow-400' />
      <h1 className='mb-4 text-6xl font-bold'>404 Not Found</h1>
      <p className='mb-5 text-xl'>This page does not exist</p>
      <ActionButton onClick={handleGoBack}>
        {location.key !== 'default' ? 'Go Back' : 'Go Home'}
      </ActionButton>
    </section>
  );
};
