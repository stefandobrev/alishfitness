import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ActionButton, ButtonVariant } from '../buttons';
import FrontAnatomy from '../anatomy/FrontAnatomy';
import BackAnatomy from '../anatomy/BackAnatomy';
import { frontMuscleGroupNames } from '../../common/constants';

export const ToggleableMuscleView = ({
  handleMuscleClick,
  selectedPrimaryMuscle,
  selectedSecondaryMuscles,
}) => {
  const [isFrontView, setIsFrontView] = useState(true);

  useEffect(() => {
    setIsFrontView(
      !selectedPrimaryMuscle ||
        Object.values(frontMuscleGroupNames).includes(selectedPrimaryMuscle),
    );
  }, [selectedPrimaryMuscle]);

  const toggleIsFrontView = () => {
    setIsFrontView((prev) => !prev);
  };

  return (
    <div className='flex flex-col items-center justify-center py-2 lg:px-4 lg:py-0'>
      <div className='mt-4'>
        <ActionButton
          variant={ButtonVariant.GRAY_DARK}
          onClick={toggleIsFrontView}
        >
          {isFrontView ? 'Show back' : 'Show front'}
        </ActionButton>
      </div>

      <AnimatePresence mode='wait'>
        {isFrontView ? (
          <motion.div
            key='front'
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='w-full'
          >
            <FrontAnatomy
              onMuscleClick={handleMuscleClick}
              selectedPrimaryMuscle={selectedPrimaryMuscle}
              selectedSecondaryMuscles={selectedSecondaryMuscles}
            />
          </motion.div>
        ) : (
          <motion.div
            key='back'
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='w-full'
          >
            <BackAnatomy
              onMuscleClick={handleMuscleClick}
              selectedPrimaryMuscle={selectedPrimaryMuscle}
              selectedSecondaryMuscles={selectedSecondaryMuscles}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
