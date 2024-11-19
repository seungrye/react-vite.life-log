import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Register from "../components/Register"
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useAuth } from "../hook/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const onSubmit = useCallback(async (value: { name: string, email: string, password: string }) => {
    const { name, email, password } = value;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name });
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
      <Register onSubmit={onSubmit} />
    </div>
  </div>
}
