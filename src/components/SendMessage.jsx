import React, { useState } from "react";
import { db, auth } from "firebase.js";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const SendMessage = () => {
  const [message, setMessage] = useState("");

  async function sendMessage(e) {
    // onSubmitでリロードされるが、する必要はない.
    e.preventDefault();

    // auth のカレントユーザーには uid と url のプロパティがある.
    const { uid, photoURL } = auth.currentUser;

    // async await で一旦セットする方法をとる.
    // doc() の第３引数をuid にしたい → auth.currentUser で解決.
    await setDoc(doc(db, "messages", uid), {
      text: message,
      uid: uid,
      photoURL: photoURL,
      createdAt: serverTimestamp(),
    });
    setMessage("");
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
