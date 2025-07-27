import { getNavigationSections } from '@/lib/section-utils';
import { ClientHeader } from './client-header';
export const dynamic = 'force-dynamic';

export async function Header() {
  const navigationSections = await getNavigationSections();

  return <ClientHeader navigationSections={navigationSections} />;
}