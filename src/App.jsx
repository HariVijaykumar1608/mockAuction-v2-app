import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Button,
  Typography,
  Box,
  Container,
  Stack,
  Paper,
} from "@mui/material";
import CreateRoom from "./Pages/createRoom";
import JoinRoom from "./Pages/joinRoom";
import "./App.css";
import Table from "./components/table";

// Create socket ONCE outside component to avoid re-connection on re-renders
const socket = io("http://localhost:3000");

function App() {
  const [code, setCode] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [roomMembers, setRoomMembers] = useState([])
  const [initialPage, setInitialPage] = useState(false);
  const [toggleCreateRoom, setToggleCreateRoom] = useState(false);
  const [toggleJoinRoom, setToggleJoinRoom] = useState(false);
  const [options, setOptions] = useState(["CSK", "MI", "RCB", "KKR", "GT", "LSG", "SRH", "PBKS", "RR", "DC"])

  useEffect(() => {
    // Listen for events from server
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("room-created", (roomCode) => {
      console.log("Room created:", roomCode);
      setCode(roomCode);
      setInRoom(true);
      setToggleCreateRoom(false);
    });

    socket.on("joined-room", (res) => {
      setInRoom(true);
      setToggleJoinRoom(false);
    });

    socket.on("getAllRoomMembers", (res) => {
      console.log("roomMembers",res)
      setRoomMembers(res);
    });

    socket.on("joinRoomErrorHandling",(res)=> {
      alert(res.msg)
      setOptions(res.option)
    })

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("connect");
      socket.off("room-created");
      socket.off("joined-room");
      socket.off("getAllRoomMembers");
      socket.off("joinRoomErrorHandling");
    };
  }, []);

  // Create room
  const handleCreateRoom = (userName, team) => {
    if (userName.trim() === "") {
      alert("Please enter your name!");
      return;
    }
    else if (team.trim() === ""){
      alert("Please select your team!");
      return;
    }
    socket.emit("create-room",{userName,team});
  };

  // Join room
  const handleJoinRoom = (roomCode,userName,team) => {
    if (roomCode.trim() === "") {
      alert("Please enter a valid room code!");
      return;
    }
    else if (userName.trim() === ""){
      alert("Please enter your Name!");
      return;
    }
    else if (team.trim() === ""){
      alert("Please select your team!");
      return;
    }
    setCode(roomCode);
    socket.emit("join-room", {roomCode,userName,team});
  };

  const handleIncrement = () => {
    socket.emit("increment", code);
  };

  const handleDecrement = () => {
    socket.emit("decrement", code);
  };

  const onOpenCreateRoom = () => {
    setToggleCreateRoom(true);
    setInitialPage(true);
  };

  const onOpenJoinRoom = () => {
    setToggleJoinRoom(true);
    setInitialPage(true);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🎉 Welcome to Mock Auction
      </Typography>

      {/* Landing Page */}
      {!initialPage && (
        <Stack spacing={2} alignItems="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onOpenCreateRoom}
          >
            Create Room
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={onOpenJoinRoom}
          >
            Join Room
          </Button>
        </Stack>
      )}

      {/* Create Room Form */}
      {toggleCreateRoom && (
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <CreateRoom handleCreateRoom={handleCreateRoom} />
        </Paper>
      )}

      {/* Join Room Form */}
      {toggleJoinRoom && (
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <JoinRoom handleJoinRoom={handleJoinRoom} options={options}/>
        </Paper>
      )}

      {/* Inside Room */}
      {inRoom && (
        <Box mt={5} textAlign="center">
          <Typography variant="h5" gutterBottom>
            Room Code: <strong>{code}</strong>
          </Typography>
          <Table data={roomMembers}/>
        </Box>
      )}
    </Container>
  );
}

export default App;
