const teamTypes = [
  {
    id: "washer",
    title: "Gilam yuvish",
    icon: "🧼",
  },
  {
    id: "driver",
    title: "Yetkazib berish",
    icon: "🚚",
  },
  {
    id: "packing",
    title: "Tayyorlovchi",
    icon: "📦",
  },
];

export const teamTypeMap = Object.fromEntries(
  teamTypes.map((type) => [type.id, type])
);

export default teamTypes;