import { cert, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "../../service-account.json" with { type: "json" };

initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

export const db = getFirestore();
