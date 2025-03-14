import { ExpertiseCard } from './ExpertiseCard';

export const ExpertiseSection = () => {
  return (
    <section className='bg-black py-16 sm:py-24 lg:py-32'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6'>
        <h2 className='mb-12 text-center text-3xl font-black tracking-tight text-white sm:mb-16 sm:text-4xl lg:text-5xl'>
          Professional Excellence
        </h2>
        <div className='grid gap-6 sm:gap-8 lg:grid-cols-2'>
          <ExpertiseCard
            title='Expertise'
            items={[
              'Resistance Training Specialist',
              'Strength & Conditioning',
              'Nutrition Coach',
              'Bodybuilding Prep Coach',
            ]}
          />
          <ExpertiseCard
            title='Qualifications'
            items={[
              'REPs Qualified Level 3 PT',
              'YMCA Diploma Exercise Referral Level 3',
              'YMCA Diploma "Gym Instructor" Tutor',
              'YMCA Kettlebells Pro Qualified',
              'First Aider Level 3',
            ]}
          />
        </div>
      </div>
    </section>
  );
};
