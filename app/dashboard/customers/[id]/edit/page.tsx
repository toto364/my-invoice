import Form from '@/app/ui/customers/form';
import Breadcrumbs from '@/app/ui/components/breadcrumbs';
import { fetchCustomerById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [customer] = await Promise.all([
    fetchCustomerById(id),
  ]);

  if (!customer) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Edit Customer',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form defaultForm={{
        ...customer,
        image_url: customer.image_url || '',
        address: customer.address || '',
        phone_number: customer.phone_number || '',
      }} />
    </main>
  );
}
