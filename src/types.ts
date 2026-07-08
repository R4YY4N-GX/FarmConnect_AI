export type LanguageCode = "en" | "hi" | "pb" | "ta" | "bn";

export interface LanguageDef {
  code: LanguageCode;
  name: string;
  nativeName: string;
  welcomeVoice: string;
  welcomeText: string;
}

export interface CropPrice {
  id: string;
  nameEn: string;
  nameHi: string;
  namePb: string;
  nameTa: string;
  nameBn: string;
  currentPrice: number;
  previousPrice: number;
  trend: "up" | "down" | "stable";
  percentage: string;
  mandi: string;
}

export interface CropPost {
  id: string;
  cropName: string;
  quantity: string;
  unit: string;
  price: string;
  farmerName: string;
  phone: string;
  location: string;
  date: string;
}

export interface ChatMessage {
  sender: "farmer" | "buyer";
  text: string;
  time: string;
}

export interface BuyerChat {
  id: string;
  buyerName: string;
  buyerPhone: string;
  avatarColor: string;
  verified: boolean;
  messages: ChatMessage[];
  isScamSuspected: boolean;
  scamReason: string;
}

export interface AlertNotification {
  id: string;
  type: "weather" | "price" | "disease" | "system";
  title: string;
  message: string;
  severity: "high" | "normal";
  time: string;
}
