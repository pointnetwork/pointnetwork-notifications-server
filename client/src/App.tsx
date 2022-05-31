import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function App() {
  fetch('/').then(console.log).catch(console.log);

  return (
    <Box>
      <Typography>Hello World</Typography>
    </Box>
  );
}

export default App;
