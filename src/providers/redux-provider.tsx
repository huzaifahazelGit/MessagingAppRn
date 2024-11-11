import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import {
  clearIndexedDbPersistence,
  getFirestore,
  terminate,
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import React, { useEffect } from "react";
import {
  AuthProvider,
  FirestoreProvider,
  FunctionsProvider,
  StorageProvider,
  useFirebaseApp,
} from "reactfire";

export default function ReduxProvider({ children }) {
  const app = useFirebaseApp();
  const firestore = getFirestore(app);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  const storage = getStorage(app);
  const fbfunctions = getFunctions(app);

  // useEffect(() => {
  //   if (firestore) {
  //     terminate(firestore)
  //       .then((res) => {
  //         console.log("terminate", res);
  //         clearIndexedDbPersistence(firestore)
  //           .then((cleared) => {
  //             console.log("cleared", cleared);
  //           })
  //           .catch((clearErr) => {
  //             console.log("clearErr", clearErr);
  //           });
  //       })
  //       .catch((termErr) => {
  //         console.log("termErr", termErr);
  //       });
  //   }
  // }, [firestore]);

  return (
    <AuthProvider sdk={auth}>
      <StorageProvider sdk={storage}>
        <FunctionsProvider sdk={fbfunctions}>
          <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>
        </FunctionsProvider>
      </StorageProvider>
    </AuthProvider>
  );
}
