import {
  ActionButton,
  ButtonVariant,
  SubmitButton,
} from '../../components/buttons';
import { InputField } from '../../components/inputs';

export const MyProfileForm = ({ isEditing, setIsEditing, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className='mb-4'>
        <InputField label='First Name' id='first_name' readOnly={!isEditing} />
      </div>
      <div className='mb-4'>
        <InputField label='Last Name' id='last_name' readOnly={!isEditing} />
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
