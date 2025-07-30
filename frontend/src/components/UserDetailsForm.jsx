const UserDetailsForm = ({connecting, setUserName, setGender, sendData}) => {
  return (
    <>
      <h3>Welcome to TTS</h3>

      <form onSubmit={sendData}>
        <label htmlFor="username">Choose your username</label>
        <input 
          id="username"
          name="username"
          type="text"
          placeholder="username"
          onChange={(e) => {setUserName(e.target.value)}}
          required
        />

        <br />

        <label htmlFor="gender">Choose your gender</label>
        <label>
          <input 
            id="gender"
            name="gender"
            type="radio"
            value="M"
            onChange={(e) => {setGender(e.target.value)}}
            required
          />
          Male
        </label>
        <label>
          <input 
            id="gender"
            name="gender"
            type="radio"
            value="F"
            onChange={(e) => {setGender(e.target.value)}}
            required
          />
          Female
        </label>
        <label>
          <input 
            id="gender"
            name="gender"
            type="radio"
            value="O"
            onChange={(e) => {setGender(e.target.value)}}
            required
          />
          Other
        </label>

        <br />

        {!connecting && <input 
          id="connectButton" 
          type="submit" 
          value="Connect" 
        />}

        {connecting && <p><strong>Connecting to Stranger...</strong></p>}
      </form>
    </>
  )
}

export default UserDetailsForm;