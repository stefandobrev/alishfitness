import { Pill } from '@/components/common';
import { ActionButton } from '@/components/buttons';
import { capitalize, toUtcMidnightDateString } from '@/utils';

const pillVariants = {
  create: 'status',
  template: 'warning',
  current: 'success',
  scheduled: 'highlight',
  archived: 'default',
};

export const formatRows = (programs, handleDelete) =>
  programs.map((program) => {
    const cells = [
      {
        id: 'title',
        text: program.programTitle,
      },
      {
        id: 'mode',
        text: (
          <Pill
            text={
              program.mode === 'create' ? 'Assigned' : capitalize(program.mode)
            }
            variant={pillVariants[program.mode]}
          />
        ),
      },
      {
        id: 'assignedUser',
        text: program.assignedUserUsername
          ? `${program.assignedUserLastName}, ${program.assignedUserFirstName} (${program.assignedUserUsername})`
          : null,
      },
      {
        id: 'status',
        text: program.status ? (
          <Pill
            text={capitalize(program.status)}
            variant={pillVariants[program.status]}
          />
        ) : null,
      },
      {
        id: 'activationDate',
        text: program.activationDate,
      },
      {
        id: 'updatedAt',
        text: toUtcMidnightDateString(new Date(program.updatedAt)),
      },
      {
        id: 'delete',
        text: (
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(program.id, program.programTitle);
            }}
          >
            Delete
          </ActionButton>
        ),
      },
    ];

    return {
      id: program.id,
      cells,
    };
  });
