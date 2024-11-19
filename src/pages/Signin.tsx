import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import Login from "../components/Login";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { WarningModal } from "../components/Modal";
import { useAuth } from "../hook/useAuth";
import { ILoginHandlerValues } from "../types/Login";
import { useCallback } from "react";

export default function Signin() {
  const navigate = useNavigate();
  const { authenticated, setAuth } = useAuth();
  const onSubmit = useCallback(async (value: ILoginHandlerValues) => {
    const { email, password, rememberMe } = value;

    try {
      if (rememberMe) await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      setAuth(true);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        // FirebaseError 에 대한 처리
        const errorCode = error?.code;
        const errorMessage = error?.message;
        console.error("code : ", errorCode, " / message : ", errorMessage);
      } else if (error instanceof Error) {
        // 일반적인 JavaScript 에러 처리
        console.error("General Error:", error.message);
        alert(`Error: ${error.message}`);
      } else {
        // 예기치 않은 에러 처리
        console.error("Unknown Error:", error);
        alert("An unknown error occurred.");
      }
      setAuth(false);
    }
  }, [navigate, setAuth]);

  return <div className='container mx-auto my-4'>
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
      <Login onSubmit={onSubmit} />
    </div>
    {authenticated && <WarningModal
      title="Deactivate account"
      description="Are you sure you want to deactivate your account? All of your data will be permanently removed.
      This action cannot be undone."
      onConfirm={() => { navigate("/"); }}
    />}
  </div>
}
