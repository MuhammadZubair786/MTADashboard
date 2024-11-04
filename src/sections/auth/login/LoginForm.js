import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { signInWithEmailAndPassword } from 'firebase/auth';
// components
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

import { db } from '../../../service/firebase';
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
    setError(''); // Reset any previous error message

    // Validation for empty fields
    if (!email || !password) {
      setLoading(false);
      setError('Please fill in both email and password fields.');
      return;
    }

    try {
      // Step 1: Query Firestore to find the user by email
      const usersRef = collection(db, 'Admin'); // Replace "users" with your actual collection name
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If no user document is found with the provided email
        setError('User does not exist.');
        setLoading(false);
        return;
      }

      // Step 2: Check if the provided password matches the stored password
      let userDoc;
      querySnapshot.forEach((doc) => {
        userDoc = doc.data();
      });

      if (userDoc && userDoc.password === password) {
        // Hardcoded token or custom token logic if needed
        localStorage.setItem('token', 'yourCustomToken');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          setLoading(false);
          navigate('/dashboard', { replace: true });
        }, 1000);
      } else {
        setError('Invalid email or password.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again.');
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

      <LoadingButton fullWidth size="large" loading={loading} type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
