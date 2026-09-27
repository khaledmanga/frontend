import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";

export const config = {
  api: {
    bodyParser: false,
  },
};

const hopByHopHeaders = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

function withoutHopByHopHeaders(headers: IncomingHttpHeaders): IncomingHttpHeaders {
  const forwarded = { ...headers };
  for (const header of hopByHopHeaders) {
    delete forwarded[header];
  }
  return forwarded;
}

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  const apiOrigin = process.env.API_ORIGIN;
  if (!apiOrigin) {
    res.statusCode = 500;
    res.end("API_ORIGIN is not configured.");
    return;
  }

  let target: URL;
  try {
    target = new URL(req.url ?? "/", apiOrigin);
  } catch {
    res.statusCode = 500;
    res.end("API_ORIGIN must be a valid HTTP(S) URL.");
    return;
  }

  const transport =
    target.protocol === "https:"
      ? httpsRequest
      : target.protocol === "http:"
        ? httpRequest
        : null;
  if (!transport) {
    res.statusCode = 500;
    res.end("API_ORIGIN must use HTTP or HTTPS.");
    return;
  }

  const requestHeaders = withoutHopByHopHeaders(req.headers);
  requestHeaders.host = target.host;

  const upstream = transport(
    target,
    { method: req.method, headers: requestHeaders },
    (upstreamResponse) => {
      res.writeHead(
        upstreamResponse.statusCode ?? 502,
        withoutHopByHopHeaders(upstreamResponse.headers),
      );
      upstreamResponse.pipe(res);
    },
  );

  upstream.on("error", (error: Error) => {
    console.error("API proxy request failed:", error);
    if (!res.headersSent) {
      res.statusCode = 502;
    }
    res.end("Unable to reach the API.");
  });

  req.pipe(upstream);
}
