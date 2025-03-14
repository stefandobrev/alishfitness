import { FeaturePoint } from './FeaturePoint';

export const IntroductionSection = () => {
  return (
    <section className='bg-white py-16 sm:py-24 lg:py-32'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16'>
          <div>
            <h2 className='mb-6 text-3xl font-black tracking-tight sm:mb-8 sm:text-4xl lg:text-5xl'>
              Beyond Traditional Training
            </h2>
            <p className='text-base leading-relaxed text-gray-600 sm:text-lg lg:text-xl'>
              As a resistance training specialist, Alish designs each movement
              and exercise precisely to fit your individual body biomechanics.
              Combined with expert nutrition coaching, you'll achieve results
              that last.
            </p>
          </div>
          <div className='space-y-6 sm:space-y-8'>
            <FeaturePoint
              title='Personalized Approach'
              description='Every exercise is specifically selected for your ability and goals.'
            />
            <FeaturePoint
              title='Nutrition Guidance'
              description='Comprehensive nutrition coaching to maximize your results.'
            />
            <FeaturePoint
              title='Expert Knowledge'
              description='Over a decade of experience in transformation and competition prep.'
            />
          </div>
        </div>
      </div>
    </section>
  );
};
