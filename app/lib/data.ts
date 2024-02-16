// import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  // Revenue,
} from './definitions';
import { formatCurrency } from './utils';
// import { customers, invoices, revenue } from './placeholder-data';
import { unstable_noStore as noStore } from 'next/cache';
import prisma from '@/app/lib/prisma';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // const data = { rows: revenue };
    // const data = await sql<Revenue>`SELECT * FROM revenue`;
    const data = await prisma.revenue.findMany();

    console.log('Data fetch completed after 3 seconds.');

    // return data.rows;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // const data = {
    //   rows: invoices
    //     .sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime())
    //     .filter((_, idx) => idx < 5)
    //     .map((invoice, idx) => {
    //       const customer = customers.find((customer) => customer.id == invoice.customer_id);
    //       return {
    //         ...invoice,
    //         id: `${idx + 1}`,
    //         name: `${customer?.name}`,
    //         image_url: `${customer?.image_url}`,
    //         email: `${customer?.email}`,
    //       }
    //     })
    // }
    // const data = await sql<LatestInvoiceRaw>`
    //   SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   ORDER BY invoices.date DESC
    //   LIMIT 5`;
    const data = await prisma.$queryRaw<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;
    // const data = await prisma.invoice.findMany({
    //   include: { customer: true },
    //   orderBy: [{ date: 'desc' }],
    //   take: 5,
    // })

    // const latestInvoices = data.rows.map((invoice) => ({
    //   ...invoice,
    //   amount: formatCurrency(invoice.amount),
    // }));
    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(Number(invoice.amount)),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    await new Promise((resolve) => setTimeout(resolve, 500));

    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    // const data: any = [
    //   { rows: [{ count: invoices.length }] },
    //   { rows: [{ count: customers.length }] },
    //   {
    //     rows: [
    //       {
    //         paid: invoices.filter((invoice) => invoice.status == 'paid').reduce((acc, invoice) => acc + invoice.amount, 0),
    //         pending: invoices.filter((invoice) => invoice.status == 'pending').reduce((acc, invoice) => acc + invoice.amount, 0)
    //       },
    //     ]
    //   },
    // ];
    // const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    // const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    // const invoiceStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM invoices`;
    const invoiceCountPromise = prisma.invoice.count();
    const customerCountPromise = prisma.customer.count();
    const invoiceStatusPromise = prisma.$queryRaw<
      { paid: number; pending: number }[]
    >`SELECT
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
      FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);
    // const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    // const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    // const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    // const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');
    const numberOfInvoices = Number(data[0] ?? '0');
    const numberOfCustomers = Number(data[1] ?? '0');
    const totalPaidInvoices = formatCurrency(Number(data[2][0].paid ?? '0'));
    const totalPendingInvoices = formatCurrency(
      Number(data[2][0].pending ?? '0'),
    );

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // const invoices = await sql<InvoicesTable>`
    //   SELECT
    //     invoices.id,
    //     invoices.amount,
    //     invoices.date,
    //     invoices.status,
    //     customers.name,
    //     customers.email,
    //     customers.image_url
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   WHERE
    //     customers.name ILIKE ${`%${query}%`} OR
    //     customers.email ILIKE ${`%${query}%`} OR
    //     invoices.amount::text ILIKE ${`%${query}%`} OR
    //     invoices.date::text ILIKE ${`%${query}%`} OR
    //     invoices.status ILIKE ${`%${query}%`}
    //   ORDER BY invoices.date DESC
    //   LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    // `;
    const invoices = await prisma.$queryRaw<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    // return invoices.rows;
    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();

  try {
    //   const count = await sql`SELECT COUNT(*)
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   WHERE
    //     customers.name ILIKE ${`%${query}%`} OR
    //     customers.email ILIKE ${`%${query}%`} OR
    //     invoices.amount::text ILIKE ${`%${query}%`} OR
    //     invoices.date::text ILIKE ${`%${query}%`} OR
    //     invoices.status ILIKE ${`%${query}%`}
    // `;
    const count = await prisma.$queryRaw<[{ count: number }]>`SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;

    // const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();

  try {
    // const data = await sql<InvoiceForm>`
    //   SELECT
    //     invoices.id,
    //     invoices.customer_id,
    //     invoices.amount,
    //     invoices.status
    //   FROM invoices
    //   WHERE invoices.id = ${id};
    // `;
    const data = await prisma.$queryRaw<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    // const invoice = data.rows.map((invoice) => ({
    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  noStore();

  try {
    // const data = await sql<CustomerField>`
    //   SELECT
    //     id,
    //     name
    //   FROM customers
    //   ORDER BY name ASC
    // `;
    const data = await prisma.$queryRaw<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    // const customers = data.rows;
    const customers = data;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await prisma.$queryRaw<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_invoices: Number(customer.total_invoices),
      total_pending: Number(customer.total_pending),
      total_paid: Number(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomersPages(query: string) {
  noStore();

  try {
    const count = await prisma.customer.count();

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchCustomerById(id: string) {
  noStore();

  try {
    const data = await prisma.customer.findFirst({ where: { id } });
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer.');
  }
}

export async function getUser(email: string) {
  noStore();

  try {
    // const user = await sql`SELECT * FROM users WHERE email=${email}`;
    const user = await prisma.$queryRaw<
      User[]
    >`SELECT * FROM users WHERE email=${email}`;
    // return user.rows[0] as User;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
