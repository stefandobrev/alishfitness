import { useTitle } from '@/hooks/useTitle.hook';
import { useScrollEffects } from './hooks/useScrollEffects';
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
