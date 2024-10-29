import { useLanguage } from "../i18n/LanguageContext";

const NotFound = () => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">
        {language.NOT_FOUND_404}
      </h1>
      <h2 className="text-2xl font-semibold mt-4">{language.PAGE_NOT_FOUND}</h2>
      <p className="text-gray-600 mt-2 text-center">
        {language.PAGE_NOT_FOUND_MESSAGE}
      </p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition bg-primary"
      >
        {language.RETURN_HOME}
      </a>
    </div>
  );
};

export default NotFound;
