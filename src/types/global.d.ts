/* eslint-disable @typescript-eslint/no-explicit-any */

export {};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (
      command: string,
      eventOrId?: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq?: unknown;
  }
}
