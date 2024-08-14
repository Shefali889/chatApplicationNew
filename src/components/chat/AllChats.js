import React, { useEffect } from "react";
import styles from "../../styles/allChats.css";
import { Avatar, Button, TextField } from "@mui/material";
import { deepOrange, deepPurple } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { useAppSelector } from "../../redux/store";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};



let apiurl = `${process.env.REACT_APP_API_URL}`;

const AllChats = (props) => {
  const { setCurrentChatId, fetchContacts, contacts } = props;
  const [chats, setChats] = React.useState([]);
  useEffect(() => {
    console.log(contacts);
    setChats(contacts);
  }, [contacts]);

  const auth = useAppSelector((state) => state.auth);
  const [topsearch, setTopSearch] = React.useState("");


  const [openNewP2p, setOpenNewP2p] = React.useState(false);
  const handleOpenP2pModal = () => setOpenNewP2p(true);
  const handleCloseP2pModal = () => setOpenNewP2p(false);
  const [newP2pEmail, setNewP2pEmail] = React.useState('')


  const createContact = () => {
    fetch(process.env.REACT_APP_API_URL + '/chat/accesschatp2p', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        recieverEmail: newP2pEmail
      })
    })
      .then(res => res.json())
      .then((data) => {
        if (data.message == "Chat found") {
          toast.success('Chat already exists')
        }
        else if (data.message == "Chat created") {
          toast.success('Chat created')
        }
        else {
          toast.error(data.message)
        }
        fetchContacts()
        handleCloseP2pModal()
      })
  }



  const [openNewGroup, setOpenNewGroup] = React.useState(false);
  const handleOpenGroupModal = () => setOpenNewGroup(true);
  const handleCloseGroupModal = () => setOpenNewGroup(false);
  const [newGroupName, setNewGroupName] = React.useState('')
  const [selelectedUsers, setSelectedUsers] = React.useState([])
  const [searchOptions, setSearchOptions] = React.useState([])


  const getSearchOptions = async (typedvalue) => {
    let res = await fetch(process.env.REACT_APP_API_URL + '/user/searchusers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ search: typedvalue })
    })

    let data = await res.json()
    if (data.ok) {
      let newOptions = data.data.map((user) => user.email)
      setSearchOptions(newOptions)
    }
  }

  const createGroup = async () => {

    let res = await fetch(process.env.REACT_APP_API_URL + '/chat/creategroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ name: newGroupName, users: selelectedUsers })
    })

    let data = await res.json()
    if (data.ok) {
      toast.success('Group created')
    }
    else {
      toast.error(data.message)
    }
    fetchContacts()
    handleCloseGroupModal()

  }


  return (
    <div className="allChats">
      <div className="search">
        <input
          type="text"
          placeholder="Search"
          value={topsearch}
          onChange={(e) => {
            setTopSearch(e.target.value);
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>

      {
        auth?.user &&
        <div className="chats">
          {chats.filter((item) => {
            if (topsearch === "") {
              return item;
            } else if (item.isGroupChat) {
              if (item.chatName.toLowerCase().includes(topsearch.toLowerCase())) {
                return item;
              }
            } else {
              if (item.users[0]._id === auth.user._id) {
                if (item.users[1].name.toLowerCase().includes(topsearch.toLowerCase()) ||
                  item.users[1].email.toLowerCase().includes(topsearch.toLowerCase())) {
                  return item;
                }
              } else {
                if (item.users[0].name.toLowerCase().includes(topsearch.toLowerCase()) ||
                  item.users[0].email.toLowerCase().includes(topsearch.toLowerCase())) {
                  return item;
                }
              }
            }
          }).map((contact, index) => (
            <div className="chat" key={index}
              onClick={() => {
                setCurrentChatId(contact._id);
              }}
            >
              {contact.isGroupChat ? (
                <div className="avatar">
                  <Avatar sx={{ bgcolor: deepOrange[500] }}>
                    {contact.chatName[0]}
                  </Avatar>
                </div>
              ) : (
                <div className="avatar">
                  <Avatar
                    alt={contact.chatName}
                    src={`${apiurl}/${auth.user && contact.users[0]._id === auth.user._id
                      ? contact.users[1].profilePic
                      : contact.users[0].profilePic}`}
                    sx={{ bgcolor: deepPurple[500] }}
                  />
                </div>
              )}

              {contact.isGroupChat ? (
                <div className="chatInfo">
                  <div className="name">{contact.chatName}</div>
                  {contact.latestMessage && (
                    <div className="lastMessage">
                      <span>{contact.latestMessage.sender.name}</span>:
                      <span>{contact.latestMessage.content}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="chatInfo">
                  <div className="name">
                    {contact.users[0]._id === auth.user._id
                      ? contact.users[1].name
                      : contact.users[0].name}

                    {contact.latestMessage && (
                      <div className="lastMessage">
                        <span>
                          {contact.latestMessage.sender._id === auth.user._id
                            ? "You : "
                            : ""}
                        </span>
                        <span>{contact.latestMessage.content}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      }

      <div className="buttondiv">
        <Button color="secondary" variant="contained" onClick={() => handleOpenP2pModal()}>
          + Chat
        </Button>

        <Button color="secondary" variant="contained" onClick={() => handleOpenGroupModal()}>
          + Group
        </Button>
      </div>

      <Modal
        open={openNewP2p}
        onClose={handleCloseP2pModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="newP2pModal">
            <TextField color="secondary" id="outlined-basic" label="Email" variant="outlined"
              value={newP2pEmail} onChange={(e) => setNewP2pEmail(e.target.value)}
            />
            <Button color="secondary" variant="contained" onClick={() => createContact()}>
              Add
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openNewGroup}
        onClose={handleCloseGroupModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="newP2pModal">
            <TextField
              id="outlined-basic" label="Group Name" variant="outlined"
              value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)}
            />

            <Autocomplete
              multiple
              id="tags-standard"
              options={searchOptions}
              getOptionLabel={(option) => option}
              onChange={(event, value) => setSelectedUsers(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Select Users"
                  placeholder="Contacts"
                  onChange={(e) => getSearchOptions(e.target.value)}
                />
              )}
            />

            <Button variant="contained" onClick={() => createGroup()}>
              Create
            </Button>
          </div>
        </Box>
      </Modal>
    </div>

  );
};

export default AllChats;
