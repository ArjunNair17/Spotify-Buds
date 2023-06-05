import { createContext } from "react";
import { app } from "../Firebase/config";

export const FirebaseContext = createContext(app);
