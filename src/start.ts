import { createMiddleware, createStart } from "@tanstack/react-start";

const logErrors = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    const message =
      error instanceof Error
        ? `${error.name}: ${error.message}\n${error.stack ?? ""}`
        : String(error);
    console.error("[plan-decoder]", message);
    return new Response(`Plan Decoder server error\n\n${message}\n`, {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [logErrors],
}));
