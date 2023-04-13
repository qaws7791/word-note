import firebaseApp from "./firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  Auth,
  User,
} from "firebase/auth";

interface SignUpParams {
  email: string;
  password: string;
}

interface SignInParams {
  email: string;
  password: string;
}


const auth:Auth = getAuth(firebaseApp);
export const signUp = async ({ email, password }: SignUpParams):Promise<User> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
};

export const signIn = async ({ email, password }: SignInParams):Promise<User> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const getCurrentUser = ():User | null => {
  return auth.currentUser;
};

export const logout = async ():Promise<void> => {
  return await signOut(auth);
};

// google login

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential!.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user)
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}

export default auth;
