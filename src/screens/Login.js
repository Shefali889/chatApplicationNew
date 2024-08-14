import React from 'react';
import styles from '../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/store';
import { logIn, logOut } from '../redux/features/auth-slice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.auth); // Use this directly to access auth state

  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = async () => {
    if (formData.email === '' || formData.password === '') {
      toast.error('Please fill all the fields');
      return;
    }

    let res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    let data = await res.json();
    if (data.ok) {
      toast.success('Login Success');
      getUserData();
    } else {
      toast.error(data.message);
    }
  };

  const getUserData = async () => {
    let res = await fetch(`${process.env.REACT_APP_API_URL}/user/getuser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    let data = await res.json();
    if (data.ok) {
      dispatch(logIn(data.data));
      // Navigate only if the user is authenticated
      navigate('/');
    } else {
      dispatch(logOut());
    }
  };

  const checkLogin = async () => {
    let res = await fetch(`${process.env.REACT_APP_API_URL}/auth/checklogin`, {
      method: 'GET',
      credentials: 'include'
    });

    let data = await res.json();
    if (data.ok) {
      navigate('/');
    }
  };

  React.useEffect(() => {
    checkLogin();
  }, []);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <div className="formOuter">
      <div className="formContainer">
        <h1>Login</h1>
        <TextField
          id="standard-basic"
          label="Email"
          variant="outlined"
          color="secondary"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <FormControl sx={{ m: 0 }} variant="outlined" color="secondary">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <p className="t1"><Link to="/forgotpassword">Forgot password?</Link></p>
        <Button variant="contained" onClick={handleLogin}>
          Submit
        </Button>
        <br />
        <p className="t2">Don't have an account? <Link to="/signup">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
