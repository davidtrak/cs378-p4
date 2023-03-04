import React, { useState } from "react";
import { getDatabase, ref, child, get, push, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [favoriteSports, setFavoriteSports] = useState([]);
  const [sport, setSport] = useState("");

  const firebaseConfig = {
    apiKey: "AIzaSyCZQov0j_wjmq3_xsCseNGIuR8zljaj8dQ",
    authDomain: "p4-cs378.firebaseapp.com",
    databaseURL: "https://p4-cs378-default-rtdb.firebaseio.com",
    projectId: "p4-cs378",
    storageBucket: "p4-cs378.appspot.com",
    messagingSenderId: "696321451787",
    appId: "1:696321451787:web:10c81d7bac39b4805da40e"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth(app);

  const handleLogin = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setLoggedIn(true);
        const user = userCredential.user;

        // Get user's favorite sports
        get(child(ref(database), 'users/' + user.uid + '/favoriteSports')).then((snapshot) => {
          if (snapshot.exists()) {
            setFavoriteSports(Object.values(snapshot.val()));
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(handleLogin)
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  const handleLogout = () => {
    auth.signOut();
    setLoggedIn(false);
  };

  const handleAddSport = async () => {
    try {
      // Update the user's favorite sports in the database
      const newSportRef = push(child(ref(database), 'users/' + auth.currentUser.uid + '/favoriteSports'));
      set(newSportRef, sport);

      setFavoriteSports([...favoriteSports, sport]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      {loggedIn ? (
        <div>
          <h1>Welcome, {email}!</h1>
          <h3>Add a favorite sport:</h3>
          <input type="text" placeholder="Sport" value={sport} onChange={(e) => setSport(e.target.value)} />
          <button onClick={handleAddSport}>Add</button>
          <h2>Your favorite sports:</h2>

          {favoriteSports !== null && favoriteSports.length === 0 ? (
            <p>You have no favorite sports.</p>
          ) :
            <ul>
              {favoriteSports.map((sport) => (
                <li key={sport}>{sport}</li>
              ))}
            </ul>
          }
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Login</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      )}
    </div>
  );
};

export default Login;
