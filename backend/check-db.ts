import { db } from "./src/_lib/firebaseAdmin.js";

async function run() {
    const uid = "pnab4Oc3rceqytTaEthI9T9PWdk1";
    console.log("Checking profiles collection...");
    const profilesSnap = await db.collection("profiles").doc(uid).get();
    console.log("profiles exists?", profilesSnap.exists);
    if (profilesSnap.exists) {
        console.log("profiles data:", profilesSnap.data());
    }

    console.log("\nChecking pro_plan_users collection...");
    const proSnap = await db.collection("pro_plan_users").doc(uid).get();
    console.log("pro_plan_users exists?", proSnap.exists);
    if (proSnap.exists) {
        console.log("pro_plan_users data:", proSnap.data());
    }
}

run().catch(console.error);
