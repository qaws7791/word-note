import firebaseApp from "./firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
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



export const signInWithGoogle = async () => {
  const {user} = await signInWithPopup(auth, provider)
  return user
}

export default auth;
