import { getNavigationSections } from '@/lib/section-utils';
import { getHeaderData } from '@/lib/actions';
import { ClientHeader } from './client-header';
export const dynamic = 'force-dynamic';

export async function Header() {
  const [navigationSections, headerData] = await Promise.all([
    getNavigationSections(),
    getHeaderData()
  ]);

  return <ClientHeader 
    navigationSections={navigationSections} 
    headerData={headerData}
  />;
}