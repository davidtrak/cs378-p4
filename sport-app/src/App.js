import React, { useState } from "react";
import { getDatabase, ref, child, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [favoriteSports, setFavoriteSports] = useState([]);
  const [sport, setSport] = useState("");

  const firebaseConfig = {
    databaseURL: process.env.REACT_APP_DB_URL,
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth(app);

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setLoggedIn(true);
      // Get user's favorite sports from the database
      const dbRef = ref(database);
      get (child(dbRef, 'users/' + auth.currentUser.uid + '/favoriteSports')).then((snapshot) => {
        if (snapshot.exists()) {
          setFavoriteSports(snapshot.val());
        } else {  
          console.log("No data available");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    setLoggedIn(false);
  };

  const handleAddSport = async () => {
    try {
      // Update the user's favorite sports in the database
      const newKey = push(child(ref(database), 'users/' + auth.currentUser.uid + '/favoriteSports')).key;
      
      const updates = {};
      updates['/users/' + auth.currentUser.uid + '/favoriteSports/' + newKey] = sport;
      await update(ref(database), updates);

      setFavoriteSports([...favoriteSports, sport]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style = {{textAlign: "center"}}>
      {loggedIn ? (
        <div>
          <h1>Welcome, {email}!</h1>
          <h3>Add a favorite sport:</h3>
          <input type="text" placeholder="Sport" value={sport} onChange={(e) => setSport(e.target.value)}/>
          <button onClick={handleAddSport}>Add</button>
          <h2>Your favorite sports:</h2>
          <ul>
            {favoriteSports.map((sport) => (
              <li key={sport}>{sport}</li>
            ))}
          </ul>
          <button onClick={handleLogout}>Logout</button>
        </div>
       ) : (
        <div>
          <h1>Login</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Login;
