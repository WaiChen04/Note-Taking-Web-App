import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import NoteForm from './components/NoteForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import noteService from './services/notes'
import './index.css'
import loginService from './services/login'
import Togglable from './components/Togglable'
import SignupForm from './components/SignupForm'
import usersService from './services/users'
import Warning from './components/Warning'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [WarningMessage, setWarning] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)
  const [signupVisible, setSignupVisible] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setWarning('You are Logged in')
      setTimeout(() => {
      setWarning(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  const handleSignup = async (event) => {
    event.preventDefault()
    try {
      await usersService.signup({
        username,  password,name,
      })
      
      setUsername('')
      setPassword('')
      setName('')

      setWarning('Account created successfully, Please Login')
      setTimeout(() => {
      setWarning(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage('Error creating account')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    setWarning('You have logged out')
    setNotes([])
    setTimeout(() => {
    setWarning(null)
    }, 5000)
  }
  
  const deleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      noteService
        .remove(id)
        .then(() => {
          setNotes(notes.filter(note => note.id !== id))
        })
        setWarning('Note Deleted')
        setTimeout(() => {
        setWarning(null)
        }, 5000)
        .catch(error => {
          console.error('Error deleting note:', error)
        })
    }
  }


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    } else {
      setUser(null)
      setNotes([])
    }
  }, [])

  useEffect(() => {
    if (user) {
      noteService.getAll(user.id).then(initialNotes => {
        setNotes(initialNotes)
      })
    }
  }, [user]) 

  const noteFormRef = useRef()

  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })

      setWarning('Note Added')
      setTimeout(() => {
      setWarning(null)
      }, 5000)
  }


  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      setWarning('Importance of note changed')
      setTimeout(() => {
      setWarning(null)
      }, 5000)
      .catch(error => {

        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)



  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const signupForm = () => {
    const hideWhenVisible = { display: signupVisible ? 'none' : '' }
    const showWhenVisible = { display: signupVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setSignupVisible(true)}>create account</button>
        </div>
        <div style={showWhenVisible}>
          <SignupForm
            username={username}
            password={password}
            name={name}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleNameChange={({ target }) => setName(target.value)}
            handleSubmit={handleSignup}
          />
          <button onClick={() => setSignupVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef} >
      <NoteForm createNote={addNote} />
    </Togglable>
  )



  return (
    <div>
      <h1>Notes</h1>
      <h3>This is a note-taking web app. You can start adding notes through making a new account.
        <br />
        If you already have an account, you can log in and start adding notes.
        <br />
        You can delete and change the importances of the notes.
      </h3>

      <Notification message={errorMessage} />
      <Warning message={WarningMessage} />
 
      {signupForm()}
      

      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in<button onClick={handleLogout}>Logout</button></p>
        {noteForm()}
      </div>
      }


{notes.length > 0 && (
  <div>
    <button onClick={() => setShowAll(!showAll)}>
      show {showAll ? 'important' : 'all'}
    </button>
  </div>
)}
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id}
          note={note}
          toggleImportance={() => toggleImportanceOf(note.id)} 
          deleteNote={deleteNote}
          />
        )}
      </ul>
    </div>
  )
}

export default App
