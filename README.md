# React Line × Firebase メモ

## 開発メモ

- rcfe
  - 基本的な関数コンポーネント用コードを生成する
- racfe
  - アロー関数版

## jsconfig.json

### import を絶対パスで記述できるようにする

```json
{
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src/*.js", "src/*.jsx"]
}
```

## マテリアル UI

- マテリアルデザインを簡単に実現できるデザインライブラリ

### マテリアルデザインとは

- UX 設計体型としてグーグルが発表している
- 統一感のあるデザインを取り入れ操作するデバイスが変わっても操作が統一される

### インストール方法

- リファレンス通り
- 今回はマテリアルアイコンを使用する
  https://mui.com/material-ui/material-icons/#main-content

### 使用方法

## 使用方法

```js
// １個ずつ取り込むのがセオリーっぽい.
import { Button } from "@mui/material";

function test() {
  return (
    <div>
      <Button>テスト</Button>
    </div>
  );
}
```

## useEffect とは

- レンダー結果が決定された後に実行される
- 副作用を実行などという
- 公式: https://ja.reactjs.org/docs/hooks-effect.html

### 使い方

```js
useEffect(() => {
  // 第１引数に処理.
}, []); // 第２引数にデータ.
```

第２引数を設定することで、第１引数の関数の実行タイミングを調整できる.

## firestore

Firebase > Cloud Firestore

### 設定

- コレクション
  - テーブルみたいな感じで使える
- フィールド
  - 一般的なフィールド

### ルール

- Firebase > Cloud Firestore > ルールタブ
- 一見 TRUE に見えてそうだが、なぜかエラーで使用できない
  - 暫定の対応

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if
          request.time < timestamp.date(2022, 10, 21);
    }
  }
}
```

↓ true にする

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true
    }
  }
}
```

## Google 認証

firebase の設定 > web > Authentication
なんでもプロバイダを追加が追加できるようになっている

### react-firebase-hooks

- React Hooks が Firebase と簡単にやりとりできるような機能を持つ
- Github: https://github.com/CSFrequency/react-firebase-hooks

- 各種便利な hook が用意されている

### useAuthState

`const [user, loading, error] = useAuthState(auth, options);`
Firebase から認証状態を取得して監視する。

- user - ログインしているかどうか
- loading - 認証状態がロードされているかどうか
- error - エラー

- auth - 監視対象のアプリのインスタンス
- options - `onUserChanged` or`auth.User`を持つオブジェクト

```js
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user] = useAuthState(auth);

  return <div>{user ? <Line /> : <SignIn />}</div>;
}
```

### React 側

- 呼び出される側 firebase.js

```js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
// 認証.
const auth = getAuth(app);
// グーグルプロバイダー.
const provider = new GoogleAuthProvider();

// エクスポート
export { auth, provider };
```

- 呼び出す側

```js
// インポート
import { auth, provider } from "./firebase";
```

- 便利な hooks が存在している.
- `npm i react-firebase-hooks`

```js
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Home() {
  // useAuthState で認証状態を管理, この状態を利用して分岐できる
  const [user] = useAuthState(auth);

  return (
    <div>
      <SignInButton />
    </div>
  );
}

function SignInButton() {
  // onClick に渡す関数
  const signInWithGoogle = () => {
    // auth 内にある関数を呼びだし、引数に auth と provider を渡す.
    signInWithPopup(auth, provider);
  };

  return <button onClick={signInWithGoogle}>グーグルでサインイン</button>;
```

### エラー対応

#### ログインを押すとエラーが出力される.

`Uncaught (in promise) FirebaseError: Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.).`

- .env ファイルがないとだめ
  - .env.local だけを作成してしまっていた

#### ログインを押すとエラーが出力

`assert.ts:136 Uncaught (in promise) FirebaseError: Firebase: Error (auth/configuration-not-found).`

- firebase 側の設定漏れ
  - Google 認証追加していなかった

### 疑問

- firebase.js ファイルにどれだけの認証系の情報を持たせるのか
- 非同期処理じゃなくていいのか

## DB にデータ送信

- input の値を`useState()`と `onChange()`を使用して値を代入する

```jsx
const SendMessage = () => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <form onSubmit={sendMessage}>
        <div>
          <input
            type="text"
            placeholder="メッセージを入力してください"
            // message に値を代入
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};
```

- 関数を定義
  - 最初は setDoc を使っていたが上書きされるため addDoc に変更した

```jsx
async function sendMessage(e) {
  // onSubmitでリロードされるが、する必要はない.
  e.preventDefault();

  // setDoc では上書きのため,addDocを使う
  // ドキュメントにランダムIDが付与されるように修正.
  const docRef = collection(db, "messages");
  await addDoc(docRef, {
    text: message,
    uid: uid,
    photoURL: photoURL,
    createdAt: serverTimestamp(),
  });
}
```

- 問題がある
  - [参考](<https://zenn.dev/nash/articles/6e18bd94eca63e#%E3%83%A9%E3%83%B3%E3%83%80%E3%83%A0%E3%81%AAid%E3%81%8C%E4%BB%98%E4%B8%8E%E3%81%95%E3%82%8C%E3%81%9F%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E6%9B%B4%E6%96%B0(%E5%AE%9F%E8%B7%B5%E7%9A%84%E3%81%AAsetdoc)>)
  - ドキュメントとデータが同時に作成される
  - → ドキュメントへの参照が存在しない
  - = 後から編集できない
  - doc を変数に入れておき、setDoc で値を入れる

```jsx
const docRef = doc(collection(db, "messages"));
await setDoc(docRef, {
  text: message,
  uid: uid,
  photoURL: photoURL,
  createdAt: serverTimestamp(),
});
```

## 今後の課題

- スタイル
  - マテリアル UI をフル活用したい
- データが送信されたタイミングでフロントに反映されるような実装
- CRUD すべてを試す
