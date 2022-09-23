import React, { useEffect, useState } from "react";
import SignOut from "components/SignOut";
import { db } from "firebase.js";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

const Line = () => {
  const [messages, setMessages] = useState();
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
        setMessages(docSnap.docs.map((doc) => doc.data()));
      };
      querySnapshot();
    } catch (error) {
      console.log("エラー");
      console.log(error);
    }
  }, []);

  return (
    <div>
      {console.log(messages)}
      <SignOut />
    </div>
  );
};

export default Line;
