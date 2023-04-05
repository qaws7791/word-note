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

}



export const createPost = async ({subject, content}:CreatePostParams):Promise<DocumentReference> => {
  return await addDoc(collection(db, "articles"), {
    subject,
    content,
    author:"김철수",
    created_at: new Date().getTime(),
  });
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
  return await getDocs(query( collection(db, 'books'),where("uid", "==",uid)))
}

export const createWord = async ({spelling, meaning,bookId}:CreateWordParams):Promise<DocumentReference> => {
  return await addDoc(collection(db, 'books',bookId,'words'), {
    spelling,
    meaning,
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
  bookId,wordId,spelling, meaning
}:{
  bookId:string, wordId:string, spelling: string, meaning: string
}) => {
   await updateDoc(doc(db,'books',bookId,'words',wordId),{
    spelling,
    meaning
  });
  return getWordData({bookId,wordId})
}

export const deleteWord =async ({bookId,wordId}:{bookId:string, wordId:string}) => {
  return deleteDoc(doc(db,'books',bookId,'words',wordId));
}

export default db;