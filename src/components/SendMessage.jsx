import React, { useState } from "react";
import { db, auth } from "firebase.js";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

const SendMessage = () => {
  const [message, setMessage] = useState("");

  async function sendMessage(e) {
    // onSubmitでリロードされるが、する必要はない.
    e.preventDefault();

    // auth のカレントユーザーには uid と url のプロパティがある.
    const { uid, photoURL } = auth.currentUser;

    // setDoc では上書きのため,addDocを使う
    // addDoc ではそのドキュメントへの参照がないため setDoc を使用する形に修正.
    // doc() でドキュメントへの参照を生成できる.
    // ドキュメントにランダムIDが付与.
    const docRef = doc(collection(db, "messages"));
    await setDoc(docRef, {
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
