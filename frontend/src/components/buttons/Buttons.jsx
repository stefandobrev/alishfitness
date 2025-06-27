import { classNames } from '@/utils';
import { ButtonVariant } from './constants';

const baseStyle =
  'rounded-md border border-gray-800 px-4 py-2 shadow-md hover:border-gray-600 disabled:border-gray-300 cursor-pointer';

const variants = {
  [ButtonVariant.RED]: classNames(
    baseStyle,
    'bg-logored hover:bg-logored-hover disabled:bg-logored-disabled text-white disabled:text-gray-300',
  ),
  [ButtonVariant.GRAY_DARK]: classNames(
    baseStyle,
    'bg-gray-600 hover:bg-gray-900 disabled:bg-gray-300 text-white disabled:text-gray-300',
  ),
  [ButtonVariant.WHITE]: classNames(
    baseStyle,
    'bg-white hover:bg-gray-300 text-gray-800 hover:text-gray-900 disabled:bg-gray-300 disabled:text-gray-700',
  ),
  [ButtonVariant.GREEN]: classNames(
    baseStyle,
    'bg-green-600 hover:bg-green-400 text-white hover:text-gray-900 disabled:bg-gray-300 disabled:text-gray-700',
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
