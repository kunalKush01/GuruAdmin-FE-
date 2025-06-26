// src/aws/awsPool.js (or any file you choose)
import { Amplify } from "aws-amplify";

export default function configureAmplify() {
  Amplify.configure({
    Auth: {
      region: process.env.REACT_APP_REGION,
      identityPoolId: process.env.REACT_APP_POOL_ID,
    },
    Storage: {
      bucket: process.env.REACT_APP_BUCKET_NAME,
      region: process.env.REACT_APP_REGION,
      identityPoolId: process.env.REACT_APP_POOL_ID,
    },
  });
}
