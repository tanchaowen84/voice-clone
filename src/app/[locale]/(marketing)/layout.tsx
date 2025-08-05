'use client';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { UpgradeModal } from '@/components/subscription/upgrade-modal';
import { useSubscriptionStore } from '@/stores/subscription-store';
import type { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar scroll={true} />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Global Upgrade Modal */}
      <UpgradeModalProvider />
    </div>
  );
}

/**
 * Upgrade Modal Provider Component
 * Renders the upgrade modal based on store state
 */
function UpgradeModalProvider() {
  const { upgradeModal, hideUpgradeModal } = useSubscriptionStore();

  if (!upgradeModal.isOpen) {
    return null;
  }

  return (
    <UpgradeModal
      isOpen={upgradeModal.isOpen}
      onClose={hideUpgradeModal}
      trigger={upgradeModal.trigger || 'character_limit'}
    />
  );
}
