
export interface IBoardData {
  atclKdCd: string
  atclTit: string
  chgDttm: string
  chgrId: string
  regDttm: string
  regtId: string
  atclSno: number
  rowNum: number
}

export interface IBoardParams {
  [key: string]: any
  atclKdCd: string
  atclTit?: string
  page?: number
  perPageNum?: number
}
