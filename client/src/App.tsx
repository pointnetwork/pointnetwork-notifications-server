import { useState } from 'react';
// MUI components
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
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
  const [isSomeFieldsEmpty, setSomeFieldsEmpty] = useState<boolean>(false);
  const [form, setForm] = useState<Notification>({ ...emptyForm });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);

  const handleChange = (e: any) =>
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.body || !form.title) return setSomeFieldsEmpty(true);
    setSomeFieldsEmpty(false);
    setLoading(true);
    setError(false);
    try {
      await axios.post('http://localhost:8080/broadcast', form);
      setForm({ ...emptyForm });
    } catch (error) {
      console.log(error);
      setError(true);
    }
    setLoading(false);
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
        {isError && (
          <Alert severity='error' variant='filled' sx={{ my: 2 }}>
            Unable to broadcast the notification
          </Alert>
        )}
        <TextField
          id='title'
          value={form.title}
          onChange={handleChange}
          label='Notification Title'
          fullWidth
          margin='dense'
          size='small'
          error={isSomeFieldsEmpty && !form.title}
        />
        <TextField
          id='body'
          value={form.body}
          onChange={handleChange}
          label='Notification Body'
          fullWidth
          margin='dense'
          size='small'
          error={isSomeFieldsEmpty && !form.body}
        />
        {isSomeFieldsEmpty && (
          <Typography color='error' variant='body2' my={1}>
            *Please fill in all the fields
          </Typography>
        )}
        <Button
          disabled={isLoading}
          variant='contained'
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <>
              <CircularProgress size={14} sx={{ mr: 1 }} />
              Broadcasting...
            </>
          ) : (
            'Broadcast'
          )}
        </Button>
      </Container>
    </Box>
  );
}

export default App;
