const UserRepository = require('./repository');
const UserService = require('./service');

class Route {
    constructor(method, uri, callback, fullMatch, guards) {
        this.method = method;
        this.uri = uri;
        this.callback = callback;
        this.fullMatch = fullMatch;
        this.guards = guards;
    }
}

class Router {
    constructor() {
        this.routes = [];
    }

    addRoute(method, uri, callback, fullMatch, guards) {
        this.routes.push(new Route(method, uri, callback, fullMatch, guards));
    }

    async solve(req, res, body, uri) {
        let userRepository = new UserRepository();
        let userService = new UserService(userRepository);

        for (let route of this.routes) {
            if (req.method == route.method) {
                if (route.fullMatch) {
                    if (route.uri === uri) {
                        if (!this.routeGuardsPassed(route, req)) {
                            res.statusCode = 401;
                            res.statusMessage = 'Unauthorized';
                            res.end('Missing or invalid token');
                        } else {
                            await route.callback(req, res, body, userService);
                        }
                        return;
                    }
                } else {
                    if (uri.startsWith(route.uri)) {
                        if (!this.routeGuardsPassed(route, req)) {
                            res.statusCode = 401;
                            res.statusMessage = 'Unauthorized';
                            res.end('Missing or invalid token');
                        } else {
                            await route.callback(req, res, body, userService);
                        }
                        return;
                    }
                }
            }
        }

        res.statusCode = 400;
        res.statusMessage = 'Bad Request';
        res.end();
    }

    routeGuardsPassed(route, req) {
        if (route['guards'] == null || route['guards'] == undefined) {
            return true;
        }
        for (let guard of route['guards']) {
            if (!guard(req)) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Router;