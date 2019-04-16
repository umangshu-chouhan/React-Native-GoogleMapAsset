import moment from 'moment'

const DATE_FORMAT = 'MMM DD, YYYY'
const DATE_FORMAT_API = 'YYYY-MM-DD'
const DATE_FORMAT_MM_DD = 'MM/DD/YYYY'
const DATE_FORMAT_DD_MM = 'DD/MM/YYYY'
const DATE_FORMAT_DD_MM_YYYY = 'DD-MM-YYYY'
const DATE_FORMAT_WITH_TIME = 'MMM DD YYYY, hh:mm a'
const TIME_ONLY = 'hh:mm a'
export const UTC_TIME_FORMAT = 'YYYY-MM-DDTHH:MM'

export const formatDate = date => {
  return moment(date).format(DATE_FORMAT)
}

export const formatDateTimeOnly = date => {
  return moment(date).format(TIME_ONLY)
}

export const formatApiDate = date => {
  return moment(date).format(DATE_FORMAT_API)
}

export const formatDateMMDD = date => {
  return moment(date).format(DATE_FORMAT_MM_DD)
}
//New Date Format
export const formatDateDDMM = date => {
  return moment(date).format(DATE_FORMAT_DD_MM)
}
export const formatDateDDMMYYYY = date => {
  return moment(date).format(DATE_FORMAT_DD_MM_YYYY)
}
export const formatDateWithTime = date => {
  return moment(date).format(DATE_FORMAT_WITH_TIME)
}

export const isAfter = (startDate, endDate) => {
  return moment(endDate).isSame(startDate) || moment(endDate).isAfter(startDate)
}

export const formatAmount = (amount, CurrencyCode) => {
  return CurrencyCode.length > 0
    ? `${CurrencyCode}${' '}${amount.toFixed(2)}`
    : `${amount.toFixed(2)}`
}

export const roundAmount = amount => {
  const objAmount = Number.isNaN(amount) ? 0 : parseFloat(amount)
  return `${objAmount.toFixed(2)}`
}

export const isBefore = (startDate, endDate) => {
  return (
    moment(endDate).isBefore(startDate) || moment(endDate).isSame(startDate)
  )
}

export const getToDateForRegion = noOfdays => {
  return moment(
    new Date(new Date().getTime() + noOfdays * 24 * 60 * 60 * 1000)
  ).format(DATE_FORMAT_MM_DD)
}

export const getCurrentTimeInGMT = () => moment.utc().format(UTC_TIME_FORMAT)

export const getCurrentTimestampInGMT = () => moment.utc().format('X')

export const getCurrentDateInGMT = () => moment.utc().format(DATE_FORMAT_API)
