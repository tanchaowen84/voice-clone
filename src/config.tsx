/**
 * Re-export all config elements from their new locations for backward compatibility
 * 
 * This file is kept for backward compatibility with existing code.
 * New code should import directly from the specific config files.
 */
export { websiteConfig } from './config/website';
export { getNavbarConfig as getMenuLinks } from './config/navbar-config';
export { getFooterConfig as getFooterLinks } from './config/footer-config';
export { getAvatarConfig as getAvatarLinks } from './config/avatar-config';
export { getSidebarConfig as getSidebarLinks } from './config/sidebar-config';
export { getSocialConfig as getSocialLinks } from './config/social-config';
export { getPricePlans as getPricePlanInfos } from './config/payment-config';
