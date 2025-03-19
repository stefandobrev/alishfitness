import {
  SaveButton,
  CancelButton,
  EditButton,
} from '../../components/buttons/EditButtons';
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
            <SaveButton />
            <CancelButton onClick={() => setIsEditing(false)} />
          </>
        ) : (
          <EditButton onClick={() => setIsEditing(true)} />
        )}
      </div>
    </form>
  );
};
