interface IFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement,
  password: HTMLInputElement
  remember: HTMLInputElement
}

export interface ILoginFormElement extends HTMLFormElement {
  readonly elements: IFormElements
}

export interface ILoginHandlerValues {
  email: string
  password: string
  rememberMe: boolean
}

export interface ILoginProps {
  onSubmit: (value: ILoginHandlerValues) => void,
}

