import React, { useEffect, useState } from "react";
import SignOut from "components/SignOut";
import { db } from "firebase.js";
import { collection, getDocs, limit, query } from "firebase/firestore";

const Line = () => {
  const [messages, setMessages] = useState();
  // DBの情報は最初だけでいい, 何回も読み込む必要はないためuseEffectを使用.
  // レンダー結果が決定された後に実行される（副作用を設定できる）
  useEffect(() => {
    // クエリの作成.
    const q = query(collection(db, "messages"), limit(50));
    try {
      const querySnapshot = async () => {
        // await は Promise オブジェクトを返す.
        const docs = await getDocs(q);
        const data = [];
        docs.forEach((doc) => {
          data.push(doc.data());
        });
        setMessages(data);
      };
      querySnapshot();
    } catch (error) {
      console.log("");
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
