import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTRPCContext } from "../../trpc";
import { authRouter } from "../authApi";
import { prismaMock } from "../../../../test/setup";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@prisma/client";
import { RoleEnumType } from "@prisma/client";
import bcrypt from "bcrypt";

describe('Auth Router', () => {
  const mockRes = {
    setHeader: vi.fn(),
  } as unknown as NextApiResponse;

  const ctx = createTRPCContext({
    req: {} as NextApiRequest,
    res: mockRes,
  });

  const caller = authRouter.createCaller(ctx);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should authenticate a valid user', async () => {
      const hashedPassword = bcrypt.hashSync('password123', 10);
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: RoleEnumType.user,
        cpf_cnpj: '12345678900',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findFirst.mockResolvedValue(mockUser);

      const result = await caller.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
      expect(mockRes.setHeader).toHaveBeenCalled();
    });

    it('should throw error for non-existent user', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      await expect(caller.login({
        email: 'wrong@example.com',
        password: 'wrongpass',
      })).rejects.toThrow('Usuário não encontrado');
    });

    it('should throw error for invalid password', async () => {
      const hashedPassword = bcrypt.hashSync('correctpass', 10);
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: RoleEnumType.user,
        cpf_cnpj: '12345678900',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findFirst.mockResolvedValue(mockUser);

      await expect(caller.login({
        email: 'test@example.com',
        password: 'wrongpass',
      })).rejects.toThrow('Invalid email or password');
    });
  });
}); 