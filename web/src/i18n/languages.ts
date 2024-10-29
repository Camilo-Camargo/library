// Interface for type checking
export interface LanguageStrings {
  // Common
  LOGIN: string;
  REGISTER: string;
  UPDATE: string;
  DELETE: string;
  CREATE: string;
  IMPORT: string;
  SEARCH: string;
  UPLOAD: string;
  DOWNLOAD: string;
  LOADING: string;
  IMAGE: string;
  PHOTO: string;
  CANCEL: string;
  CLOSE: string;
  SAVE: string;
  EDIT: string;
  YES: string;
  NO: string;

  // Navigation & Titles
  DASHBOARD: string;
  BOOKS: string;
  BORROWS: string;
  STUDENTS: string;
  GENERATES: string;

  // Auth
  USERNAME: string;
  PASSWORD: string;
  LOGIN_FAILED: string;
  LOGOUT: string;

  // Books
  BOOK_TITLE: string;
  BOOK_AUTHOR: string;
  BOOK_LOCATION: string;
  BOOK_QUANTITY: string;
  CREATE_BOOK: string;
  IMPORT_BOOKS: string;
  UPLOAD_COVER: string;
  UPLOAD_PHOTO: string;
  SEARCH_BOOKS: string;
  RESERVE: string;
  UNRESERVE: string;
  AVAILABLE_BOOKS: string;

  // Students
  STUDENT_FULLNAME: string;
  STUDENT_CODE: string;
  STUDENT_AGE: string;
  STUDENT_GRADE: string;
  STUDENT_IDENTIFICATION: string;
  CREATE_STUDENT: string;
  IMPORT_STUDENTS: string;
  IMPORT_STUDENTS_CSV: string;
  SEARCH_STUDENTS: string;
  SELECT_IDENTIFICATION_TYPE: string;
  SELECT_STUDENT: string;

  // Borrows
  BORROW_DATE: string;
  RETURN_DATE: string;
  RETURNED_AT: string;
  DUE_DATE: string;
  OBSERVATIONS: string;
  STATUS: string;
  STATUS_BORROWED: string;
  STATUS_RETURNED: string;
  DOWNLOADING: string;
  DOWNLOAD_BORROW_PDF: string;
  NO_BORROWS: string;
  LOADING_BORROWS: string;
  BORROW_BOOK: string;

  // 404 Page
  NOT_FOUND_404: string;
  PAGE_NOT_FOUND: string;
  PAGE_NOT_FOUND_MESSAGE: string;
  RETURN_HOME: string;

  // Library Name
  LIBRARY_NAME: string;
  SCHOOL_NAME: string;

  // Placeholders
  NA: string;
  SELECT_OPTION: string;

  // Messages
  CONFIRM_DELETE: string;
  OPERATION_SUCCESS: string;
  OPERATION_FAILED: string;
  REQUIRED_FIELD: string;
}

export const EN: LanguageStrings = {
  // Common
  LOGIN: "Login",
  REGISTER: "Register",
  UPDATE: "Update",
  DELETE: "Delete",
  CREATE: "Create",
  IMPORT: "Import",
  SEARCH: "Search",
  UPLOAD: "Upload",
  DOWNLOAD: "Download",
  LOADING: "Loading",
  IMAGE: "Image",
  PHOTO: "Photo",
  CANCEL: "Cancel",
  CLOSE: "Close",
  SAVE: "Save",
  EDIT: "Edit",
  YES: "Yes",
  NO: "No",

  // Navigation & Titles
  DASHBOARD: "Dashboard",
  BOOKS: "Books",
  BORROWS: "Borrows",
  STUDENTS: "Students",
  GENERATES: "Generates",

  // Auth
  USERNAME: "Username",
  PASSWORD: "Password",
  LOGIN_FAILED: "Login failed! Please check your credentials.",
  LOGOUT: "Logout",

  // Books
  BOOK_TITLE: "Title",
  BOOK_AUTHOR: "Author",
  BOOK_LOCATION: "Location",
  BOOK_QUANTITY: "Quantity",
  CREATE_BOOK: "Create Book",
  IMPORT_BOOKS: "Import Books from CSV",
  UPLOAD_COVER: "Upload Cover",
  UPLOAD_PHOTO: "Upload Photo",
  SEARCH_BOOKS: "Search books by title",
  RESERVE: "Reserve",
  UNRESERVE: "Unreserve",
  AVAILABLE_BOOKS: "Available Books",

  // Students
  STUDENT_FULLNAME: "Full Name",
  STUDENT_CODE: "Code",
  STUDENT_AGE: "Age",
  STUDENT_GRADE: "Grade",
  STUDENT_IDENTIFICATION: "Identification",
  CREATE_STUDENT: "Create Student",
  IMPORT_STUDENTS: "Import Students",
  IMPORT_STUDENTS_CSV: "Import Students from CSV",
  SEARCH_STUDENTS: "Search students by name",
  SELECT_IDENTIFICATION_TYPE: "Select Identification Type",
  SELECT_STUDENT: "Select a student",

  // Borrows
  BORROW_DATE: "Borrow Date",
  RETURN_DATE: "Return Date",
  RETURNED_AT: "Returned At",
  DUE_DATE: "Due Date",
  OBSERVATIONS: "Observations",
  STATUS: "Status",
  STATUS_BORROWED: "Borrowed",
  STATUS_RETURNED: "Returned",
  DOWNLOADING: "Downloading...",
  DOWNLOAD_BORROW_PDF: "Download Borrow PDF",
  NO_BORROWS: "No borrows found from last month.",
  LOADING_BORROWS: "Loading borrows...",
  BORROW_BOOK: "Borrow Book",

  // 404 Page
  NOT_FOUND_404: "404",
  PAGE_NOT_FOUND: "Page Not Found",
  PAGE_NOT_FOUND_MESSAGE: "Sorry, the page you're looking for doesn't exist.",
  RETURN_HOME: "Return to Home",

  // Library Name
  LIBRARY_NAME: "Library",
  SCHOOL_NAME: "Colegio Soraca",

  // Placeholders
  NA: "N/A",
  SELECT_OPTION: "Select an option",

  // Messages
  CONFIRM_DELETE: "Are you sure you want to delete this item?",
  OPERATION_SUCCESS: "Operation completed successfully",
  OPERATION_FAILED: "Operation failed",
  REQUIRED_FIELD: "This field is required",
};

export const ES: LanguageStrings = {
  // Common
  LOGIN: "Iniciar Sesión",
  REGISTER: "Registrarse",
  UPDATE: "Actualizar",
  DELETE: "Eliminar",
  CREATE: "Crear",
  IMPORT: "Importar",
  SEARCH: "Buscar",
  UPLOAD: "Subir",
  DOWNLOAD: "Descargar",
  LOADING: "Cargando",
  IMAGE: "Imagen",
  PHOTO: "Foto",
  CANCEL: "Cancelar",
  CLOSE: "Cerrar",
  SAVE: "Guardar",
  EDIT: "Editar",
  YES: "Sí",
  NO: "No",

  // Navigation & Titles
  DASHBOARD: "Panel Principal",
  BOOKS: "Libros",
  BORROWS: "Préstamos",
  STUDENTS: "Estudiantes",
  GENERATES: "Generar",

  // Auth
  USERNAME: "Usuario",
  PASSWORD: "Contraseña",
  LOGIN_FAILED:
    "¡Error de inicio de sesión! Por favor verifique sus credenciales.",
  LOGOUT: "Cerrar Sesión",

  // Books
  BOOK_TITLE: "Título",
  BOOK_AUTHOR: "Autor",
  BOOK_LOCATION: "Ubicación",
  BOOK_QUANTITY: "Cantidad",
  CREATE_BOOK: "Crear Libro",
  IMPORT_BOOKS: "Importar Libros desde CSV",
  UPLOAD_COVER: "Subir Portada",
  UPLOAD_PHOTO: "Subir Foto",
  SEARCH_BOOKS: "Buscar libros por título",
  RESERVE: "Reservar",
  UNRESERVE: "Cancelar Reserva",
  AVAILABLE_BOOKS: "Libros Disponibles",

  // Students
  STUDENT_FULLNAME: "Nombre Completo",
  STUDENT_CODE: "Código",
  STUDENT_AGE: "Edad",
  STUDENT_GRADE: "Grado",
  STUDENT_IDENTIFICATION: "Identificación",
  CREATE_STUDENT: "Crear Estudiante",
  IMPORT_STUDENTS: "Importar Estudiantes",
  IMPORT_STUDENTS_CSV: "Importar Estudiantes desde CSV",
  SEARCH_STUDENTS: "Buscar estudiantes por nombre",
  SELECT_IDENTIFICATION_TYPE: "Seleccionar Tipo de Identificación",
  SELECT_STUDENT: "Seleccionar un estudiante",

  // Borrows
  BORROW_DATE: "Fecha de Préstamo",
  RETURN_DATE: "Fecha de Devolución",
  RETURNED_AT: "Devuelto el",
  DUE_DATE: "Fecha de Vencimiento",
  OBSERVATIONS: "Observaciones",
  STATUS: "Estado",
  STATUS_BORROWED: "Prestado",
  STATUS_RETURNED: "Devuelto",
  DOWNLOADING: "Descargando...",
  DOWNLOAD_BORROW_PDF: "Descargar PDF de Préstamos",
  NO_BORROWS: "No se encontraron préstamos del último mes.",
  LOADING_BORROWS: "Cargando préstamos...",
  BORROW_BOOK: "Prestar Libro",

  // 404 Page
  NOT_FOUND_404: "404",
  PAGE_NOT_FOUND: "Página No Encontrada",
  PAGE_NOT_FOUND_MESSAGE:
    "Lo sentimos, la página que estás buscando no existe.",
  RETURN_HOME: "Regresar al Inicio",

  // Library Name
  LIBRARY_NAME: "Biblioteca",
  SCHOOL_NAME: "Colegio Soraca",

  // Placeholders
  NA: "N/D",
  SELECT_OPTION: "Seleccione una opción",

  // Messages
  CONFIRM_DELETE: "¿Está seguro de que desea eliminar este elemento?",
  OPERATION_SUCCESS: "Operación completada con éxito",
  OPERATION_FAILED: "La operación falló",
  REQUIRED_FIELD: "Este campo es requerido",
};
