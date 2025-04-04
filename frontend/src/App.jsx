import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { router } from './routes/router';
import { AuthWrapper, Spinner } from './components/common';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<Spinner loading={true} className='min-h-[70vh]' />}
        persistor={persistor}
      >
        <AuthWrapper>
          <RouterProvider router={router} />
        </AuthWrapper>
      </PersistGate>
    </Provider>
  );
};

export default App;
