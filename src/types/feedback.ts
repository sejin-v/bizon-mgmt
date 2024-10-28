
// [{ evalScorName: "매우불만", userTotalCount: "12" }, { evalScorName: "불만", userTotalCount: "0" },…]
interface evaluatingCustomerSatisfactionDTO {
  evalScorName: string
  userTotalCount: string
}
export interface IFeedbackData {
  avgScor: string
  evalQstnCntn: string
  evalQstnNo: number
  evaluatingCustomerSatisfactionDTOList: evaluatingCustomerSatisfactionDTO[]
  regDttm: string
}


export interface IFeedbackParams {
  regDtStart: string
  regDtEnd: string
}

export interface ISubjectFeedbackData {
  ansrRegDttm: string
  encEntrNo: string
  entrNo: string
  entrStusNm: string
  evalAnsr: string
  evalQstnCntn: string
  evalQstnNo: number
  evalRegDttm: string
  rowNum: number
  sbscDownSped: number
  sbscUpldSped: number
  trfEvetOccrDt: string
}

export interface ISubjectFeedbackParams {
  evalRegDtStart: string
  evalRegDtEnd: string
  entrNo?: string
  page?: number
  perPageNum?: number
}