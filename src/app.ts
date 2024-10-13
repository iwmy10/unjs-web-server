import { RequestListener } from "http";
import { addRoute, createRouter, findRoute, RouterContext } from "rou3";

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

type AppRoute = { handler: (params?: Record<string, string>) => string };

class App {
  _router: RouterContext<AppRoute>;
  constructor() {
    this._router = createRouter();
  }

  on(method: HTTPMethod, route: string, handler: AppRoute["handler"]) {
    addRoute(this._router, method, route, { handler });
  }

  _handle: RequestListener = (req, res) => {
    const route = findRoute(this._router, req.method as HTTPMethod, req.url!);
    if (route) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      const data = route.data.handler(route.params);
      res.end(data);
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  };
}
