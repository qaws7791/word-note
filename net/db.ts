import firebaseApp from "./firebase";
import { 
  getFirestore,
  Firestore,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs, 
  updateDoc,
  query, 
  collection, 
  DocumentReference,
  QuerySnapshot,
  DocumentData, 
  where,
  doc } from "firebase/firestore";
const db:Firestore = getFirestore(firebaseApp);

interface CreatePostParams {
  subject: string;
  content: string;
  author: string;
}

interface CreateBookParams {
  authorName: string;
  bookName: string;
  userId: string;
}
interface GetBooksAllParams {
  uid: string
}

interface CreateWordParams {
  spelling: string;
  meaning: string;
  bookId: string;
  rating: number;

}





export const createBook = async ({authorName, bookName,userId}:CreateBookParams):Promise<DocumentReference> => {
  return await addDoc(collection(db, "books"), {
    authorName,
    bookName,
    userId,
    created_at: new Date().getTime(),
  });
}


export const getBooksAll = async({uid}: GetBooksAllParams):Promise<QuerySnapshot<DocumentData>> => {
  const q = query( collection(db, 'books'),where("userId", "==",uid));
  return await getDocs(q)
}

export const createWord = async ({spelling, meaning,bookId,rating}:CreateWordParams):Promise<DocumentReference> => {
  return await addDoc(collection(db, 'books',bookId,'words'), {
    spelling,
    meaning,
    rating,
    created_at: new Date().getTime(),
  });
}

export const deleteBook =async (id:string) => {
  return deleteDoc(doc(db, 'books',id));
}

export const updateBook =async ({bookName,id}:{bookName:string, id:string}) => {
  return await updateDoc(doc(db, 'books',id), {
        bookName
    });
  
}

export const getBook =async (id:string) => {
  return await getDoc(doc(db, 'books',id));
}

export const getWord = async ({bookId,wordId}:{bookId:string, wordId:string}) => {
  return await getDoc(doc(db,'books',bookId,'words',wordId))
}

export const getWordData = async ({bookId,wordId}:{bookId:string, wordId:string}) => {
  const dataRef = await getDoc(doc(db,'books',bookId,'words',wordId));

  return {id: dataRef.id, ...dataRef.data()}
}

export const updateWord = async({
  bookId,
  wordId,
  spelling, 
  meaning,
  rating
}:{
  bookId:string, 
  wordId:string, 
  spelling: string | undefined, 
  meaning: string | undefined,
  rating: number | undefined
}) => {
   await updateDoc(doc(db,'books',bookId,'words',wordId),{
    spelling,
    meaning,
    rating,
  });
  return getWordData({bookId,wordId})
}

export const deleteWord =async ({bookId,wordId}:{bookId:string, wordId:string}) => {
  return deleteDoc(doc(db,'books',bookId,'words',wordId));
}

export default db;