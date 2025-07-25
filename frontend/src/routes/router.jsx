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
  ViewAllPage,
  ManageProgramPage,
  MySessionPage,
} from '../pages';

// Route Guards
import {
  AuthRoute,
  AdminRoute,
  MemberRoute,
  PublicRoute,
} from '../components/routes';

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

          <Route path='/training-programs/view-all' element={<ViewAllPage />} />
          <Route
            path='/training-programs/create'
            element={<ManageProgramPage />}
          />
          <Route
            path='/training-programs/edit/:id'
            element={<ManageProgramPage />}
          />
        </Route>

        <Route element={<MemberRoute />}>
          <Route path='/my-program' element={<MyProgramPage />} />
          <Route path='/my-sessions/:id' element={<MySessionPage />} />
        </Route>
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Route>,
  ),
);
