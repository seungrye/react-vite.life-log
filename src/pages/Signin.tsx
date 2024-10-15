import Login from "../components/Login";

export default function Signin() {
  return <div className='container mx-auto my-4'>
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
      <Login onSubmit={({ email, password, rememberMe }) => {
        console.log("email:", email, ", password:", password, ", rememberMe:", rememberMe);
      }} />
    </div>
  </div>

}
