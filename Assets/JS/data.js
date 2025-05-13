    const translations = {
  en: {
    WELCOME_TO_AGRIROBOT : "WELCOME TO AGRIROBOT"
  },
  ar: {
    WELCOME_TO_AGRIROBOT : "WELCOME TO AGRIROBOT arabic"
  }
};
  const base_url = `http://192.168.1.9:8000/api/` ;

  let language = localStorage.getItem('language');
  
  if (!language) {
    language = navigator.language.startsWith('ar') ? 'ar' : 'en';
    setlanguage(language);
  }
  apply_language(language);
  function setlanguage(lang)
  {
    if(lang=== 'ar' || lang === 'en')
    {
      language = lang;
      localStorage.setItem('language', language);
      apply_language(language);
      // location.reload();
    }
  }

function apply_language(language)
{
  const elements = document.querySelectorAll('[data-key]');
  elements.forEach(el => {
    const key = el.getAttribute('data-key');
    el.textContent = translations[language][key];
  });
}
