import React, { useState } from "react";
import { getDatabase, ref, child, get, push, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

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

const LoginForm = (props) => {
  return (
    <div>
      <h1>Login</h1>
      <input type="email" placeholder="Email" value={props.email} onChange={(e) => props.setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={props.password} onChange={(e) => props.setPassword(e.target.value)} />
      <button onClick={props.handleLogin}>Login</button>
      <button onClick={props.handleSignUp}>Sign Up</button>
    </div>
  );
}

const SportsList = (props) => {
  return (
    <div>
      <h1>Welcome, {props.email}!</h1>
      <h3>Add a favorite sport:</h3>
      <input type="text" placeholder="Sport" value={props.sport} onChange={(e) => props.setSport(e.target.value)} />
      <button onClick={props.handleAddSport}>Add</button>
      <h2>Your favorite sports:</h2>

      {props.favoriteSports.length === 0 ? (
        <p>You have no favorite sports.</p>
      ) :
        <ul>
          {props.favoriteSports.map((sport) => (
            <li key={sport}>{sport}</li>
          ))}
        </ul>
      }
    </div>
  );
}


const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [favoriteSports, setFavoriteSports] = useState([]);
  const [sport, setSport] = useState("");

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
        alert(error.message);
      });
  };

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(handleLogin)
      .catch((error) => {
        alert(error.message);
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
          <SportsList {...{ email, favoriteSports, sport, setSport, handleAddSport }} />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <LoginForm {...{ email, setEmail, password, setPassword, handleLogin, handleSignUp }} />
      )
      }
    </div >
  );
};

export default App;
