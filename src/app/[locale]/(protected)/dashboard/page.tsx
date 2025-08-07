import { redirect } from 'next/navigation';

/**
 * Dashboard page - temporarily disabled
 *
 * Redirects users to settings/profile page instead
 * This page uses demo data and is not suitable for production
 */
export default function DashboardPage() {
  // Redirect to settings page since dashboard is temporarily disabled
  redirect('/settings/profile');
}
