import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import {Button,Typography,Box,Container,Stack,Paper} from "@mui/material";
import CreateRoom from "./Pages/createRoom";
import JoinRoom from "./Pages/joinRoom";
import Table from "./components/table";
import CreateOptions from "./Pages/createOptions";
import Static from './Pages/Static';
import RouteCall from "./route/routeCall";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [userData, setUserData] = useState({});
  const [inRoom, setInRoom] = useState(false);
  const [roomMembers, setRoomMembers] = useState([]);
  const [initialPage, setInitialPage] = useState(false);
  const [toggleCreateRoom, setToggleCreateRoom] = useState(false);
  const [toggleJoinRoom, setToggleJoinRoom] = useState(false);
  const [options, setOptions] = useState([
    "CSK", "MI", "RCB", "KKR", "GT", "LSG", "SRH", "PBKS", "RR", "DC"
  ]);
  const [bidInterval, setBidInterval] = useState("");
  const [startAuction, setStartAuction] = useState(false);
  const [signInPage, setSignInPage] = useState(false);
  const [logInPage, setLogInPage] = useState(false);
  const [welcomePage, setWelcomePage] = useState(false);
  const [userName, setUserName] = useState("")

  const socketRef = useRef(null);

  useEffect(() => {
    async function checkLogin() {
      try {
        const checkLoginExists = await RouteCall.checkLogIn();

        if (checkLoginExists.message === "Auto login success") {
          setUserName(checkLoginExists.data.userName || "")
          setInitialPage(true);
          connectToSocket();
        } else {
          setWelcomePage(true);
        }

      } catch (error) {
        console.log(error);
        setWelcomePage(true);
      }
    }

    checkLogin();
  }, []);

  const connectToSocket = () => {

    if (socketRef.current) return;

    socketRef.current = io("http://localhost:3000", {
      withCredentials: true,
    });

    // 🔥 Attach listeners inside connect()
    socketRef.current.on("connect", () => {
      console.log("WS Connected");
      setWelcomePage(false)
      setSignInPage(false)
      setLogInPage(false)
      setInitialPage(true)
    });

    socketRef.current.on("room-created", (roomCode) => {
      setCode(roomCode);
      setInRoom(true);
      setToggleCreateRoom(false);
    });

    socketRef.current.on("joined-room", () => {
      setInRoom(true);
      setToggleJoinRoom(false);
    });

    socketRef.current.on("userDetails", (data) => {
      setUserData(data);
    });

    socketRef.current.on("getAllRoomMembers", (res) => {
      setRoomMembers(res);
    });

    socketRef.current.on("joinRoomErrorHandling", (res) => {
      alert(res.msg);
      setOptions(res.option);
    });

    socketRef.current.on("auctionStarted", (timer) => {
      setBidInterval(timer);
      setStartAuction(true);
    });

  }

  const handleCreateRoom = (userName, team) => {
    if (!userName.trim()) return alert("Enter name!");
    if (!team.trim()) return alert("Choose team!");

    socketRef.current.emit("create-room", { userName, team });
  };

  const handleJoinRoom = (roomCode, userName, team) => {
    if (!roomCode.trim()) return alert("Enter room code!");
    if (!userName.trim()) return alert("Enter name!");
    if (!team.trim()) return alert("Choose team!");

    setCode(roomCode);
    socketRef.current.emit("join-room", { roomCode, userName, team });
  };

  const handleStartAuction = (timer) => {
    socketRef.current.emit("startAuction", { roomCode: code, timer });
  };

  const signInOrLogIn = async (gmailId, password, userName) => {
    if (signInPage) {
      const res = await RouteCall.signIn(userName, gmailId, password);

      if (res.message === "User signed in successfully") {
        console.log("signInSuccess");
        setWelcomePage(false)
        setSignInPage(false);
        setLogInPage(true)
      }
      return;
    }

    // ---------------- LOGIN ----------------
    const logInAttempt = await RouteCall.logIn(gmailId, password);

    if (logInAttempt.message === "Login successful") {
      console.log("LoginSuccess");
      setUserName(logInAttempt.data.userName || "")
      connectToSocket()

    } else {
      console.error("loginFailed");
    }
  };

  const onOpenSignInPage = () => {
    setWelcomePage(false)
    setSignInPage(true)
  }

  const onOpenLoginPage = () => {
    setWelcomePage(false)
    setLogInPage(true)
  }

  const onOpenCreateRoom = () => {
    setInitialPage(false)
    setToggleCreateRoom(true)
  }

  const onOpenJoinRoom = () => {
    setInitialPage(false)
    setToggleJoinRoom(true)
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🎉 Welcome to Mock Auction
      </Typography>

      {welcomePage && (
        <Stack spacing={2} alignItems="center" mt={4}>
          <Button variant="contained" onClick={onOpenSignInPage}>
            Sign In
          </Button>

          <Button variant="outlined" onClick={onOpenLoginPage}>
            Log In
          </Button>
        </Stack>
      )}

      {initialPage && (
        <Stack spacing={2} alignItems="center" mt={4}>
          <Button variant="contained" onClick={onOpenCreateRoom}>
            Create Room
          </Button>

          <Button variant="outlined" onClick={onOpenJoinRoom}>
            Join Room
          </Button>
        </Stack>
      )}

      {signInPage && <Static signInOrLogIn={signInOrLogIn} signIn={signInPage} />}
      {logInPage && <Static signInOrLogIn={signInOrLogIn} />}

      {toggleCreateRoom && (
        <Paper sx={{ p: 3, mt: 4 }} elevation={3}>
          <CreateRoom handleCreateRoom={handleCreateRoom} userName={userName} />
        </Paper>
      )}

      {toggleJoinRoom && (
        <Paper sx={{ p: 3, mt: 4 }} elevation={3}>
          <JoinRoom handleJoinRoom={handleJoinRoom} options={options} userName={userName} />
        </Paper>
      )}

      {inRoom && !startAuction && (
        <Box mt={5} textAlign="center">
          <Typography variant="h5">
            Room Code: <strong>{code}</strong>
          </Typography>

          <Table data={roomMembers} />

          {userData.role === "creator" && (
            <CreateOptions handleStartAuction={handleStartAuction} />
          )}
        </Box>
      )}

      {startAuction && <h1>🔥 Auction Started! 🔥</h1>}
    </Container>
  );
}

export default App;
