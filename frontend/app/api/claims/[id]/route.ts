import { proxy } from '@/lib/backend';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxy(`/claims/${id}`, request);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxy(`/claims/${id}`, request);
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxy(`/claims/${id}`, request);
}
