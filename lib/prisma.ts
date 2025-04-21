import { PrismaClient } from "@prisma/client"

// Create a mock PrismaClient for when the real one fails to initialize
const createMockPrismaClient = () => {
  console.warn("Using mock PrismaClient because the real one failed to initialize")

  return {
    user: {
      findUnique: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      findMany: () => Promise.resolve([]),
    },
    project: {
      create: () => Promise.resolve({}),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    },
    screen: {
      create: () => Promise.resolve({}),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve({}),
      count: () => Promise.resolve(0),
    },
    report: {
      create: () => Promise.resolve({}),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
    },
    issue: {
      create: () => Promise.resolve({}),
      createMany: () => Promise.resolve({ count: 0 }),
      groupBy: () => Promise.resolve([]),
    },
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
  } as unknown as PrismaClient
}

// Try to initialize the real PrismaClient, but fall back to the mock if it fails
let prisma: PrismaClient

try {
  // PrismaClient is attached to the `global` object in development to prevent
  // exhausting your database connection limit.
  const globalForPrisma = global as unknown as { prisma: PrismaClient }

  prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
} catch (error) {
  console.error("Failed to initialize PrismaClient:", error)
  prisma = createMockPrismaClient()
}

export default prisma
