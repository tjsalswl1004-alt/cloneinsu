import { proxy } from '@/lib/backend';

export async function POST(request: Request) {
  return proxy('/auth/signup', request);
}
