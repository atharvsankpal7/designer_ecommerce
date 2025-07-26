import { getHomepageSections } from '@/lib/section-utils';
import { SectionCarousel } from './section-carousel';

export async function HomepageSections() {
  const homepageSections = await getHomepageSections();

  if (homepageSections.length === 0) {
    return null;
  }

  return (
    <>
      {homepageSections.map((section) => (
        <SectionCarousel key={section.id} section={section} />
      ))}
    </>
  );
}