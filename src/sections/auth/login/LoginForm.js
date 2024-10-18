import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
 

  const handleClick = async () => {
    setLoading(true); 

    // Validation for empty fields
    if (!email || !password) {
      setLoading(false); 
      setError('Please fill in both email and password fields.');
      return;
    }

    // Hardcoded check for correct credentials
    if (email === 'admin123@gmail.com' && password === 'admin123') {
      localStorage.setItem('token', JSON.stringify('gfhfg'));
      setTimeout(() => {
        setLoading(false); 
        navigate('/dashboard', { replace: true });
      }, 3000);
    } else {
      setError('Invalid email or password.');
      setLoading(false); 
    }
  };

  return (
    <>
      <Stack spacing={3} sx={{ my: 3 }}>
        <TextField
          name="email"
          label="Email address"
          onChange={(e) => {
            setEmail(e.target.value);
            setError(''); // Clear error when typing
          }}
          value={email}
          error={!!error} // Highlight field in case of error
        />

        <TextField
          name="password"
          label="Password"
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(''); // Clear error when typing
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!!error} // Highlight field in case of error
        />
      </Stack>

      <Box component="h3" sx={{ color: 'red', my: 2 }}>
        {error}
      </Box>

      <LoadingButton fullWidth size="large"  loading={loading}  type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
