// 

import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

// Create socket ONCE outside component to avoid re-connection on re-renders
const socket = io("http://localhost:3000");

function App() {
  const [code, setCode] = useState("");
  const [count, setCount] = useState(0);
  const [inRoom, setInRoom] = useState (false)

  useEffect(() => {
    // Listen for events from server
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("room-created", (roomCode) => {
      console.log("Room created:", roomCode);
      setCode(roomCode)
      setInRoom(true)
    });

    socket.on("joined-room", (res) => {
      console.log("Join response:", res);
      setInRoom(true)
    });

    socket.on("getCount", (res) =>{
      console.log("updated count: ", res)
      setCount(res)
    })

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("connect");
      socket.off("room-created");
      socket.off("joined-room");
      socket.off("getCount")
    };
  }, []);

  // Create room
  const handleCreateRoom = () => {
    socket.emit("create-room");
  };

  // Join room
  const handleJoinRoom = () => {
    socket.emit("join-room", code);
  };

  const handleIncrement = () => {
    socket.emit("increment",code)
  }

  const handleDecrement = () => {
    socket.emit("decrement",code)
  }

  return (
    <>
      <h1>Welcome to Mock Auction</h1>

      {!inRoom ? (
        <div>
          <input name="Name" placeholder="Enter your Name" />
          <button name="create-room" onClick={handleCreateRoom}>
            Create Room
          </button>

          <br />
          <br />

          <input
            name="code"
            placeholder="Enter the Room Code"
            onChange={(e) => setCode(e.target.value)}
          />
          <button name="join-room" onClick={handleJoinRoom}>
            Join Room
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h1>🔢 Counter App</h1>
          <h2>{count}</h2>

          <button
            onClick={handleIncrement}
            style={{ marginRight: "10px", padding: "10px 20px" }}
          >
            ➕ Increment
          </button>

          <button
            onClick={handleDecrement}
            style={{ padding: "10px 20px" }}
          >
            ➖ Decrement
          </button>
        </div>
      )}
    </>
  );
}

export default App;
