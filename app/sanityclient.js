import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'o2o9ouqt',   // your project ID
  dataset: 'production',   // your dataset name
  useCdn: true,            // true = cached data, false = fresh data
  apiVersion: '2023-01-01' // API version date
});
