import { RequestListener } from "http";
import { addRoute, createRouter, findRoute, RouterContext } from "rou3";
import { parseQuery, parseURL } from "ufo";

export const createApp = () => new App();

type HTTPMethod =
  | "GET"
  | "HEAD"
  | "PATCH"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE";

type Context = { params?: Record<string, string>; query: any };
type Handler = (ctx: Context) => string;
type AppRoute = { handler: Handler };

export class App {
  _router: RouterContext<AppRoute>;
  constructor() {
    this._router = createRouter();
  }

  on(method: HTTPMethod, route: string, handler: Handler) {
    addRoute(this._router, method, route, { handler });
  }

  _handle: RequestListener = (req, res) => {
    const url = parseURL(req.url || "/");
    const route = findRoute(
      this._router,
      req.method as HTTPMethod,
      url.pathname
    );

    if (route) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      const context = {
        params: route.params,
        query: parseQuery(url.search),
      };
      const data = route.data.handler(context);
      res.end(data);
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  };
}
