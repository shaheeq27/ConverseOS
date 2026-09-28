import { NextResponse } from "next/server";

export interface ApiResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: unknown;
}

export interface ApiResponseEnvelope<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: ApiResponseMeta;
  requestId: string;
  timestamp: string;
  version: string;
}

export function createApiResponse<T>({
  data,
  error,
  meta,
  status = 200,
}: {
  data?: T;
  error?: { code: string; message: string; details?: unknown };
  meta?: ApiResponseMeta;
  status?: number;
}): NextResponse<ApiResponseEnvelope<T>> {
  const requestId = `req_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
  const timestamp = new Date().toISOString();
  const version = "v1";

  const success = !error && status >= 200 && status < 300;

  return NextResponse.json(
    {
      success,
      ...(data !== undefined && { data }),
      ...(error && { error }),
      ...(meta && { meta }),
      requestId,
      timestamp,
      version,
    },
    { status }
  );
}
