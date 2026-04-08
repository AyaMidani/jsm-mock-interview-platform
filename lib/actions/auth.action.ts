'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";


const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();
        if (userRecord.exists) {
            return {
                error: 'User already exists, please login instead'
            }
        }
        await db.collection('users').doc(uid).set({
            name, email
        });
        return {
            success: true,
            message: `Account created for ${name} with email ${email}`
        }
    } catch (error: any) {
        console.log('Error creating new user:', error);
        if(error.code === 'auth/email-already-exists') {
           return{
            error: 'Email already exists'
           }
        }
         return{
            error: 'Failed to create user'
           }
    }   
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userCredential = await auth.getUserByEmail(email);
        if(!userCredential) {
            return {
                success: false,
                error: 'User not found'
            }
        }
        await setSessionCookies(idToken);
        return {
            success: true,
        }
    } catch (error: any) {
        console.log('Error signing in:', error);
        if(error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            return{
                success: false,
                error: 'Invalid email or password'
            }
        }
        return{
            error: 'Failed to sign in'
        }
    }
}

export async function setSessionCookies(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, { 
        expiresIn: ONE_WEEK * 1000 
    });

    cookieStore.set('session', sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: ONE_WEEK,
        path: '/',
        sameSite: 'lax',
    });

}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if (!userRecord.exists) {
            return null;
        }
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (error) {
        console.log('Error verifying session cookie:', error);
        return null;
    }
} 

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}


