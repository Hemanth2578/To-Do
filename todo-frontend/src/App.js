import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Typography,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';



function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#6200ea',
      },
      secondary: {
        main: '#03dac6',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  });

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/todos/')
      .then(response => setTodos(response.data));
  }, []);

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;
    axios.post('http://127.0.0.1:8000/api/todos/', { title: newTodo, completed: false })
      .then(response => setTodos([...todos, response.data]));
    setNewTodo('');
  };

  const handleToggleComplete = (id, completed) => {
    axios.patch(`http://127.0.0.1:8000/api/todos/${id}/`, { completed: !completed })
      .then(response => {
        const updatedTodos = todos.map(todo => todo.id === id ? response.data : todo);
        setTodos(updatedTodos);
      });
  };

  const handleDeleteTodo = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/todos/${id}/`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" style={{ paddingTop: '40px' }}>
        <Typography variant="h4" align="center" gutterBottom style={{ marginBottom: '30px' }}>
          TODO Application
        </Typography>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '30px', backgroundColor: '#f5f5f5' }}>
          <TextField
            variant="outlined"
            label="New TODO"
            fullWidth
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAddTodo()}
            InputProps={{
              endAdornment: (
                <IconButton color="primary" onClick={handleAddTodo}>
                  <Add />
                </IconButton>
              ),
            }}
          />
        </Paper>
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#fafafa' }}>
          <List>
            {todos.length === 0 && <Typography align="center" color="textSecondary">No TODOs available.</Typography>}
            {todos.map(todo => (
              <React.Fragment key={todo.id}>
                <ListItem style={{ padding: '10px 0' }}>
                  <Checkbox
                    edge="start"
                    checked={todo.completed}
                    onClick={() => handleToggleComplete(todo.id, todo.completed)}
                    tabIndex={-1}
                    disableRipple
                    color="secondary"
                  />
                  <ListItemText
                    primary={todo.title}
                    primaryTypographyProps={{
                      style: {
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'gray' : 'black',
                      }
                    }}
                  />
                  <IconButton edge="end" onClick={() => handleDeleteTodo(todo.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;

