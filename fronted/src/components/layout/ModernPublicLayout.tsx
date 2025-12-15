import { ReactNode } from 'react';
import { ModernNavbar } from './ModernNavbar';
import { ModernFooter } from './ModernFooter';

interface ModernPublicLayoutProps {
  children: ReactNode;
}

export function ModernPublicLayout({ children }: ModernPublicLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <ModernNavbar />
      <main>{children}</main>
      <ModernFooter />
    </div>
  );
}
