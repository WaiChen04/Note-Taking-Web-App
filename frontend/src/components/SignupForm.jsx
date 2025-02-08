const SignupForm = ({
    handleSubmit,
    username,
    password,
    name,
    handleUsernameChange,
    handlePasswordChange,
    handleNameChange
   }) => {
   return (
     <div>
       <h2>Register</h2>
 
       <form onSubmit={handleSubmit}>
         <div>
           username
           <input
             value={username}
             onChange={handleUsernameChange}
           />
         </div>
         <div>
           password
           <input
             type="password"
             value={password}
             onChange={handlePasswordChange}
           />
       </div>
       <div>
           name
           <input
             type="namee"
             value={name}
             onChange={handleNameChange}
           />
       </div>
         <button type="submit">Create Account</button>
       </form>
     </div>
   )
 }
 
 export default SignupForm