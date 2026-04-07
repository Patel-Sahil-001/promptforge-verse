import { admin } from './src/_lib/firebaseAdmin.js';

async function checkUser() {
    const email = "99sahil9426@gmail.com";
    try {
        const userRec = await admin.auth().getUserByEmail(email);
        console.log("User UID:", userRec.uid);
        
        const docSnap = await admin.firestore().collection("profiles").doc(userRec.uid).get();
        if (docSnap.exists) {
            console.log("Profile Data:", docSnap.data());
        } else {
            console.log("No profile found for UID:", userRec.uid);
        }
    } catch(e) {
        console.error(e);
    }
    process.exit(0);
}
checkUser();
