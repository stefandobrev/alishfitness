import { useState } from 'react';

import FrontAnatomy from '../anatomy/FrontAnatomy';
import BackAnatomy from '../anatomy/BackAnatomy';

export const FullBodyMuscleView = ({ handleMuscleClick }) => {
  const [hoveredMuscle, setHoveredMuscle] = useState('');

  const handleMuscleHover = (name) => {
    setHoveredMuscle(name);
  };

  return (
    <div className='flex flex-row items-center justify-center'>
      <div className='flex h-[calc(100vh-108px)] w-[35%] items-center justify-center'>
        <FrontAnatomy
          onMuscleClick={handleMuscleClick}
          onMuscleHover={handleMuscleHover}
        />
      </div>
      <div className='flex h-[calc(100vh-108px)] w-[35%] items-center justify-center'>
        <BackAnatomy
          onMuscleClick={handleMuscleClick}
          onMuscleHover={handleMuscleHover}
        />
      </div>
      <div
        className={`absolute top-[20%] z-10 mx-auto p-4 text-lg font-bold duration-300 ${
          hoveredMuscle ? 'block' : 'hidden'
        }`}
      >
        {hoveredMuscle}
      </div>
    </div>
  );
};
