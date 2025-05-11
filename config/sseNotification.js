let clients = [];

const setupSSE = (app) => {
  app.get("/api/notifications", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    clients.push(res);

    req.on("close", () => {
      clients = clients.filter(client => client !== res);
    });
  });
};

const sendNotification = (message) => {
  clients.forEach(client =>
    client.write(`data: ${JSON.stringify(message)}\n\n`)
  );
};

module.exports = { setupSSE, sendNotification };
