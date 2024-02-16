import { Suspense } from 'react';
import Pagination from '@/app/ui/components/pagination';
import Search from '@/app/ui/search';
import { PrimaryButton } from '@/app/ui/components/buttons';
import { bai_jamjuree } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { PlusIcon } from '@heroicons/react/24/outline';

export type ResourceIndexProps<T> = {
  createButtonTitle?: string;
  createButtonUrl: string;
  fetchFilteredResources: (query: string, currentPage: number) => Promise<T[]>;
  fetchResourcesPages: (query: string) => Promise<number>;
  renderResources: (resources: T[]) => JSX.Element;
  searchPlaceholder?: string;
  title?: string;
} & ResourceIndexSearchParamsType;

export type ResourceIndexSearchParamsType = {
  page?: string;
  query?: string;
};

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
          title={props.createButtonTitle || 'Create'}
          url={props.createButtonUrl}
        />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <ResourcesRendererWrapper<T>
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

export async function ResourcesRendererWrapper<T>(props: {
  currentPage: number;
  fetchFilteredResources: (query: string, currentPage: number) => Promise<T[]>;
  query: string;
  renderResources: (resources: T[]) => JSX.Element;
}) {
  const resources = await props.fetchFilteredResources(
    props.query,
    props.currentPage,
  );

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        {/* <div className="rounded-lg bg-gray-50 p-2 md:pt-0"> */}
        <div className="rounded-lg bg-gray-50 p-2">
          {props.renderResources(resources)}
        </div>
      </div>
    </div>
  );
}
