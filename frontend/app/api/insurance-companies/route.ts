import { proxy } from '@/lib/backend';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const path = category ? `/insurance-companies?category=${encodeURIComponent(category)}` : '/insurance-companies';
  return proxy(path, request);
}
