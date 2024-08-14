import React from 'react'
import logo from '../assets/logo.png'
import '../styles/navbar.css'
import { Avatar, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { logIn, logOut } from '../redux/features/auth-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { useAppSelector } from '../redux/store'


const Navbar = () => {
  const dispatch = useDispatch()
  const auth = useAppSelector((state) => state.auth)
  const navigate = useNavigate();


  console.log('auth ', auth)

  let apiurl = process.env.REACT_APP_API_URL

  const checkLogin = async () => {
    let res = await fetch(process.env.REACT_APP_API_URL + '/auth/checklogin', {
      method: 'GET',
      credentials: 'include'
    })

    let data = await res.json()
    if (!data.ok) {
      // dispatch(logOut())
    }
    else {
      // console.log(data)
      getUserData()
    }
  }
  React.useEffect(() => {
    checkLogin()
  }, [])


  const getUserData = async () => {

    let res = await fetch(process.env.REACT_APP_API_URL + '/user/getuser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    let data = await res.json()
    if (data) {
      dispatch(logIn(data.data))

    }
    else {
      console.log(data)
    }

  }



  const handleLogout = async () => {
    let res = await fetch(process.env.REACT_APP_API_URL + '/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })

    let data = await res.json()
    if (data.ok) {
      dispatch(logOut())
      navigate('/login')
    }
  }
  return (
    <div className="nav">
      <div className="left">
        <img src={logo} alt="logo" width={50} height={50} />
      </div>
      <div className="right">
        {auth?.user && (
          <Avatar src={`${apiurl}/${auth.user.profilePic}`} />
        )}
        {auth?.isAuth ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </div>
    </div>

  )
}

export default Navbar