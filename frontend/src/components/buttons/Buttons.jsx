const variants = {
  red: 'bg-logored hover:bg-logored-hover disabled:bg-logored-disabled text-white disabled:text-gray-300',
  grayDark:
    'bg-gray-600 hover:bg-gray-900 disabled:bg-gray-300 text-white disabled:text-gray-300',
  white:
    'bg-white hover:bg-gray-300 text-gray-800 hover:text-gray-900 disabled:bg-gray-300 disabled:text-gray-700',
};

const BaseButton = ({
  children,
  type = 'button',
  variant = 'red',
  className = '',
  disabled = false,
  onClick,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`${variants[variant]} ${
      disabled ? '' : 'cursor-pointer'
    } rounded-md border border-gray-800 px-4 py-2 shadow-md hover:border-gray-600 disabled:border-gray-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const SubmitButton = (props) => <BaseButton {...props} type='submit' />;

export const ActionButton = (props) => <BaseButton {...props} type='button' />;
