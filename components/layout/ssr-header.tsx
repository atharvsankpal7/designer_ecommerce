export const dynamic = "force-dynamic";

import { getNavigationSections } from '@/lib/section-utils';
import { ClientHeader } from './client-header';

export async function SSRHeader() {
  const navigationSections = await getNavigationSections();
  return <ClientHeader navigationSections={navigationSections} />;
}
