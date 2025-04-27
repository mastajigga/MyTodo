import { describe, it, expect, vi, beforeEach } from 'vitest';
import { middleware } from '@/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { Session, User, SupabaseClient } from '@supabase/supabase-js';
import { createMockSupabaseClient } from '@/types/mocks/supabase';
import { Database } from '@/types/supabase';

const mockUser: User = {
  id: 'user-123',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  role: 'authenticated',
  email: 'test@example.com',
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
};

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createMiddlewareClient: vi.fn()
}));

describe('Auth Middleware', () => {
  const mockSupabase = createMockSupabaseClient();
  const mockResponse = new NextResponse();
  let mockRequest: NextRequest;

  beforeEach(() => {
    mockRequest = new NextRequest(new URL('http://localhost:3000'));
    (createMiddlewareClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('should allow access when user is authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
      error: null
    });

    const response = await middleware(mockRequest);
    expect(response.status).toBe(200);
  });

  it('should redirect to login when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null
    });

    const response = await middleware(mockRequest);
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/auth/login');
  });
}); 