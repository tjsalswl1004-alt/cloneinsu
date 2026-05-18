import { proxy } from '@/lib/backend';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const path = status ? `/claims?status=${encodeURIComponent(status)}` : '/claims';
  return proxy(path, request);
}

export async function POST(request: Request) {
  return proxy('/claims', request);
}
