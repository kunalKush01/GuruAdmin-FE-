import  {Amplify, Auth, Storage } from 'aws-amplify';

export default function configureAmplify() {
  Amplify.configure({
    Auth: {
      identityPoolId:process.env.REACT_APP_POOL_ID,
      region: process.env.REACT_APP_REGION,
      // region:"",
    },
    Storage: {
      bucket: process.env.REACT_APP_BUCKET_NAME,
      region: process.env.REACT_APP_REGION,
      // region:"",
      identityPoolId: process.env.REACT_APP_POOL_ID
    }
  });
}