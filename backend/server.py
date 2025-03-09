import asyncio
import websockets
import os
from collections import deque

LOG_FILE = "log.txt"  # Adjust path if needed

async def tail_log(websocket, path):
    print("Client connected!")  # Debugging

    try:
        with open(LOG_FILE, "r") as f:
            # Read the last 10 lines
            last_lines = deque(f, maxlen=10)  # Store last 10 lines efficiently
            for line in last_lines:
                await websocket.send(line.strip())

            f.seek(0, os.SEEK_END)  # Move to end of file for live updates

            while True:
                line = f.readline()
                if not line:
                    await asyncio.sleep(0.5)
                    continue

                print(f"Sending: {line.strip()}")  # Debugging
                await websocket.send(line.strip())

    except Exception as e:
        print("Error:", e)

async def server():
    print("Starting WebSocket server on ws://localhost:8765")  # Debugging
    async with websockets.serve(tail_log, "localhost", 8765):
        await asyncio.Future()  # Keep server running

if __name__ == "__main__":
    asyncio.run(server())
