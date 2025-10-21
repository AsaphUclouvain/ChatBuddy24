# ChatBuddy24: High-Concurrency Anonymous Chat

ChatBuddy24 is a real-time, anonymous chat application engineered to handle high-concurrency and demonstrate low-latency performance. This project was a deep dive into system design, network communication, and backend optimization.

## Core Problem & Solution

The challenge was to build a chat service that could support over 100 simultaneous users without a traditional login system, ensuring all messages felt instantaneous. This was solved using a WebSocket-based architecture on a Node.js backend.

## Technical Features

* **Real-Time Communication:** Implemented a WebSocket (Socket.IO) server to manage persistent, bi-directional connections with all clients.
* **Scalability & Performance:** The Node.js event loop and non-blocking I/O model were leveraged to support 100+ concurrent connections.
* **Low-Latency (Sub-70ms):** Backend logic was optimized to ensure message broadcast and database operations completed in under 70ms, providing a seamless user experience.
* **Anonymity:** No user accounts are required. On connection, each user is assigned a random, temporary ID and a guest name (e.g., "Anonymous Panda").
* **Live User Count:** The server maintains an active connection list and broadcasts the current user count to all clients in real-time.
* **Typing Indicators:** Broadcasts a "user is typing..." event to all other clients, a classic feature of modern chat systems.

## Tech Stack

| Area | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js, Socket.IO Client | Building a dynamic, component-based UI that reacts to server events. |
| **Backend** | Node.js, Express.js | Creating the core API and server logic. |
| **Real-Time** | Socket.IO | Managing persistent WebSocket connections and event broadcasting. |
| **Database** | PostgreSQL / Redis | (Choose one: PostgreSQL for persistent message history, or Redis for a high-speed, non-persistent cache) |

## 🚀 Local Setup & Installation

Local Setup and Installation coming soon.
