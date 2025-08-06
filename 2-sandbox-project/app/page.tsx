"use client";

import { useState, useEffect, useCallback } from "react";

interface SandboxState {
  loading: boolean;
  error: string | null;
  sandboxUrl: string | null;
  sandboxId: string | null;
  connected: boolean;
}

const SANDBOX_API_URL =
  process.env.NEXT_PUBLIC_SANDBOX_API_URL || "http://localhost:4000";

export default function SandboxInterface() {
  const [state, setState] = useState<SandboxState>({
    loading: true,
    error: null,
    sandboxUrl: null,
    sandboxId: null,
    connected: false,
  });

  const [logs, setLogs] = useState<
    Array<{
      message: string;
      type: "info" | "error" | "success";
      timestamp: Date;
    }>
  >([]);
  const [showLogs, setShowLogs] = useState(false);

  const addLog = useCallback(
    (message: string, type: "info" | "error" | "success" = "info") => {
      setLogs((prev) => [...prev, { message, type, timestamp: new Date() }]);
    },
    []
  );

  const checkServerHealth = useCallback(async () => {
    try {
      const response = await fetch(`${SANDBOX_API_URL}/health`);
      const isConnected = response.ok;
      setState((prev) => ({ ...prev, connected: isConnected }));
      return isConnected;
    } catch (error) {
      setState((prev) => ({ ...prev, connected: false }));
      return false;
    }
  }, []);

  const createSandbox = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      addLog("Creating sandbox with base files...", "info");

      const response = await fetch(`${SANDBOX_API_URL}/sandboxes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: `nextjs-interface-${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        loading: false,
        sandboxUrl: data.sandboxUrl,
        sandboxId: data.sandboxId,
        error: null,
      }));

      addLog(`Sandbox created successfully: ${data.sandboxId}`, "success");
      addLog(`Sandbox URL: ${data.sandboxUrl}`, "info");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: `Failed to create sandbox: ${errorMessage}`,
      }));
      addLog(`Error creating sandbox: ${errorMessage}`, "error");
    }
  }, [addLog]);

  const destroySandbox = useCallback(async () => {
    if (!state.sandboxId) return;

    try {
      addLog(`Destroying sandbox: ${state.sandboxId}`, "info");

      const response = await fetch(
        `${SANDBOX_API_URL}/sandboxes/${state.sandboxId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        addLog("Sandbox destroyed successfully", "success");
      } else {
        addLog("Failed to destroy sandbox", "error");
      }

      setState((prev) => ({
        ...prev,
        sandboxUrl: null,
        sandboxId: null,
        loading: true,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      addLog(`Error destroying sandbox: ${errorMessage}`, "error");
    }
  }, [state.sandboxId, addLog]);

  const refreshSandbox = useCallback(() => {
    if (state.sandboxUrl) {
      addLog("Refreshing sandbox...", "info");
      // Force iframe reload by changing src
      setState((prev) => ({
        ...prev,
        sandboxUrl: `${state.sandboxUrl}?refresh=${Date.now()}`,
      }));
    }
  }, [state.sandboxUrl, addLog]);

  // Initialize sandbox on component mount
  useEffect(() => {
    const initializeSandbox = async () => {
      addLog("Checking server connection...", "info");

      const isServerRunning = await checkServerHealth();

      if (isServerRunning) {
        addLog("Server is running, creating sandbox...", "success");
        await createSandbox();
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            "Sandbox server is not running. Please start the server first.",
        }));
        addLog("Sandbox server is not running", "error");
      }
    };

    initializeSandbox();
  }, [checkServerHealth, createSandbox, addLog]);

  // Periodic health check
  useEffect(() => {
    const interval = setInterval(checkServerHealth, 5000);
    return () => clearInterval(interval);
  }, [checkServerHealth]);

  const handleIframeLoad = useCallback(() => {
    if (state.sandboxUrl) {
      addLog("Sandbox application loaded successfully", "success");
    }
  }, [state.sandboxUrl, addLog]);

  const handleIframeError = useCallback(() => {
    addLog("Failed to load sandbox application", "error");
  }, [addLog]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Sandbox Project Interface
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {state.sandboxId && (
              <div className="bg-gray-100 px-3 py-1 rounded-md text-sm text-gray-700">
                Sandbox: {state.sandboxId.slice(0, 8)}...
              </div>
            )}

            <button
              onClick={createSandbox}
              disabled={state.loading || !!state.sandboxId}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
            >
              {state.sandboxId ? "Sandbox Running" : "Create Sandbox"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        {state.loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Creating sandbox...</p>
            </div>
          </div>
        )}

        {state.error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Error
              </h2>
              <p className="text-gray-600 mb-4">{state.error}</p>
              <button
                onClick={createSandbox}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {state.sandboxUrl && !state.loading && !state.error && (
          <iframe
            src={state.sandboxUrl}
            className="w-full h-full border-none"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Sandbox Preview"
          />
        )}
      </main>

      {/* Logs Panel */}
      {showLogs && (
        <div className="fixed bottom-4 right-4 w-96 max-h-64 bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <span className="font-medium">Logs</span>
            <button
              onClick={() => setLogs([])}
              className="text-gray-400 hover:text-white text-sm"
            >
              Clear
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-48 text-sm font-mono">
            {logs.length === 0 ? (
              <p className="text-gray-400">No logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-1 ${
                    log.type === "error"
                      ? "text-red-400"
                      : log.type === "success"
                      ? "text-green-400"
                      : "text-blue-400"
                  }`}
                >
                  <span className="text-gray-500">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>{" "}
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
