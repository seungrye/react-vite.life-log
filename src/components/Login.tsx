interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement,
  password: HTMLInputElement
  remember: HTMLInputElement
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

interface LoginProps {
  onSubmit: (value: { email: string, password: string, rememberMe: boolean }) => void,
}

export default function Login(props: LoginProps) {
  const { onSubmit } = props;

  return <form className="max-w-sm mx-auto" onSubmit={(event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();
    const elements = event.currentTarget.elements;
    onSubmit({
      email: elements.email.value,
      password: elements.password.value,
      rememberMe: elements.remember.checked
    });
  }}>
    <div className="mb-5">
      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
        Your email
      </label>
      <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@flowbite.com" required />
    </div>
    <div className="mb-5">
      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
        Your password
      </label>
      <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
    </div>
    <div className="flex items-start mb-5">
      <div className="flex items-center h-5">
        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
      </div>
      <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900">
        Remember me
      </label>
    </div>
    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
      Submit
    </button>
  </form>
}
