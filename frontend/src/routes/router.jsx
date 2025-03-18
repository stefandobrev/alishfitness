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
  ManageExercisesPage,
  ManageUsersPage,
  MuscleGroupExercisePage,
  NotFoundPage,
  ProfileSettingsPage,
  RegistrationPage,
  MyProfilePage,
  ExerciseDetailPage,
  MyProgramPage,
} from '../pages';

// Route Guards
import AuthRoute from '../components/AuthRoute';
import AdminRoute from '../components/AdminRoute';
import MemberRoute from '../components/MemberRoute';
import PublicRoute from '../components/PublicRoute';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />} />

      <Route element={<PublicRoute />}>
        <Route path='/register' element={<RegistrationPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Route>

      <Route element={<AuthRoute />}>
        <Route path='/exercises' element={<ExercisePage />} />
        <Route
          path='/exercises/:slugMuscleGroup'
          element={<MuscleGroupExercisePage />}
        />
        <Route
          path='/exercises/:slugMuscleGroup/:slugTitle'
          element={<ExerciseDetailPage />}
        />
        <Route path='/my-profile' element={<MyProfilePage />} />
        <Route path='/settings' element={<ProfileSettingsPage />} />

        <Route element={<AdminRoute />}>
          <Route path='/manage/exercises' element={<ManageExercisesPage />} />
          <Route path='/manage/users' element={<ManageUsersPage />} />
        </Route>

        <Route element={<MemberRoute />}>
          <Route path='/my-program' element={<MyProgramPage />} />
        </Route>
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Route>,
  ),
);
