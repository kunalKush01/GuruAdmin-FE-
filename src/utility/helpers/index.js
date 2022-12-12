import AWS from "aws-sdk";

export function configureAmplify() {
  AWS.config.region = process.env.REACT_APP_AWS_REGION; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  });
}

//Configure Storage with S3 bucket information
export function SetS3Config() {
  // Storage.configure({
  //   bucket: "textile-star",
  //   // level: "public",
  //   region: "ap-south-1",
  //   identityPoolId: "ap-south-1:9aa50f58-6efd-4739-b4c7-7da6f7430ea6",
  // });
}

const myBucket = new AWS.S3({
  params: { Bucket: process.env.REACT_APP_AWS_BUCKET_NAME },
  region: process.env.REACT_APP_AWS_REGION,
});

export const uploadFileToS3 = async (file) => {
  const tempFolder = process.env.REACT_APP_AWS_TEMP_FOLDER;
  let extension = file.name.split(".").pop();
  let cleanFileName = file.name.replace(/\..+$/, "");
  let fileName = `${Date.now()}_${cleanFileName}.${extension}`;
  fileName = fileName.replace(" ", "_");
  const params = {
    ACL: "private",
    Key: `${tempFolder}/${fileName}`,
    ContentType: file.type,
    Body: file,
  };
  
  try {
    const data = await myBucket.upload(params).promise();

    return fileName;
  } catch (error) {
  
  }
};
