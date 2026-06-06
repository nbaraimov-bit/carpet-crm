export default function getSalary(
  workerEarnings,
  workerPhone,
  days,
  selectedDate
) {

  const today = new Date()
  let total = 0

  Object.entries(
    workerEarnings || {}
  ).forEach(([dateId, data]) => {

    const worker =
      data?.[workerPhone]

    if (!worker) return

    const date =
      new Date(dateId)

    if (
      selectedDate &&
      days === "custom"
    ) {

      const selected =
        new Date(selectedDate)

      if (
        date.getDate() ===
          selected.getDate() &&
        date.getMonth() ===
          selected.getMonth() &&
        date.getFullYear() ===
          selected.getFullYear()
      ) {
        total +=
          Number(
            worker.salary || 0
          )
      }

      return
    }

    if (days === "all") {
      total +=
        Number(
          worker.salary || 0
        )
      return
    }

    if (days === 1) {

      if (
        date.getDate() ===
          today.getDate() &&
        date.getMonth() ===
          today.getMonth() &&
        date.getFullYear() ===
          today.getFullYear()
      ) {
        total +=
          Number(
            worker.salary || 0
          )
      }

      return
    }

    if (days === 7) {

      const monday =
        new Date(today)

      const day =
        today.getDay()

      const diff =
        day === 0
          ? 6
          : day - 1

      monday.setDate(
        today.getDate() -
        diff
      )

      if (date >= monday) {
        total +=
          Number(
            worker.salary || 0
          )
      }

      return
    }

    if (days === 30) {

      if (
        date.getMonth() ===
          today.getMonth() &&
        date.getFullYear() ===
          today.getFullYear()
      ) {
        total +=
          Number(
            worker.salary || 0
          )
      }

      return
    }

  })

  return total
}