import React, { useState } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [favoriteSports, setFavoriteSports] = useState([]);
  const [sport, setSport] = useState("");

  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setLoggedIn(true);
      // Retrieve the user's favorite sports from the database
      const userRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
      const doc = await userRef.get();
      if (doc.exists) {
        setFavoriteSports(doc.data().favoriteSports);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    firebase.auth().signOut();
    setLoggedIn(false);
  };

  const handleAddSport = async () => {
    try {
      // Update the user's favorite sports in the database
      const userRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
      await userRef.update({
        favoriteSports: firebase.firestore.FieldValue.arrayUnion(sport)
      });
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
