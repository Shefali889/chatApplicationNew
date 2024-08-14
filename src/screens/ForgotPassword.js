import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import styles from '../styles/auth.css';
import BackButton from '../components/BackButton';



const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
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
      navigate('/forgotpassword/newpassword?email='+formData.email)
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
      <h1>Forgot Password</h1>
      <TextField
        id="standard-basic"
        label="Email"
        variant="outlined"
        color="secondary"
        name='email'
        value={formData.email}
        onChange={handleInputChange}
      />

      <div className="inputrow">
        {sendingOtp ? (
          <LoadingButton
            size="small"
            endIcon={<SendIcon />}
            loading={sendingOtp}
            loadingPosition="end"
            variant="contained"
          >
            <span>Send</span>
          </LoadingButton>
        ) : (
          <Button
            variant='contained'
            color='secondary'
            onClick={sendOtp}
          >
            Send OTP
          </Button>
        )}
      </div>
    </div>
  </div>

  )
}

export default ForgotPassword