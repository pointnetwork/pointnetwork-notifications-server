import { useState } from 'react';
// MUI components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// Typescript
import { Notification } from './@types/interfaces';
import axios from 'axios';

const emptyForm: Notification = {
  title: '',
  body: '',
};

function App() {
  const [form, setForm] = useState<Notification>({ ...emptyForm });

  const handleChange = (e: any) =>
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8080/broadcast', form);
      setForm({ ...emptyForm });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box height='100vh' display='flex' alignItems='center'>
      <Container maxWidth='sm'>
        <Box display='flex'>
          <Typography fontWeight='bold' color='primary' variant='h4' mr={1}>
            Point
          </Typography>
          <Typography fontWeight='bold' variant='h4'>
            Broadcast
          </Typography>
        </Box>
        <Typography mb={3}>
          Broadcast Notifications to connected users
        </Typography>
        <TextField
          id='title'
          value={form.title}
          onChange={handleChange}
          label='Notification Title'
          fullWidth
          margin='dense'
          size='small'
        />
        <TextField
          id='body'
          value={form.body}
          onChange={handleChange}
          label='Notification Body'
          fullWidth
          margin='dense'
          size='small'
        />
        <Button
          variant='contained'
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Broadcast
        </Button>
      </Container>
    </Box>
  );
}

export default App;
