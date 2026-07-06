const teamTypes = [
  {
    id: "washer",
    title: "Gilam yuvish",
    icon: "🧼",

    services: [
      {
        key: "carpet",
        title: "Gilam",
        icon: "🧼",
      },
      {
        key: "blanket",
        title: "Adyol",
        icon: "🛏",
      },
      {
        key: "yakandoz",
        title: "Yakandoz",
        icon: "🧵",
      },
      {
        key: "curtain",
        title: "Parda",
        icon: "🪟",
      },
    ],
  },

  {
    id: "driver",
    title: "Yetkazib berish",
    icon: "🚚",

    services: [],
  },

  {
    id: "packing",
    title: "Tayyorlovchi",
    icon: "📦",

    services: [],
  },
];

export const teamTypeMap = Object.fromEntries(
  teamTypes.map((type) => [type.id, type])
);

export default teamTypes;