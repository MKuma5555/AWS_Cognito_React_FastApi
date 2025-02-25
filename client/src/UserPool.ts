import { CognitoUserPool } from "amazon-cognito-identity-js";

interface PoolData {  
  UserPoolId: string;
  ClientId: string;
}

// .env にID等は入力しています
const poolData: PoolData = {
  UserPoolId: import.meta.env.VITE_USER_POOL_ID || "",
  ClientId: import.meta.env.VITE_CLIENT_ID || "",
};

const userPool = new CognitoUserPool(poolData); 

export default userPool; 