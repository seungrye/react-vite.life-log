export interface ModalProps {
  title: string,
  description: string,
  onConfirm: () => void,
  onCancel?: () => void,
}


