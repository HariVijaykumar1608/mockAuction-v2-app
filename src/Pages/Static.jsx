import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

export default function Static({ signIn, signInOrLogIn }) {
    const [gmailId, setGmailId] = useState("")
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Box display="flex" flexDirection="column" gap={2} width="300px" m="auto">
            {signIn &&
                <TextField
                    label="Enter your Name"
                    variant="outlined"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                />
            }
            <TextField
                label="Enter your Gmail Id"
                variant="outlined"
                value={gmailId}
                onChange={(e) => setGmailId(e.target.value)}
                fullWidth
            />
            <TextField
                label="Enter your password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => signInOrLogIn( gmailId, password, userName )}
                fullWidth
            >
                {signIn ? 'Sign In' : 'Log In'}
            </Button>
        </Box>
    );
}

