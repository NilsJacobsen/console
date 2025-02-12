import { getReferenceForModel } from '@console/dynamic-plugin-sdk/src/utils/k8s';
import { resourceObjPath, resourcePath } from '@console/internal/components/utils';
import { ALL_NAMESPACES_KEY, useActiveNamespace } from '@console/shared';
import { useActiveCluster } from '@console/shared/src/hooks/useActiveCluster'; // TODO remove multicluster
import { ClusterServiceVersionModel } from '../models';
import { ClusterServiceVersionKind } from '../types';

export const useClusterServiceVersionPath = (csv: ClusterServiceVersionKind): string => {
  const [activeNamespace] = useActiveNamespace();
  const [cluster] = useActiveCluster(); // TODO remove multicluster
  const csvReference = getReferenceForModel(ClusterServiceVersionModel);
  // Don't link to csv in 'openshift' namespace when copiedCSVsDisabled and in another namespace
  if (
    window.SERVER_FLAGS.copiedCSVsDisabled[cluster] && // TODO remove multicluster
    csv.metadata.namespace === 'openshift' && // Is global csv
    activeNamespace !== ALL_NAMESPACES_KEY
  ) {
    return resourcePath(csvReference, csv.metadata.name, activeNamespace);
  }
  return resourceObjPath(csv, csvReference);
};
