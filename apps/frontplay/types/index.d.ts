export type KeyValue = {
  [key: string | number]: any
}

export type LabelValueOption = {
  label: string | number
  value: any
  [key: string | number]: any
}[]

export type Message = {
  role: 'sender' | 'receiver'
  name: string
  content: string
}
