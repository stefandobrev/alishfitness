export const MuscleGroup = ({
  id,
  name,
  onClick,
  onHover,
  selectedPrimaryMuscle,
  selectedSecondaryMuscles,
  children,
}) => {
  const isPrimary = selectedPrimaryMuscle === id;
  const isSecondary = selectedSecondaryMuscles.includes(id);

  return (
    <g
      onClick={() => onClick?.(id)}
      onMouseEnter={() => onHover?.(name)}
      onMouseLeave={() => onHover?.('')}
      id={id}
      className={`cursor-pointer ${
        isPrimary
          ? 'fill-logored'
          : isSecondary
            ? 'fill-amber-300'
            : 'fill-[#e6e7e8] hover:fill-red-300 active:fill-red-300'
      }`}
    >
      {children}
    </g>
  );
};
