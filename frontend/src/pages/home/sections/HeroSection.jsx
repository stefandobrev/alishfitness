import { ActionButton } from '@/components/buttons';

export const HeroSection = ({ blurAmount }) => {
  return (
    <section className='relative h-screen w-full overflow-hidden'>
      {/* Fixed background - unblurred */}
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `url('/images/alishfitness-hero.webp')`,
        }}
      />

      {/* Blurred background layer */}
      <div
        className='absolute inset-0 bg-cover bg-center transition-all duration-300'
        style={{
          backgroundImage: `url('/images/alishfitness-hero.webp')`,
          filter: `blur(${blurAmount}px)`,
          transform: 'scale(1.1)', // Prevent blur edges from showing
        }}
      />

      {/* Gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/70 to-black/40' />

      {/* Content container */}
      <div className='relative container mx-auto flex h-full max-w-7xl items-center px-4 pt-20 sm:px-6'>
        <div className='max-w-3xl'>
          <h1 className='mb-6 text-5xl font-black tracking-tight text-white sm:mb-8 sm:text-6xl lg:text-8xl'>
            Elite Training,
            <br />
            Exceptional Results.
          </h1>
          <p className='mb-8 text-lg leading-relaxed font-light text-gray-200 sm:mb-12 sm:text-xl lg:text-2xl'>
            Transform your physique with London's premier personal trainer.
            Specialized in resistance training and nutrition coaching.
          </p>
          <ActionButton
            onClick={() => (window.location.href = '/signup')}
            className='w-full px-8 py-3 text-lg transition-transform hover:scale-105 sm:w-auto sm:px-12 sm:py-4'
          >
            Start Your Journey
          </ActionButton>
        </div>
      </div>
    </section>
  );
};
