export default function getHours(
  attendance,
  workerPhone,
  days,
  selectedDate
) {
    const today = new Date()
    const fromDate = new Date(today)

    return attendance

    .filter((a) => {

      if (a.workerPhone!== workerPhone) return false
      if (days === "all") return true
      if (!a.createdAt || !a.createdAt.toDate) return false

      const date = a.createdAt.toDate()

      if (selectedDate && days === "custom") {

        const selected = new Date(selectedDate)

        return (
          date.getDate() === selected.getDate() &&
          date.getMonth() === selected.getMonth() &&
          date.getFullYear() === selected.getFullYear()
        )

      }

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
        fromDate.setDate(today.getDate() - diff)
      }

      else {
        fromDate.setDate(today.getDate() - days)
      }

      if (days === 30) {
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        )
      }

      return (date >= fromDate)

    })

    .reduce((sum, a) => sum + Number(a.totalHours || 0 ), 0 )
}