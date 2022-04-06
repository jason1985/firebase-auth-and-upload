import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, storage } from "./firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import { Spinner } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const [photoUrl, setPhotoUrl] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user] = useAuthState(auth); // null if not logged in
  const [uploading, setUploading] = useState(false);

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("register", user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
  };

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("signed out");
      })
      .catch((error) => {
        console.log(error);
        // An error happened.
      });
  };

  const updatePhotoUrl = () => {
    const profileImageRef = ref(storage, `images/${user.uid}`);

    getDownloadURL(profileImageRef).then((img) => {
      updateProfile(auth.currentUser, {
        photoURL: img,
      })
        .then(() => {
          console.log("profile updated");
          setPhotoUrl(img);
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const uploadImage = () => {
    console.log(imageUpload);
    if (!imageUpload) return;
    setUploading(true);
    const imageRef = ref(storage, `images/${user.uid}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      updatePhotoUrl();
    });
  };

  useEffect(() => {
    if (user !== null && user.photoURL !== null) {
      setPhotoUrl(user.photoURL);
    } else {
      setPhotoUrl("default-user-image.png");
    }
  }, [user]);

  return (
    <div className="App">
      <h1>{user ? `Welcome ${user.email}` : "Please login"}</h1>
      {user ? (
        <>
          <img src={photoUrl} alt="uploaded pic" />
          <input
            type="file"
            onChange={(e) => setImageUpload(e.target.files[0])}
          />
          <button disabled={uploading} onClick={uploadImage}>
            {" "}
            {uploading ? (
              <Spinner style={{ width: "1.2rem", height: "1.2em" }} />
            ) : (
              "upload image"
            )}
          </button>
          <button onClick={logout}>logout</button>
        </>
      ) : (
        <>
          <form style={{ display: "flex", flexDirection: "column" }}>
            name:
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
            password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
          <div>
            <button onClick={register}>register</button>
            <button onClick={signIn}>login</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
