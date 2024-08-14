import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import styles from '../styles/auth.css';
import BackButton from '../components/BackButton';


const Signup = () => {
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [otp, setOtp] = useState('');


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }


  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [showOtp, setShowOtp] = React.useState(false);

  const handleClickShowOtp = () => setShowOtp((show) => !show);

  const [sendingOtp, setSendingOtp] = useState(false)
  const sendOtp = async () => {
    setSendingOtp(true)
    let res = await fetch(process.env.REACT_APP_API_URL + '/auth/sendotp', {
      method: 'POST',
      body: JSON.stringify({ email: formData.email }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    let data = await res.json()
    setSendingOtp(false)

    if (data.ok) {
      toast.success('OTP sent')
    }
    else {
      toast.error(data.message)
    }
  }

  const handleSignup = async () => {
    console.log(formData)
    console.log(imageFile)
    console.log(otp)

    if (formData.name == "" || formData.email == '' || formData.password == '' || otp == '') {
      toast.error('Please fill all the fields')
      return
    }
    if (!imageFile) {
      toast.error('Please select an image')
      return
    }
    // if (formData.password.length < 6) {
    //   toast.error('Password must be atleast 6 characters long')
    //   return
    // }

    let formdata = new FormData();
    formdata.append('name', formData.name);
    formdata.append('email', formData.email);
    formdata.append('password', formData.password);
    formdata.append('otp', otp);
    if (imageFile) {
      formdata.append('clientfile', imageFile)
    }

    let res = await fetch(process.env.REACT_APP_API_URL + '/auth/register', {
      method: 'POST',
      body: formdata,
      credentials: 'include'
    })
    let data = await res.json()
    if (data.ok) {
      toast.success('Signup successful')
      navigate('/login')
    }
    else {
      toast.error(data.message)
    }
  }
  return (
    <div className="formOuter">
    {/* Backbutton */}
    <BackButton backroute='/login' />

    <div className="formContainer">
      <h1>Signup</h1>
      <div className="pickImageContainer">
        <Avatar
          src={
            imageFile ? URL.createObjectURL(imageFile) : ''
          }
        />
        <Button color="secondary" variant="contained" component="label">
          Select Image
          <input type="file" hidden
            onChange={
              (e) => {
                if (e.target.files) {
                  setImageFile(e.target.files[0]);
                }
              }
            }
          />
        </Button>
      </div>
      <TextField
        id="name-input"
        label="Name"
        variant="outlined"
        color="secondary"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <div className="inputRow">
        <TextField
          id="email-input"
          label="Email"
          variant="outlined"
          color="secondary"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {
          sendingOtp ?
            <LoadingButton
              size="small"
              endIcon={<SendIcon />}
              loading={sendingOtp}
              loadingPosition="end"
              variant="contained"
            >
              <span>Send</span>
            </LoadingButton>
            :
            <Button variant='contained' color='secondary' onClick={sendOtp}>
              Send OTP
            </Button>
        }
      </div>

      <FormControl sx={{ m: 0 }} variant="outlined" color='secondary'>
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

      <FormControl sx={{ m: 0 }} variant="outlined" color='secondary'>
        <InputLabel htmlFor="outlined-adornment-otp">Otp</InputLabel>
        <OutlinedInput
          id="outlined-adornment-otp"
          type={showOtp ? 'text' : 'password'}
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle otp visibility"
                onClick={handleClickShowOtp}
                edge="end"
              >
                {showOtp ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Otp"
        />
      </FormControl>

      <Button variant="contained" color="secondary" onClick={handleSignup}>
        Verify
      </Button>
      <br />
      <p className="t2">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  </div>
  )
}

export default Signup