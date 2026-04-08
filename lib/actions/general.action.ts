import { doc } from "firebase/firestore";
import { db } from "@/firebase/admin";

export async function getInterviewByUserId(userId : string): Promise<Interview[]> {
  const interviews = await db
    .collection('interviews')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();    
    return interviews.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Interview[];
}

export async function getLatestInterviews(params : GetLatestInterviewsParams): Promise<Interview[]> {
    const {userId , limit = 20} = params;
  const interviews = await db
    .collection('interviews')
    .orderBy('createdAt', 'desc')
    .where('finilized', '==', true)
    .where('userId', '!=', userId)
    .limit(limit)
    .get();    
    return interviews.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Interview[];
}

export async function getInterviewById(id : string): Promise<Interview> {
  const interviews= await db
    .collection('interviews')
    .doc(id)
    .get();    
    return interviews.data() as Interview || null;
}
