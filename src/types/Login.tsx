interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement,
  password: HTMLInputElement
  remember: HTMLInputElement
}

export interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

export interface LoginHandlerValues {
  email: string
  password: string
  rememberMe: boolean
}

export interface LoginProps {
  onSubmit: (value: LoginHandlerValues) => void,
}

