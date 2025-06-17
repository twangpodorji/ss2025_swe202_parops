import Login from "../shared/services/login";
import Signup from "../shared/services/signup";

const presentation = {
  Login,
  Signup,
}

export default function App() {
  return (
    <presentation.Login />
  );
}