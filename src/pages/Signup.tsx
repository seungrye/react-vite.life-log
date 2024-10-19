import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Register from "../components/Register"
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const onSubmit = async (value: any) => {
    const { name, email, password } = value;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name });
      navigate("/");
    } catch (error: (FirebaseError | any)) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("code : ", errorCode, " / message : ", errorMessage);
    }
  }

  return <div className='container mx-auto my-4'>
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
      <Register onSubmit={onSubmit} />
    </div>
  </div>
}
