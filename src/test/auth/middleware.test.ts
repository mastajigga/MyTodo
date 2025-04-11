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
  createMiddlewareClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
  })),
}));

describe('Auth Middleware', () => {
  let mockReq: NextRequest;
  let mockSupabase: ReturnType<typeof createMiddlewareClient>;

  beforeEach(() => {
    mockReq = new NextRequest(new URL('http://localhost:3000'));
    mockSupabase = createMockSupabaseClient() as unknown as ReturnType<typeof createMiddlewareClient>;
    vi.mocked(createMiddlewareClient).mockReturnValue(mockSupabase);
  });

  it('should redirect to login for protected routes when not authenticated', async () => {
    mockReq = new NextRequest(new URL('http://localhost:3000/dashboard'));
    mockSupabase.auth.getUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });

    const response = await middleware(mockReq);

    expect(response).toBeInstanceOf(NextResponse);
    const redirectUrl = new URL('/auth/login', 'http://localhost:3000');
    redirectUrl.searchParams.set('redirectTo', '/dashboard');
    expect(response?.url).toBe(redirectUrl.toString());
  });

  it('should allow access to public routes when not authenticated', async () => {
    mockReq = new NextRequest(new URL('http://localhost:3000/auth/login'));
    mockSupabase.auth.getUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });

    const response = await middleware(mockReq);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response?.url).toBeUndefined();
  });

  it('should redirect to dashboard when accessing auth routes while authenticated', async () => {
    mockReq = new NextRequest(new URL('http://localhost:3000/auth/login'));
    mockSupabase.auth.getUser = vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null });

    const response = await middleware(mockReq);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response?.url).toBe('http://localhost:3000/dashboard');
  });

  it('should allow access to protected routes when authenticated', async () => {
    mockReq = new NextRequest(new URL('http://localhost:3000/dashboard'));
    mockSupabase.auth.getUser = vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null });

    const response = await middleware(mockReq);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response?.url).toBeUndefined();
  });
}); 