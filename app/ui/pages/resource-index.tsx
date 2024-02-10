import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import { PrimaryButton } from '@/app/ui/invoices/buttons';
import { bai_jamjuree } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { PlusIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Invoices',
};

// export type UseResourceIndexProps<T> = {
//   query: string,
//   page: string,
//   fetchResourcesPages: (query: string) => Promise<number>,
//   fetchFilteredResources: (query: string) => Promise<T[]>,
// }

// maybe adjust per resource type
export type ResourceIndexProps<T> = {
  createButtonTitle?: string;
  createButtonUrl: string;
  fetchFilteredResources: (query: string, currentPage: number) => Promise<T[]>,
  fetchResourcesPages: (query: string) => Promise<number>,
  page?: string;
  query?: string;
  renderResources: (resources: T[]) => JSX.Element;
  searchPlaceholder?: string;
  title?: string;
}

// export function useResourceIndex<T>(props: UseResourceIndexProps<T>) {
//   return {
//     query: props.query || '',
//     currentPage: Number(props.page) || 1,
//     totalPages: props.fetchResourcesPages(props.query),
//     fetchFilteredResources: props.fetchFilteredResources,
//   }
// }

export default async function ResourceIndex<T>(props: ResourceIndexProps<T>) {
  const query = props.query || '';
  const currentPage = Number(props.page) || 1;

  const totalPages = await props.fetchResourcesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${bai_jamjuree.className} text-2xl`}>{props.title}</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={props.searchPlaceholder || 'Search ...'} />
        <PrimaryButton
          icon={<PlusIcon className="h-5 md:ml-4" />}
          title={props.createButtonTitle}
          url={props.createButtonUrl}
        />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <ResourcesTable<T>
          query={query}
          currentPage={currentPage}
          fetchFilteredResources={props.fetchFilteredResources}
          renderResources={props.renderResources}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

export async function ResourcesTable<T>({
  currentPage,
  fetchFilteredResources,
  query,
  renderResources,
}: {
  currentPage: number;
  fetchFilteredResources: (query: string, currentPage: number) => Promise<T[]>,
  query: string;
  renderResources: (resources: T[]) => JSX.Element;
}) {
  const resources = await fetchFilteredResources(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {renderResources(resources)}
          {/* <div className="md:hidden">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  );
}