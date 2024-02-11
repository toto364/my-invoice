import { Metadata } from 'next';
import Image from 'next/image';
import { fetchCustomersPages, fetchFilteredCustomers } from '@/app/lib/data';
import { CustomersTableType } from '@/app/lib/definitions';
import ResourceIndex from '@/app/ui/pages/resource-index';
import { formatCurrency, formatFinancialNumber, formatNumber } from '@/app/lib/utils';
import { inconsolata } from '@/app/ui/fonts';
import { ResourceRenderer } from '@/app/ui/pages/resource-renderer';
import { ActionButton } from '@/app/ui/components/buttons';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  return (
    <ResourceIndex<CustomersTableType>
      createButtonTitle="Create Customer"
      createButtonUrl="/dashboard/customers/create"
      fetchFilteredResources={fetchFilteredCustomers}
      fetchResourcesPages={fetchCustomersPages}
      page={searchParams?.page}
      query={searchParams?.query}
      renderResources={renderCustomersTable}
      searchPlaceholder="Search customers..."
      title="Customers"
    />
  );
}

function renderCustomersTable(customers: CustomersTableType[]) {
  return (
    <ResourceRenderer
      headers={[
        { children: <>Customer</>, key: "header-customer" },
        { children: <>Email</>, key: "header-email" },
        { children: <># Invoices</>, className: "text-right", key: "header-invoices" },
        { children: <>฿ Pending</>, className: "text-right", key: "header-pending" },
        { children: <>฿ Paid</>, className: "text-right", key: "header-paid" },
      ]}
      resources={customers.map((customer) => ({
        action: (<>
          <ActionButton
            icon={<PencilIcon className="w-5" />}
          />
          <ActionButton
            icon={<TrashIcon className="w-5" />}
          />
        </>),
        card: {
          upperPanel: (<>
            <div className="mb-2 flex items-center">
              <Image
                src={customer.image_url}
                className="mr-2 rounded-full"
                width={28}
                height={28}
                alt={`${customer.name}'s profile picture`}
              />
              <p>{customer.name}</p>
            </div>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </>),
          lowerPanel: (<div>
            <div className="flex w-1/2 flex-col">
              <p className="text-xs">Pending</p>
              <p className={`${inconsolata.className}`}>{formatCurrency(customer.total_pending)}</p>
            </div>
            <div className="flex w-1/2 flex-col">
              <p className="text-xs">Paid</p>
              <p className={`${inconsolata.className}`}>{formatCurrency(customer.total_paid)}</p>
            </div>
          </div>),
        },
        cols: [
          {
            children: (
              <div className="flex items-center gap-3">
                <Image
                  src={customer.image_url}
                  className="rounded-full"
                  width={28}
                  height={28}
                  alt={`${customer.name}'s profile picture`}
                />
                <p>{customer.name}</p>
              </div>
            ),
            key: `customer-${customer.id}-customer`,
          },
          {
            children: <>{customer.email}</>,
            key: `customer-${customer.id}-email`,
          },
          {
            children: <>{formatNumber(customer.total_invoices)}</>,
            className: `${inconsolata.className} text-right`,
            key: `customer-${customer.id}-invoices`,
          },
          {
            children: <>{formatFinancialNumber(customer.total_pending)}</>,
            className: `${inconsolata.className} text-right`,
            key: `customer-${customer.id}-pending`,
          },
          {
            children: <>{formatFinancialNumber(customer.total_paid)}</>,
            className: `${inconsolata.className} text-right`,
            key: `customer-${customer.id}-paid`,
          },
        ],
        key: `customer-${customer.id}`,
      }))}
    />
  );
}
