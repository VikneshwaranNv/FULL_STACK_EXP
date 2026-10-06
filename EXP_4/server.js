const http = require("http");

const server = http.createServer((req, res) => {

    // GET request
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>GET and POST Application</title>
            </head>

            <body>
                <h1>Node.js GET and POST Application</h1>

                <h2>GET Request</h2>
                <p>This page is displayed using a GET request.</p>

                <h2>POST Request</h2>

                <form method="POST" action="/submit">

                    <label>Enter your name:</label>

                    <input
                        type="text"
                        name="name"
                        required
                    >

                    <button type="submit">
                        Submit
                    </button>

                </form>
            </body>
            </html>
        `);
    }

    // POST request
    else if (req.method === "POST" && req.url === "/submit") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const data = new URLSearchParams(body);

            const name = data.get("name");

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>POST Successful</title>
                </head>

                <body>

                    <h1>POST Request Successful</h1>

                    <p>Hello, ${name}!</p>

                    <p>
                        Your data was received successfully.
                    </p>

                    <br>

                    <a href="/">
                        Go Back
                    </a>

                </body>
                </html>
            `);
        });
    }

    // Invalid URL
    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Page Not Found");
    }
});

server.listen(3001, () => {

    console.log(
        "Server running at http://localhost:3001"
    );

});