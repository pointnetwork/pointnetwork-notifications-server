import { useEffect, useState } from 'react';
import axios from 'axios';
// MUI components
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// Components
import UIThemeProvider from './components/UIThemeProvider';
// Icons
import CircleIcon from '@mui/icons-material/Circle';
// Typescript
import { Notification } from './@types/interfaces';

const emptyForm: Notification = {
  title: '',
  body: '',
};

function App() {
  const [isSomeFieldsEmpty, setSomeFieldsEmpty] = useState<boolean>(false);
  const [form, setForm] = useState<Notification>({ ...emptyForm });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [connectedUsers, setConnectedUsers] = useState<number>(0);

  useEffect(() => {
    setInterval(async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:8080/connected-users'
        );
        setConnectedUsers(data);
      } catch (error) {
        console.error(error);
      }
    }, 5000);
  }, []);

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
    <UIThemeProvider>
      <Box height='100vh' display='flex' alignItems='center'>
        <Box
          position='fixed'
          top={16}
          right={16}
          display='flex'
          alignItems='center'
          borderRadius={20}
          bgcolor='primary.light'
          p={1}
        >
          <CircleIcon color='success' fontSize='small' />
          <Typography variant='body2' ml={0.5} mr={2}>
            {connectedUsers} Connected Users
          </Typography>
        </Box>
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
    </UIThemeProvider>
  );
}

export default App;
