import Image from 'next/image';
import {
  formatCurrency,
  formatFinancialNumber,
  formatNumber,
} from '@/app/lib/utils';
import { inconsolata } from '@/app/ui/fonts';
import ResourceRenderer, {
  CardProps, TableDataProps,
} from '@/app/ui/pages/resource-renderer';
import { ActionButton } from '@/app/ui/components/buttons';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DeleteModal from '@/app/ui/customers/delete-modal';
import { CustomersTableType } from '@/app/lib/definitions';

export const SEARCH_PARAM_RESOURCE_MAP = {
  'customerEmail': 'email',
  'customerImageUrl': 'image_url',
  'customerName': 'name',
};

export type DeleteModalSearchParamsType = {
  openDeleteModal?: string;
  customerEmail?: string;
  customerName?: string;
  customerImageUrl?: string;
};

export default function renderCustomers(
  customers: CustomersTableType[],
) {
  const createDeleteUrl = (customer: CustomersTableType): string => {
    const params = new URLSearchParams();
    params.set('openDeleteModal', true.toString());
    let key: keyof typeof SEARCH_PARAM_RESOURCE_MAP;
    for (key in SEARCH_PARAM_RESOURCE_MAP) {
      let searchParamKey = SEARCH_PARAM_RESOURCE_MAP[key] as keyof CustomersTableType;
      params.set(key, `${customer[searchParamKey]}`);
    }
    return `/dashboard/customers?${params.toString()}`;
  };

  return (
    <>
      <ResourceRenderer
        tableHeaders={tableHeaders}
        resources={customers.map((customer) => ({
          action: (
            <>
              <ActionButton
                icon={<PencilIcon className="w-5" />}
                url={`/dashboard/customers/${customer.id}/edit`}
              />
              <ActionButton
                icon={<TrashIcon className="w-5" />}
                url={createDeleteUrl(customer)}
              />
            </>
          ),
          card: getCardProps(customer),
          cols: getTableDataProps(customer),
          key: `customer-${customer.id}`,
        }))}
      />
      <DeleteModal />
    </>
  );
}

const tableHeaders = [
  { children: <>Customer</>, key: 'header-customer' },
  { children: <>Email</>, key: 'header-email' },
  {
    children: <># Invoices</>,
    className: 'text-right',
    key: 'header-invoices',
  },
  {
    children: <>฿ Pending</>,
    className: 'text-right',
    key: 'header-pending',
  },
  {
    children: <>฿ Paid</>,
    className: 'text-right',
    key: 'header-paid',
  },
];

const getTableDataProps = (customer: CustomersTableType): TableDataProps[] => [
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
];

const getCardProps = (customer: CustomersTableType): CardProps => ({
  upperPanel: (
    <>
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
    </>
  ),
  lowerPanel: (
    <div>
      <div className="flex w-1/2 flex-col">
        <p className="text-xs">Pending</p>
        <p className={`${inconsolata.className}`}>
          {formatCurrency(customer.total_pending)}
        </p>
      </div>
      <div className="flex w-1/2 flex-col">
        <p className="text-xs">Paid</p>
        <p className={`${inconsolata.className}`}>
          {formatCurrency(customer.total_paid)}
        </p>
      </div>
    </div>
  ),
});
