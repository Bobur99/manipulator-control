import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  Container,
  TextField,
  Paper,
  Stack,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store";
import { logout } from "../../features/authSlice";
import {
  optimizeCommands,
  hasInvalidCommands,
  cleanCommands,
} from "../../utils/commandOptimizer";
import GridTable from "../../components/GridTable";
import { executeCommandsWithSamples } from "../../utils/commandExecutorWithSamples";
import { Slider } from "@mui/material";

import { addHistoryItem } from "../../features/historySlice";

interface CommandFormInputs {
  commands: string;
}

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const [optimized, setOptimized] = useState<string>("");
  const [normalizedOriginal, setNormalizedOriginal] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const historyItems = useAppSelector((state) => state.history.items);

const GRID_ROWS = 10;
const GRID_COLS = 10;

  const { register, handleSubmit, reset } = useForm<CommandFormInputs>({
    defaultValues: {
      commands: "",
    },
  });

  const [manipulatorPosition, setManipulatorPosition] = useState({
    x: 0,
    y: 0,
  });
  const [animationSpeed, setAnimationSpeed] = useState(500); 

  const [samples, setSamples] = useState([
    { x: 1, y: 2 },
    { x: 3, y: 4 },
  ]); 

const animateCommands = (commands: string) => {
  if (!commands) return;

  const samplesBefore = samples.map((s) => ({ ...s }));

  const { positions, samplesAfter } = executeCommandsWithSamples(
    commands,
    { x: 0, y: 0 },
    GRID_ROWS,
    GRID_COLS,
    samplesBefore.map((s) => ({ ...s })) 
  );

  positions.forEach((pos, index) => {
    setTimeout(() => {
      setManipulatorPosition(pos);

      if (index === positions.length - 1) {
        setSamples(samplesAfter.map((s) => ({ ...s })));

        dispatch(
          addHistoryItem({
            original: normalizedOriginal,
            optimized,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            samplesBefore, 
            samplesAfter: samplesAfter.map((s) => ({ ...s })), 
          })
        );

        setOpenSnackbar(true);
      }
    }, index * animationSpeed);
  });
};



  const handleLogout = () => {
    dispatch(logout());
  };

  const onSubmit: SubmitHandler<CommandFormInputs> = (data) => {
    const raw = data.commands;

    if (!raw.trim()) {
      setValidationError("Введите хотя бы одну команду.");
      setOptimized("");
      setNormalizedOriginal("");
      return;
    }

    if (hasInvalidCommands(raw)) {
      setValidationError(
        "Допустимы только буквы: Л, П, В, Н, О, Б (без пробелов и других символов)."
      );
      setOptimized("");
      setNormalizedOriginal("");
      return;
    }

    setValidationError(null);

    const cleaned = cleanCommands(raw);
    const result = optimizeCommands(raw);

    setNormalizedOriginal(cleaned);
    setOptimized(result);
  };

  const handleClear = () => {
    reset({ commands: "" });
    setOptimized("");
    setNormalizedOriginal("");
    setValidationError(null);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Манипулятор - панель управления
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Stack spacing={3}>
          {/* Блок ввода команды */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Ввод последовательности команд
            </Typography>

            <Typography variant="body2" mb={1}>
              Допустимые команды: <b>Л</b> (налево), <b>П</b> (направо),{" "}
              <b>В</b> (вверх), <b>Н</b> (вниз), <b>О</b> (взять образец),{" "}
              <b>Б</b> (отпустить образец).
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                label="Последовательность команд"
                fullWidth
                margin="normal"
                {...register("commands")}
                error={!!validationError}
                helperText={
                  validationError ||
                  "Например: ЛЛЛЛВВПППОНННБ или ЛЛЛНННЛЛЛНННО"
                }
              />

              <Stack direction="row" spacing={2} mt={2}>
                <Button type="submit" variant="contained">
                  Оптимизировать
                </Button>
                <Button variant="outlined" onClick={handleClear}>
                  Очистить
                </Button>
              </Stack>
            </Box>
          </Paper>

          {normalizedOriginal && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>
                Результат оптимизации
              </Typography>

              <Typography variant="body1">
                <b>Исходная команда (нормализованная):</b>{" "}
                <code>{normalizedOriginal}</code>
              </Typography>

              <Typography variant="body1" mt={1}>
                <b>Оптимизированная версия:</b> <code>{optimized}</code>
              </Typography>
            </Paper>
          )}
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>
            Скорость анимации (мс): {animationSpeed}
          </Typography>
          <Slider
            min={100}
            max={2000}
            step={50}
            value={animationSpeed}
            onChange={(_e, value) => setAnimationSpeed(value as number)}
          />
        </Box>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => animateCommands(normalizedOriginal)}
          disabled={!normalizedOriginal}
        >
          Запустить манипулятор
        </Button>

        <Box sx={{ mt: 4, width: '100%', overflowX: 'auto', overflowY: 'auto', maxHeight: 400 }}>
          <GridTable
            rows={10}
            cols={10}
            manipulatorPosition={manipulatorPosition}
            samples={samples}
          />
        </Box>

        {historyItems.length > 0 && (
          <Paper sx={{ p: 3, mt: 4 }}>
  <Typography variant="h6" mb={2}>
    История выполненных команд
  </Typography>

  <Box sx={{ width: '100%', overflowX: 'auto' }}>
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell>Дата</TableCell>
          <TableCell>Время</TableCell>
          <TableCell>Исходная</TableCell>
          <TableCell>Оптимизированная</TableCell>
          <TableCell>Образцы до</TableCell>
          <TableCell>Образцы после</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {historyItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.date}</TableCell>
            <TableCell>{item.time}</TableCell>
            <TableCell>{item.original}</TableCell>
            <TableCell>{item.optimized}</TableCell>
            <TableCell>
              {item.samplesBefore.map((s) => `(${s.x},${s.y})`).join(", ")}
            </TableCell>
            <TableCell>
              {item.samplesAfter.map((s) => `(${s.x},${s.y})`).join(", ")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
</Paper>

        )}
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Команда успешно выполнена!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
