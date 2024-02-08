import { PrismaClient } from '@prisma/client'
import { customers, invoices, revenue, users } from '../app/lib/placeholder-data.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const processedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return { ...user, password: hashedPassword }
    })
  )
  await prisma.user.createMany({ data: processedUsers })

  await prisma.customer.createMany({ data: customers })

  const processedInvoices = invoices.map((invoice) => ({ ...invoice, date: new Date(invoice.date) }))
  await prisma.invoice.createMany({ data: processedInvoices })

  await prisma.revenue.createMany({ data: revenue })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })