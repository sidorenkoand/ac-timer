const http = require('http');
const fs = require('fs');
const path = require('path');

class JSONServer {

    body
    req
    res

    constructor(port) {
        this.port = port || 3000;
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }

    async handleRequest(req, res) {
        this.req = req;
        this.res = res;
        const url = req.url.replaceAll('/', '_');
        const jsonFilePath = path.join(__dirname, 'json', `${url}.json`);

        await this.loadBody();

        try {
            this.validateRequest(req.url);
        } catch (error) {
            this.sendError(error.message, 400);
            console.log(error);
            return;
        }

        if (fs.existsSync(jsonFilePath)) {
            fs.readFile(jsonFilePath, 'utf8', (err, data) => {
                if (err) {
                    this.sendError(err.message, 500);
                } else {
                    this.sendResponse(data);
                }
            });
        } else {
            this.sendError('File not found: ' + jsonFilePath, 404);
        }
    }

    validateRequest(url) {
        if (url === '/api/v1/issue-token') {
            if (this.body.username !== 'dev@example.com' || this.body.password !== 'Impossible-pass') {
                throw new Error('Wrong credentials');
            }
        } else if (this.req.headers['Authentication'] !== 'Bearer 2-6zmW8dnKpHqPLwVk2f3LMrTfVxAiJU1DibofeCPt') {
            throw new Error('Wrong token');
        }
    }

    sendResponse(data, statusCode = 200) {
        this.res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        this.res.end(data);
    }

    sendError(message, statusCode = 500) {
        this.res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify({"type": "ApiError", "message": message}));
    }

    loadBody() {
        return new Promise((resolve, reject) => {
            let data = '';

            this.req.on('data', chunk => {
                data += chunk;
            });

            this.req.on('end', async () => {
                try {
                    this.body = JSON.parse(data);
                    resolve(this.body);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}

const server = new JSONServer(3000);
server.start();
