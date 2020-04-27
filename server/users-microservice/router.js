class Route {
    constructor(method, uri, callback, fullMatch) {
        this.method = method;
        this.uri = uri;
        this.callback = callback;
        this.fullMatch = fullMatch;
    }
}

class Router {
    constructor() {
        this.routes = [];
    }

    addRoute(method, uri, callback, fullMatch) {
        this.routes.push(new Route(method, uri, callback, fullMatch));
    }

    async solve(req, res, body, uri) {
        for (let route of this.routes) {
            if (req.method == route.method) {
                if (route.fullMatch) {
                    if (route.uri === uri) {
                        await route.callback(req, res, body);
                        return;
                    }
                } else {
                    if (uri.startsWith(route.uri)) {
                        await route.callback(req, res, body);
                        return;
                    }
                }
            }
        }

        res.status = 400;
        res.statusMessage = 'Bad Request';
        res.end();
    }
}

router = new Router();

module.exports = Router;