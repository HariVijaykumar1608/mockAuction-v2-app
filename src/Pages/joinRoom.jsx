import { useState } from "react";
import { TextField, Button, Box, Autocomplete } from "@mui/material";

function JoinRoom({ handleJoinRoom, options, userName }) {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState(userName || "")
  const [team, setTeam] = useState("");


  return (
    <Box display="flex" flexDirection="column" gap={2} width="300px" m="auto">
      <TextField
        label="Enter Room Code"
        variant="outlined"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        fullWidth
      />
       <TextField
        label="Enter Your Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <Autocomplete
          options={options}
          value={team}
          onChange={(event, newValue) => setTeam(newValue)}
          fullWidth
          renderInput={(params) => (
           <TextField {...params} label="Select your Team" variant="outlined" />
          )}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={()=>handleJoinRoom(roomCode,name,team)}
        fullWidth
      >
        Join Room
      </Button>
    </Box>
  );
}

export default JoinRoom;
