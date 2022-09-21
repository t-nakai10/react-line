import "./App.css";
import SignIn from "components/SignIn.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "firebase.js";

function App() {
  const user = useAuthState(auth);

  return <div>{user ? <Line /> : <SignIn />}</div>;
}

export default App;
