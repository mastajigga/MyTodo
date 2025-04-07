import { describe, it, expect, vi, beforeEach } from 'vitest';
import { middleware } from '@/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createMiddlewareClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
    },
  })),
}));

describe('Auth Middleware', () => {
  let mockReq: NextRequest;
  
  beforeEach(() => {
    mockReq = new NextRequest(new URL('http://localhost:3000'));
  });

  it('should redirect to login for protected routes when not authenticated', async () => {
    const mockSupabase = createMiddlewareClient({ req: mockReq, res: NextResponse.next() });
    vi.mocked(mockSupabase.auth.getSession).mockResolvedValue({ data: { session: null }, error: null });

    mockReq = new NextRequest(new URL('http://localhost:3000/dashboard'));
    const response = await middleware(mockReq);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response?.url).toBe('http://localhost:3000/auth/login?redirectTo=/dashboard');
  });

  it('should allow access to public routes when not authenticated', async () => {
    const mockSupabase = createMiddlewareClient({ req: mockReq, res: NextResponse.next() });
    vi.mocked(mockSupabase.auth.getSession).mockResolvedValue({ data: { session: null }, error: null });

    mockReq = new NextRequest(new URL('http://localhost:3000/auth/login'));
    const response = await middleware(mockReq);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response?.url).toBeUndefined();
  });

  it('should redirect to dashboard when accessing auth routes while authenticated', async () => {
    const mockSupabase = createMiddlewareClient({ req: mockReq, res: NextResponse.next() });
    vi.mocked(mockSupabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    });

    mockReq = new NextRequest(new URL('http://localhost:3000/auth/login'));
    const response = await middleware(mockReq);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response?.url).toBe('http://localhost:3000/dashboard');
  });

  it('should allow access to protected routes when authenticated', async () => {
    const mockSupabase = createMiddlewareClient({ req: mockReq, res: NextResponse.next() });
    vi.mocked(mockSupabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    });

    mockReq = new NextRequest(new URL('http://localhost:3000/dashboard'));
    const response = await middleware(mockReq);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response?.url).toBeUndefined();
  });
}); 