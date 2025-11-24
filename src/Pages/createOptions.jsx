import { useState } from "react";
import { TextField, Button, Box, Autocomplete } from "@mui/material";

function CreateOptions({ handleStartAuction }) {
  const [timer, setTimer] = useState("");

  return (
    <Box display="flex" flexDirection="column" gap={2} width="300px" m="auto">
      {/* <TextField
        label="Enter your Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      /> */}
    <Autocomplete
      options={["10 sec", "15 sec", "30 sec", "45 sec", "1min"]}
      value={timer}
      onChange={(event, newValue) => setTimer(newValue)}
      fullWidth
      renderInput={(params) => (
       <TextField {...params} label="Timer" variant="outlined" />
    )}
    />
      <Button
        variant="contained"
        color="primary"
        onClick={()=>handleStartAuction(timer)}
        fullWidth
      >
        Start Auction
      </Button>
    </Box>
  );
}

export default CreateOptions;
