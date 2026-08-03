import { Link } from "react-router-dom";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";

function ResetPassword() {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 500,
        justifySelf: "center",
        p: { xs: 3, sm: 4.5 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider"
      }}
    >
      <Stack spacing={2.5}>
        <div>
          <Typography component="h1" variant="h4">
            New password
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Add a fresh password for your retail workspace.
          </Typography>
        </div>
        <TextField label="New password" type="password" required />
        <TextField label="Confirm password" type="password" required />
        <Button component={Link} to="/login" variant="contained">
          Save password
        </Button>
      </Stack>
    </Paper>
  );
}

export default ResetPassword;
