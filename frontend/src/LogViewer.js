import { useState, useEffect, useRef } from "react";

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const isPausedRef = useRef(false);
  const ws = useRef(null);
  const logContainerRef = useRef(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8765");
    ws.current = websocket;
    console.log(websocket);
    
    websocket.onmessage = (event) => {
      if (!isPausedRef.current) {
        setLogs((prevLogs) => [...prevLogs.slice(-9), event.data]);
      }
    };

    websocket.onerror = (error) => console.error("WebSocket Error:", error);
    websocket.onclose = () => console.log("WebSocket closed");

    return () => {
      websocket.close(); // Ensure WebSocket is closed on unmount
    };
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="p-4 w-full max-w-2xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Live Log Viewer</h2>
      <div
        ref={logContainerRef}
        className="h-64 overflow-y-auto border border-gray-700 p-2 rounded-md"
      >
        {logs.map((log, index) => (
          <p key={index} className="text-sm font-mono">{log}</p>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          onClick={() => (isPausedRef.current = false)}
        >
          Play
        </button>
        <button
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
          onClick={() => (isPausedRef.current = true)}
        >
          Pause
        </button>
      </div>
    </div>
  );
};

export default LogViewer;
