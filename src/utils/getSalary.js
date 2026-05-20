export default function getSalary(
  orders,
  workerPhone,
  days,
  selectedDate
) {

    const today = new Date()
    const fromDate = new Date(today)

    if (days === 7) {

      const day = today.getDay()
      const diff = day === 0 ? 6 : day - 1

      fromDate.setDate( today.getDate() - diff )
    }

    else {
      fromDate.setDate( today.getDate() - days )
    }

    return (orders || [])

    .filter((o) => {

      const isWorker =
      o.carpetWasher === workerPhone ||
      o.blanketWasher === workerPhone ||
      o.yakandozWasher === workerPhone ||
      o.curtainWasher === workerPhone

      if (!isWorker) return false

      const dateField =
        o.carpetDate ||
        o.blanketDate ||
        o.yakandozDate ||
        o.curtainDate

      if (!dateField || !dateField.toDate)
      return false

      const date = dateField.toDate()

      if (selectedDate && days === "custom") {

        const selected = new Date(selectedDate)

        return (
          date.getDate() === selected.getDate() &&
          date.getMonth() === selected.getMonth() &&
          date.getFullYear() === selected.getFullYear()
        )

      }

      if (days === "all") {return true}

      if (days === 1) {
        return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        )
      }

      if (days === 7) {
        const day = today.getDay()
        const diff = day === 0 ? 6 : day - 1
        fromDate.setDate( today.getDate() - diff)
      }

      else {
        fromDate.setDate( today.getDate() - days)
      }

      if (days === 30) {

        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        )

      }

      return ( date >= fromDate )

    })

    .reduce(

      (sum, o) => sum +
      Number(o.carpetSalary || 0) +
      Number(o.blanketSalary || 0) +
      Number(o.yakandozSalary || 0) +
      Number(o.curtainSalary || 0),
      0
    )

}