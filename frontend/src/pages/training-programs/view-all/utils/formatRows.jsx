import { Pill } from '@/components/common';
import { ActionButton } from '@/components/buttons';
import { capitalize } from '@/utils';

const pillVariants = {
  create: 'status',
  template: 'warning',
  current: 'success',
  scheduled: 'highlight',
  archived: 'default',
};

export const formatRows = (programs) =>
  programs.map((program) => {
    const cells = [
      {
        id: 'title',
        text: program.program_title,
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
        id: 'assigned_user',
        text: program.assigned_user__username
          ? `${program.assigned_user__last_name}, ${program.assigned_user__first_name} (${program.assigned_user__username})`
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
        id: 'activation_date',
        text: program.activation_date,
      },
      {
        id: 'delete',
        text: <ActionButton> Delete </ActionButton>,
      },
    ];

    return {
      id: program.id,
      cells,
    };
  });
