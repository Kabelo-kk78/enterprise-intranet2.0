#!/bin/bash
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting Enterprise Intranet..."
echo ""

# Start backend
echo "[1/2] Starting backend on port 5000..."
(cd "$ROOT_DIR/backend" && node server.js) &
BACKEND_PID=$!
sleep 2

# Start frontend
echo "[2/2] Starting frontend on port 5173..."
(cd "$ROOT_DIR" && npx vite) &
FRONTEND_PID=$!
sleep 3

echo ""
echo "==================================="
echo "  App is running!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:5000"
echo ""
echo "  Super Admin: super@company.com / super123"
echo "  Admin:       admin@company.com / admin123"
echo "  Manager:     jane@company.com / jane123"
echo "  Staff:       bob@company.com / bob123"
echo "  Guest:       guest@company.com / guest123"
echo "==================================="
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
