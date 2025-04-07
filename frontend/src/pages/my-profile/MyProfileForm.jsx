import {
  ActionButton,
  ButtonVariant,
  SubmitButton,
} from '@/components/buttons';
import { InputField } from '@/components/inputs';

export const MyProfileForm = ({ isEditing, setIsEditing, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className='mb-4'>
        <InputField label='First Name' id='firstName' readOnly={!isEditing} />
      </div>
      <div className='mb-4'>
        <InputField
          label='Last Name'
          id='lastName'
          readOnly={!isEditing}
          className='w-15'
        />
      </div>
      <div className='flex space-x-4'>
        {isEditing ? (
          <>
            <SubmitButton>Save</SubmitButton>
            <ActionButton
              variant={ButtonVariant.GRAY_DARK}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </ActionButton>
          </>
        ) : (
          <ActionButton onClick={() => setIsEditing(true)}>Edit</ActionButton>
        )}
      </div>
    </form>
  );
};
