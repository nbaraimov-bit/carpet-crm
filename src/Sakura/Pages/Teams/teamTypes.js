const teamTypes = [
  { id: "washer", title: "Gilam yuvish" },
  { id: "packing", title: "Tayyorlovchi" },
  { id: "driver", title: "Yetkazib berish" },
];

export const teamTypeMap = Object.fromEntries(teamTypes.map((type) => [type.id, type]));

export const teamDefaultShares = {
  washer: { carpet: 0, blanket: 0, yakandoz: 0, curtain: 0 },
  driver: {},
  packing: {},
};

export default teamTypes;
