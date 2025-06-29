import { classNames } from '@/utils';
import { ButtonVariant } from './constants';

const baseStyle =
  'rounded-md border border-gray-800 px-4 py-2 shadow-md hover:border-gray-600';

const variants = {
  [ButtonVariant.RED]: classNames(
    baseStyle,
    'cursor-pointer bg-logored hover:bg-logored-hover text-white',
    'disabled:bg-logored-disabled disabled:text-gray-300 disabled:cursor-default',
  ),
  [ButtonVariant.GRAY_DARK]: classNames(
    baseStyle,
    'cursor-pointer bg-gray-600 hover:bg-gray-900 text-white',
    'disabled:bg-logored-disabled disabled:text-gray-300 disabled:cursor-default',
  ),
  [ButtonVariant.WHITE]: classNames(
    baseStyle,
    'cursor-pointer bg-white hover:bg-gray-300 text-gray-800 hover:text-gray-900',
    'disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-default',
  ),
  [ButtonVariant.GREEN]: classNames(
    baseStyle,
    'cursor-pointer bg-green-600 hover:bg-green-400 text-white hover:text-gray-900',
    'disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-default',
  ),
  [ButtonVariant.BLANK]: '',
};

const BaseButton = ({
  children,
  type = 'button',
  variant = ButtonVariant.RED,
  className = '',
  disabled = false,
  onClick,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`${variants[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const SubmitButton = (props) => <BaseButton {...props} type='submit' />;

export const ActionButton = (props) => <BaseButton {...props} type='button' />;
