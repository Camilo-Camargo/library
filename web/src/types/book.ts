import { UserIdentificationType } from "./enum";

export type Book = {
  id: number;
  title: string;
  author: string;
  cover: string;
  quantity: number;
  location: string;
  returnDate?: string;
  student: User;
};

export type User = {
  id: number;
  username: string;
  identification: string;
  identificationType: UserIdentificationType;
  code: string;
  age: number;
  fullname: string;
  role: string;
  profileImage: string;
  grade: number;
  password: string;
};

export type Student = {
  grade: number;
  code: string;
  user: User;
};
