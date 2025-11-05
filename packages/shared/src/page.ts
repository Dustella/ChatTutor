export enum PageType {

}

export interface Page {
  type: string | PageType
  title: string
  history: unknown[]
}
