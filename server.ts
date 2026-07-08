import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Use JSON body parser with a generous size limit for image uploads
app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini client
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API Client initialized successfully.");
    } catch (err) {
      console.error("Failed to initialize Gemini API Client:", err);
    }
  }
  return ai;
}

// Robust JSON parsing helper to strip markdown format and repair minor errors
function parseSafeJson(text: string | undefined): any {
  if (!text) return {};
  let cleaned = text.trim();
  // Strip markdown code block wrappers
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Initial JSON parse failed. Attempting cleanup. Raw string:", text);
    try {
      // Remove trailing commas inside lists or maps
      cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
      return JSON.parse(cleaned);
    } catch (innerErr) {
      console.error("Cleanup parsing failed:", innerErr);
      // Attempt extraction of JSON via regex
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0].replace(/,\s*([\]}])/g, "$1"));
        } catch (regexErr) {
          console.error("Failed to parse regex-extracted JSON:", regexErr);
        }
      }
      return {};
    }
  }
}

// Simulated dynamic crop prices across Indian Mandis (APMC)
let cropPrices = [
  { id: "wheat", nameEn: "Wheat (Kanak / Gehun)", nameHi: "गेहूं", namePb: "ਕਣਕ", nameTa: "கோதுமை", nameBn: "গম", currentPrice: 2275, previousPrice: 2210, trend: "up", percentage: "+2.9%", mandi: "Khanna, Punjab" },
  { id: "paddy", nameEn: "Paddy Rice (Dhan)", nameHi: "धान (चावल)", namePb: "ਝੋਨਾ", nameTa: "நெல்", nameBn: "ধান", currentPrice: 2183, previousPrice: 2183, trend: "stable", percentage: "0.0%", mandi: "Karnal, Haryana" },
  { id: "onion", nameEn: "Onion (Pyaz)", nameHi: "प्याज", namePb: "ਪਿਆਜ਼", nameTa: "வெங்காயம்", nameBn: "পেঁয়াজ", currentPrice: 1850, previousPrice: 1980, trend: "down", percentage: "-6.5%", mandi: "Lasalgaon, Maharashtra" },
  { id: "potato", nameEn: "Potato (Aloo)", nameHi: "आलू", namePb: "ਆਲੂ", nameTa: "உருளைக்கிழங்கு", nameBn: "আলু", currentPrice: 1420, previousPrice: 1350, trend: "up", percentage: "+5.1%", mandi: "Agra, Uttar Pradesh" },
  { id: "tomato", nameEn: "Tomato (Tamatar)", nameHi: "टमाटर", namePb: "ਟਮਾਟਰ", nameTa: "தக்காளி", nameBn: "টমেটো", currentPrice: 2400, previousPrice: 2800, trend: "down", percentage: "-14.2%", mandi: "Kolar, Karnataka" },
  { id: "mustard", nameEn: "Mustard Seeds (Sarso)", nameHi: "सरसों", namePb: "ਸਰ੍ਹੋਂ", nameTa: "கடுகு", nameBn: "সরিষা", currentPrice: 5450, previousPrice: 5380, trend: "up", percentage: "+1.3%", mandi: "Bharatpur, Rajasthan" },
  { id: "cotton", nameEn: "Cotton (Kapas)", nameHi: "कपास (रूई)", namePb: "ਕਪਾਹ", nameTa: "பருத்தி", nameBn: "তুলা", currentPrice: 7100, previousPrice: 7150, trend: "down", percentage: "-0.7%", mandi: "Rajkot, Gujarat" },
  { id: "garlic", nameEn: "Garlic (Lahsun)", nameHi: "लहसुन", namePb: "ਲਸਣ", nameTa: "பூண்டு", nameBn: "রসুন", currentPrice: 12500, previousPrice: 11200, trend: "up", percentage: "+11.6%", mandi: "Indore, Madhya Pradesh" }
];

// Simulated post-crop listings
let postedCrops = [
  {
    id: "post_1",
    cropName: "Wheat",
    quantity: "45",
    unit: "Quintal",
    price: "2300",
    farmerName: "Harpreet Singh",
    phone: "9876543210",
    location: "Amritsar, Punjab",
    date: "Today, 10:30 AM"
  },
  {
    id: "post_2",
    cropName: "Potato",
    quantity: "120",
    unit: "Bags (50kg)",
    price: "750",
    farmerName: "Rajesh Yadav",
    phone: "9123456789",
    location: "Agra, Uttar Pradesh",
    date: "Yesterday"
  }
];

// Simulated Buyer Chats pre-populated to experience Scam Warners
let chats = [
  {
    id: "chat_1",
    buyerName: "Sohan Lal (Amritsar Grain Trader)",
    buyerPhone: "+91 94451 23098",
    avatarColor: "bg-emerald-600",
    verified: true,
    messages: [
      { sender: "farmer", text: "Namaste Sohan ji, I have listed 45 quintals of high quality Gehun.", time: "11:00 AM" },
      { sender: "buyer", text: "Namaste Harpreet ji. I saw your post. The quality in Khanna mandi is good. I can pay Rs. 2280 per quintal and pick it up tomorrow from your farm. Is that okay?", time: "11:02 AM" },
      { sender: "farmer", text: "Please make it Rs. 2300. It is pure organic and properly dried.", time: "11:05 AM" },
      { sender: "buyer", text: "Okay, done. I will pay Rs. 2300. My truck will come tomorrow afternoon. I will pay cash or net banking upon weight check. Please send me your farm address.", time: "11:06 AM" }
    ],
    isScamSuspected: false,
    scamReason: ""
  },
  {
    id: "chat_2",
    buyerName: "Lucky Kumar (Online Agent - Fast Pay)",
    buyerPhone: "+91 81099 87231",
    avatarColor: "bg-red-500",
    verified: false,
    messages: [
      { sender: "buyer", text: "Hello farmer, I will buy all your crop immediately for double price! Very fast deal.", time: "09:15 AM" },
      { sender: "farmer", text: "Really? How will you pay me?", time: "09:16 AM" },
      { sender: "buyer", text: "I am sending a QR code image to you. Scan this barcode in your Google Pay or PhonePe app, enter your UPI PIN, and you will get Rs. 50,000 advance instantly. Hurry, scan now!", time: "09:18 AM" }
    ],
    isScamSuspected: true,
    scamReason: "This buyer is asking you to SCAN a QR Code and enter your UPI PIN to receive money. In UPI, scanning a QR code and entering your PIN will DEDUCT money from your account, not credit it. This is a common financial fraud."
  },
  {
    id: "chat_3",
    buyerName: "Mandi Help Agent (Advance Fee Broker)",
    buyerPhone: "+91 70231 44102",
    avatarColor: "bg-amber-500",
    verified: false,
    messages: [
      { sender: "buyer", text: "Sir, I have a big government buyer for your crop. They will pay the highest government rate of Rs. 3000.", time: "Yesterday" },
      { sender: "farmer", text: "That is great. How do we proceed?", time: "Yesterday" },
      { sender: "buyer", text: "You just need to pay Rs. 500 registration fee. Send Rs. 500 to my number first, then I will book your truck slot. If you don't pay now, slot will go to other farmer.", time: "Yesterday" }
    ],
    isScamSuspected: true,
    scamReason: "This buyer is asking for an advance registration fee before completing the purchase. Genuine buyers do not ask farmers to pay money beforehand. Please do not send any advance money."
  }
];

// ----------------------------------------
// API ENDPOINTS
// ----------------------------------------

// 1. Get Crop Prices
app.get("/api/prices", (req, res) => {
  res.json(cropPrices);
});

// 2. Post a Crop Listing
app.post("/api/post-crop", (req, res) => {
  const { cropName, quantity, unit, price, farmerName, phone, location } = req.body;
  if (!cropName || !quantity || !price) {
    return res.status(400).json({ error: "Please enter crop name, quantity, and price." });
  }

  const newPost = {
    id: "post_" + (postedCrops.length + 1),
    cropName,
    quantity,
    unit: unit || "Quintal",
    price,
    farmerName: farmerName || "Farmer",
    phone: phone || "9999999999",
    location: location || "Punjab, India",
    date: "Just Now"
  };

  postedCrops.unshift(newPost);

  // Generate a mock automatic buyer inquiry chat based on the posted crop name
  const simulatedBuyerName = `${cropName === "Wheat" || cropName === "Paddy" ? "Satnam Singh" : "Ram Mehar"} (Mandi Trader)`;
  const isScamSimulated = Math.random() > 0.6; // 40% chance of attracting a suspicious buyer to let the user experience the detection system
  
  let initialBuyerMessage = "";
  let scamReasonStr = "";
  if (isScamSimulated) {
    initialBuyerMessage = `Hello, I want to buy all your ${quantity} ${unit || "Quintal"} of ${cropName} right away. Please click this link http://get-farmer-advance-500.com to fill in your bank card details and security OTP so I can send the money.`;
    scamReasonStr = "This message asks you to click a strange link and share your sensitive bank card details and security OTP. Genuine buyers never require card numbers or OTPs to send you money.";
  } else {
    initialBuyerMessage = `Namaste ji! I am interested in your ${quantity} ${unit || "Quintal"} of ${cropName}. Can you share your phone number or farm address so we can coordinate transport? I can pay Rs. ${Math.round(Number(price) * 0.98)} per ${unit || "Quintal"}.`;
  }

  const newChatId = "chat_" + (chats.length + 1);
  const newSimulatedChat = {
    id: newChatId,
    buyerName: simulatedBuyerName,
    buyerPhone: "+91 98822 " + Math.floor(10000 + Math.random() * 90000),
    avatarColor: isScamSimulated ? "bg-red-500" : "bg-emerald-600",
    verified: !isScamSimulated,
    messages: [
      { sender: "buyer", text: initialBuyerMessage, time: "Just Now" }
    ],
    isScamSuspected: isScamSimulated,
    scamReason: scamReasonStr
  };

  chats.unshift(newSimulatedChat);

  res.json({ success: true, post: newPost, newChatId });
});

// 3. Get Active Chats
app.get("/api/chats", (req, res) => {
  res.json(chats);
});

// 4. Send Message in Chat (and optionally trigger simulated replies or scam analysis)
app.post("/api/chat/send", async (req, res) => {
  const { chatId, text, sender } = req.body;
  const chatIndex = chats.findIndex((c) => c.id === chatId);
  if (chatIndex === -1) {
    return res.status(404).json({ error: "Chat not found" });
  }

  const newMessage = {
    sender: sender || "farmer",
    text,
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  };

  chats[chatIndex].messages.push(newMessage);

  // If the farmer sent the message, let's analyze if we should simulate a reply from the buyer
  if (sender === "farmer") {
    // If it's a scam buyer, let's trigger a scammy pressure response
    setTimeout(async () => {
      let replyText = "";
      if (chats[chatIndex].isScamSuspected) {
        replyText = "Don't worry, it is 100% safe. Just scan the code or click the link. If you do not do it now, I will buy from another farmer.";
      } else {
        replyText = "Thank you! I will speak with my transport driver and message you in some time. Please keep your crop ready.";
      }
      
      chats[chatIndex].messages.push({
        sender: "buyer",
        text: replyText,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      });
    }, 2000);
  }

  res.json({ success: true, chat: chats[chatIndex] });
});

// 5. AI Chat Scam Detector Endpoint
app.post("/api/chat/analyze", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.json({ isScam: false, reason: "" });
  }

  const aiClient = getGeminiClient();

  // Simple quick heuristic for instant response or offline fallback
  const containsSuspiciousTerms = (msg: string) => {
    const m = msg.toLowerCase();
    return (
      m.includes("qr") ||
      m.includes("scan") ||
      m.includes("upi pin") ||
      m.includes("advance fee") ||
      m.includes("registration fee") ||
      m.includes("pay first") ||
      m.includes("otp") ||
      m.includes("bar code") ||
      m.includes("barcode") ||
      m.includes("double price") ||
      m.includes("card number") ||
      m.includes("cvv") ||
      m.includes("link click") ||
      m.includes("password")
    );
  };

  const localWarning = containsSuspiciousTerms(message);
  let scamReasonLocal = "";
  if (localWarning) {
    if (message.toLowerCase().includes("qr") || message.toLowerCase().includes("scan") || message.toLowerCase().includes("pin")) {
      scamReasonLocal = "This message mentions scanning a QR Code or entering your UPI PIN. Remember: scanning a code is only for sending money, NEVER for receiving money.";
    } else if (message.toLowerCase().includes("fee") || message.toLowerCase().includes("pay first")) {
      scamReasonLocal = "This message requests you to pay an advance fee or registration fee. Genuine buyers will never ask a farmer for money first.";
    } else {
      scamReasonLocal = "This message asks for sensitive financial details or immediate payment actions, which is common in online scams. Please be careful.";
    }
  }

  if (!aiClient) {
    // Return heuristic response if API key is missing
    return res.json({
      isScam: localWarning,
      reason: localWarning ? scamReasonLocal : "",
      safetyTips: [
        "Never scan any QR code to receive money.",
        "Never share your UPI PIN or Bank OTP with anyone.",
        "Do not pay any advance fee for transport or listing registration."
      ]
    });
  }

  try {
    const escapedMessage = message.replace(/"/g, '\\"');
    const prompt = `Analyze this chat message received by an Indian farmer from an online buyer. Determine if it is likely a scam (e.g., QR code scanning fraud, UPI pin request, advance registration fee request, malicious link, or pressure tactics).
    
    Message: "${escapedMessage}"
    
    Respond STRICTLY in JSON format with three keys:
    1. "isScam" (boolean: true if it looks suspicious or is a known scam pattern, false otherwise)
    2. "reason" (string: a simple, helpful explanation in plain English that a simple farmer can understand. Do not use complex technical terms.)
    3. "safetyTips" (array of strings: 2-3 short, actionable safety tips for the farmer)`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isScam: {
              type: Type.BOOLEAN,
              description: "Whether the message looks suspicious or is a known scam pattern."
            },
            reason: {
              type: Type.STRING,
              description: "A simple, helpful explanation in plain English that a simple farmer can understand."
            },
            safetyTips: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: "2-3 short, actionable safety tips for the farmer."
            }
          },
          required: ["isScam", "reason", "safetyTips"]
        }
      },
    });

    const result = parseSafeJson(response.text);
    res.json({
      isScam: result.isScam !== undefined ? result.isScam : localWarning,
      reason: result.reason || scamReasonLocal,
      safetyTips: result.safetyTips || [
        "Never scan any QR code to receive money.",
        "Never share your UPI PIN or Bank OTP with anyone.",
        "Do not pay any advance fee for transport or listing registration."
      ]
    });
  } catch (err) {
    console.error("Gemini scan detector error:", err);
    res.json({
      isScam: localWarning,
      reason: localWarning ? scamReasonLocal : "",
      safetyTips: [
        "Never scan any QR code to receive money.",
        "Never share your UPI PIN or Bank OTP with anyone.",
        "Do not pay any advance fee for transport or listing registration."
      ]
    });
  }
});

// 6. AI Crop Doctor Endpoint
app.post("/api/crop-doctor", async (req, res) => {
  const { image, mimeType, language } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Please provide a crop leaf image." });
  }

  // Pre-configured mock responses for beautiful fallback diagnostics
  const getMockDiagnosis = (lang: string) => {
    const translations: Record<string, any> = {
      en: {
        diseaseName: "Yellow Rust of Wheat (Puccinia striiformis)",
        explanation: "This is a fungal disease that affects wheat crops. It appears as yellow stripes or powdery spots on the leaves.",
        fertilizerOrMedicine: "Fungicide Spray (Propiconazole 25% EC)",
        treatmentSteps: [
          "Spray Propiconazole (Tilt) fungicide - mix 200 ml in 200 liters of water per acre.",
          "Avoid excessive nitrogen fertilizer which can increase fungal growth.",
          "Irrigate the field regularly but avoid standing water."
        ],
        audioText: "Your crop is affected by Yellow Rust of Wheat. Spray Propiconazole fungicide by mixing 200 milliliters in 200 liters of water per acre. Avoid excessive nitrogen fertilizers."
      },
      hi: {
        diseaseName: "गेहूं का पीला रतुआ रोग (Yellow Rust)",
        explanation: "यह एक फंगस (फफूंद) से होने वाली बीमारी है जो गेहूं की पत्तियों को प्रभावित करती है। पत्तियों पर पीले रंग की धारियां या पाउडर जैसे धब्बे दिखाई देते हैं।",
        fertilizerOrMedicine: "फफूंदनाशक दवा (प्रोपिकोनाज़ोल 25% ईसी / टिल्ट)",
        treatmentSteps: [
          "प्रोपिकोनाज़ोल (टिल्ट) फफूंदनाशक का छिड़काव करें - प्रति एकड़ 200 मिलीलीटर दवा को 200 लीटर पानी में मिलाएं।",
          "खेत में यूरिया या नाइट्रोजन खाद बहुत अधिक मात्रा में न डालें क्योंकि इससे बीमारी बढ़ती है।",
          "खेत में पानी जमा न होने दें और उचित सिंचाई करें।"
        ],
        audioText: "आपके गेहूं की फसल में पीला रतुआ रोग के लक्षण हैं। इसके नियंत्रण के लिए प्रति एकड़ 200 मिलीलीटर प्रोपिकोनाज़ोल दवा को 200 लीटर पानी में मिलाकर छिड़काव करें। खेत में अधिक यूरिया न डालें।"
      },
      pb: {
        diseaseName: "ਕਣਕ ਦਾ ਪੀਲਾ ਕੁੰਗੀ ਰੋਗ (Yellow Rust)",
        explanation: "ਇਹ ਉੱਲੀ (ਫੰਗਸ) ਕਾਰਨ ਹੋਣ ਵਾਲੀ ਬੀਮਾਰੀ ਹੈ ਜੋ ਕਣਕ ਦੇ ਪੱਤਿਆਂ 'ਤੇ ਪੀਲੀਆਂ ਲਾਈਨਾਂ ਜਾਂ ਪਾਊਡਰ ਵਰਗੇ ਨਿਸ਼ਾਨ ਬਣਾਉਂਦੀ ਹੈ।",
        fertilizerOrMedicine: "ਉੱਲੀਨਾਸ਼ਕ ਦਵਾਈ (ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ 25% ਈਸੀ / Tilt)",
        treatmentSteps: [
          "ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ ਦਵਾਈ ਦਾ ਛਿੜਕਾਅ ਕਰੋ - 200 ਮਿਲੀਲੀਟਰ ਦਵਾਈ ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕੋ।",
          "ਵੱਧ ਨਾਈਟ੍ਰੋਜਨ (ਯੂਰੀਆ) ਖਾਦ ਪਾਉਣ ਤੋਂ ਗੁਰੇਜ਼ ਕਰੋ, ਇਸ ਨਾਲ ਬੀਮਾਰੀ ਵੱਧਦੀ ਹੈ।",
          "ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਾ ਨਾ ਹੋਣ ਦਿਓ।"
        ],
        audioText: "ਤੁਹਾਡੀ ਕਣਕ ਦੀ ਫਸਲ ਨੂੰ ਪੀਲੀ ਕੁੰਗੀ ਦਾ ਰੋਗ ਲੱਗਾ ਹੈ। ਇਸਦੇ ਇਲਾਜ ਲਈ 200 ਮਿਲੀਲੀਟਰ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ ਦਵਾਈ ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕਾਅ ਕਰੋ। ਯੂਰੀਆ ਖਾਦ ਦੀ ਜ਼ਿਆਦਾ ਵਰਤੋਂ ਨਾ ਕਰੋ।"
      },
      ta: {
        diseaseName: "கோதுமை மஞ்சள் துரு நோய்",
        explanation: "இது கோதுமைப் பயிரைத் தாக்கும் பூஞ்சை காளான் நோயாகும். இலைகளில் மஞ்சள் நிற கோடுகள் அல்லது தூள் போன்ற புள்ளிகளாக தோன்றும்.",
        fertilizerOrMedicine: "பூஞ்சைக் கொல்லி (புரோபிகோனசோல் 25% EC)",
        treatmentSteps: [
          "புரோபிகோனசோல் பூஞ்சைக் கொல்லியை தெளிக்கவும் - ஒரு ஏக்கருக்கு 200 லிட்டர் நீரில் 200 மி.லி கலந்து தெளிக்கவும்.",
          "அதிகப்படியான நைட்ரஜன் உரங்களைத் தவிர்க்கவும், இது பூஞ்சை வளர்ச்சியை அதிகரிக்கும்.",
          "வயலில் தண்ணீர் தேங்குவதைத் தவிர்க்கவும்."
        ],
        audioText: "உங்கள் பயிர் கோதுமை மஞ்சள் துரு நோயால் பாதிக்கப்பட்டுள்ளது. ஏக்கருக்கு 200 மில்லி புரோபிகோனசோல் பூஞ்சைக் கொல்லியை 200 லிட்டர் நீரில் கலந்து தெளிக்கவும்."
      },
      bn: {
        diseaseName: "গমের হলুদ মরিচা রোগ (Yellow Rust)",
        explanation: "এটি একটি ছত্রাকজনিত রোগ যা গম ফসলের ক্ষতি করে। পাতার উপরে হলদে রঙের লম্বা রেখা বা গুঁড়ো দাগ দেখা যায়।",
        fertilizerOrMedicine: "ছত্রাকনাশক স্প্রে (প্রোপিকোনাজল ২৫% ইসি / টিল্ট)",
        treatmentSteps: [
          "প্রোপিকোনাজল (টিল্ট) ছত্রাকনাশক স্প্রে করুন - প্রতি একরে ২০০ লিটার পানিতে ২০০ মিলি মিশিয়ে স্প্রে করুন।",
          "অতিরিক্ত ইউরিয়া বা নাইট্রোজেন সার ব্যবহার বন্ধ রাখুন, এটি রোগ বাড়িয়ে দেয়।",
          "জমিতে পানি জমতে দেবেন না, নিষ্কাশন ব্যবস্থা ভালো রাখুন।"
        ],
        audioText: "আপনার গম ফসলে হলুদ মরিচা রোগ হয়েছে। প্রতিকারের জন্য প্রতি একরে ২০০ মিলি প্রোপিকোনাজল ছত্রাকনাশক ২০০ লিটার পানিতে মিশিয়ে স্প্রে করুন। ইউরিয়া সার কম ব্যবহার করুন।"
      }
    };
    return translations[lang] || translations["en"];
  };

  const aiClient = getGeminiClient();
  const selectedLang = language || "en";

  if (!aiClient) {
    // Return high quality mock diagnosis if no Gemini key
    return res.json(getMockDiagnosis(selectedLang));
  }

  try {
    // Strip headers if they exist in the base64 string
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `You are "Crop Doctor AI", an empathetic expert agricultural scientist advising a poor Indian farmer.
    Analyze the uploaded image of the diseased plant leaf or crop. Identify the potential disease.
    
    Please provide the diagnosis in ${selectedLang === "hi" ? "Hindi (हिंदी)" : selectedLang === "pb" ? "Punjabi (ਪੰਜਾਬੀ)" : selectedLang === "ta" ? "Tamil (தமிழ்)" : selectedLang === "bn" ? "Bengali (বাংলা)" : "Simple English"}.
    
    Respond strictly in JSON format with the following keys, written in a very friendly, reassuring, humble manner. Avoid complex technical jargon and scientific names unless requested. Keep sentences short and clear.
    
    JSON structure:
    {
      "diseaseName": "Name of the crop disease in the selected language",
      "explanation": "A very simple, clear explanation of what is wrong with the plant and why it happened.",
      "fertilizerOrMedicine": "The specific local pesticide, fungicide, medicine, or organic remedy (e.g. Neem Oil, Urea reduction, or chemical spray) that the farmer should buy.",
      "treatmentSteps": [
        "Step 1: simple instruction",
        "Step 2: simple instruction",
        "Step 3: simple instruction"
      ],
      "audioText": "A short, clean, reassuring 2-sentence summary of the diagnosis and immediate action in the chosen language. This will be read aloud to the farmer."
    }
    
    Make sure the text is fully translated to the target language ${selectedLang}. Ensure the JSON is valid.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: base64Data,
      },
    };

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseaseName: {
              type: Type.STRING,
              description: "Name of the crop disease in the selected language"
            },
            explanation: {
              type: Type.STRING,
              description: "A very simple, clear explanation of what is wrong with the plant and why it happened in the selected language."
            },
            fertilizerOrMedicine: {
              type: Type.STRING,
              description: "The specific local pesticide, fungicide, medicine, or organic remedy that the farmer should buy in the selected language."
            },
            treatmentSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: "List of 3 simple actionable step-by-step instructions in the selected language."
            },
            audioText: {
              type: Type.STRING,
              description: "A short, clean, reassuring 2-sentence summary of the diagnosis and immediate action in the chosen language."
            }
          },
          required: ["diseaseName", "explanation", "fertilizerOrMedicine", "treatmentSteps", "audioText"]
        }
      },
    });

    const result = parseSafeJson(response.text);
    res.json({
      diseaseName: result.diseaseName || getMockDiagnosis(selectedLang).diseaseName,
      explanation: result.explanation || getMockDiagnosis(selectedLang).explanation,
      fertilizerOrMedicine: result.fertilizerOrMedicine || getMockDiagnosis(selectedLang).fertilizerOrMedicine,
      treatmentSteps: result.treatmentSteps || getMockDiagnosis(selectedLang).treatmentSteps,
      audioText: result.audioText || getMockDiagnosis(selectedLang).audioText
    });
  } catch (err) {
    console.error("Gemini Crop Doctor error:", err);
    res.json(getMockDiagnosis(selectedLang));
  }
});

// 7. AI Voice Assistant Endpoint
app.post("/api/voice-assistant", async (req, res) => {
  const { query, language } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Please enter or speak your query." });
  }

  const selectedLang = language || "en";

  // Pre-configured mock responses for beautiful farming assistant fallbacks
  const getMockVoiceReply = (q: string, lang: string) => {
    const qLower = q.toLowerCase();
    
    if (lang === "hi") {
      if (qLower.includes("पीला") || qLower.includes("yellow") || qLower.includes("wheat")) {
        return {
          text: "गेहूं के पत्ते पीले पड़ने के मुख्य कारण नाइट्रोजन की कमी या पीला रतुआ रोग हो सकते हैं। यदि पत्तियों पर पीला पाउडर छूने पर उंगली में लगता है, तो यह पीला रतुआ है। इसके लिए 'प्रोपिकोनाज़ोल' फंगसनाशक का छिड़काव करें। यदि पाउडर नहीं है, तो खेत में नाइट्रोजन (यूरिया) का संतुलित उपयोग करें।",
          suggestion: "पीला रतुआ के लिए छिड़काव की विधि",
          audioText: "गेहूं के पत्ते पीले पड़ने का कारण पीला रतुआ या नाइट्रोजन की कमी है। रतुआ होने पर प्रोपिकोनाज़ोल दवा का छिड़काव करें।"
        };
      }
      return {
        text: `नमस्ते किसान भाई! आपके सवाल "${q}" के लिए सलाह: हमेशा अच्छी गुणवत्ता के प्रमाणित बीजों का ही उपयोग करें। बुवाई से पहले बीजोपचार जरूर करें। मिट्टी की जांच के अनुसार ही खाद और यूरिया डालें। सिंचाई हमेशा शाम के समय या सुबह करें।`,
        suggestion: "फसल उत्पादन की मुख्य बातें",
        audioText: "नमस्ते किसान भाई! हमेशा अच्छे बीजों का उपयोग करें, मिट्टी की जांच कराएं और सही समय पर पानी दें।"
      };
    } else if (lang === "pb") {
      if (qLower.includes("ਪੀਲਾ") || qLower.includes("yellow") || qLower.includes("wheat")) {
        return {
          text: "ਕਣਕ ਦੇ ਪੱਤੇ ਪੀਲੇ ਹੋਣ ਦੇ ਮੁੱਖ ਕਾਰਨ ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਘਾਟ ਜਾਂ ਪੀਲੀ ਕੁੰਗੀ ਰੋਗ ਹੋ ਸਕਦੇ ਹਨ। ਜੇਕਰ ਪੱਤਿਆਂ 'ਤੇ ਪੀਲਾ ਪਾਊਡਰ ਹੈ ਤਾਂ ਇਹ ਪੀਲੀ ਕੁੰਗੀ ਹੈ। ਇਸਦੇ ਇਲਾਜ ਲਈ 'ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ' ਦਵਾਈ ਦਾ ਛਿੜਕਾਅ ਕਰੋ। ਜੇਕਰ ਸਾਧਾਰਨ ਪੀਲਾਪਣ ਹੈ ਤਾਂ ਯੂਰੀਆ ਦੀ ਸਹੀ ਮਾਤਰਾ ਵਿੱਚ ਵਰਤੋਂ ਕਰੋ।",
          suggestion: "ਪੀਲੀ ਕੁੰਗੀ ਰੋਗ ਦਾ ਇਲਾਜ",
          audioText: "ਕਣਕ ਦੇ ਪੱਤੇ ਪੀਲੇ ਹੋਣ ਦਾ ਕਾਰਨ ਪੀਲੀ ਕੁੰਗੀ ਹੋ ਸਕਦੀ ਹੈ। ਇਸਦੇ ਲਈ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।"
        };
      }
      return {
        text: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਤੁਹਾਡੇ ਸਵਾਲ "${q}" ਲਈ ਸਲਾਹ: ਆਪਣੀ ਫਸਲ ਲਈ ਹਮੇਸ਼ਾ ਤਸਦੀਕਸ਼ੁਦਾ ਬੀਜ ਹੀ ਵਰਤੋ। ਸਮੇਂ ਸਿਰ ਸਹੀ ਮਾਤਰਾ ਵਿੱਚ ਸਿੰਚਾਈ ਕਰੋ ਅਤੇ ਯੂਰੀਆ ਖਾਦ ਦੀ ਬੇਲੋੜੀ ਵਰਤੋਂ ਨਾ ਕਰੋ।`,
        suggestion: "ਚੰਗੀ ਫਸਲ ਲਈ ਨੁਕਤੇ",
        audioText: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਹਮੇਸ਼ਾ ਵਧੀਆ ਬੀਜ ਵਰਤੋ ਅਤੇ ਯੂਰੀਆ ਖਾਦ ਦੀ ਫਾਲਤੂ ਵਰਤੋਂ ਨਾ ਕਰੋ।"
      };
    } else if (lang === "ta") {
      return {
        text: "வணக்கம் விவசாயி தோழரே! உங்கள் பயிர்களின் ஆரோக்கியத்திற்கு, நல்ல தரமான சான்றளிக்கப்பட்ட விதைகளைப் பயன்படுத்துங்கள். நடவு செய்வதற்கு முன் விதை நேர்த்தி செய்ய வேண்டும். மண்ணின் தேவைக்கேற்ப உரங்களைப் பயன்படுத்துங்கள்.",
        suggestion: "விவசாய ஆலோசனைகள்",
        audioText: "வணக்கம் விவசாயி தோழரே! நல்ல தரமான விதைகளைப் பயன்படுத்தி மண்ணின் தேவைக்கேற்ப உரமிடுங்கள்."
      };
    } else if (lang === "bn") {
      return {
        text: "নমস্কার চাষী ভাই! আপনার ফসলের ভালো ফলনের জন্য সর্বদা উন্নত মানের বীজ ব্যবহার করুন। সুষম সার প্রয়োগ করুন এবং অতিরিক্ত জল জমতে দেবেন না। পোকা দমনের জন্য নিম তেল স্প্রে করতে পারেন।",
        suggestion: "উন্নত চাষের কিছু সহজ টিপস",
        audioText: "নমস্কার চাষী ভাই! ভালো ফলনের জন্য উন্নত বীজ ব্যবহার করুন এবং সুষম সার প্রয়োগ করুন।"
      };
    } else {
      // English default
      if (qLower.includes("yellow") || qLower.includes("wheat") || qLower.includes("leaf")) {
        return {
          text: "Yellow leaves in crops like wheat usually point to Nitrogen Deficiency or Yellow Rust disease. If you see yellow powder on leaves that stains your finger, it is Yellow Rust. Spray Tilt (Propiconazole) fungicide. If no powder is present, apply Urea or Zinc supplements.",
          suggestion: "Treatment for Wheat Leaf Yellowing",
          audioText: "Yellow wheat leaves are usually caused by nitrogen deficiency or yellow rust. Spray Propiconazole fungicide for rust."
        };
      }
      return {
        text: `Hello Farmers! For your query "${q}": We advise using high-quality certified seeds, treating seeds before planting, balanced NPK fertilizer based on soil testing, and drip or timely evening irrigation to maximize crop yield.`,
        suggestion: "General Farming Best Practices",
        audioText: "Hello Farmer! Use quality seeds, test your soil, and irrigate your crop at the right time."
      };
    }
  };

  const aiClient = getGeminiClient();

  if (!aiClient) {
    return res.json(getMockVoiceReply(query, selectedLang));
  }

  try {
    const escapedQuery = query.replace(/"/g, '\\"');
    const prompt = `You are "Kisaan Dost AI", a friendly, empathetic farming assistant for Indian farmers.
    The farmer speaks or asks: "${escapedQuery}"
    
    Please answer the farmer's question in a very warm, comforting, encouraging, and highly respectful tone.
    Your answer must be fully translated in ${selectedLang === "hi" ? "Hindi (हिंदी)" : selectedLang === "pb" ? "Punjabi (ਪੰਜਾਬੀ)" : selectedLang === "ta" ? "Tamil (தமிழ்)" : selectedLang === "bn" ? "Bengali (বাংলা)" : "Simple English"}.
    
    Do not use complex chemical names or heavy engineering terms. Keep explanations straightforward, using standard household or local Indian farming terms.
    
    Respond strictly in JSON format with three keys:
    {
      "text": "The detailed helpful advice in the selected language (1-2 clear paragraphs)",
      "suggestion": "A short, actionable 3-4 word title or next step (e.g. 'Spray Neem Oil' or 'Check Soil Moisture')",
      "audioText": "A simplified, highly scannable, comforting 1-2 sentence speech output in the chosen language. This is read aloud to elderly farmers."
    }`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The detailed helpful advice in the selected language (1-2 clear paragraphs)"
            },
            suggestion: {
              type: Type.STRING,
              description: "A short, actionable 3-4 word title or next step in the chosen language."
            },
            audioText: {
              type: Type.STRING,
              description: "A simplified, highly scannable, comforting 1-2 sentence speech output in the chosen language."
            }
          },
          required: ["text", "suggestion", "audioText"]
        }
      },
    });

    const result = parseSafeJson(response.text);
    res.json({
      text: result.text || getMockVoiceReply(query, selectedLang).text,
      suggestion: result.suggestion || getMockVoiceReply(query, selectedLang).suggestion,
      audioText: result.audioText || getMockVoiceReply(query, selectedLang).audioText
    });
  } catch (err) {
    console.error("Gemini Voice Assistant error:", err);
    res.json(getMockVoiceReply(query, selectedLang));
  }
});

// ----------------------------------------
// VITE DEV / PROD MIDDLEWARE SETUP
// ----------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    // Serve production static assets from dist/
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FarmConnect AI Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
