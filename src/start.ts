import { createMiddleware, createStart } from "@tanstack/react-start";

const SECURITY = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "frame-ancestors 'none'",
} as const;

function withSecurityHeaders(response: Response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY)) {
    if (!headers.has(key)) headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const logErrors = createMiddleware().server(async ({ next }) => {
  try {
    const result = await next();
    if (result instanceof Response) return withSecurityHeaders(result);
    return result;
  } catch (error) {
    const message =
      error instanceof Error
        ? `${error.name}: ${error.message}\n${error.stack ?? ""}`
        : String(error);
    console.error("[plan-decoder]", message);
    return withSecurityHeaders(
      new Response("Something went wrong. Please try again.", {
        status: 500,
        headers: { "content-type": "text/plain; charset=utf-8" },
      }),
    );
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [logErrors],
}));
