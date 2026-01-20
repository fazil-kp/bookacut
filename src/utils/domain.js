export const getCurrentHost = () => window.location.host;

export const getPlatformDomain = () =>
  import.meta.env.VITE_PLATFORM_DOMAIN || 'platform.bookacut.local';

export const isPlatformDomain = () => {
  const host = getCurrentHost();
  const platformDomain = getPlatformDomain();

  // Exact match or subdomain pointing to the configured platform domain
  return host === platformDomain || host.endsWith(`.${platformDomain}`);
};

export const isClientDomain = () => !isPlatformDomain();


