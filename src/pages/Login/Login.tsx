import React, { useState } from "react";
import { useForm, } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useAppDispatch } from "../../store";
import { login} from "../../features/authSlice";
import {useNavigate } from "react-router-dom";

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (data: LoginFormInputs) => {
    if (data.username === "admin" && data.password === "admin") {
      dispatch(login()); // это сохранит в localStorage
      navigate("/control"); // переходим на главную страницу
    } else {
      setError("Неверные логин или пароль");
    }
  };

  // const handleLogout = () => {
  //   dispatch(logout()); 
  //   navigate("/login");
  // };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Paper sx={{ p: 4, width: "100%" }}>
          <Typography variant="h5" mb={2} textAlign="center">
            Вход в систему
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Логин"
              fullWidth
              margin="normal"
              {...register("username", { required: true })}
              defaultValue="admin"
            />
            <TextField
              label="Пароль"
              type="password"
              fullWidth
              margin="normal"
              {...register("password", { required: true })}
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Войти
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
