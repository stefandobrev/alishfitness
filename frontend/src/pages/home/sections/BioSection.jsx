import { ActionButton } from '../../../components/buttons';

export const BioSection = () => {
  return (
    <section className='bg-white py-16 sm:py-24 lg:py-32'>
      <div className='container mx-auto max-w-4xl px-4 sm:px-6'>
        <h2 className='mb-12 text-center text-3xl font-black tracking-tight sm:mb-16 sm:text-4xl lg:text-5xl'>
          The Journey
        </h2>
        <div className='space-y-6 text-base leading-relaxed text-gray-600 sm:space-y-8 sm:text-lg lg:text-xl'>
          <p>
            Alish has over 10 years experience in training. Over this period of
            time he has developed a love and passion for living a healthy
            lifestyle. He believes 'first you must walk the road, then preach
            it'.
          </p>
          <p>
            Over the last few years, Alish has gained a wealth of knowledge
            within the fitness industry. Alish understands the importance of
            creating a healthy and active lifestyle. Although changing your life
            for the better can be hard to achieve, Alish will guide you step by
            step to reach your goals.
          </p>
          <p>
            As an actively competing bodybuilder, Alish specialises in building
            lean muscle, decreasing body fat and nutritional guidance.
          </p>
        </div>
        <div className='mt-8 text-center sm:mt-12'>
          <ActionButton
            onClick={() => (window.location.href = '/contact')}
            className='w-full px-8 py-3 text-lg transition-transform hover:scale-105 sm:w-auto sm:px-12 sm:py-4'
          >
            Book a Consultation
          </ActionButton>
        </div>
      </div>
    </section>
  );
};
