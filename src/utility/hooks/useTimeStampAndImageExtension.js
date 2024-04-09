
const useTimeStampAndImageExtension = (acceptedFiles) => {
  const specificDate = new Date();
  const unixTimestampSeconds = Math.floor(specificDate.getTime() / 1000);
  const extension = acceptedFiles?.name.split(".").pop();
  
  return { unixTimestampSeconds, extension };
};

export default useTimeStampAndImageExtension;
