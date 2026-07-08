import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Send,
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  User,
  Settings,
  Bell,
  Camera,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Phone,
  Check,
  Languages,
  LogOut,
  ChevronRight,
  Info
} from "lucide-react";
import {
  LanguageCode,
  LanguageDef,
  CropPrice,
  CropPost,
  ChatMessage,
  BuyerChat,
  AlertNotification
} from "./types";

// Supported languages configurations
const LANGUAGES: LanguageDef[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    welcomeVoice: "Welcome to FarmConnect A.I. Your voice-guided farming companion.",
    welcomeText: "Please select your language to continue."
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    welcomeVoice: "फार्मकनेक्ट एआई में आपका स्वागत है। आपकी आवाज़-निर्देशित खेती सहायक।",
    welcomeText: "कृपया आगे बढ़ने के लिए अपनी भाषा चुनें।"
  },
  {
    code: "pb",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    welcomeVoice: "ਫਾਰਮ-ਕਨੈਕਟ ਏ.ਆਈ. ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਤੁਹਾਡਾ ਆਵਾਜ਼-ਅਧਾਰਿਤ ਖੇਤੀ ਸਾਥੀ।",
    welcomeText: "ਕਿਰਪਾ ਕਰਕੇ ਅੱਗੇ ਵਧਣ ਲਈ ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ।"
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    welcomeVoice: "ফার্মকানেক্ট এআই-তে আপনাকে স্বাগতম। আপনার ভয়েস-নির্দেশিত চাষাবাদ সহকারী।",
    welcomeText: "দয়া করে চালিয়ে যেতে আপনার ভাষা নির্বাচন করুন।"
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    welcomeVoice: "பார்ம்கனெக்ட் ஏஐ-க்கு உங்களை வரவேற்கிறோம். உங்களின் குரல்வழி விவசாயத் தோழன்.",
    welcomeText: "தொடர உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்."
  }
];

// App-wide translations helper
const TRANSLATIONS: Record<LanguageCode, Record<string, any>> = {
  en: {
    appName: "FarmConnect AI",
    back: "Back",
    save: "Save",
    continue: "Continue",
    chooseLang: "Choose Language / भाषा चुनें",
    skipLogin: "Skip & Use Guest Mode",
    phonePlaceholder: "Enter 10-digit Phone Number",
    phoneLabel: "Mobile Number",
    otpLabel: "Enter 4-Digit OTP",
    otpPlaceholder: "Type OTP sent to your phone",
    sendOtp: "Send OTP Verification",
    verifyOtp: "Verify & Enter App",
    otpSentMsg: "An OTP has been sent to +91 ",
    welcomeBack: "Welcome back, Farmer!",
    listening: "Listening...",
    askAnything: "Speak or ask anything about crops...",
    voiceGuidance: "Voice Guidance is ON. Tap any text to hear it aloud.",
    mandiPrices: "Mandi Crop Prices",
    searchCrop: "Search crops (e.g. Wheat, Potato)...",
    mandiLocation: "Market / Mandi",
    increase: "Increased",
    decrease: "Decreased",
    stable: "Stable",
    sellCrops: "Sell Your Crops",
    step: "Step",
    selectCrop: "Select Your Crop",
    enterQuantity: "How much quantity do you have?",
    enterPrice: "What price do you want to sell at?",
    quantity: "Quantity",
    pricePerQuintal: "Price per Quintal (Rs.)",
    postButton: "Post Crop for Buyers",
    postSuccess: "Crop Posted Successfully!",
    postSuccessDesc: "Buyers will contact you in the Buyer Chat tab shortly.",
    buyerChat: "Buyer Chat",
    safeDealingTitle: "🤝 Safe Dealing Shield",
    verifiedBuyer: "Verified Buyer",
    scamWarningHeader: "⚠️ SAFETY WARNING",
    cropDoctor: "AI Crop Doctor",
    takePhoto: "Take Crop Leaf Photo",
    diagnoseButton: "Analyze & Diagnose Disease",
    diseaseLabel: "Disease Name:",
    explanationLabel: "Simple Explanation:",
    medicineLabel: "Suggested Medicine / Treatment:",
    stepsLabel: "Treatment Steps:",
    samplePhotos: "Or use a sample leaf photo to test the AI:",
    voiceAssistant: "Kisaan Dost Voice",
    presetsTitle: "Tap a common question to ask:",
    alertsTitle: "Important Farming Alerts",
    mandiAverage: "Mandi Avg: ",
    recentListings: "Your Listings & Near Offers",
    newNotification: "New message or alert received!"
  },
  hi: {
    appName: "फार्मकनेक्ट एआई",
    back: "पीछे जाएं",
    save: "सहेजें",
    continue: "आगे बढ़ें",
    chooseLang: "अपनी भाषा चुनें",
    skipLogin: "बिना लॉग-इन आगे बढ़ें",
    phonePlaceholder: "10- अंकों का मोबाइल नंबर डालें",
    phoneLabel: "मोबाइल नंबर",
    otpLabel: "4-अंकों का ओटीपी (OTP) दर्ज करें",
    otpPlaceholder: "मोबाइल पर भेजा गया ओटीपी नंबर भरें",
    sendOtp: "ओटीपी भेजें",
    verifyOtp: "ओटीपी सत्यापित करें",
    otpSentMsg: "एक ओटीपी भेजा गया है: +91 ",
    welcomeBack: "आपका स्वागत है, किसान भाई!",
    listening: "सुन रहा हूँ...",
    askAnything: "फसलों या खेती के बारे में कुछ भी बोलें...",
    voiceGuidance: "आवाज़ मार्गदर्शन चालू है। सुनने के लिए किसी भी शब्द पर टैप करें।",
    mandiPrices: "आज के फसल दाम",
    searchCrop: "फसल खोजें (जैसे: गेहूं, आलू, प्याज)...",
    mandiLocation: "मंडी स्थान",
    increase: "बढ़ा",
    decrease: "घटा",
    stable: "स्थिर",
    sellCrops: "अपनी फसल बेचें",
    step: "कदम",
    selectCrop: "अपनी फसल चुनें",
    enterQuantity: "आपके पास कितनी मात्रा है?",
    enterPrice: "आप किस कीमत पर बेचना चाहते हैं?",
    quantity: "मात्रा",
    pricePerQuintal: "कीमत प्रति क्विंटल (रु.)",
    postButton: "खरीदार को पोस्ट भेजें",
    postSuccess: "फसल सफलतापूर्वक पोस्ट की गई!",
    postSuccessDesc: "खरीदार जल्द ही आपसे 'खरीदार से बात' सेक्शन में संपर्क करेंगे।",
    buyerChat: "खरीदार से बातचीत",
    safeDealingTitle: "🤝 सुरक्षित व्यापार सुरक्षा",
    verifiedBuyer: "सत्यापित खरीदार",
    scamWarningHeader: "⚠️ सुरक्षा चेतावनी",
    cropDoctor: "फसल डॉक्टर एआई",
    takePhoto: "फसल के पत्ते का फोटो लें",
    diagnoseButton: "बीमारी की जांच करें",
    diseaseLabel: "बीमारी का नाम:",
    explanationLabel: "आसान भाषा में स्पष्टीकरण:",
    medicineLabel: "सुझाई गई दवा / इलाज:",
    stepsLabel: "इलाज के आसान चरण:",
    samplePhotos: "या जांच करने के लिए एक सैंपल फोटो चुनें:",
    voiceAssistant: "किसान दोस्त आवाज़",
    presetsTitle: "पूछने के लिए नीचे दिए गए सवाल पर टैप करें:",
    alertsTitle: "ज़रूरी खेती सूचनाएं",
    mandiAverage: "मंडी औसत: ",
    recentListings: "आपकी पोस्ट की गई फसलें",
    newNotification: "नई सूचना प्राप्त हुई!"
  },
  pb: {
    appName: "ਫਾਰਮਕਨੈਕਟ ਏ.ਆਈ.",
    back: "ਪਿੱਛੇ ਜਾਓ",
    save: "ਸੰਭਾਲੋ",
    continue: "ਅੱਗੇ ਵਧੋ",
    chooseLang: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    skipLogin: "ਬਿਨਾਂ ਲੌਗ-ਇਨ ਅੱਗੇ ਜਾਓ",
    phonePlaceholder: "10-ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਭਰੋ",
    phoneLabel: "ਮੋਬਾਈਲ ਨੰਬਰ",
    otpLabel: "4-ਅੰਕਾਂ ਦਾ ਓ.ਟੀ.ਪੀ. ਦਰਜ ਕਰੋ",
    otpPlaceholder: "ਮੋਬਾਈਲ 'ਤੇ ਭੇਜਿਆ ਓ.ਟੀ.ਪੀ. ਭਰੋ",
    sendOtp: "ਓ.ਟੀ.ਪੀ. ਭੇਜੋ",
    verifyOtp: "ਓ.ਟੀ.ਪੀ. ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    otpSentMsg: "ਇੱਕ ਓ.ਟੀ.ਪੀ. ਭੇਜਿਆ ਗਿਆ ਹੈ: +91 ",
    welcomeBack: "ਜੀ ਆਇਆਂ ਨੂੰ, ਕਿਸਾਨ ਵੀਰੋ!",
    listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ...",
    askAnything: "ਫਸਲਾਂ ਜਾਂ ਖੇਤੀ ਬਾਰੇ ਕੁਝ ਵੀ ਬੋਲੋ...",
    voiceGuidance: "ਆਵਾਜ਼ ਮਾਰਗਦਰਸ਼ਨ ਚਾਲੂ ਹੈ। ਸੁਣਨ ਲਈ ਕਿਸੇ ਵੀ ਲਿਖਤ 'ਤੇ ਟੈਪ ਕਰੋ।",
    mandiPrices: "ਅੱਜ ਦੇ ਫਸਲ ਭਾਅ",
    searchCrop: "ਫਸਲ ਲੱਭੋ (ਜਿਵੇਂ: ਕਣਕ, ਆਲੂ, ਪਿਆਜ਼)...",
    mandiLocation: "ਮੰਡੀ ਦਾ ਸਥਾਨ",
    increase: "ਵਧਿਆ",
    decrease: "ਘਟਿਆ",
    stable: "ਸਥਿਰ",
    sellCrops: "ਆਪਣੀ ਫਸਲ ਵੇਚੋ",
    step: "ਕਦਮ",
    selectCrop: "ਆਪਣੀ ਫਸਲ ਚੁਣੋ",
    enterQuantity: "ਤੁਹਾਡੇ ਕੋਲ ਕਿੰਨੀ ਮਾਤਰਾ ਹੈ?",
    enterPrice: "ਤੁਸੀਂ ਕਿਸ ਭਾਅ ਵੇਚਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    quantity: "ਮਾਤਰਾ",
    pricePerQuintal: "ਭਾਅ ਪ੍ਰਤੀ ਕੁਇੰਟਲ (ਰੁ.)",
    postButton: "ਖਰੀਦਦਾਰ ਨੂੰ ਪੋਸਟ ਭੇਜੋ",
    postSuccess: "ਫਸਲ ਦੀ ਪੋਸਟ ਸਫਲਤਾਪੂਰਵਕ ਪਾਈ ਗਈ!",
    postSuccessDesc: "ਖਰੀਦਦਾਰ ਜਲਦੀ ਹੀ 'ਖਰੀਦਦਾਰ ਚੈਟ' ਵਿੱਚ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰਨਗੇ।",
    buyerChat: "ਖਰੀਦਦਾਰ ਨਾਲ ਗੱਲਬਾਤ",
    safeDealingTitle: "🤝 ਸੁਰੱਖਿਅਤ ਵਪਾਰ ਸ਼ੀਲਡ",
    verifiedBuyer: "ਪ੍ਰਮਾਣਿਤ ਖਰੀਦਦਾਰ",
    scamWarningHeader: "⚠️ ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀ",
    cropDoctor: "ਫਸਲ ਡਾਕਟਰ ਏ.ਆਈ.",
    takePhoto: "ਫਸਲ ਦੇ ਪੱਤੇ ਦੀ ਫੋਟੋ ਲਓ",
    diagnoseButton: "ਬੀਮਾਰੀ ਦੀ ਜਾਂਚ ਕਰੋ",
    diseaseLabel: "ਬੀਮਾਰੀ ਦਾ ਨਾਮ:",
    explanationLabel: "ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਵਿਆਖਿਆ:",
    medicineLabel: "ਸੁਝਾਈ ਗਈ ਦਵਾਈ / ਇਲਾਜ:",
    stepsLabel: "ਇਲਾਜ ਦੇ ਸੌਖੇ ਪੜਾਅ:",
    samplePhotos: "ਜਾਂ ਜਾਂਚ ਲਈ ਸੈਂਪਲ ਫੋਟੋ ਚੁਣੋ:",
    voiceAssistant: "ਕਿਸਾਨ ਦੋਸਤ ਆਵਾਜ਼",
    presetsTitle: "ਪੁੱਛਣ ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਸਵਾਲ 'ਤੇ ਟੈਪ ਕਰੋ:",
    alertsTitle: "ਜ਼ਰੂਰੀ ਖੇਤੀ ਚੇਤਾਵਨੀਆਂ",
    mandiAverage: "ਮੰਡੀ ਔਸਤ: ",
    recentListings: "ਤੁਹਾਡੀਆਂ ਪੋਸਟਾਂ",
    newNotification: "ਨਵੀਂ ਚੇਤਾਵਨੀ ਮਿਲੀ ਹੈ!"
  },
  bn: {
    appName: "ফার্মকানেক্ট এআই",
    back: "ফিরে যান",
    save: "সংরক্ষণ করুন",
    continue: "এগিয়ে যান",
    chooseLang: "ভাষা নির্বাচন করুন",
    skipLogin: "লগইন ছাড়াই প্রবেশ করুন",
    phonePlaceholder: "১০ অঙ্কের মোবাইল নম্বর লিখুন",
    phoneLabel: "মোবাইল নম্বর",
    otpLabel: "৪ অঙ্কের ওটিপি দিন",
    otpPlaceholder: "মোবাইলে পাঠানো ওটিপি দিন",
    sendOtp: "ওটিপি পাঠান",
    verifyOtp: "ওটিপি যাচাই করুন",
    otpSentMsg: "ওটিপি পাঠানো হয়েছে এই নম্বরে: +91 ",
    welcomeBack: "স্বাগতম চাষী ভাই!",
    listening: "শুনছি...",
    askAnything: "ফসল বা চাষ নিয়ে যেকোনো প্রশ্ন বলুন...",
    voiceGuidance: "ভয়েস গাইডেন্স চালু আছে। শুনতে যেকোনো লেখায় চাপুন।",
    mandiPrices: "আজকের ফসলের দাম",
    searchCrop: "ফসল খুঁজুন (যেমন: গম, আলু, পেঁয়াজ)...",
    mandiLocation: "বাজার / মান্ডি",
    increase: "বৃদ্ধি",
    decrease: "হ্রাস",
    stable: "স্থির",
    sellCrops: "আপনার ফসল বিক্রি করুন",
    step: "ধাপ",
    selectCrop: "আপনার ফসল বাছাই করুন",
    enterQuantity: "আপনার কাছে কত পরিমাণ ফসল আছে?",
    enterPrice: "আপনি কত দামে বিক্রি করতে চান?",
    quantity: "পরিমাণ",
    pricePerQuintal: "কুইন্টাল প্রতি মূল্য (টাকা)",
    postButton: "ক্রেতাদের জন্য পোস্ট করুন",
    postSuccess: "ফসল পোস্ট সফল হয়েছে!",
    postSuccessDesc: "ক্রেতারা শীঘ্রই 'ক্রেতা চ্যাট' ট্যাবে যোগাযোগ করবেন।",
    buyerChat: "ক্রেতাদের সাথে চ্যাট",
    safeDealingTitle: "🤝 নিরাপদ লেনদেন সুরক্ষা",
    verifiedBuyer: "যাচাইকৃত ক্রেতা",
    scamWarningHeader: "⚠️ নিরাপত্তা সতর্কতা",
    cropDoctor: "এআই ফসল ডাক্তার",
    takePhoto: "ফসলের পাতার ছবি তুলুন",
    diagnoseButton: "রোগ নির্ণয় করুন",
    diseaseLabel: "রোগের নাম:",
    explanationLabel: "সহজ ভাষায় বিবরণ:",
    medicineLabel: "প্রস্তাবিত ওষুধ বা কীটনাশক:",
    stepsLabel: "প্রতিকারের সহজ ধাপসমূহ:",
    samplePhotos: "অথবা পরীক্ষার জন্য একটি পাতার নমুনা বেছে নিন:",
    voiceAssistant: "কিষাণ দোস্ত ভয়েস",
    presetsTitle: "জিজ্ঞেস করতে নিচের যেকোনো প্রশ্নে চাপুন:",
    alertsTitle: "গুরুত্বপূর্ণ কৃষি সতর্কতা",
    mandiAverage: "মান্ডি গড়: ",
    recentListings: "আপনার বর্তমান পোস্টসমূহ",
    newNotification: "নতুন বিজ্ঞপ্তি এসেছে!"
  },
  ta: {
    appName: "பார்ம்கனெக்ட் ஏஐ",
    back: "பின்னால் செல்லவும்",
    save: "சேமிக்கவும்",
    continue: "தொடரவும்",
    chooseLang: "மொழியைத் தேர்ந்தெடுக்கவும்",
    skipLogin: "பதிவு செய்யாமல் உள்நுழையவும்",
    phonePlaceholder: "10-இலக்க மொபைல் எண்",
    phoneLabel: "கைபேசி எண்",
    otpLabel: "4-இலக்க OTP ஐ உள்ளிடவும்",
    otpPlaceholder: "மொபைலுக்கு வந்த OTP ஐ உள்ளிடவும்",
    sendOtp: "OTP அனுப்பவும்",
    verifyOtp: "OTP சரிபார்க்கவும்",
    otpSentMsg: "OTP அனுப்பப்பட்டது இந்த எண்ணிற்கு: +91 ",
    welcomeBack: "வருக, விவசாயத் தோழரே!",
    listening: "கேட்டுக் கொண்டிருக்கிறது...",
    askAnything: "பயிர்கள் பற்றி எதையும் பேசுங்கள் அல்லது கேளுங்கள்...",
    voiceGuidance: "குரல் வழிகாட்டுதல் இயக்கத்தில் உள்ளது. கேட்க உரையைத் தட்டவும்.",
    mandiPrices: "இன்றைய சந்தை விலை நிலவரம்",
    searchCrop: "பயிரை தேடுக (எ.கா. கோதுமை, உருளைக்கிழங்கு)...",
    mandiLocation: "சந்தை / மண்டி",
    increase: "அதிகரிப்பு",
    decrease: "குறைவு",
    stable: "மாற்றமில்லை",
    sellCrops: "பயிர்களை விற்கவும்",
    step: "படி",
    selectCrop: "உங்கள் பயிரைத் தேர்ந்தெடுக்கவும்",
    enterQuantity: "உங்களிடம் எவ்வளவு அளவு உள்ளது?",
    enterPrice: "என்ன விலைக்கு விற்க விரும்புகிறீர்கள்?",
    quantity: "அளவு",
    pricePerQuintal: "ஒரு குவிண்டால் விலை (ரூ.)",
    postButton: "விலையை பதிவேற்றவும்",
    postSuccess: "பயிர் விவரம் வெற்றிகரமாக பதிவேற்றப்பட்டது!",
    postSuccessDesc: "வாங்குபவர்கள் விரைவில் உங்களிடம் 'வாங்குபவர் அரட்டை' மூலம் தொடர்புகொள்வர்.",
    buyerChat: "வாங்குபவர் அரட்டை",
    safeDealingTitle: "🤝 பாதுகாப்பான வர்த்தக கேடயம்",
    verifiedBuyer: "சரிபார்க்கப்பட்ட வாங்குபவர்",
    scamWarningHeader: "⚠️ பாதுகாப்பு எச்சரிக்கை",
    cropDoctor: "பயிர் மருத்துவர் ஏஐ",
    takePhoto: "இலையை புகைப்படம் எடுக்கவும்",
    diagnoseButton: "நோயைக் கண்டறிந்து தீர்வு காண்க",
    diseaseLabel: "நோயின் பெயர்:",
    explanationLabel: "எளிய விளக்கம்:",
    medicineLabel: "பரிந்துரைக்கப்படும் மருந்து:",
    stepsLabel: "பராமரிப்பு முறைகள்:",
    samplePhotos: "அல்லது பரிசோதிக்க மாதிரி இலையைத் தேர்ந்தெடுக்கவும்:",
    voiceAssistant: "கிசான் தோஸ்த் வாய்ஸ்",
    presetsTitle: "கேட்க கீழே உள்ள கேள்வியைத் தட்டவும்:",
    alertsTitle: "முக்கிய விவசாய அறிவிப்புகள்",
    mandiAverage: "சந்தை சராசரி: ",
    recentListings: "உங்கள் விற்பனைப் பதிவுகள்",
    newNotification: "புதிய செய்தி வந்துள்ளது!"
  }
};

// Preset dynamic queries based on language for voice assistant
const PRESET_QUERIES: Record<LanguageCode, { text: string; spoken: string }[]> = {
  en: [
    { text: "My wheat leaves are turning yellow.", spoken: "My wheat leaves are turning yellow." },
    { text: "What is the best fertilizer for high paddy yield?", spoken: "What is the best fertilizer for high paddy yield?" },
    { text: "How can I prevent onion rot in heavy rain?", spoken: "How can I prevent onion rot in heavy rain?" },
    { text: "When is the best time to irrigate garlic crops?", spoken: "When is the best time to irrigate garlic crops?" }
  ],
  hi: [
    { text: "मेरे गेहूं के पत्ते पीले पड़ रहे हैं, क्या करूँ?", spoken: "मेरे गेहूं के पत्ते पीले पड़ रहे हैं, क्या करूँ?" },
    { text: "धान की अच्छी पैदावार के लिए कौन सी खाद बढ़िया है?", spoken: "धान की अच्छी पैदावार के लिए कौन सी खाद बढ़िया है?" },
    { text: "बारिश में प्याज की फसल को सड़ने से कैसे बचाएं?", spoken: "बारिश में प्याज की फसल को सड़ने से कैसे बचाएं?" },
    { text: "लहसुन की फसल में पानी कब देना चाहिए?", spoken: "लहसुन की फसल में पानी कब देना चाहिए?" }
  ],
  pb: [
    { text: "ਮੇਰੀ ਕਣਕ ਦੇ ਪੱਤੇ ਪੀਲੇ ਪੈ ਰਹੇ ਹਨ, ਕੀ ਕਰਾਂ?", spoken: "ਮੇਰੀ ਕਣਕ ਦੇ ਪੱਤੇ ਪੀਲੇ ਪੈ ਰਹੇ ਹਨ, ਕੀ ਕਰਾਂ?" },
    { text: "ਝੋਨੇ ਦੇ ਵਧੇਰੇ ਝਾੜ ਲਈ ਕਿਹੜੀ ਖਾਦ ਵਧੀਆ ਹੈ?", spoken: "ਝੋਨੇ ਦੇ ਵਧੇਰੇ ਝਾੜ ਲਈ ਕਿਹੜੀ ਖਾਦ ਵਧੀਆ ਹੈ?" },
    { text: "ਮੀਂਹ ਵਿੱਚ ਪਿਆਜ਼ ਦੀ ਫਸਲ ਨੂੰ ਗਲਣ ਤੋਂ ਕਿਵੇਂ ਬਚਾਈਏ?", spoken: "ਮੀਂਹ ਵਿੱਚ ਪਿਆਜ਼ ਦੀ ਫਸਲ ਨੂੰ ਗਲਣ ਤੋਂ ਕਿਵੇਂ ਬਚਾਈਏ?" },
    { text: "ਲਸਣ ਦੀ ਫਸਲ ਨੂੰ ਪਾਣੀ ਕਦੋਂ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?", spoken: "ਲਸਣ ਦੀ ਫਸਲ ਨੂੰ ਪਾਣੀ ਕਦੋਂ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?" }
  ],
  bn: [
    { text: "আমার গমের পাতা হলুদ হয়ে যাচ্ছে, কি করবো?", spoken: "আমার গমের পাতা হলুদ হয়ে যাচ্ছে, কি করবো?" },
    { text: "ধানের ফলন বাড়াতে কোন সার সবচেয়ে ভালো?", spoken: "ধানের ফলন বাড়াতে কোন সার সবচেয়ে ভালো?" },
    { text: "ভারী বৃষ্টিতে পেঁয়াজ পচন থেকে কিভাবে বাঁচাবো?", spoken: "ভারী বৃষ্টিতে পেঁয়াজ পচন থেকে কিভাবে বাঁচাবো?" },
    { text: "রসুন চাষে সেচ দেওয়ার সঠিক সময় কোনটি?", spoken: "রসুন চাষে সেচ দেওয়ার সঠিক সময় কোনটি?" }
  ],
  ta: [
    { text: "என் கோதுமை இலைகள் மஞ்சளாக மாறுகின்றன, என்ன செய்ய வேண்டும்?", spoken: "என் கோதுமை இலைகள் மஞ்சளாக மாறுகின்றன, என்ன செய்ய வேண்டும்?" },
    { text: "நெல் மகசூல் அதிகரிக்க என்ன உரம் பயன்படுத்த வேண்டும்?", spoken: "நெல் மகசூல் அதிகரிக்க என்ன உரம் பயன்படுத்த வேண்டும்?" },
    { text: "மழையில் வெங்காயம் அழுகுவதைத் தடுப்பது எப்படி?", spoken: "மழையில் வெங்காயம் அழுகுவதைத் தடுப்பது எப்படி?" },
    { text: "பூண்டு பயிருக்கு எப்போது நீர் பாய்ச்ச வேண்டும்?", spoken: "பூண்டு பயிருக்கு எப்போது நீர் பாய்ச்ச வேண்டும்?" }
  ]
};

// Initial alerts mock data
const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: "alert_1",
    type: "weather",
    title: "Heavy Rain Warning (भारी बारिश की चेतावनी)",
    message: "Thunderstorms and very heavy rainfall expected in Punjab, Haryana, and UP mandis over the next 48 hours. Cover open crop piles in mandis.",
    severity: "high",
    time: "2 hours ago"
  },
  {
    id: "alert_2",
    type: "disease",
    title: "Yellow Rust Alert (पीला रतुआ सतर्कता)",
    message: "Yellow rust symptoms spotted in some parts of Amritsar and Gurdaspur districts. Inspect wheat daily and spray Til/Propiconazole if found.",
    severity: "high",
    time: "5 hours ago"
  },
  {
    id: "alert_3",
    type: "price",
    title: "Garlic Record Price (लहसुन का ऐतिहासिक दाम)",
    message: "Garlic prices surge to record ₹12,500 per quintal in Indore APMC. Great time for growers to list and sell.",
    severity: "normal",
    time: "1 day ago"
  }
];

// Sample leaf disease pictures to let users easily test the Crop Doctor analyzer instantly
const SAMPLE_LEAF_IMAGES = [
  {
    name: "Wheat Rust Leaf (रतुआ पत्ता)",
    crop: "Wheat",
    status: "Yellow rust fungus visible",
    url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=250",
    base64Placeholder: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
  },
  {
    name: "Potato Late Blight Leaf (झुलसा पत्ता)",
    crop: "Potato",
    status: "Dark spots and mold symptoms",
    url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=250",
    base64Placeholder: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
  },
  {
    name: "Healthy Paddy Leaf (स्वस्थ धान का पत्ता)",
    crop: "Paddy Rice",
    status: "Lush green healthy crop",
    url: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=250",
    base64Placeholder: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
  }
];

export default function App() {
  // Navigation & User state
  const [currentScreen, setCurrentScreen] = useState<
    "splash" | "language" | "login" | "home" | "prices" | "sell" | "chat" | "doctor" | "voice_assistant" | "profile"
  >("splash");

  const [selectedLang, setSelectedLang] = useState<LanguageCode>("en");
  const [phoneNumber, setPhoneNumber] = useState("9876543210");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userName, setUserName] = useState("Rajesh Kumar");
  const [userState, setUserState] = useState("Amritsar, Punjab");

  // App data state
  const [cropPrices, setCropPrices] = useState<CropPrice[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sell crop wizard state
  const [sellStep, setSellStep] = useState(1);
  const [sellCropName, setSellCropName] = useState("");
  const [sellQuantity, setSellQuantity] = useState("40");
  const [sellUnit, setSellUnit] = useState("Quintal");
  const [sellPrice, setSellPrice] = useState("2300");
  const [postingCrop, setPostingCrop] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);

  // Chat state
  const [activeChats, setActiveChats] = useState<BuyerChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<BuyerChat | null>(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);

  // Crop Doctor AI state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzingCrop, setAnalyzingCrop] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<{
    diseaseName: string;
    explanation: string;
    fertilizerOrMedicine: string;
    treatmentSteps: string[];
    audioText: string;
  } | null>(null);

  // Voice Assistant state
  const [voiceQuery, setVoiceQuery] = useState("");
  const [submittingVoiceQuery, setSubmittingVoiceQuery] = useState(false);
  const [voiceAssistantReply, setVoiceAssistantReply] = useState<{
    text: string;
    suggestion: string;
    audioText: string;
  } | null>(null);
  const [isListeningSimulated, setIsListeningSimulated] = useState(false);

  // Alerts
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(2);

  // Voice Guidance switch
  const [voiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState(true);

  // Reference for scrolling chat to bottom
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

  // Warm up speechSynthesis voices cache
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Initialize Speech Recognition based on selected language
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true; // Show live text as user speaks!
      
      let langTag = "en-IN";
      if (selectedLang === "hi") langTag = "hi-IN";
      else if (selectedLang === "pb") langTag = "pa-IN";
      else if (selectedLang === "bn") langTag = "bn-IN";
      else if (selectedLang === "ta") langTag = "ta-IN";
      rec.lang = langTag;
      
      rec.onstart = () => {
        setIsListeningSimulated(true);
        transcriptRef.current = "";
        setVoiceQuery("");
      };
      
      rec.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcriptRef.current = event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const currentText = transcriptRef.current || interimTranscript;
        setVoiceQuery(currentText);
      };
      
      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "aborted") {
          setIsListeningSimulated(false);
          if (event.error === "not-allowed") {
            speakText(selectedLang === "hi" ? "कृपया माइक्रोफोन की अनुमति दें।" : "Please grant microphone permissions.");
          } else if (event.error === "no-speech") {
            speakText(selectedLang === "hi" ? "मुझे कोई आवाज़ नहीं सुनाई दी।" : "I didn't hear any speech.");
          }
        }
      };
      
      rec.onend = () => {
        setIsListeningSimulated(false);
        const finalQuery = transcriptRef.current;
        if (finalQuery && finalQuery.trim()) {
          transcriptRef.current = "";
          handleVoiceQuerySubmit(finalQuery);
        }
      };
      
      recognitionRef.current = rec;
    }
  }, [selectedLang]);

  // ----------------------------------------
  // TTS (Text-to-Speech) System
  // ----------------------------------------
  const speakText = (text: string) => {
    if (!voiceGuidanceEnabled) return;
    try {
      // Cancel current speaking
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Determine voice lang matching selected code
      let langTag = "en-IN";
      if (selectedLang === "hi") langTag = "hi-IN";
      else if (selectedLang === "pb") langTag = "hi-IN"; // Hindi voice works best for Punjabi fallback
      else if (selectedLang === "bn") langTag = "bn-IN";
      else if (selectedLang === "ta") langTag = "ta-IN";
      
      utterance.lang = langTag;

      // Find the absolute most natural/neural/premium voice available in the browser
      const voices = window.speechSynthesis.getVoices();
      const matchingVoices = voices.filter(v => {
        const vLang = v.lang.toLowerCase().replace("_", "-");
        const targetPrefix = langTag.toLowerCase().substring(0, 2);
        return vLang.startsWith(targetPrefix);
      });

      // Sort voices to prioritize high-quality neural/premium/natural/google voices
      const sortedVoices = [...matchingVoices].sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        
        const isANeural = aName.includes("natural") || aName.includes("neural") || aName.includes("premium") || aName.includes("google") || aName.includes("siri") || aName.includes("microsoft");
        const isBNeural = bName.includes("natural") || bName.includes("neural") || bName.includes("premium") || bName.includes("google") || bName.includes("siri") || bName.includes("microsoft");
        
        if (isANeural && !isBNeural) return -1;
        if (!isANeural && isBNeural) return 1;
        return 0;
      });

      if (sortedVoices.length > 0) {
        utterance.voice = sortedVoices[0];
      }

      utterance.rate = 0.98; // OpenAI-like natural pace (clear and premium)
      utterance.pitch = 1.02; // Warm and friendly tone
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error or not supported:", e);
    }
  };

  // Speaks welcome message when language is changed
  const handleLanguageSelect = (lang: LanguageCode) => {
    setSelectedLang(lang);
    // Auto speak welcome in selected tongue
    const targetLang = LANGUAGES.find((l) => l.code === lang);
    if (targetLang) {
      // Wait briefly so render completes
      setTimeout(() => {
        speakText(targetLang.welcomeVoice);
      }, 300);
    }
    setCurrentScreen("login");
  };

  // ----------------------------------------
  // FETCH DATA ON LOAD
  // ----------------------------------------
  useEffect(() => {
    fetchPrices();
    fetchChats();
  }, []);

  const fetchPrices = async () => {
    setLoadingPrices(true);
    try {
      const res = await fetch("/api/prices");
      if (res.ok) {
        const data = await res.json();
        setCropPrices(data);
      }
    } catch (err) {
      console.error("Error loading prices:", err);
    } finally {
      setLoadingPrices(false);
    }
  };

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setActiveChats(data);
      }
    } catch (err) {
      console.error("Error loading chats:", err);
    } finally {
      setLoadingChats(false);
    }
  };

  // Scroll chat bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat?.messages?.length]);

  // Translate shorthand helper
  const t = (key: string) => {
    const langDict = TRANSLATIONS[selectedLang] || TRANSLATIONS["en"];
    return langDict[key] || TRANSLATIONS["en"][key] || key;
  };

  // Handle simulated login
  const handleSendOtp = () => {
    if (phoneNumber.length < 10) {
      speakText(selectedLang === "hi" ? "कृपया सही मोबाइल नंबर डालें।" : "Please enter a correct phone number.");
      alert(selectedLang === "hi" ? "कृपया सही मोबाइल नंबर डालें।" : "Please enter a correct phone number.");
      return;
    }
    setIsOtpSent(true);
    setOtpCode("1234"); // Pre-populate for ultimate simplicity
    speakText(selectedLang === "hi" ? "ओटीपी भेज दिया गया है। ओटीपी नंबर एक दो तीन चार है।" : "OTP sent. The OTP is 1 2 3 4.");
  };

  const handleVerifyOtp = () => {
    if (otpCode !== "1234") {
      speakText(selectedLang === "hi" ? "ग़लत ओटीपी। सही ओटीपी दर्ज करें।" : "Wrong OTP. Please enter correct OTP.");
      alert(selectedLang === "hi" ? "ग़लत ओटीपी। सही ओटीपी दर्ज करें।" : "Wrong OTP. Please enter correct OTP.");
      return;
    }
    setIsGuest(false);
    setCurrentScreen("home");
    speakText(t("welcomeBack"));
  };

  const handleSkipLogin = () => {
    setIsGuest(true);
    setUserName(selectedLang === "en" ? "Guest Farmer" : "अतिथि किसान");
    setUserState(selectedLang === "en" ? "New Mandi, India" : "नई मंडी, भारत");
    setCurrentScreen("home");
    speakText(t("welcomeBack"));
  };

  // Post crop flow
  const handlePostCrop = async () => {
    setPostingCrop(true);
    try {
      const response = await fetch("/api/post-crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: sellCropName,
          quantity: sellQuantity,
          unit: sellUnit,
          price: sellPrice,
          farmerName: userName,
          phone: phoneNumber,
          location: userState
        })
      });
      if (response.ok) {
        const result = await response.json();
        setSellSuccess(true);
        speakText(t("postSuccess") + " " + t("postSuccessDesc"));
        // reload chats list to include the newly simulated buyer
        fetchChats();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPostingCrop(false);
    }
  };

  // Send Chat message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || typedMessage;
    if (!textToSend.trim() || !selectedChat) return;

    const originalChatId = selectedChat.id;

    // optimistic local update
    const updatedMessages = [
      ...selectedChat.messages,
      { sender: "farmer" as const, text: textToSend, time: "Just Now" }
    ];
    const updatedChat = { ...selectedChat, messages: updatedMessages };
    setSelectedChat(updatedChat);
    setActiveChats(prev => prev.map(c => c.id === originalChatId ? updatedChat : c));
    setTypedMessage("");

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: originalChatId,
          text: textToSend,
          sender: "farmer"
        })
      });

      if (response.ok) {
        const result = await response.json();
        // After 2.2 seconds, reload to pull the automatic simulated response or refresh
        setTimeout(() => {
          fetchChats().then(() => {
            // update currently selected chat details if we are still viewing it
            setActiveChats(all => {
              const current = all.find(ch => ch.id === originalChatId);
              if (current && selectedChat?.id === originalChatId) {
                setSelectedChat(current);
              }
              return all;
            });
          });
        }, 2200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Crop Doctor upload / sample analyze
  const analyzeCropLeaf = async (imgBase64: string) => {
    setAnalyzingCrop(true);
    setDiagnosisResult(null);
    try {
      const response = await fetch("/api/crop-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imgBase64,
          mimeType: "image/jpeg",
          language: selectedLang
        })
      });
      if (response.ok) {
        const result = await response.json();
        setDiagnosisResult(result);
        speakText(result.audioText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingCrop(false);
    }
  };

  // Voice Assistant trigger
  const handleVoiceQuerySubmit = async (queryText?: string) => {
    const activeQuery = queryText || voiceQuery;
    if (!activeQuery.trim()) return;

    setSubmittingVoiceQuery(true);
    setVoiceAssistantReply(null);
    try {
      const response = await fetch("/api/voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: activeQuery,
          language: selectedLang
        })
      });

      if (response.ok) {
        const result = await response.json();
        setVoiceAssistantReply(result);
        speakText(result.audioText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingVoiceQuery(false);
      setVoiceQuery("");
    }
  };

  // Handle speech recognition or simulation if not supported
  const handleMicClick = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && recognitionRef.current) {
      if (isListeningSimulated) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
        setIsListeningSimulated(false);
      } else {
        setIsListeningSimulated(true);
        speakText(selectedLang === "hi" ? "मैं सुन रहा हूँ, कृपया बोलें।" : "Listening now, please speak.");
        // Short delay so TTS doesn't interfere with the mic input
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error("Error starting speech recognition:", e);
            setIsListeningSimulated(false);
          }
        }, 1200);
      }
    } else {
      // Fallback to simulation if SpeechRecognition is not supported in the current environment
      if (isListeningSimulated) {
        setIsListeningSimulated(false);
        return;
      }
      
      setIsListeningSimulated(true);
      speakText(selectedLang === "hi" ? "मैं सुन रहा हूँ, कृपया बोलें।" : "Listening now, please speak.");
      
      // Auto match preset after 3 seconds for smooth simulator experience
      const presets = PRESET_QUERIES[selectedLang] || PRESET_QUERIES["en"];
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
      
      setTimeout(() => {
        setIsListeningSimulated(false);
        setVoiceQuery(randomPreset.text);
        handleVoiceQuerySubmit(randomPreset.text);
        setCurrentScreen("voice_assistant");
      }, 3200);
    }
  };

  // Filter crops in mandi list
  const filteredPrices = cropPrices.filter((crop) => {
    const nameMatch =
      crop.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.nameHi.includes(searchQuery) ||
      crop.mandi.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch;
  });

  return (
    <div className="min-h-screen bg-[#F9FBF9] flex flex-col font-sans text-[#1B4332] antialiased">
      
      {/* ----------------------------------------
          TOP STATUS & HEADER
          ---------------------------------------- */}
      <header className="bg-white border-b-2 border-[#E8F5E9] p-4 md:p-6 flex justify-between items-center shrink-0 shadow-sm">
        <div 
          id="header-brand"
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => currentScreen !== "splash" && currentScreen !== "language" && setCurrentScreen("home")}
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#2D6A4F] rounded-full flex items-center justify-center text-white text-xl md:text-3xl font-bold shadow-lg">
            🌾
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#1B4332] tracking-tight">
              {t("appName")}
            </h1>
            <p className="text-[#52796F] text-xs md:text-sm font-semibold">
              {currentScreen === "splash" || currentScreen === "language" ? "Indian Farmer Companion" : `${userName} | ${userState}`}
            </p>
          </div>
        </div>

        {/* Accessibility Voice Guidance toggle + Settings/Profile panel */}
        <div id="header-actions" className="flex items-center gap-2 md:gap-4">
          <button
            id="toggle-voice"
            onClick={() => {
              const nextState = !voiceGuidanceEnabled;
              setVoiceGuidanceEnabled(nextState);
              if (nextState) {
                setTimeout(() => speakText(selectedLang === "hi" ? "आवाज़ सहायता चालू की गई।" : "Voice support turned on."), 200);
              } else {
                window.speechSynthesis.cancel();
              }
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl font-bold text-sm md:text-base border-2 transition-all ${
              voiceGuidanceEnabled
                ? "bg-[#E8F5E9] border-[#2D6A4F] text-[#2D6A4F]"
                : "bg-gray-100 border-gray-300 text-gray-500"
            }`}
            title="Read out text on tap"
          >
            {voiceGuidanceEnabled ? <Volume2 className="w-5 h-5 animate-bounce" /> : <VolumeX className="w-5 h-5" />}
            <span className="hidden md:inline">{voiceGuidanceEnabled ? "Voice ON" : "Voice OFF"}</span>
          </button>

          {currentScreen !== "splash" && currentScreen !== "language" && (
            <>
              <button
                id="header-lang-btn"
                onClick={() => {
                  speakText("Choose your language / भाषा बदलें");
                  setCurrentScreen("language");
                }}
                className="flex items-center gap-1 bg-[#E8F5E9] text-[#1B4332] hover:bg-[#D7E9D9] p-3 rounded-2xl font-bold border-2 border-[#B7E4C7] text-sm"
              >
                <Languages className="w-5 h-5" />
                <span className="hidden sm:inline">भाषा / Lang</span>
              </button>

              <button
                id="header-profile-btn"
                onClick={() => {
                  speakText(userName);
                  setCurrentScreen("profile");
                }}
                className="w-12 h-12 bg-[#2D6A4F] rounded-2xl flex items-center justify-center text-white text-xl shadow-md hover:bg-[#1B4332]"
              >
                <User className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* ----------------------------------------
          MAIN APP CONTENT BODY
          ---------------------------------------- */}
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full flex flex-col justify-center">

        {/* SCREEN 1: SPLASH SCREEN */}
        {currentScreen === "splash" && (
          <div id="screen-splash" className="text-center py-8 px-4 flex flex-col items-center justify-center gap-6">
            <div className="w-36 h-36 bg-gradient-to-tr from-[#2D6A4F] to-[#52B788] rounded-[36px] flex items-center justify-center text-7xl shadow-2xl animate-pulse">
              🌾
            </div>
            
            <div className="space-y-2 max-w-lg">
              <h1 className="text-5xl font-black text-[#1B4332] tracking-tight">
                FarmConnect AI
              </h1>
              <p className="text-2xl text-[#40916C] font-extrabold">
                किसान समृद्धि और सुरक्षा मंच
              </p>
              <p className="text-lg text-[#52796F] font-medium pt-2">
                Easy farming, direct crop selling, automated scam protection & visual crop health diagnosis.
              </p>
            </div>

            <div className="bg-emerald-50 border-2 border-[#B7E4C7] p-4 rounded-3xl max-w-md text-sm text-[#2D6A4F] font-bold">
              🔊 Designed with extra-large visual buttons and interactive voice guidance for simple smartphone users.
            </div>

            <button
              id="splash-start-btn"
              onClick={() => {
                speakText("Please choose your language to continue. कृपया अपनी भाषा चुनें।");
                setCurrentScreen("language");
              }}
              className="w-full max-w-sm py-6 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-2xl font-extrabold rounded-[30px] shadow-xl hover:shadow-2xl transition-all border-[6px] border-[#B7E4C7] flex items-center justify-center gap-3 active:scale-95"
            >
              <span>शुरू करें / Start</span>
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}

        {/* SCREEN 2: CHOOSE LANGUAGE */}
        {currentScreen === "language" && (
          <div id="screen-language" className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-5xl">🌐</span>
              <h2 className="text-3xl font-black text-[#1B4332]">{t("chooseLang")}</h2>
              <p className="text-lg text-[#52796F] font-medium">Select your primary language for voice and screens</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  id={`lang-btn-${lang.code}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`p-5 rounded-[24px] border-4 text-left flex justify-between items-center transition-all ${
                    selectedLang === lang.code
                      ? "bg-[#E8F5E9] border-[#2D6A4F] shadow-lg scale-102"
                      : "bg-white border-[#E8F5E9] hover:border-[#B7E4C7]"
                  }`}
                >
                  <div>
                    <p className="text-2xl font-black text-[#1B4332]">{lang.nativeName}</p>
                    <p className="text-sm text-[#52796F] font-bold">{lang.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedLang === lang.code && <Check className="w-8 h-8 text-[#2D6A4F] stroke-[3]" />}
                    <Volume2 
                      className="w-6 h-6 text-[#52796F] cursor-pointer hover:text-[#1B4332]" 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Speak welcome in this voice speculatively
                        const oldLang = selectedLang;
                        setSelectedLang(lang.code);
                        speakText(lang.welcomeVoice);
                        // restore shortly
                        setTimeout(() => setSelectedLang(oldLang), 2000);
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SCREEN 3: LOGIN / OTP */}
        {currentScreen === "login" && (
          <div id="screen-login" className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-5xl">📱</span>
              <h2 className="text-3xl font-black text-[#1B4332]" onClick={() => speakText(t("phoneLabel"))}>
                {t("phoneLabel")}
              </h2>
              <p className="text-[#52796F] font-bold text-lg">Secure & Passwordless OTP Login</p>
            </div>

            <div className="bg-white border-2 border-[#E8F5E9] p-6 rounded-[32px] shadow-md space-y-5">
              {!isOtpSent ? (
                <div className="space-y-4">
                  <label className="block text-xl font-bold text-[#1B4332]" htmlFor="phone-input">
                    {t("phoneLabel")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-[#52796F]">+91</span>
                    <input
                      id="phone-input"
                      type="tel"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder={t("phonePlaceholder")}
                      className="w-full pl-16 pr-4 py-5 bg-[#F9FBF9] text-2xl font-black rounded-2xl border-2 border-[#B7E4C7] focus:outline-none focus:border-[#2D6A4F] text-[#1B4332]"
                    />
                  </div>
                  <button
                    id="login-send-otp-btn"
                    onClick={handleSendOtp}
                    className="w-full py-5 bg-[#2D6A4F] text-white text-xl font-black rounded-2xl border-b-4 border-[#1B4332] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-6 h-6" />
                    <span>{t("sendOtp")}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-emerald-50 p-4 rounded-xl text-[#2D6A4F] font-bold text-sm">
                    {t("otpSentMsg")}{phoneNumber}
                  </div>
                  <label className="block text-xl font-bold text-[#1B4332]" htmlFor="otp-input">
                    {t("otpLabel")}
                  </label>
                  <input
                    id="otp-input"
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder={t("otpPlaceholder")}
                    className="w-full text-center tracking-widest text-4xl font-black py-4 bg-[#F9FBF9] rounded-2xl border-2 border-[#B7E4C7] text-[#1B4332]"
                  />
                  <div className="flex gap-2">
                    <button
                      id="login-back-btn"
                      onClick={() => setIsOtpSent(false)}
                      className="w-1/3 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl"
                    >
                      {t("back")}
                    </button>
                    <button
                      id="login-verify-otp-btn"
                      onClick={handleVerifyOtp}
                      className="w-2/3 py-4 bg-[#2D6A4F] text-white text-xl font-black rounded-2xl border-b-4 border-[#1B4332] shadow-md flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-6 h-6" />
                      <span>{t("verifyOtp")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                id="login-skip-btn"
                onClick={handleSkipLogin}
                className="text-lg font-black text-[#2D6A4F] underline hover:text-[#1B4332] p-2"
              >
                {t("skipLogin")}
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4: HOME SCREEN (THE FOUR PILLARS GRID) */}
        {currentScreen === "home" && (
          <div id="screen-home" className="space-y-6">
            
            {/* Dynamic Alert Banner if unread exists */}
            {alerts.length > 0 && unreadAlertsCount > 0 && (
              <div 
                id="home-alert-banner"
                className="bg-[#FFF4E5] border-l-8 border-[#FF9100] p-4 md:p-6 rounded-[28px] flex items-center gap-4 md:gap-6 shadow-md cursor-pointer hover:bg-[#FFEADA] transition-all"
                onClick={() => {
                  speakText(alerts[0].title + ". " + alerts[0].message);
                }}
              >
                <span className="text-4xl md:text-5xl animate-bounce">⚠️</span>
                <div className="flex-grow">
                  <h2 className="text-xl md:text-2xl font-black text-[#D84315] flex items-center gap-2">
                    {alerts[0].title}
                  </h2>
                  <p className="text-base md:text-lg text-[#BF360C] font-semibold line-clamp-2">
                    {alerts[0].message}
                  </p>
                </div>
                <button
                  id="home-dismiss-alert-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUnreadAlertsCount(0);
                    speakText("Alert dismissed.");
                  }}
                  className="bg-white px-4 py-2 rounded-xl border-2 border-[#FF9100] font-black text-sm text-[#D84315] hover:bg-orange-50 active:scale-95"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Main Menu Grid of 4 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              {/* Menu 1: Crop Prices */}
              <div
                id="menu-btn-prices"
                onClick={() => {
                  speakText(t("mandiPrices"));
                  setCurrentScreen("prices");
                }}
                className="bg-white border-4 border-[#B7E4C7] rounded-[40px] shadow-xl hover:shadow-2xl flex flex-col items-center justify-center text-center p-6 md:p-10 cursor-pointer active:scale-95 transition-all group"
              >
                <div className="text-7xl md:text-8xl mb-3 transform group-hover:scale-110 transition-transform">🌾</div>
                <h3 className="text-3xl md:text-4xl font-black mb-1 text-[#1B4332]">{t("mandiPrices")}</h3>
                <p className="text-xl md:text-2xl text-[#52796F] font-bold">
                  {selectedLang === "en" ? "Check Today's rates" : "फसल के आज के दाम"}
                </p>
              </div>

              {/* Menu 2: Sell Crops */}
              <div
                id="menu-btn-sell"
                onClick={() => {
                  speakText(t("sellCrops"));
                  setSellStep(1);
                  setSellSuccess(false);
                  setCurrentScreen("sell");
                }}
                className="bg-white border-4 border-[#B7E4C7] rounded-[40px] shadow-xl hover:shadow-2xl flex flex-col items-center justify-center text-center p-6 md:p-10 cursor-pointer active:scale-95 transition-all group"
              >
                <div className="text-7xl md:text-8xl mb-3 transform group-hover:scale-110 transition-transform">🛒</div>
                <h3 className="text-3xl md:text-4xl font-black mb-1 text-[#1B4332]">{t("sellCrops")}</h3>
                <p className="text-xl md:text-2xl text-[#52796F] font-bold">
                  {selectedLang === "en" ? "Post crops for Buyers" : "फसल सीधे बेचें"}
                </p>
              </div>

              {/* Menu 3: Buyer Chat */}
              <div
                id="menu-btn-chat"
                onClick={() => {
                  speakText(t("buyerChat"));
                  setCurrentScreen("chat");
                  if (activeChats.length > 0 && !selectedChat) {
                    setSelectedChat(activeChats[0]);
                  }
                }}
                className="bg-white border-4 border-[#B7E4C7] rounded-[40px] shadow-xl hover:shadow-2xl flex flex-col items-center justify-center text-center p-6 md:p-10 cursor-pointer active:scale-95 transition-all group relative"
              >
                {activeChats.some(c => c.isScamSuspected) && (
                  <span className="absolute top-4 right-4 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full border-2 border-red-300">
                    ⚠️ Safe Shield Active
                  </span>
                )}
                <div className="text-7xl md:text-8xl mb-3 transform group-hover:scale-110 transition-transform">💬</div>
                <h3 className="text-3xl md:text-4xl font-black mb-1 text-[#1B4332]">{t("buyerChat")}</h3>
                <p className="text-xl md:text-2xl text-[#52796F] font-bold">
                  {selectedLang === "en" ? "Chat safely with Buyers" : "खरीदार से बात करें"}
                </p>
              </div>

              {/* Menu 4: Crop Doctor */}
              <div
                id="menu-btn-doctor"
                onClick={() => {
                  speakText(t("cropDoctor"));
                  setCurrentScreen("doctor");
                }}
                className="bg-white border-4 border-[#40916C] rounded-[40px] shadow-xl hover:shadow-2xl flex flex-col items-center justify-center text-center p-6 md:p-10 cursor-pointer active:scale-95 border-dashed transition-all group"
              >
                <div className="text-7xl md:text-8xl mb-3 transform group-hover:scale-110 transition-transform">🤖</div>
                <h3 className="text-3xl md:text-4xl font-black mb-1 text-[#1B4332]">{t("cropDoctor")}</h3>
                <p className="text-xl md:text-2xl text-[#52796F] font-bold">
                  {selectedLang === "en" ? "AI Leaf Disease Check" : "बीमारी की एआई जांच"}
                </p>
              </div>
            </div>

            {/* Bottom Alert Banner with list of recent alerts */}
            <div className="bg-white border-2 border-[#E8F5E9] p-6 rounded-[32px] shadow-md space-y-4">
              <h4 className="text-2xl font-black text-[#1B4332] flex items-center gap-2">
                <Bell className="w-7 h-7 text-[#2D6A4F]" />
                <span>{t("alertsTitle")}</span>
              </h4>
              <div className="divide-y divide-[#E8F5E9]">
                {alerts.map((al) => (
                  <div 
                    key={al.id} 
                    className="py-3 cursor-pointer hover:bg-slate-50 transition-colors flex gap-3 items-start"
                    onClick={() => speakText(al.title + ". " + al.message)}
                  >
                    <span className="text-2xl">{al.type === "weather" ? "⛈️" : al.type === "disease" ? "🐛" : "📈"}</span>
                    <div>
                      <h5 className="font-bold text-[#1B4332] text-lg">{al.title}</h5>
                      <p className="text-sm text-[#52796F] font-medium">{al.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 5: CROP PRICES LIST */}
        {currentScreen === "prices" && (
          <div id="screen-prices" className="space-y-6">
            
            {/* Header section with back button */}
            <div className="flex items-center gap-3">
              <button
                id="prices-back-btn"
                onClick={() => setCurrentScreen("home")}
                className="bg-[#E8F5E9] p-4 rounded-2xl text-[#1B4332] font-black border-2 border-[#B7E4C7] active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-3xl font-black text-[#1B4332]">{t("mandiPrices")}</h2>
                <p className="text-[#52796F] font-bold">Real-time dynamic prices across India</p>
              </div>
            </div>

            {/* Easy-to-use search crops input bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 text-[#52796F]" />
              <input
                id="crop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchCrop")}
                className="w-full pl-14 pr-12 py-5 bg-white text-xl font-bold rounded-2xl border-2 border-[#B7E4C7] focus:outline-none focus:border-[#2D6A4F] text-[#1B4332] shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Mandi List Cards */}
            {loadingPrices ? (
              <div className="text-center py-12 space-y-2">
                <RefreshCw className="w-10 h-10 animate-spin text-[#2D6A4F] mx-auto" />
                <p className="font-bold">Loading official mandi database...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPrices.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl text-center border-2 border-dashed border-[#B7E4C7]">
                    <p className="text-xl font-bold text-gray-500">No crop found matching search query.</p>
                  </div>
                ) : (
                  filteredPrices.map((crop) => {
                    const priceText = `Rs. ${crop.currentPrice} per quintal in ${crop.mandi}`;
                    const cropLocalizedName = selectedLang === "hi" ? crop.nameHi : selectedLang === "pb" ? crop.namePb : selectedLang === "ta" ? crop.nameTa : selectedLang === "bn" ? crop.nameBn : crop.nameEn;
                    
                    return (
                      <div
                        key={crop.id}
                        id={`crop-card-${crop.id}`}
                        onClick={() => {
                          speakText(`${cropLocalizedName}. Current price is ${crop.currentPrice} Rupees per quintal in ${crop.mandi}. This is ${crop.percentage} trend.`);
                        }}
                        className="bg-white border-4 border-[#B7E4C7] hover:border-[#2D6A4F] rounded-[32px] p-6 shadow-md transition-all cursor-pointer hover:shadow-lg flex items-center justify-between"
                      >
                        <div className="space-y-2 flex-grow">
                          <div className="flex items-center gap-3">
                            <span className="text-5xl">
                              {crop.id === "wheat" ? "🌾" : crop.id === "paddy" ? "🌾" : crop.id === "onion" ? "🧅" : crop.id === "potato" ? "🥔" : crop.id === "tomato" ? "🍅" : crop.id === "garlic" ? "🧄" : "🌱"}
                            </span>
                            <div>
                              <h3 className="text-2xl font-black text-[#1B4332]">{cropLocalizedName}</h3>
                              <p className="text-sm font-bold text-[#52796F] flex items-center gap-1">
                                <span>📍 {crop.mandi}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-[#2D6A4F]">₹{crop.currentPrice}</span>
                            <span className="text-sm font-semibold text-gray-400">/ Quintal</span>
                          </div>
                        </div>

                        {/* Trend direction pill */}
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-1 px-4 py-2 rounded-full font-black text-lg ${
                            crop.trend === "up" 
                              ? "bg-emerald-100 text-emerald-800" 
                              : crop.trend === "down" 
                                ? "bg-red-100 text-red-800" 
                                : "bg-gray-100 text-gray-800"
                          }`}>
                            <span className="text-xl">{crop.trend === "up" ? "↑" : crop.trend === "down" ? "↓" : "•"}</span>
                            <span>{crop.percentage}</span>
                          </div>
                          <p className="text-xs text-[#52796F] mt-1 font-bold">
                            {crop.trend === "up" ? t("increase") : crop.trend === "down" ? t("decrease") : t("stable")}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* SCREEN 6: SELL CROPS STEP WIZARD */}
        {currentScreen === "sell" && (
          <div id="screen-sell" className="space-y-6">
            
            {/* Header section with back button */}
            <div className="flex items-center gap-3">
              <button
                id="sell-back-btn"
                onClick={() => {
                  if (sellStep > 1 && !sellSuccess) {
                    setSellStep(sellStep - 1);
                  } else {
                    setCurrentScreen("home");
                  }
                }}
                className="bg-[#E8F5E9] p-4 rounded-2xl text-[#1B4332] font-black border-2 border-[#B7E4C7] active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-3xl font-black text-[#1B4332]">{t("sellCrops")}</h2>
                <p className="text-[#52796F] font-bold">Post your crop offers in three simple clicks</p>
              </div>
            </div>

            {/* Post crop wizard content */}
            {sellSuccess ? (
              <div className="bg-white border-4 border-[#B7E4C7] p-8 rounded-[40px] text-center space-y-6 shadow-xl animate-fadeIn">
                <div className="w-24 h-24 bg-[#E8F5E9] text-[#2D6A4F] rounded-full flex items-center justify-center text-6xl mx-auto border-4 border-[#40916C]">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-[#1B4332]">{t("postSuccess")}</h3>
                  <p className="text-xl text-[#52796F] font-semibold">{t("postSuccessDesc")}</p>
                </div>

                <div className="bg-[#E8F5E9] p-5 rounded-3xl max-w-md mx-auto text-[#1B4332]">
                  <p className="font-extrabold text-lg">Posted Crop: {sellCropName}</p>
                  <p className="font-medium">Quantity: {sellQuantity} {sellUnit} | Rate: ₹{sellPrice} / Qtl</p>
                </div>

                <button
                  id="sell-post-ok-btn"
                  onClick={() => {
                    setCurrentScreen("home");
                    speakText("Back to home screen.");
                  }}
                  className="w-full max-w-xs py-4 bg-[#2D6A4F] text-white text-xl font-black rounded-2xl border-b-4 border-[#1B4332] active:scale-95 shadow-md"
                >
                  OK / होम स्क्रीन पर जाएं
                </button>
              </div>
            ) : (
              <div className="bg-white border-2 border-[#E8F5E9] p-6 md:p-8 rounded-[36px] shadow-lg space-y-6">
                
                {/* Step indicator bar */}
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <span className="text-lg font-black text-[#1B4332]">
                    {t("step")} {sellStep} of 3
                  </span>
                  <div className="flex gap-2">
                    <div className={`w-10 h-3 rounded-full ${sellStep >= 1 ? "bg-[#2D6A4F]" : "bg-gray-200"}`} />
                    <div className={`w-10 h-3 rounded-full ${sellStep >= 2 ? "bg-[#2D6A4F]" : "bg-gray-200"}`} />
                    <div className={`w-10 h-3 rounded-full ${sellStep >= 3 ? "bg-[#2D6A4F]" : "bg-gray-200"}`} />
                  </div>
                </div>

                {/* STEP 1: Select crop category */}
                {sellStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 
                      className="text-2xl font-black text-[#1B4332]"
                      onClick={() => speakText(t("selectCrop"))}
                    >
                      {t("selectCrop")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "Wheat (गेहूं)", icon: "🌾", key: "Wheat" },
                        { name: "Paddy Rice (धान)", icon: "🌾", key: "Paddy" },
                        { name: "Potato (आलू)", icon: "🥔", key: "Potato" },
                        { name: "Onion (प्याज)", icon: "🧅", key: "Onion" },
                        { name: "Mustard (सरसों)", icon: "🟡", key: "Mustard" },
                        { name: "Garlic (लहसुन)", icon: "🧄", key: "Garlic" }
                      ].map((c) => (
                        <button
                          key={c.key}
                          onClick={() => {
                            setSellCropName(c.key);
                            speakText(`Selected crop ${c.name}. Moving to quantity selection.`);
                            setSellStep(2);
                          }}
                          className={`p-6 rounded-[28px] border-4 text-center flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
                            sellCropName === c.key
                              ? "bg-[#E8F5E9] border-[#2D6A4F]"
                              : "bg-white border-gray-100 hover:border-[#B7E4C7]"
                          }`}
                        >
                          <span className="text-6xl">{c.icon}</span>
                          <span className="text-xl font-black text-[#1B4332]">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Enter Quantity */}
                {sellStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 
                      className="text-2xl font-black text-[#1B4332]"
                      onClick={() => speakText(t("enterQuantity"))}
                    >
                      {t("enterQuantity")}
                    </h3>

                    <div className="flex justify-center items-center gap-4 py-6">
                      <button
                        onClick={() => {
                          const val = Math.max(1, Number(sellQuantity) - 5);
                          setSellQuantity(val.toString());
                        }}
                        className="bg-[#E8F5E9] text-[#1B4332] border-2 border-[#B7E4C7] p-4 rounded-2xl text-2xl font-bold hover:bg-[#D7E9D9]"
                      >
                        <Minus className="w-8 h-8 stroke-[3]" />
                      </button>
                      <input
                        type="text"
                        value={sellQuantity}
                        onChange={(e) => setSellQuantity(e.target.value.replace(/\D/g, ""))}
                        className="w-32 text-center text-4xl font-black bg-[#F9FBF9] py-4 rounded-2xl border-2 border-[#2D6A4F] text-[#1B4332]"
                      />
                      <button
                        onClick={() => {
                          const val = Number(sellQuantity) + 5;
                          setSellQuantity(val.toString());
                        }}
                        className="bg-[#E8F5E9] text-[#1B4332] border-2 border-[#B7E4C7] p-4 rounded-2xl text-2xl font-bold hover:bg-[#D7E9D9]"
                      >
                        <Plus className="w-8 h-8 stroke-[3]" />
                      </button>
                    </div>

                    {/* Unit Toggle */}
                    <div className="flex justify-center gap-3">
                      {["Quintal", "Bags (50kg)", "Tons"].map((unit) => (
                        <button
                          key={unit}
                          onClick={() => {
                            setSellUnit(unit);
                            speakText(`Selected unit ${unit}`);
                          }}
                          className={`px-4 py-2 rounded-full font-bold text-sm ${
                            sellUnit === unit ? "bg-[#2D6A4F] text-white" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        speakText(`Selected quantity ${sellQuantity} ${sellUnit}. Moving to price selection.`);
                        setSellStep(3);
                      }}
                      className="w-full py-5 bg-[#2D6A4F] text-white text-xl font-black rounded-2xl border-b-4 border-[#1B4332] shadow-md mt-4"
                    >
                      {t("continue")}
                    </button>
                  </div>
                )}

                {/* STEP 3: Enter Target Price */}
                {sellStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 
                      className="text-2xl font-black text-[#1B4332]"
                      onClick={() => speakText(t("enterPrice"))}
                    >
                      {t("enterPrice")}
                    </h3>

                    <div className="flex justify-center items-center gap-4 py-6">
                      <button
                        onClick={() => {
                          const val = Math.max(100, Number(sellPrice) - 50);
                          setSellPrice(val.toString());
                        }}
                        className="bg-[#E8F5E9] text-[#1B4332] border-2 border-[#B7E4C7] p-4 rounded-2xl text-2xl font-bold hover:bg-[#D7E9D9]"
                      >
                        <Minus className="w-8 h-8 stroke-[3]" />
                      </button>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-[#52796F]">₹</span>
                        <input
                          type="text"
                          value={sellPrice}
                          onChange={(e) => setSellPrice(e.target.value.replace(/\D/g, ""))}
                          className="w-44 text-center pl-10 text-4xl font-black bg-[#F9FBF9] py-4 rounded-2xl border-2 border-[#2D6A4F] text-[#1B4332]"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const val = Number(sellPrice) + 50;
                          setSellPrice(val.toString());
                        }}
                        className="bg-[#E8F5E9] text-[#1B4332] border-2 border-[#B7E4C7] p-4 rounded-2xl text-2xl font-bold hover:bg-[#D7E9D9]"
                      >
                        <Plus className="w-8 h-8 stroke-[3]" />
                      </button>
                    </div>

                    <div className="bg-[#FFF4E5] p-4 rounded-2xl text-sm font-semibold text-center text-amber-800">
                      💡 Standard average price is roughly ₹2,100 to ₹2,400 for high quality wheat.
                    </div>

                    <button
                      id="sell-post-crop-btn"
                      onClick={handlePostCrop}
                      disabled={postingCrop}
                      className="w-full py-5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-2xl font-black rounded-[24px] border-b-[6px] border-[#1B4332] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all mt-4"
                    >
                      {postingCrop ? (
                        <>
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          <span>Posting Crop Offer...</span>
                        </>
                      ) : (
                        <>
                          <span>{t("postButton")}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SCREEN 7: BUYER CHAT (WITH AUTO SCAM SHIELD DETECT) */}
        {currentScreen === "chat" && (
          <div id="screen-chat" className="space-y-4">
            
            {/* Header section with back button */}
            <div className="flex items-center gap-3">
              <button
                id="chat-back-btn"
                onClick={() => {
                  setSelectedChat(null);
                  setCurrentScreen("home");
                }}
                className="bg-[#E8F5E9] p-4 rounded-2xl text-[#1B4332] font-black border-2 border-[#B7E4C7] active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-3xl font-black text-[#1B4332]">{t("buyerChat")}</h2>
                <p className="text-[#52796F] font-bold">Safe communications protected by automated fraud scan</p>
              </div>
            </div>

            {/* Split layout: List of buyers on left, Active message pane on right / full screen */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[550px]">
              
              {/* Left Column: Chats Lists */}
              <div className={`md:col-span-5 bg-white border-2 border-[#E8F5E9] rounded-3xl p-4 overflow-y-auto space-y-3 ${selectedChat ? "hidden md:block" : "block"}`}>
                <h3 className="text-lg font-black text-[#1B4332] pb-2 border-b border-[#E8F5E9]">
                  Active Buyers List
                </h3>
                {activeChats.map((ch) => (
                  <div
                    key={ch.id}
                    id={`chat-item-${ch.id}`}
                    onClick={() => {
                      setSelectedChat(ch);
                      speakText(`Viewing chat with ${ch.buyerName}.`);
                    }}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border-2 flex items-center gap-3 relative ${
                      selectedChat?.id === ch.id
                        ? "bg-[#E8F5E9] border-[#2D6A4F] shadow-sm"
                        : "bg-white border-gray-100 hover:border-[#B7E4C7]"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full ${ch.avatarColor} flex items-center justify-center text-white text-xl font-bold`}>
                      {ch.buyerName.charAt(0)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-1 justify-between">
                        <h4 className="font-bold text-[#1B4332] text-sm truncate">{ch.buyerName}</h4>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{ch.messages[ch.messages.length - 1]?.text}</p>
                    </div>

                    {ch.isScamSuspected && (
                      <span className="w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white absolute right-3 top-3 animate-pulse" title="Scam Suspected!" />
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column: Active Chat Panel */}
              <div className={`md:col-span-7 bg-white border-2 border-[#E8F5E9] rounded-3xl p-4 flex flex-col justify-between overflow-hidden h-full ${!selectedChat ? "hidden md:flex items-center justify-center text-center text-gray-400" : "flex"}`}>
                {selectedChat ? (
                  <>
                    {/* Header of chosen buyer */}
                    <div className="pb-3 border-b border-[#E8F5E9] flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3">
                        {/* Tablet/mobile back to list button */}
                        <button
                          onClick={() => setSelectedChat(null)}
                          className="md:hidden p-2 bg-[#E8F5E9] text-[#1B4332] rounded-xl font-bold mr-1"
                        >
                          List
                        </button>
                        <div className={`w-10 h-10 rounded-full ${selectedChat.avatarColor} flex items-center justify-center text-white text-lg font-bold`}>
                          {selectedChat.buyerName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[#1B4332] flex items-center gap-1">
                            <span>{selectedChat.buyerName}</span>
                            {selectedChat.verified && (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                Verified
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-[#52796F] font-bold">{selectedChat.buyerPhone}</p>
                        </div>
                      </div>
                      
                      {/* Safety shield check */}
                      <span className={`text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 ${
                        selectedChat.isScamSuspected ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {selectedChat.isScamSuspected ? "⚠️ Suspicious" : "✓ Secure connection"}
                      </span>
                    </div>

                    {/* Chat Area Scrollable */}
                    <div className="flex-grow overflow-y-auto py-4 space-y-3">
                      
                      {/* Scam Shield Warn Banner - Highly Visible */}
                      {selectedChat.isScamSuspected && (
                        <div className="bg-[#FFF2F2] border-2 border-red-300 p-4 rounded-2xl space-y-2 text-[#C53030] animate-fadeIn shadow-sm">
                          <h5 className="font-black text-base flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce" />
                            <span>{t("scamWarningHeader")}</span>
                          </h5>
                          <p className="text-sm font-semibold leading-relaxed">
                            {selectedChat.scamReason}
                          </p>
                          <div className="bg-white p-3 rounded-xl border border-red-200 text-xs text-red-800 font-bold">
                            ⚠️ सुरक्षित रहने के टिप्स: कभी भी अपनी बैंक जानकारी या मोबाइल स्क्रीन पर आए ओटीपी नंबर को किसी को न बताएं।
                          </div>
                          <button
                            onClick={() => speakText(selectedChat.scamReason)}
                            className="bg-white px-3 py-1 rounded-lg border-2 border-red-300 text-xs font-bold text-red-600 flex items-center gap-1 mx-auto"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>सुनें / Speak Warning</span>
                          </button>
                        </div>
                      )}

                      {/* Message list */}
                      {selectedChat.messages.map((msg, i) => (
                        <div
                          key={i}
                          onClick={() => speakText(msg.text)}
                          className={`flex ${msg.sender === "farmer" ? "justify-end" : "justify-start"} cursor-pointer`}
                        >
                          <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-xs ${
                            msg.sender === "farmer"
                              ? "bg-[#2D6A4F] text-white rounded-br-none"
                              : "bg-[#F0F2F5] text-slate-800 rounded-bl-none border border-[#E4E6EB]"
                          }`}>
                            <p className="text-sm md:text-base font-semibold leading-snug">{msg.text}</p>
                            <span className="block text-[10px] text-right opacity-75 mt-1">{msg.time}</span>
                          </div>
                        </div>
                      ))}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Dynamic Safe Quick Replies buttons to prevent typing errors */}
                    <div className="py-2 flex gap-1.5 overflow-x-auto shrink-0 border-t border-gray-100">
                      {[
                        { text: "Call me please (कॉल करें)", reply: "Please call me directly to finalize the price and transport." },
                        { text: "Rate is final (रेट फाइनल है)", reply: "The rate is final as listed. I have very premium dried crops." },
                        { text: "Let's trade (सौदा पक्का)", reply: "Yes, I agree to sell. Let us finalize the transport tomorrow." },
                        { text: "No scans! (मैं क्यूआर कोड स्कैन नहीं करूँगा)", reply: "I will not scan any QR code or send advance fees. That looks like fraud." }
                      ].map((qr, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            speakText(qr.text);
                            handleSendMessage(qr.reply);
                          }}
                          className="bg-emerald-50 text-[#2D6A4F] border border-[#B7E4C7] hover:bg-[#D7E9D9] px-3 py-1.5 rounded-full text-xs font-black shrink-0 active:scale-95 transition-all"
                        >
                          {qr.text}
                        </button>
                      ))}
                    </div>

                    {/* Standard Message Input */}
                    <div className="pt-2 flex gap-2 shrink-0 border-t border-[#E8F5E9]">
                      <input
                        type="text"
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                        placeholder="अपनी बात लिखें / Type message..."
                        className="flex-grow px-4 py-3 bg-[#F9FBF9] rounded-2xl border-2 border-[#B7E4C7] text-base font-bold text-[#1B4332] focus:outline-none focus:border-[#2D6A4F]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendMessage();
                        }}
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        className="bg-[#2D6A4F] text-white p-4 rounded-2xl hover:bg-[#1B4332] active:scale-95 shadow-md"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto" />
                    <p className="text-lg font-bold text-gray-400">Please select a buyer chat from the left side list</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* SCREEN 8: CROP DOCTOR (AI LEAF DIAGNOSIS) */}
        {currentScreen === "doctor" && (
          <div id="screen-doctor" className="space-y-6">
            
            {/* Header section with back button */}
            <div className="flex items-center gap-3">
              <button
                id="doctor-back-btn"
                onClick={() => {
                  setDiagnosisResult(null);
                  setCurrentScreen("home");
                }}
                className="bg-[#E8F5E9] p-4 rounded-2xl text-[#1B4332] font-black border-2 border-[#B7E4C7] active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-3xl font-black text-[#1B4332]">{t("cropDoctor")}</h2>
                <p className="text-[#52796F] font-bold">Snap diseased leaf or use a demo sample leaf photo to diagnose instantly</p>
              </div>
            </div>

            {/* Main Crop Doctor visual container */}
            <div className="bg-white border-2 border-[#E8F5E9] p-6 rounded-[36px] shadow-lg space-y-6">
              
              {!diagnosisResult ? (
                <div className="space-y-6 text-center">
                  
                  {/* Photo select button area */}
                  <div className="border-4 border-dashed border-[#B7E4C7] rounded-[32px] p-8 bg-[#F9FBF9] flex flex-col items-center gap-4">
                    <Camera className="w-20 h-20 text-[#2D6A4F] animate-pulse" />
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-[#1B4332]">Take Leaf Picture</h3>
                      <p className="text-sm font-semibold text-[#52796F]">Support high definition crop health diagnosis</p>
                    </div>

                    <input
                      type="file"
                      id="crop-leaf-file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              const base64Str = event.target.result as string;
                              setUploadedImage(base64Str);
                              speakText("Leaf photo selected. Click diagnose to analyze.");
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    <label
                      htmlFor="crop-leaf-file"
                      className="cursor-pointer bg-[#2D6A4F] text-white px-8 py-4 rounded-2xl text-lg font-black border-b-4 border-[#1B4332] shadow-md hover:bg-[#1B4332] inline-block active:scale-95"
                    >
                      {t("takePhoto")}
                    </label>

                    {uploadedImage && (
                      <div className="mt-4 p-2 bg-emerald-50 rounded-xl inline-flex items-center gap-2">
                        <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-bold text-emerald-800">Your Photo is Ready for check!</span>
                      </div>
                    )}
                  </div>

                  {/* Preloaded Sample leaf pictures for immediate offline check */}
                  <div className="space-y-3 text-left">
                    <h4 className="text-lg font-black text-[#1B4332]">{t("samplePhotos")}</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {SAMPLE_LEAF_IMAGES.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setUploadedImage(img.url);
                            speakText(`Selected sample leaf of ${img.crop}. Now checking crop.`);
                            analyzeCropLeaf(img.url);
                          }}
                          className={`cursor-pointer border-2 p-2 rounded-2xl bg-white text-center hover:shadow-md transition-all ${
                            uploadedImage === img.url ? "border-[#2D6A4F] bg-[#E8F5E9]" : "border-gray-100"
                          }`}
                        >
                          <img src={img.url} alt={img.name} className="w-full h-24 object-cover rounded-xl mb-1.5" />
                          <p className="text-xs font-black text-[#1B4332] truncate">{img.name}</p>
                          <p className="text-[10px] text-[#52796F] truncate">{img.crop}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {uploadedImage && (
                    <button
                      id="doctor-diagnose-btn"
                      onClick={() => analyzeCropLeaf(uploadedImage)}
                      disabled={analyzingCrop}
                      className="w-full py-5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xl font-black rounded-2xl shadow-md border-b-4 border-[#1B4332] flex items-center justify-center gap-2"
                    >
                      {analyzingCrop ? (
                        <>
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          <span>AI Doctor is diagnosing leaf...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 text-yellow-300" />
                          <span>{t("diagnoseButton")}</span>
                        </>
                      )}
                    </button>
                  )}

                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Results Pane */}
                  <div className="bg-[#E8F5E9] border-l-8 border-[#2D6A4F] p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs uppercase tracking-wider font-bold text-[#52796F]">Diagnosis Result</p>
                        <h3 className="text-2xl font-black text-[#1B4332] flex items-center gap-2">
                          <span>{diagnosisResult.diseaseName}</span>
                        </h3>
                      </div>
                      <button
                        onClick={() => speakText(diagnosisResult.audioText)}
                        className="bg-white p-3 rounded-full shadow-md text-[#2D6A4F] border border-[#B7E4C7] active:scale-95"
                        title="Listen to diagnosis"
                      >
                        <Volume2 className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <p className="text-base font-semibold leading-relaxed text-[#1B4332]">
                      <span className="font-extrabold">{t("explanationLabel")} </span>
                      {diagnosisResult.explanation}
                    </p>
                  </div>

                  {/* Fertilizer Spray / medicine instructions */}
                  <div className="bg-[#FFF9F2] p-5 rounded-2xl border-l-8 border-amber-500 space-y-2 text-[#854D0E]">
                    <h4 className="text-lg font-black flex items-center gap-2">
                      💊 {t("medicineLabel")}
                    </h4>
                    <p className="text-xl font-extrabold text-[#78350F]">{diagnosisResult.fertilizerOrMedicine}</p>
                  </div>

                  {/* Step treatment check list */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-black text-[#1B4332]">{t("stepsLabel")}</h4>
                    <div className="space-y-2">
                      {diagnosisResult.treatmentSteps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="w-6 h-6 bg-[#2D6A4F] text-white font-black rounded-full flex items-center justify-center shrink-0 text-xs mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-sm font-bold text-slate-700 leading-normal">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reset back button to snap another */}
                  <button
                    id="doctor-reset-btn"
                    onClick={() => {
                      setDiagnosisResult(null);
                      setUploadedImage(null);
                      speakText("Ready for another leaf diagnose.");
                    }}
                    className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg font-black rounded-2xl border-b-2 border-gray-300"
                  >
                    Check Another Leaf / दूसरी पत्ती की जांच करें
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* SCREEN 9: VOICE ASSISTANT DETAILED PANEL */}
        {currentScreen === "voice_assistant" && (
          <div id="screen-voice" className="space-y-6">
            
            {/* Header with back */}
            <div className="flex items-center gap-3">
              <button
                id="voice-back-btn"
                onClick={() => {
                  setVoiceAssistantReply(null);
                  setCurrentScreen("home");
                }}
                className="bg-[#E8F5E9] p-4 rounded-2xl text-[#1B4332] font-black border-2 border-[#B7E4C7] active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-3xl font-black text-[#1B4332]">{t("voiceAssistant")}</h2>
                <p className="text-[#52796F] font-bold">Ask anything in simple local languages</p>
              </div>
            </div>

            {/* Main Interactive Mic with wave */}
            <div className="bg-white border-2 border-[#E8F5E9] p-6 md:p-8 rounded-[36px] shadow-lg space-y-6 text-center">
              
              {/* Mic Area */}
              <div className="flex flex-col items-center justify-center py-6 gap-3">
                <button
                  id="voice-mic-trigger"
                  onClick={handleMicClick}
                  className={`w-32 h-32 rounded-full border-[10px] shadow-2xl flex items-center justify-center transition-all ${
                    isListeningSimulated
                      ? "bg-red-500 border-red-200 scale-105"
                      : "bg-[#2D6A4F] border-[#B7E4C7] hover:scale-102"
                  }`}
                >
                  <span className="text-7xl">🎤</span>
                </button>

                <div>
                  <p className="text-2xl font-black text-[#1B4332]">
                    {isListeningSimulated ? t("listening") : "Tap Microphone to Speak"}
                  </p>
                  <p className="text-sm font-semibold text-[#52796F]">
                    {t("askAnything")}
                  </p>
                </div>

                {isListeningSimulated && (
                  <div className="flex justify-center gap-1.5 py-2">
                    <span className="w-3 h-8 bg-red-500 rounded-full animate-bounce delay-75" />
                    <span className="w-3 h-12 bg-red-500 rounded-full animate-bounce delay-150" />
                    <span className="w-3 h-6 bg-red-500 rounded-full animate-bounce delay-200" />
                    <span className="w-3 h-10 bg-red-500 rounded-full animate-bounce delay-300" />
                  </div>
                )}
              </div>

              {/* Dynamic Input text box to check queries */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voiceQuery}
                    onChange={(e) => setVoiceQuery(e.target.value)}
                    placeholder="या लिखकर पूछें / Or type your question here..."
                    className="flex-grow px-4 py-4 bg-[#F9FBF9] rounded-2xl border-2 border-[#B7E4C7] text-lg font-bold text-[#1B4332] focus:outline-none focus:border-[#2D6A4F]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVoiceQuerySubmit();
                    }}
                  />
                  <button
                    onClick={() => handleVoiceQuerySubmit()}
                    disabled={submittingVoiceQuery}
                    className="bg-[#2D6A4F] text-white px-6 rounded-2xl hover:bg-[#1B4332] font-black"
                  >
                    Ask
                  </button>
                </div>
              </div>

              {/* Suggestions / Common preset questions cards */}
              <div className="text-left space-y-3">
                <h4 className="text-base font-black text-[#1B4332] flex items-center gap-1">
                  <Info className="w-4 h-4 text-[#2D6A4F]" />
                  <span>{t("presetsTitle")}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(PRESET_QUERIES[selectedLang] || PRESET_QUERIES["en"]).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setVoiceQuery(q.text);
                        speakText(q.spoken);
                        handleVoiceQuerySubmit(q.text);
                      }}
                      className="text-left p-3.5 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-800 transition-all flex items-start gap-2 active:scale-98"
                    >
                      <span className="text-emerald-700 font-extrabold shrink-0">?</span>
                      <span>{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI response panel */}
              {submittingVoiceQuery && (
                <div className="py-6 space-y-2 text-center">
                  <RefreshCw className="w-10 h-10 animate-spin text-[#2D6A4F] mx-auto" />
                  <p className="font-bold text-gray-500">Kisaan Dost AI is drafting your helpful tip...</p>
                </div>
              )}

              {voiceAssistantReply && (
                <div className="bg-[#E8F5E9] border-2 border-[#B7E4C7] p-5 rounded-3xl text-left space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-start">
                    <span className="text-xs uppercase tracking-wider font-extrabold text-[#52796F]">
                      Answer in {selectedLang.toUpperCase()}
                    </span>
                    <button
                      onClick={() => speakText(voiceAssistantReply.audioText)}
                      className="bg-white p-2.5 rounded-full shadow-sm text-[#2D6A4F]"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-lg font-black text-[#1B4332] leading-relaxed">
                    {voiceAssistantReply.text}
                  </p>
                  
                  <div className="bg-white px-4 py-2.5 rounded-xl border border-emerald-200 inline-block">
                    <p className="text-xs text-slate-500 font-bold">Actionable Next Step:</p>
                    <p className="text-sm font-black text-[#2D6A4F]">{voiceAssistantReply.suggestion}</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* SCREEN 10: SETTINGS / PROFILE DETAIL */}
        {currentScreen === "profile" && (
          <div id="screen-profile" className="space-y-6">
            
            <div className="flex items-center gap-3">
              <button
                id="profile-back-btn"
                onClick={() => setCurrentScreen("home")}
                className="bg-[#E8F5E9] p-4 rounded-2xl text-[#1B4332] font-black border-2 border-[#B7E4C7]"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-3xl font-black text-[#1B4332]">Profile & Settings</h2>
                <p className="text-[#52796F] font-bold">Manage your profile and language preferences</p>
              </div>
            </div>

            <div className="bg-white border-2 border-[#E8F5E9] p-6 rounded-[36px] shadow-lg space-y-6">
              
              {/* Profile card info */}
              <div className="flex items-center gap-4 p-4 bg-[#E8F5E9] rounded-2xl">
                <div className="w-16 h-16 bg-[#2D6A4F] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {userName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#1B4332]">{userName}</h3>
                  <p className="text-[#52796F] font-bold text-sm">State: {userState}</p>
                  <p className="text-xs text-gray-500">Phone: +91 {phoneNumber}</p>
                </div>
              </div>

              {/* Editable inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-black text-[#1B4332] mb-1">Farmer Name / किसान का नाम</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-xl border border-[#B7E4C7] font-bold text-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-[#1B4332] mb-1">Location / स्थान</label>
                  <input
                    type="text"
                    value={userState}
                    onChange={(e) => setUserState(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-xl border border-[#B7E4C7] font-bold text-[#1B4332]"
                  />
                </div>
              </div>

              {/* Save & Reset controls */}
              <div className="pt-4 flex flex-col gap-3">
                <button
                  id="profile-save-btn"
                  onClick={() => {
                    speakText("Profile details saved successfully.");
                    setCurrentScreen("home");
                  }}
                  className="w-full py-4 bg-[#2D6A4F] text-white text-lg font-black rounded-2xl border-b-4 border-[#1B4332] shadow-sm flex items-center justify-center gap-2"
                >
                  <Check className="w-6 h-6" />
                  <span>{t("save")}</span>
                </button>

                <button
                  id="profile-logout-btn"
                  onClick={() => {
                    speakText("Logging out.");
                    setIsOtpSent(false);
                    setPhoneNumber("9876543210");
                    setOtpCode("");
                    setCurrentScreen("splash");
                  }}
                  className="w-full py-4 bg-red-50 text-red-700 text-lg font-black rounded-2xl border border-red-200 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out / लॉग आउट</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ----------------------------------------
          BOTTOM VOICE CONTROL & CAPTION BAR
          ---------------------------------------- */}
      <footer className="mt-auto p-4 md:p-6 bg-white border-t-2 border-[#E8F5E9] flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col text-center sm:text-left">
          <p className="text-[#52796F] text-base md:text-lg italic font-semibold">
            {voiceGuidanceEnabled ? `"${t("voiceGuidance")}"` : "Voice guidance is muted. Tap Volume icon above to enable."}
          </p>
          <p className="text-[#2D6A4F] text-lg md:text-xl font-bold mt-0.5">
            {selectedLang === "hi" 
              ? "नमस्ते किसान भाई, क्या मैं आपकी मदद कर सकता हूँ?" 
              : selectedLang === "pb" 
                ? "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ, ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?" 
                : selectedLang === "bn"
                  ? "নমস্কার চাষী ভাই, আমি আপনাকে কিভাবে সাহায্য করতে পারি?"
                  : selectedLang === "ta"
                    ? "வணக்கம் விவசாயத் தோழரே, நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?"
                    : "Hello Farmer, how can Kisaan Dost AI assist you today?"}
          </p>
        </div>
        
        {/* Large microphone action button */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2 items-center">
            <div className={`w-3.5 h-3.5 rounded-full ${isListeningSimulated ? "bg-red-500 animate-ping" : "bg-[#40916C] animate-pulse"}`} />
            <span className="text-[#40916C] font-extrabold text-sm uppercase tracking-wider">
              {isListeningSimulated ? "Listening" : "Companion Active"}
            </span>
          </div>
          
          <button
            id="bottom-voice-assistant-mic"
            onClick={handleMicClick}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-[6px] shadow-2xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all ${
              isListeningSimulated ? "bg-red-500 border-red-200" : "bg-[#2D6A4F] border-[#B7E4C7]"
            }`}
            title="Press to speak"
          >
            <span className="text-4xl md:text-5xl">🎤</span>
          </button>
        </div>
      </footer>

      {/* Sleek Theme Ambient Fixed Indicator */}
      <div className="fixed left-0 top-[25%] h-64 w-1.5 bg-[#2D6A4F] rounded-r-full hidden md:block"></div>
    </div>
  );
}
