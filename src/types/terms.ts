
export interface ITermsData {
  chgDttm: string
  regDttm: string
  rowNum: string
  tadvPrvsLinkId: string
  tadvPrvsLinkNm: string
  tadvPrvsLinkUrlAddr: string
  updateTadvPrvsLinkId: string
}



export interface ITermsParams {
  [key: string]: any
  tadvPrvsLinkNm?: string
  tadvPrvsLinkUrlAddr?: string
  updateTadvPrvsLinkId?: string
  page?: number
  perPageNum: number
}
