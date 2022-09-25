import React, { useState } from "react";
import { db } from "firebase.js";

const SendMessage = () => {
  const [message, setMessage] = useState("");

  function sendMessage(e) {
    // onSubmitでリロードされるが、する必要はない.
    e.preventDefault();
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
