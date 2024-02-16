import { Metadata } from 'next';
import { fetchCustomersPages, fetchFilteredCustomers } from '@/app/lib/data';
import { CustomersTableType } from '@/app/lib/definitions';
import ResourceIndex, {
  ResourceIndexSearchParamsType,
} from '@/app/ui/pages/resource-index';
import renderResources, {
  DeleteModalSearchParamsType,
} from '@/app/ui/customers/resource-renderer';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: ResourceIndexSearchParamsType & DeleteModalSearchParamsType;
}) {
  return (
    <ResourceIndex<CustomersTableType>
      createButtonTitle="Create Customer"
      createButtonUrl="/dashboard/customers/create"
      fetchFilteredResources={fetchFilteredCustomers}
      fetchResourcesPages={fetchCustomersPages}
      page={searchParams?.page}
      query={searchParams?.query}
      // renderResources={(customers) => renderResources(customers, searchParams)}
      renderResources={renderResources}
      searchPlaceholder="Search customers..."
      title="Customers"
    />
  );
}
