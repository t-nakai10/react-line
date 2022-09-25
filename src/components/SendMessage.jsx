import React, { useState } from "react";
import { db } from "firebase.js";
import { doc, setDoc } from "firebase/firestore";

const SendMessage = () => {
  const [message, setMessage] = useState("");

  async function sendMessage(e) {
    // onSubmitでリロードされるが、する必要はない.
    e.preventDefault();
    // async await で一旦セットする方法をとる.
    // doc() の第３引数をuid にしたい.
    await setDoc(doc(db, "messages", "test"), {
      text: message,
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
