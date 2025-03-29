import { ToggleableMuscleView } from '../../../components/muscleviews';

export const AnatomySection = ({
  activeTab,
  handleMuscleClick,
  selectedPrimaryMuscle,
}) => (
  <div
    className={`w-full items-center lg:w-[25%] ${
      activeTab !== 'anatomy' ? 'hidden lg:block' : ''
    }`}
  >
    <div className='lg:sticky lg:top-20'>
      <ToggleableMuscleView
        handleMuscleClick={handleMuscleClick}
        selectedPrimaryMuscle={selectedPrimaryMuscle}
      />
    </div>
  </div>
);
