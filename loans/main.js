/**
 *
 *  Assumptions for time constrains
 *
 * if (principalTokenId: null) = USDC = DAI all equal to $1
 *
 *  Token was not needed for calculation since they were both equal
 *
 *  Took the Minimum price for the day if collateral was less then it was added to output Array.
 *
 *  Todo: Refactor
 *  for loops into Array built in methods
 *
 *
 */

 const loans = require('../loans.json')
 const ethPrice = require('../eth-price.json')
 const tokens = require('../tokens.json')

 const MS_PER_DAY = 1000 * 60 * 60 * 24

 //Given a date, return which loans were liquidatable

 async function getLiquidatableLoans(givenDate) {
     const ethPriceDate = await getEthPriceDate(
         givenDate,
         ethPrice
     )

     const loansIDWillLiquidate = await getloansIDWillLiquidate(
         givenDate,
         laons,
         ethPriceDate
     )

     return [...loansIDWillLiquidate]
 }

 function getEthPriceDate(givenDate, ethData) {
     const ethPricesForDate = []
     const dateToFilter = givenDate.getDate()

     for (let i = 0; i < ethData.length; i++) {
         let eth = ethData[i]

         let dateOfEth = new Date(eth.date).getDate()
         if (dateToFilter === dateOfEth) {
            ethPricesForDate.push(eth.value)
         }
     }
     return Math.min(...ethPricesForDate)
 }

 function getLoansToLiquidateForDay(date, loans, minEthPrice) {
     const loansID = []

     for (let i = 0; i < loans.length; i++) {
         let loan = loans[i]
         let collateral = loan.collateralAmount * minEthPrice
         let principalAmount = loan.principalAmount

         if (isLoanPastDue(date, loan)) {
             loansID.push(loan.id)
         } else if (collateral === 0) {
             loansID.push(loan.id)
         } else {
             if (collateral < principalAmount) {
                 loansID.push(loan.id)
             }
         }
     }
     console.log(loan)
     return loansID
 }

 function isLoanPastDue(dateToTest, loan) {
     const dateToTestInMS = dateToTest.getTime()
     const loanIssueDate = parseInt(loan.filledAt)
     const daysToExpire = loan.durationInDays
     const durationOfLoansInMS = MS_PER_DAY * daysToExpire
     const loanExpire = loanIssueDate + durationOfLoansInMS

     if (dateToTestInMS > loanExpire) {
         return true
     }
     return false
 }

 module.exports = {
    getLiquidatableLoans,
    getEthPriceDate,
    getLoansToLiquidateForDay,
    isLoanPastDue,
    MS_PER_DAY
 }