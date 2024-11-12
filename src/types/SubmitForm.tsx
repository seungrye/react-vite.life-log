interface IFormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement,
  category: HTMLInputElement
  date: HTMLInputElement,
  tags: HTMLInputElement,
}

export interface ISubmitFormElement extends HTMLFormElement {
  readonly elements: IFormElements
}

export interface ISubmitFormHandlerValue {
  title: string
  content: string
  category: string
  tags: string
  createdAt: Date | null
}

export interface ISubmitFormProps {
  onSubmit: (value: ISubmitFormHandlerValue) => void,
  editorDefaultValue?: string // to use default value
}

