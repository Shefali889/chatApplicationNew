import React, { useEffect, useRef, useState } from 'react';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import { BeatLoader } from 'react-spinners';
import nochat from '../../assets/noChats.png';
import noMessage from '../../assets/noMessage.png';
import styles from '../../styles/currentChat.css';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { useAppSelector } from '../../redux/store';


let apiurl = process.env.REACT_APP_API_URL

const CurrentChat = (params) => {
  const navigate = useNavigate();
  const chatMessagesRef = useRef(null);
  const { selectedChat, allMessages, setAllMessages, message, setMessage, sendMessage, socket, currentChatId } = params
  const auth = useAppSelector((state) => state.auth)
  const [someoneTyping, setSomeoneTyping] = React.useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);


  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }
  useEffect(() => {
    scrollToBottom()
  }, [])

  // useEffect(() => {
  //   console.log('SELECTED CHAT', selectedChat)
  // }, [selectedChat])

  useEffect(() => {
    scrollToBottom()
  }, [allMessages])

  useEffect(() => {
    if (!auth.isAuth) {
      return navigate('/login')
    }
  }, [auth])


  const handleTyping = () => {
    socket.emit("typing", currentChatId);
  };

  const handleStopTyping = () => {
    // add delay for 5 seconds
    setTimeout(() => {
      socket.emit("stop typing", currentChatId);
    }, 5000);
  };


  useEffect(() => {
    socket.on("typing", (room) => {
      // Handle typing indicator for the given chat room
      // You can update the UI to show that someone is typing
      // console.log("Someone is typing in room:", room);
      setSomeoneTyping(true)
      scrollToBottom()

    });

    socket.on("stop typing", (room) => {
      // Handle stop typing indicator for the given chat room
      // You can update the UI to hide the typing indicator
      // console.log("Someone stopped typing in room:", room);
      setSomeoneTyping(false)
    });

    // Cleanup event listeners when the component is unmounted
    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [currentChatId]);

  useEffect(() => {
    if (!auth.isAuth) {
      return navigate("/login");
    }
    socket.emit("userOnline", auth.user._id);
    if (!selectedChat || !selectedChat.users || selectedChat.users.length < 2) {
      // Handle the case where selectedChat is not properly defined or users array is not available
      console.error("Selected chat or users array is not defined correctly.");
      return;
    }

    // Determine the other user's ID
    const otherUserId = selectedChat.users[0]._id === auth.user._id
      ? selectedChat.users[1]._id
      : selectedChat.users[0]._id;


    // Listen for the online status of the other user
    socket.on("userOnlineStatus", ({ userId, isOnline }) => {
      if (userId === otherUserId) {

        if (isOnline == true) {
          setIsOtherUserOnline(isOnline);
          console.log(otherUserId, 'is ', isOnline)

        }
        else {
          console.log(otherUserId, 'else is ', isOnline)

          setIsOtherUserOnline(false);
        }

        // console.log(otherUserId , ' is ', isOnline)
      }
    });

    // Emit an event to get the current online status of the other user
    socket.emit("checkUserOnlineStatus", otherUserId);

    return () => {
      socket.off("userOnlineStatus");
    };
  }, [selectedChat, auth.user, socket]);
  return (
<div className="currentChat">
  {
    auth.user && selectedChat ?
      <div className="chatIn">
        <div className="chatTop">
          {
            selectedChat.isGroupChat ?
              <div className="chatImage">
                <Avatar sx={{ bgcolor: deepOrange[500] }} className="avatar">
                  {selectedChat.chatName[0]}
                </Avatar>
              </div>
              :
              <div className="chatImage" style={{ position: 'relative' }}>
                <Avatar
                  alt={selectedChat.chatName}
                  src={`${apiurl}/${selectedChat.users[0]._id === auth.user._id
                    ? selectedChat.users[1].profilePic
                    : selectedChat.users[0].profilePic}`}
                  sx={{ bgcolor: deepPurple[500] }}
                />
                <span
                  className="statusDot"
                  style={{
                    backgroundColor: isOtherUserOnline ? 'lightgreen' : 'gray',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid white',
                  }}
                />
              </div>
          }

          {
            selectedChat.isGroupChat ?
              <div className="chatNameStatus">
                <div className="chatName">{selectedChat.chatName}</div>
              </div>
              :
              <div className="chatNameStatus">
                <div className="chatName">{selectedChat.users[0]._id === auth.user._id
                  ? selectedChat.users[1].name : selectedChat.users[0].name}</div>
              </div>
          }
        </div>

        <div className="chatMessages" ref={chatMessagesRef}>
          {
            allMessages && allMessages.length > 0 ?
              allMessages.map((message, index) => (
                <div className="messagerow" key={index}>
                  {
                    message.sender._id === auth.user._id ?
                      <div className="messageYou">
                        <div className="messageText">{message.content}</div>
                      </div>
                      :
                      <div className="message">
                        <div className="messageText">{message.content}</div>
                      </div>
                  }
                </div>
              ))
              :
              <div className="noChatout">
                <img src={noMessage} width={500} height={500} alt='' />
              </div>
          }
          {
            someoneTyping &&
            <div className="messagerow">
              <div className="message">
                <BeatLoader color="#ffffff" />
              </div>
            </div>
          }
        </div>

        <div className="chatBottom">
          <input type='text' placeholder='Type a message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            onKeyUp={handleStopTyping}
          />

          <div onClick={sendMessage}>
            <SendIcon sx={{ color: deepPurple[500] }} />
          </div>
        </div>
      </div>
      :
      <div className="noChatout">
        <img src={nochat} width={500} height={500} alt='' />
      </div>
  }
</div>

  )
}

export default CurrentChat