import { atom } from "jotai";
import { User } from "../types/book";


export const UserAtom = atom<User | undefined>(undefined);