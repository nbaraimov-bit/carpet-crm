export default function getCount(
  orders,
  workerPhone,
  washerField,
  countField,
  days,
  selectedDate
) {

    return (orders || [])

    .filter((o) => {

      if (o[washerField] !== workerPhone)
      return false

      const dateField = washerField.replace(
        "Washer",
        "Date"
      )

      if (!o[dateField]) return false

      const date = o[dateField].toDate()
      const today = new Date()
      const fromDate = new Date(today)

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
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        )
      }

      return (date >= fromDate)
    
    })

    .reduce(
      (sum, o) => sum + Number( o[countField] || 0 ),
      0
    )

}