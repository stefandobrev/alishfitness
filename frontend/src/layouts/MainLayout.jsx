import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../components/navbar/Navbar';
import { Spinner, Toast } from '../components/common';

const MainLayout = () => {
  const isLoading = useSelector((state) => state.loading.loading);
  const currentYear = new Date().getFullYear();

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <main className='flex-1'>
        {isLoading ? (
          <Spinner loading={isLoading} className={'fixed inset-0'} />
        ) : (
          <Outlet />
        )}
      </main>
      <footer className='h-7 bg-gray-800'>
        <div className='container mx-auto flex h-full items-center justify-center px-4'>
          <p className='text-gray-300'>
            © {currentYear} AlishFitness. All rights reserved.
          </p>
        </div>
      </footer>
      <Toast />
    </div>
  );
};

export default MainLayout;
