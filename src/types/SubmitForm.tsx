interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement,
  category: HTMLInputElement
  date: HTMLInputElement,
  tags: HTMLInputElement,
}

export interface SubmitFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

export interface SubmitFormHandlerValue {
  title: string
  content: string
  category: string
  tags: string
  createdAt: Date | null
}

export interface SubmitFormProps {
  onSubmit: (value: SubmitFormHandlerValue) => void,
  editorDefaultValue?: string // to use default value
}

