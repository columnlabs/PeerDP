import SimpleSocket from "simple-socket-js";
import { Monitor } from "node-screenshots";
import 'dotenv/config'

const socket = new SimpleSocket({
  project_id: 
    "618b715cc97663b8d8809a78",
  project_token:
    process.env.SIMPLESOCKET_SERVER_TOKEN
});

const monitor = Monitor.all()[0];

let stopped = false;

process.on("SIGINT", () => {
  console.log("Stopping stream...");
  stopped = true;
  socket.close?.();
});

async function stream() {
  console.log("Starting stream...")
  await new Promise(r => setTimeout(r, 768));
  console.log("Stream started!");

  while (!stopped) {
    const image = await monitor.captureImage();
    const jpeg = image.toJpegSync();
    const jpegBase64 = jpeg.toString("base64");

    socket.publish({ task: "stream" }, { frame: jpegBase64 });

    await new Promise(r => setTimeout(r, 33));
  }

  process.exit(0);
}

stream();