import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import Login from "../components/Login";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { WarningModal } from "../components/Modal";

export default function Signin() {
  const navigate = useNavigate();
  const { authenticated, setAuth } = useAuth();
  const onSubmit = async (value: any) => {
    const { email, password, rememberMe } = value;

    try {
      rememberMe && await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      setAuth(true);
    } catch (error: (FirebaseError | any)) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("code : ", errorCode, " / message : ", errorMessage);
    }
  }


  return <div className='container mx-auto my-4'>
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
      <Login onSubmit={onSubmit} />
    </div>
    <WarningModal state={!!authenticated}
      title="Deactivate account"
      description="Are you sure you want to deactivate your account? All of your data will be permanently removed.
      This action cannot be undone."
      onConfirm={() => { navigate("/"); }}
    />
  </div>
}
