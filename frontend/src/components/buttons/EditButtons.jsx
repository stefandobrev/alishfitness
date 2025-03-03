import Button from './Button';

export const EditButton = ({
  children = 'Edit',
  variant = 'red',
  onClick,
  disabled,
  className = '',
}) => (
  <Button
    type='button'
    onClick={onClick}
    variant={variant}
    disabled={disabled}
    className={className}
    aria-label='Edit'
  >
    {children}
  </Button>
);

export const ToggleButton = ({
  children = 'Toggle',
  onClick,
  disabled,
  className = '',
}) => (
  <Button
    type='button'
    onClick={onClick}
    variant='grayDark'
    disabled={disabled}
    className={className}
    aria-label='Toggle'
  >
    {children}
  </Button>
);

export const SaveButton = ({
  children = 'Save',
  disabled,
  className = '',
  ...props
}) => (
  <Button
    type='submit'
    disabled={disabled}
    variant='red'
    className={className}
    aria-label='Save Changes'
    {...props}
  >
    {children}
  </Button>
);

export const CancelButton = ({ children = 'Cancel', onClick }) => (
  <Button
    type='button'
    onClick={onClick}
    variant='grayDark'
    aria-label='Cancel Editing'
  >
    {children}
  </Button>
);

export const DeleteButton = ({
  children = 'Delete',
  variant = 'red',
  onClick,
  className = '',
}) => (
  <Button
    type='button'
    onClick={onClick}
    variant={variant}
    className={className}
    aria-label='Delete'
  >
    {children}
  </Button>
);

export const ViewButton = ({
  children = 'View',
  variant = 'grayDark',
  onClick,
  className = '',
}) => (
  <Button
    type='button'
    onClick={onClick}
    variant={variant}
    className={className}
    aria-label='View'
  >
    {children}
  </Button>
);
