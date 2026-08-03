import { Link } from "react-router-dom";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";

function ForgotPassword() {
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
            Reset access
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Enter your account email to continue password recovery.
          </Typography>
        </div>
        <TextField label="Email address" type="email" required />
        <Button component={Link} to="/reset-password" variant="contained">
          Continue
        </Button>
        <Typography component={Link} to="/login" color="primary.main" fontWeight={800}>
          Back to login
        </Typography>
      </Stack>
    </Paper>
  );
}

export default ForgotPassword;
