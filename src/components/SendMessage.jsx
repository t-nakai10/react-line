import React, { useState } from "react";

const SendMessage = () => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <form action="">
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
