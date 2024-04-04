import moment from "moment";

export const exportCattleJson = (data) => {
  return data.map((item) => ({
    cattleId: item?.tagId,
    motherId: item?.motherId ?? "N/A",
    type: item?.type,
    breed: item?.breed,
    dateOfBirth: moment(item?.dob).format(" DD MMM YYYY"),
    age: item?.age,
    purchaseDate: moment(item?.purchaseDate).format(" DD MMM YYYY"),
    purchasePrice: item?.purchaseDate ?? "N/A",
    source: item?.source ?? "N/A",
    ownerName: item?.ownerName ?? "N/A",
    ownerNumber: item?.ownerMobile
      ? "+" + item?.ownerCountryCode + item?.ownerMobile
      : "N/A",
    ownerId: item?.ownerId,
    isDead: item?.isDead ? "YES" : "NO",
    deathReason: item?.deathReason ?? "-",
    isSold: item?.isSold ? "YES" : "NO",
    purchaserName: item?.purchaserName ?? "-",
    purchaserNumber: item?.purchaserMobile
      ? "+" + item?.purchaserCountryCode + item?.purchaserMobile
      : "N/A",
    soldDate: item?.soldDate
      ? moment(item?.soldDate).format(" DD MMM YYYY")
      : "N/A",
    soldPrice: item?.soldPrice ?? "N/A",
    isMilking: item?.isMilking ? "YES" : "NO",
    milkQuantity: item?.milkQuantity ?? "N/A",
    isPregnant: item?.isPregnant ? "YES" : "NO",
    deliveryDate: item?.deliveryDate
      ? moment(item?.deliveryDate).format(" DD MMM YYYY")
      : "N/A",
    pregnancyDate: item?.pregnancyDate
      ? moment(item?.pregnancyDate).format(" DD MMM YYYY")
      : "N/A",
  }));
};
