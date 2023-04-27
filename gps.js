const net = require("net");

class GPSListener {
  constructor(port, onMessageCallback) {
    this.port = port;
    this.onMessageCallback = onMessageCallback;
    this.status = "stopped";
  }

  start() {
    const server = net.createServer((socket) => {
      console.log(
        `GPS device connected: ${socket.remoteAddress}:${socket.remotePort}`
      );
      socket.on("data", (data) => {
        const message = data.toString().trim();
        console.log(`Received GPS message: ${message}`);
        this.onMessageCallback(message);
      });
      socket.on("end", () => {
        console.log("GPS device disconnected");
      });
      socket.write("Connected to GPS listener\n");
    });

    server.listen(this.port, () => {
      console.log(`GPS listener started on port ${this.port}`);
      this.status = "running";
    });

    server.on("error", (err) => {
      console.error("GPS listener error:", err);
      this.status = "error";
    });
  }

  stop() {
    // close the server to stop listening for connections
    server.close(() => {
      console.log("GPS listener stopped");
      this.status = "stopped";
    });
  }

  restart() {
    // stop the server if it's currently running, then start it again
    if (this.status === "running") {
      this.stop();
    }
    this.start();
  }

  getStatus() {
    return this.status;
  }
}

module.exports = GPSListener;
