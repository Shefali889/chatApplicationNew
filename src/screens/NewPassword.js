import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState } from 'react'
import styles from '../styles/auth.css'
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import BackButton from '../components/BackButton';





const NewPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const email = searchParams.get('email')

    const [formData, setFormData] = useState({
        newpassword: '',
        confirmpassword: '',
        otp: ''
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [showCPassword, setShowCPassword] = React.useState(false);
    const handleClickShowCPassword = () => setShowCPassword((show) => !show);
    const [showOtp, setShowOtp] = React.useState(false);
    const handleClickShowOtp = () => setShowOtp((show) => !show);

    const [loading, setLoading] = useState(false)

    const savePassword = async () => {
        if (formData.newpassword != formData.confirmpassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)
        let res = await fetch(process.env.REACT_APP_API_URL + '/auth/updatepassword', {
            method: 'POST',
            body: JSON.stringify({ email, otp: formData.otp, newpassword: formData.newpassword }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        let data = await res.json()
        setLoading(false)

        if (data.ok) {
            toast.success('Password updated')
            navigate('/login')
        }
        else {
            toast.error(data.message)
        }
    }
    return (
        <div className="formOuter">
        {/* BackButton */}
        <BackButton backroute='/login' />
  
        <div className="formContainer">
          <FormControl sx={{ m: 0 }} variant="outlined" color='secondary'>
            <InputLabel htmlFor="outlined-adornment-new-password">New Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-new-password"
              type={showPassword ? 'text' : 'password'}
              name="newpassword"
              value={formData.newpassword}
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
            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type={showCPassword ? 'text' : 'password'}
              name="confirmpassword"
              value={formData.confirmpassword}
              onChange={handleInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowCPassword}
                    edge="end"
                  >
                    {showCPassword ? <VisibilityOff /> : <Visibility />}
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
              value={formData.otp}
              onChange={handleInputChange}
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
  
          {!loading && (
            <Button
              variant="contained"
              color="secondary"
              onClick={savePassword}
            >
              Save Password
            </Button>
          )}
        </div>
      </div>
    )
}

export default NewPassword