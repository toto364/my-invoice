'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import prisma from '@/app/lib/prisma';

const InvoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// This is temporary until @types/react-dom is updated
export type InvoiceState = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

export async function createInvoice(
  prevState: InvoiceState,
  formData: FormData,
) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date();

  // Insert data into the database
  try {
    await prisma.invoice.create({
      data: {
        customer_id: customerId,
        amount: amountInCents,
        status,
        date,
      },
    });
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: InvoiceState,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Edit Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await prisma.$executeRaw`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.$executeRaw`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const CustomerFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  imageUrl: z.nullable(z.string()),
  address: z.nullable(z.string()),
  phoneNumber: z.nullable(z.string()),
});

// This is temporary until @types/react-dom is updated
export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    imageUrl?: string[];
    address?: string[];
    phoneNumber?: string[];
  };
  message?: string | null;
};

const CreateCustomer = CustomerFormSchema.omit({ id: true });

export async function createCustomer(
  prevState: CustomerState,
  formData: FormData,
) {
  // Validate form fields using Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    imageUrl: formData.get('imageUrl'),
    address: formData.get('address'),
    phoneNumber: formData.get('phoneNumber'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { name, email, imageUrl, address, phoneNumber } = validatedFields.data;

  // Insert data into the database
  try {
    await prisma.customer.create({
      data: {
        name,
        email,
        image_url: imageUrl || '',
        address,
        phone_number: phoneNumber,
      },
    });
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Customer.',
    };
  }

  // Revalidate the cache for the Customers page and redirect the user.
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

const UpdateCustomer = CustomerFormSchema.omit({ id: true });

export async function updateCustomer(
  id: string,
  prevState: CustomerState,
  formData: FormData,
) {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    imageUrl: formData.get('imageUrl'),
    address: formData.get('address'),
    phoneNumber: formData.get('phoneNumber'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Edit Customer.',
    };
  }

  const { name, email, imageUrl, address, phoneNumber } = validatedFields.data;

  try {
    await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        image_url: imageUrl || '',
        address,
        phone_number: phoneNumber,
      },
    });
  } catch (error) {
    return { message: 'Database Error: Failed to Update Customer.' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
  try {
    await prisma.customer.delete({ where: { id } });
    revalidatePath('/dashboard/customers');
    return { message: 'Deleted Customer' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Customer.' };
  }
}
