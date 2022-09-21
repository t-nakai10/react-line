import React, { useEffect, useState } from "react";
import SignOut from "components/SignOut";
import { db } from "firebase.js";
import { collection } from "firebase/firestore";

const Line = () => {
  const [messages, setMessages] = useState();
  // DBの情報は最初だけでいい, 何回も読み込む必要はないためuseEffectを使用.
  // レンダー結果が決定された後に実行される（副作用を設定できる）
  useEffect(() => {
    // DB の messages テーブル（コレクション）に接続.
    // 下記は Firebase v9 では動作しない.
    // db.collection("messages")
    //   .orderBy("createdAt")
    //   .limit(50)
    //   // onSnapshot で実際に取り出し.
    //   .onSnapshot((snapshot) => {
    //     setMessages(snapshot.docs.map((doc) => doc.data()));
    //   });

    // v9 対応していく.
    setMessages(collection(db, "messages").orderBy("createdAt"));
  }, []);

  return (
    <div>
      {console.log(messages)}
      <SignOut />
    </div>
  );
};

export default Line;
