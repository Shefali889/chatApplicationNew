import styles from './App.css'
import React, { useEffect, useState } from 'react'

import logo from './assets/logo2.png'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './redux/store';

export default function Home() {
  //   CHECK LOGIN STATUS

  const navigation = useNavigate()
  const [isLogged, setIsLogged] = React.useState(false);
  const auth = useAppSelector((state) => state.auth);


  console.log(auth)

  const checkLogin = async () => {
    let res = await fetch(process.env.REACT_APP_API_URL + '/auth/checklogin', {
      method: 'GET',
      credentials: 'include'
    })

    let data = await res.json()
    if (!data.ok) {
      navigation('/login')
    }
    else {
      setIsLogged(true)
    }
  }
  React.useEffect(() => {
    checkLogin()
  }, [])


  return (
    <div className="homediv">
      <img src={logo} width={500} height={500} alt="" quality={100} />
      <Button
        color="secondary"
        variant="contained"
        onClick={() => {
          if (isLogged) {
            navigation('/chats');
          } else {
            navigation('/login');
          }
        }}
      >
        Show Chats
      </Button>
    </div>

  )
}
