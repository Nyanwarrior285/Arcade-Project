const http = require("http");
const url = require("url");

const PORT = 3000;

const listOfItems = [
    {
        title: "My Way",
        artist: "Frank Sinatra",
        genre: "Classic Jazz",
        streams: 0,
    },
    {
        title: "The Climb",
        artist: "Miley Cyrus",
        genre: "Pop",
        streams: 1_234_567,
    },
    {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        genre: "Awesome",
        streams: 65_536,
    },
];

function handleRequest(req, res) {
    const parsedURL = url.parse(req.url);
    const path = parsedURL.pathname;

    if (path.startsWith("/songs-list")) {
        let index = path.split("/")[2];
        if (index) {
            index = parseInt(index);
        }

        if (req.method == "GET") {
            if (typeof index == "number") {
                if (index >= 0 && index < listOfItems.length) {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(listOfItems[index]));
                } else {
                    res.writeHead(404, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({error: "Index out of bounds"}));
                };
            } else {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(listOfItems));
            };
        };
    };

    // if () {

    // };

    if (!res.writableEnded) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify(
            {error: "Bad Request"}
        ));
    };
};

function main() {
    const server = http.createServer(handleRequest);

    server.listen(PORT, () => {
        console.log("Server listening on http://localhost:" + PORT + "/");
    });
};

main();