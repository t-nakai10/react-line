import React, { useEffect, useState } from "react";
import SignOut from "components/SignOut";
import { db } from "firebase.js";

const Line = () => {
  const [messages, setMessages] = useState();
  // DBの情報は最初だけでいい, 何回も読み込む必要はないためuseEffectを使用.
  // レンダー結果が決定された後に実行される（副作用を設定できる）
  useEffect(() => {}, []);

  return (
    <div>
      <SignOut />
    </div>
  );
};

export default Line;
