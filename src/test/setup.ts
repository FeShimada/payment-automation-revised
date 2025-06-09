import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'vitest-mock-extended';
import { beforeEach, vi } from 'vitest';

export const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

vi.mock('../server/db', () => ({
  default: {
    prisma: prismaMock,
  },
  prisma: prismaMock,
})); 