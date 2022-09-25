import React, { useState } from "react";
import { db, auth } from "firebase.js";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const SendMessage = () => {
  const [message, setMessage] = useState("");

  async function sendMessage(e) {
    // onSubmitでリロードされるが、する必要はない.
    e.preventDefault();

    // auth のカレントユーザーには uid と url のプロパティがある.
    const { uid, photoURL } = auth.currentUser;

    // setDoc では上書きのため,addDocを使う
    // ドキュメントにランダムIDが付与される.
    const docRef = collection(db, "messages");
    await addDoc(docRef, {
      text: message,
      uid: uid,
      photoURL: photoURL,
      createdAt: serverTimestamp(),
    });
  }

  return (
    <div>
      <form onSubmit={sendMessage}>
        <div>
          <input
            type="text"
            placeholder="メッセージを入力してください"
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default SendMessage;
