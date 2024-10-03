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
  fullname: string;
  role: string;
  profileImage: string;
  grade: number;
  password: string;
};

export type Student = {
  grade: number;
  user: User;
};
