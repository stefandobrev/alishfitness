import { useMediaQuery } from 'react-responsive';

export function useIsMobile() {
  return useMediaQuery({ maxWidth: 768 });
}

export const frontMuscleGroupNames = {
  abdominals: 'abdominals',
  adductors: 'adductors',
  biceps: 'biceps',
  calves: 'calves',
  deltoidAnterior: 'deltoid-anterior',
  deltoidLateral: 'deltoid-lateral',
  forearms: 'forearms',
  neck: 'neck',
  obliques: 'obliques',
  pectoralisMiddleLower: 'pectoralis-middle-lower',
  pectoralisUpper: 'pectoralis-upper',
  quadriceps: 'quadriceps',
  trapsUpper: 'traps-upper',
};

export const backMuscleGroupNames = {
  adductors: 'adductors',
  calves: 'calves',
  deltoidLateral: 'deltoid-lateral',
  deltoidPosterior: 'deltoid-posterior',
  forearms: 'forearms',
  glutes: 'glutes',
  hamstrings: 'hamstrings',
  lats: 'lats',
  lowerback: 'lowerback',
  neck: 'neck',
  trapsMiddleLower: 'traps-middle-lower',
  trapsUpper: 'traps-upper',
  triceps: 'triceps',
};

export const getLightColors = (index) => {
  const bgColors = [
    'bg-red-300',
    'bg-yellow-300',
    'bg-green-300',
    'bg-blue-300',
    'bg-orange-300',
    'bg-purple-300',
    'bg-teal-300',
    'bg-pink-300',
    'bg-gray-300',
    'bg-violet-300',
    'bg-rose-300',
    'bg-stone-300',
  ];
  return bgColors[index % bgColors.length];
};
