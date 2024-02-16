'use client';

import Link from 'next/link';
import {
  AtSymbolIcon,
  LinkIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createCustomer, updateCustomer } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { CustomerForm } from '@/app/lib/definitions';

const useForm = (customerId?: string) => {
  let action = createCustomer;
  if (customerId) {
    action = updateCustomer.bind(null, customerId)
  }
  const initialState = { message: null, errors: {} };
  return useFormState(action, initialState);
}

export default function Form({
  defaultForm,
}: {
  defaultForm?: CustomerForm
}) {
  const [state, dispatch] = useForm(defaultForm?.id)

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Choose name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              placeholder="Enter name"
              defaultValue={defaultForm?.name}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-10 text-sm outline-2 placeholder:text-gray-500"
              required
              aria-describedby="name-error"
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Choose email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              placeholder="Enter email"
              defaultValue={defaultForm?.email}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-10 text-sm outline-2 placeholder:text-gray-500"
              required
              aria-describedby="email-error"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Image Url */}
        <div className="mb-4">
          <label htmlFor="image-url" className="mb-2 block text-sm font-medium">
            Choose image url
          </label>
          <div className="relative">
            <input
              id="image-url"
              name="imageUrl"
              placeholder="Enter image-url"
              defaultValue={defaultForm?.image_url || ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="image-url-error"
            />
            <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="image-url-error" aria-live="polite" aria-atomic="true">
            {state.errors?.imageUrl &&
              state.errors.imageUrl.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Address */}
        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            Choose address
          </label>
          <div className="relative">
            <input
              id="address"
              name="address"
              placeholder="Enter address"
              defaultValue={defaultForm?.address || ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="address-error"
            />
            <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="address-error" aria-live="polite" aria-atomic="true">
            {state.errors?.address &&
              state.errors.address.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Choose phone
          </label>
          <div className="relative">
            <input
              id="phone"
              name="phoneNumber"
              placeholder="Enter phone"
              defaultValue={defaultForm?.phone_number || ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="phone-error"
            />
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="phone-error" aria-live="polite" aria-atomic="true">
            {state.errors?.phoneNumber &&
              state.errors.phoneNumber.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {state.message ? (
          <div id="message-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500" key="message-error">
              {state.message}
            </p>
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Customer</Button>
      </div>
    </form>
  );
}
