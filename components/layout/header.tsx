import { getNavigationSections } from '@/lib/section-utils';
import { ClientHeader } from './client-header';

export async function Header() {
  const navigationSections = await getNavigationSections();

  return <ClientHeader navigationSections={navigationSections} />;
}