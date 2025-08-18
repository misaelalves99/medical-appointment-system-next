// src/types/Error.ts

export interface ErrorViewModel {
  requestId?: string | null;
  showRequestId: boolean;
}

export function createErrorViewModel(requestId?: string | null): ErrorViewModel {
  return {
    requestId,
    showRequestId: !!requestId,
  };
}
