import { useTitle } from '@/hooks';
import { useScrollEffects } from './hooks';
import {
  HeroSection,
  IntroductionSection,
  ExpertiseSection,
  BioSection,
} from './sections';

export const HomePage = () => {
  useTitle('Alish Hamdi | Personal Training');
  const { isScrolled, blurAmount } = useScrollEffects();

  return (
    <div className='relative'>
      <div data-navbar-solid={isScrolled}>
        <HeroSection blurAmount={blurAmount} />
        <IntroductionSection />
        <ExpertiseSection />
        <BioSection />
      </div>
    </div>
  );
};
