import { Link } from "react-router-dom";

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement,
  email: HTMLInputElement,
  password: HTMLInputElement,
  cpassword: HTMLInputElement
}

interface RegisterFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

interface RegisterProps {
  onSubmit: (value: { name: string, email: string, password: string }) => void,
}

export default function Register(props: RegisterProps) {
  const { onSubmit } = props;

  return <form className="max-w-sm mx-auto" onSubmit={(event: React.FormEvent<RegisterFormElement>) => {
    event.preventDefault();
    const elements = event.currentTarget.elements;

    if (elements.password.value != elements.cpassword.value) {
      return console.error("password != confirm password");
    }

    console.assert(onSubmit != undefined);
    onSubmit({
      name: elements.name.value,
      email: elements.email.value,
      password: elements.password.value,
    });
  }}>
    <div className="mb-5">
      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
        User name
      </label>
      <input type="name"
        id="name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="User name" required />
    </div>
    <div className="mb-5">
      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
        Email Id
      </label>
      <input type="email"
        id="email"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="email-id@domain.name" required />
    </div>
    <div className="mb-5">
      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
        Password
      </label>
      <input type="password"
        id="password"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
        placeholder="Enter password" />
    </div>
    <div className="mb-5">
      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
        Confirm Password
      </label>
      <input type="password"
        id="cpassword"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
        placeholder="Enter confirm password" />
    </div>

    <div className="!mt-12">
      <button type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
      >
        Create an account
      </button>
    </div>

    <p className="text-gray-800 text-sm mt-6 text-center">Already have an account?
      <Link to="/signin" className="text-blue-600 font-semibold hover:underline ml-1">Login here</Link>
    </p>
  </form>
}
