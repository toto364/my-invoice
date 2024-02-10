import { Metadata } from 'next';
import Image from 'next/image';
import { fetchCustomersPages, fetchFilteredCustomers } from '@/app/lib/data';
import { CustomersTableType } from '@/app/lib/definitions';
import ResourceIndex from '@/app/ui/pages/resource-index';
import { formatFinancialNumber, formatNumber } from '@/app/lib/utils';
import { inconsolata } from '@/app/ui/fonts';

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
    <table className="hidden min-w-full text-gray-900 md:table">
      <thead className="rounded-lg text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
            Customer
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Email
          </th>
          <th scope="col" className="px-3 py-5 font-medium text-right">
            # Invoices
          </th>
          <th scope="col" className="px-3 py-5 font-medium text-right">
            ฿ Pending
          </th>
          <th scope="col" className="px-3 py-5 font-medium text-right">
            ฿ Paid
          </th>
          {/* <th scope="col" className="relative py-3 pl-6 pr-3">
            <span className="sr-only">Edit</span>
          </th> */}
        </tr>
      </thead>
      <tbody className="bg-white">
        {customers?.map((customer) => (
          <tr
            key={customer.id}
            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
          >
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
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
            </td>
            <td className="whitespace-nowrap px-3 py-3">
              {customer.email}
            </td>
            <td className={`${inconsolata.className} whitespace-nowrap px-3 py-3 text-right`}>
              {formatNumber(customer.total_invoices)}
            </td>
            <td className={`${inconsolata.className} whitespace-nowrap px-3 py-3 text-right`}>
              {formatFinancialNumber(customer.total_pending)}
            </td>
            <td className={`${inconsolata.className} whitespace-nowrap px-3 py-3 text-right`}>
              {formatFinancialNumber(customer.total_paid)}
            </td>
            {/* <td className="whitespace-nowrap py-3 pl-6 pr-3">
              <div className="flex justify-end gap-3">
                <UpdateInvoice id={invoice.id} />
                <DeleteInvoice id={invoice.id} />
              </div>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
