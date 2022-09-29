import React, { useEffect, useState } from "react";
import SignOut from "components/SignOut";
import { db } from "firebase.js";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import SendMessage from "./SendMessage";

const Line = () => {
  const [messages, setMessages] = useState([]);
  // DBの情報は最初だけでいい, 何回も読み込む必要はないためuseEffectを使用.
  // レンダー結果が決定された後に実行される（副作用を設定できる）
  // @todo リロードなしで更新したいが、方法がわからないため後から対応する。
  //       予想: 第２引数にデータを入れると良さそう。
  useEffect(() => {
    // クエリの作成.
    async function querySnapshot() {
      const q = query(
        collection(db, "messages"),
        limit(50),
        orderBy("createdAt")
      );

      try {
        // await は Promise オブジェクトを返す.
        const docSnap = await getDocs(q);
        setMessages(
          docSnap.docs.map((doc) => {
            const data = doc.data();
            // データにユニークIDがあったため付与しておく.
            return { ...data, id: doc.id };
          })
        );
      } catch (error) {
        console.log("エラー");
        console.log(error);
      }
    }
    querySnapshot();
  }, []);

  return (
    <div>
      <SignOut />
      <div>
        {messages.map(({ id, text, photoURL }) => (
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
