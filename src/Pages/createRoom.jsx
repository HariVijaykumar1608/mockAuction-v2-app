import { useState } from "react";
import { TextField, Button, Box, Autocomplete } from "@mui/material";

function CreateRoom({ handleCreateRoom }) {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");

  return (
    <Box display="flex" flexDirection="column" gap={2} width="300px" m="auto">
      <TextField
        label="Enter your Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
    <Autocomplete
      options={["CSK", "MI", "RCB", "KKR", "GT", "LSG", "SRH", "PBKS", "RR", "DC"]}
      value={team}
      onChange={(event, newValue) => setTeam(newValue)}
      fullWidth
      renderInput={(params) => (
       <TextField {...params} label="Select your Team" variant="outlined" />
    )}
    />
      <Button
        variant="contained"
        color="primary"
        onClick={()=>handleCreateRoom(name,team)}
        fullWidth
      >
        Create Room
      </Button>
    </Box>
  );
}

export default CreateRoom;
