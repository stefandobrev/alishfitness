import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
} from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Pages
import {
  ExercisePage,
  HomePage,
  LoginPage,
  ManagePage,
  MuscleGroupExercisePage,
  NotFoundPage,
  ProfileSettingsPage,
  RegistrationPage,
  YourProfilePage,
  ExerciseDetailPage,
} from '../pages';

// Route Guards
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import PublicRoute from '../components/PublicRoute';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />} />

      <Route element={<PublicRoute />}>
        <Route path='/register' element={<RegistrationPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path='/exercises' element={<ExercisePage />} />
        <Route
          path='/exercises/:slugMuscleGroup'
          element={<MuscleGroupExercisePage />}
        />
        <Route
          path='/exercises/:slugMuscleGroup/:slugTitle'
          element={<ExerciseDetailPage />}
        />
        <Route path='/profile' element={<YourProfilePage />} />
        <Route path='/settings' element={<ProfileSettingsPage />} />

        <Route element={<AdminRoute />}>
          <Route path='/manage' element={<ManagePage />} />
        </Route>
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Route>,
  ),
);
