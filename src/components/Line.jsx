import React, { useEffect, useState } from "react";
import SignOut from "components/SignOut";
import { db } from "firebase.js";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import SendMessage from "./SendMessage";

const Line = () => {
  const [messages, setMessages] = useState([]);
  // DBの情報は最初だけでいい, 何回も読み込む必要はないためuseEffectを使用.
  // レンダー結果が決定された後に実行される（副作用を設定できる）
  useEffect(() => {
    // クエリの作成.
    const q = query(
      collection(db, "messages"),
      limit(50),
      orderBy("createdAt")
    );

    try {
      const querySnapshot = async () => {
        // await は Promise オブジェクトを返す.
        const docSnap = await getDocs(q);
        setMessages(
          docSnap.docs.map((doc) => {
            const data = doc.data();
            // データにユニークIDがあったため付与しておく.
            return { ...data, id: doc.id };
          })
        );
      };
      querySnapshot();
    } catch (error) {
      console.log("エラー");
      console.log(error);
    }
  }, []);

  return (
    <div>
      <SignOut />
      <div>
        {messages.map(({ id, text, photoURL, uid }) => (
          <div key={id}>
            <div>
              <img src={photoURL} alt="" />
              <p>{text}</p>
            </div>
          </div>
        ))}
        <p>データを送信しました！</p>
      </div>
      <SendMessage />
    </div>
  );
};

export default Line;
