export const locales = ["en", "fr", "ar"] as const
export type Locale = (typeof locales)[number]

export const translations = {
  en: {
    // Auth
    login: "Login",
    register: "Register",
    logout: "Logout",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",

    // Profile
    firstName: "First Name",
    lastName: "Last Name",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    originCity: "Origin City",

    // Pregnancy questions
    isFirstPregnancy: "Is this your first pregnancy?",
    livingChildrenCount: "Number of living children",
    deliveryType: "Delivery type",
    natural: "Natural",
    cesarean: "Cesarean",
    both: "Both",
    birthPlace: "Where did you give birth?",
    publicHospital: "Public Hospital",
    privateHospital: "Private Hospital",
    clinic: "Clinic",

    // Medical survey
    beforeInjection: "Before Cytotec injection",
    toldAboutCynto: "Were you told that you would be given Cytotec?",
    gaveConsent: "Did you give your consent?",
    knewWhyCynto: "Do you know why you were given Cytotec?",

    duringLabor: "During labor",
    strongContractions: "Did you have very strong or very fast contractions after the injection?",
    morePainThanExpected: "Did you have more pain than you expected?",
    askedToStop: "Did you ask to stop the medication?",

    afterDelivery: "After delivery",
    problemsAfterDelivery: "Did you have problems after delivery?",
    feltRespected: "Did you feel respected during labor?",
    tooMuchCyntoUsed: "Do you think too much Cytotec was used?",

    // Posts
    createPost: "Create Post",
    title: "Title",
    content: "Content",
    anonymous: "Post anonymously",
    like: "Like",
    comment: "Comment",
    communityPosts: "Community Posts",
    welcome: "Welcome",

    // Common
    yes: "Yes",
    no: "No",
    dontKnow: "I don't know",
    dontRemember: "I don't remember",
    didntDare: "I didn't dare",
    aLittle: "A little",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    loading: "Loading...",
    success: "Success",
    error: "Error",
  },
  fr: {
    // Auth
    login: "Connexion",
    register: "S'inscrire",
    logout: "Déconnexion",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    forgotPassword: "Mot de passe oublié?",
    resetPassword: "Réinitialiser le mot de passe",

    // Profile
    firstName: "Prénom",
    lastName: "Nom",
    age: "Âge",
    gender: "Genre",
    male: "Homme",
    female: "Femme",
    other: "Autre",
    originCity: "Ville d'origine",

    // Pregnancy questions
    isFirstPregnancy: "Est-ce votre premier accouchement?",
    livingChildrenCount: "Nombre d'enfants vivants",
    deliveryType: "Type d'accouchement",
    natural: "Voie basse",
    cesarean: "Césarienne",
    both: "Les deux",
    birthPlace: "Où avez-vous accouché?",
    publicHospital: "Hôpital public",
    privateHospital: "Hôpital privé",
    clinic: "Clinique",

    // Medical survey
    beforeInjection: "Avant l'injection du Cytotec",
    toldAboutCynto: "Est-ce qu'on vous a dit qu'on allait vous donner du Cytotec?",
    gaveConsent: "Avez-vous donné votre accord?",
    knewWhyCynto: "Savez-vous pourquoi on vous a donné du Cytotec?",

    duringLabor: "Pendant le travail",
    strongContractions: "Avez-vous eu des contractions très fortes ou très rapides après l'injection?",
    morePainThanExpected: "Avez-vous eu mal plus que ce que vous attendiez?",
    askedToStop: "Avez-vous demandé à arrêter le produit?",

    afterDelivery: "Après l'accouchement",
    problemsAfterDelivery: "Avez-vous eu des problèmes après l'accouchement?",
    feltRespected: "Vous êtes-vous sentie respectée pendant le travail?",
    tooMuchCyntoUsed: "Pensez-vous qu'on a utilisé trop de Cytotec?",

    // Posts
    createPost: "Créer un post",
    title: "Titre",
    content: "Contenu",
    anonymous: "Publier anonymement",
    like: "J'aime",
    comment: "Commenter",
    communityPosts: "Publications de la communauté",
    welcome: "Bienvenue",

    // Common
    yes: "Oui",
    no: "Non",
    dontKnow: "Je ne sais pas",
    dontRemember: "Je ne me souviens pas",
    didntDare: "Je n'ai pas osé",
    aLittle: "Un peu",
    save: "Sauvegarder",
    cancel: "Annuler",
    submit: "Soumettre",
    loading: "Chargement...",
    success: "Succès",
    error: "Erreur",
  },
  ar: {
    // Auth
    login: "تسجيل الدخول",
    register: "التسجيل",
    logout: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    resetPassword: "إعادة تعيين كلمة المرور",

    // Profile
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    age: "العمر",
    gender: "الجنس",
    male: "ذكر",
    female: "أنثى",
    other: "آخر",
    originCity: "مدينة المنشأ",

    // Pregnancy questions
    isFirstPregnancy: "هل هذه ولادتك الأولى؟",
    livingChildrenCount: "عدد الأطفال الأحياء",
    deliveryType: "نوع الولادة",
    natural: "طبيعية",
    cesarean: "قيصرية",
    both: "كلاهما",
    birthPlace: "مكان الولادة",
    publicHospital: "مستشفى عام",
    privateHospital: "مستشفى خاص",
    clinic: "عيادة",

    // Medical survey
    beforeInjection: "قبل حقن السيتوتاك",
    toldAboutCynto: "هل قيل لك أنه سيتم إعطاؤك السيتوسين؟",
    gaveConsent: "هل أعطيت موافقتك؟",
    knewWhyCynto: "هل كنت تعلمين لماذا تم إعطاؤك السيتوسين؟",

    duringLabor: "أثناء الولادة",
    strongContractions: "هل شعرت بتقلصات قوية جداً أو سريعة جداً بعد الحقن؟",
    morePainThanExpected: "هل شعرت بألم أكثر مما كنت تتوقعين؟",
    askedToStop: "هل طلبت إيقاف الدواء؟",

    afterDelivery: "بعد الولادة",
    problemsAfterDelivery: "هل واجهت مشاكل بعد الولادة؟",
    feltRespected: "هل شعرت بأنه تم احترامك أثناء الولادة؟",
    tooMuchCyntoUsed: "هل تعتقدين أنه تم استخدام الكثير من السيتوسين؟",

    // Posts
    createPost: "إنشاء منشور",
    title: "العنوان",
    content: "المحتوى",
    anonymous: "نشر بشكل مجهول",
    like: "إعجاب",
    comment: "تعليق",
    communityPosts: "منشورات المجتمع",
    welcome: "مرحباً",

    // Common
    yes: "نعم",
    no: "لا",
    dontKnow: "لا أعرف",
    dontRemember: "لا أتذكر",
    didntDare: "لم أجرؤ",
    aLittle: "قليلاً",
    save: "حفظ",
    cancel: "إلغاء",
    submit: "إرسال",
    loading: "جاري التحميل...",
    success: "نجح",
    error: "خطأ",
  },
}

export function getTranslation(locale: Locale, key: keyof typeof translations.en): string {
  return translations[locale][key] || translations.en[key]
}
