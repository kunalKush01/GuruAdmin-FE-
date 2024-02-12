import moment from "moment";

export const exportCattleJson = (data) => {
  return data.map((item) => ({
    cattleId: item?.tagId,
    ownerId: item?.ownerId,
    type: item?.type,
    motherId: item?.motherId ?? "N/A",
    breed: item?.breed,
    dateOfBirth: moment(item?.dob).format(" DD MMM YYYY"),
    age: item?.age,
    isPregnant:
      // <div style={{ padding: "16px" }}>
      item?.isPregnant ? "YES" : "NO",
    // </div>
    isMilking: item?.isMilking ? "YES" : "NO",
    pregnancyDate: item?.pregnancyDate
      ? moment(item?.pregnancyDate).format(" DD MMM YYYY")
      : "N/A",
    milkQuantity: item?.milkQuantity ?? "N/A",
  }));
};
