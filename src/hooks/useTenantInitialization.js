import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tenantService } from '../services/tenantService';
import { useTenantStore } from '../store/tenantStore';
import { getCurrentHost, isClientDomain } from '../utils/domain';

/**
 * Initializes tenant context on client domains by resolving the current host
 * to a tenant/client record and storing it in the tenant store.
 */
export const useTenantInitialization = () => {
  const { setTenant, tenant } = useTenantStore();

  const enabled = isClientDomain() && !tenant;

  const query = useQuery({
    queryKey: ['tenant', getCurrentHost()],
    queryFn: () => tenantService.resolveByDomain(getCurrentHost()),
    enabled,
    retry: 1,
    staleTime: 10 * 60 * 1000,
    onSuccess: (data) => {
      // Expecting shape: { tenant: { id, name, databaseName, domain, ... } }
      if (data?.tenant) {
        setTenant(data.tenant);
      }
    },
  });

  useEffect(() => {
    if (!enabled && tenant) {
      // nothing to do, tenant already loaded
    }
  }, [enabled, tenant]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    tenant,
  };
};


