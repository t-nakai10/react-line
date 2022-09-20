import { Button } from "@mui/material";
import React from "react";
import { db, auth, provider } from "firebase.js";
import { signInWithPopup } from "firebase/auth";

function SignIn() {
  function singInWithGoogle() {
    signInWithPopup(auth, provider);
  }

  return (
    <div>
      <Button onClick={singInWithGoogle}>グーグルでログインする</Button>
    </div>
  );
}

export default SignIn;
