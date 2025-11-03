"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Check,
  Languages,
  Smartphone,
  CreditCard,
  BookOpen,
  Shield,
  PlayCircle,
  Car,
  Lock,
  Stars,
} from "lucide-react";

/**
 * QUICK NOTES
 * - Stripe is intentionally NOT connected. "Go Pro" shows a notice.
 * - Redeem Code accepts: IND-DEMO-1234 (sets Pro in localStorage).
 * - Add more questions by extending QUESTION_BANK below (Q001–Q050).
 */

// ------------------------- i18n copy ---------------------------------
const dict = {
  en: {
    brand: "CaliforniA+",
    heroTitle: "California DMV Writing Test Prep (Hindi + Gujarati)",
    heroTag:
      "Bilingual practice with timed quizzes and explanations. Built for Indian drivers in California.",
    ctaPrimary: "Start Free Quiz",
    ctaSecondary: "See Pricing",
    featuresTitle: "Built to launch quickly",
    features: [
      {
        icon: <BookOpen className="w-5 h-5" />,
        title: "Bilingual content",
        desc: "Full questions & choices in Hindi and Gujarati with answer keys.",
      },
      {
        icon: <PlayCircle className="w-5 h-5" />,
        title: "Timed practice",
        desc: "Exam-like flow, instant feedback, progress.",
      },
      {
        icon: <CreditCard className="w-5 h-5" />,
        title: "Monetize later",
        desc: "Stripe button stays visible but disabled for now.",
      },
      {
        icon: <Smartphone className="w-5 h-5" />,
        title: "Mobile-first",
        desc: "Fast on any phone. Works offline after first load.",
      },
      {
        icon: <Shield className="w-5 h-5" />,
        title: "Simple access",
        desc: "Redeem codes locally until backend is added.",
      },
    ],
    pricingTitle: "Simple pricing",
    planFree: {
      name: "Free",
      price: "$0",
      items: ["Sample quiz (10 Qs)", "1 language at a time", "Email support"],
      cta: "Try free",
    },
    planPro: {
      name: "Pro",
      price: "$19",
      period: "/mo",
      items: [
        "All quizzes & updates",
        "Hindi + Gujarati",
        "Answer explanations",
        "Downloadable PDFs (later)",
      ],
      cta: "Go Pro",
    },
    faqTitle: "FAQs",
    faqs: [
      {
        q: "Is this official DMV content?",
        a: "No. It's an independent prep resource aligned to California rules.",
      },
      {
        q: "Which languages are included?",
        a: "UI in English; questions in Hindi and Gujarati.",
      },
      {
        q: "Refunds?",
        a: "N/A right now (Stripe not connected).",
      },
    ],
    footer: `© ${new Date().getFullYear()} CaliforniA+ — Study smarter. Drive safer.`,
    sampleQuizTitle: "Try a sample quiz",
    language: "Language",
    redeemTitle: "Redeem Access Code",
    redeemPlaceholder: "Enter code (try: IND-DEMO-1234)",
    redeemBtn: "Redeem",
    redeemSuccess: "Success — Pro unlocked on this device.",
    redeemFail: "Invalid or expired code.",
    proLocked: "Pro content (locked)",
    proUnlockHint:
      "Redeem a code below or click Go Pro (Stripe not set up yet).",
    startQuiz: "Start Quiz",
    finish: "Finish",
    next: "Next",
    prev: "Back",
    correctAnswer: "Correct answer",
    scoreTitle: "Results",
    restart: "Restart",
    notConfigured: "Payments not configured yet. Stripe will be added later.",
  },
  hi: {
    brand: "कैलिफ़ोर्निया+",
    heroTitle: "कैलिफ़ोर्निया DMV लिखित परीक्षा तैयारी (हिंदी + गुजराती)",
    heroTag:
      "द्विभाषी अभ्यास, टाइम्ड क्विज़ और समझ के साथ। कैलिफ़ोर्निया में भारतीय ड्राइवर्स के लिए।",
    ctaPrimary: "फ्री क्विज़ शुरू करें",
    ctaSecondary: "कीमतें देखें",
    featuresTitle: "तेज़ी से लॉन्च करने के लिए",
    features: [
      {
        icon: <BookOpen className="w-5 h-5" />,
        title: "द्विभाषी सामग्री",
        desc: "हिंदी व गुजराती में प्रश्न, विकल्प और उत्तर कुंजी।",
      },
      {
        icon: <PlayCircle className="w-5 h-5" />,
        title: "टाइम्ड अभ्यास",
        desc: "परीक्षा जैसा प्रवाह, तुरंत फीडबैक, प्रोग्रेस।",
      },
      {
        icon: <CreditCard className="w-5 h-5" />,
        title: "कमाई बाद में",
        desc: "Stripe बटन दिखेगा पर अभी निष्क्रिय है।",
      },
      {
        icon: <Smartphone className="w-5 h-5" />,
        title: "मोबाइल-फर्स्ट",
        desc: "हर फोन पर तेज़। पहली बार बाद ऑफ़लाइन भी।",
      },
      {
        icon: <Shield className="w-5 h-5" />,
        title: "आसान एक्सेस",
        desc: "अभी लोकल रिडीम कोड, बाद में बैकएंड।",
      },
    ],
    pricingTitle: "सिंपल प्राइसिंग",
    planFree: {
      name: "फ्री",
      price: "₹0",
      items: ["सैंपल क्विज़ (10 प्रश्न)", "एक समय में 1 भाषा", "ईमेल सपोर्ट"],
      cta: "ट्राय करें",
    },
    planPro: {
      name: "प्रो",
      price: "₹1,599",
      period: "/माह",
      items: ["सभी क्विज़ + अपडेट्स", "हिंदी + गुजराती", "उत्तर व्याख्या", "PDF (बाद में)"],
      cta: "प्रो लें",
    },
    faqTitle: "सामान्य प्रश्न",
    faqs: [
      { q: "क्या यह आधिकारिक DMV सामग्री है?", a: "नहीं, यह स्वतंत्र प्रेप संसाधन है।" },
      { q: "कौन-सी भाषाएँ?", a: "हिंदी और गुजराती प्रश्न, UI अंग्रेज़ी।" },
      { q: "रिफंड?", a: "अभी लागू नहीं (Stripe सेटअप बाकी)." },
    ],
    footer: `© ${new Date().getFullYear()} कैलिफ़ोर्निया+ — स्मार्ट तरीके से पढ़ें, सुरक्षित चलाएँ।`,
    sampleQuizTitle: "सैंपल क्विज़ आज़माएँ",
    language: "भाषा",
    redeemTitle: "कोड रिडीम करें",
    redeemPlaceholder: "कोड लिखें (जैसे: IND-DEMO-1234)",
    redeemBtn: "रिडीम",
    redeemSuccess: "सफल — इस डिवाइस पर प्रो अनलॉक।",
    redeemFail: "कोड अमान्य/समाप्त।",
    proLocked: "प्रो कंटेंट (लॉक)",
    proUnlockHint: "नीचे कोड रिडीम करें या ‘प्रो लें’ (Stripe बाद में)।",
    startQuiz: "क्विज़ शुरू करें",
    finish: "समाप्त",
    next: "आगे",
    prev: "पीछे",
    correctAnswer: "सही उत्तर",
    scoreTitle: "परिणाम",
    restart: "फिर से",
    notConfigured: "पेमेंट अभी कनेक्ट नहीं। Stripe बाद में जोड़ेंगे।",
  },
  gu: {
    brand: "California+",
    heroTitle: "કૅલિફોર્નિયા DMV લખિત પરીક્ષા તૈયારી (હિન્દી + ગુજરાતી)",
    heroTag:
      "દ્વિભાષી પ્રેક્ટિસ, ટાઇમ્ડ ક્વિઝ અને સમજાવટ. કૅલિફોર્નિયામાં ભારતીય ડ્રાઇવર્સ માટે.",
    ctaPrimary: "ફ્રી ક્વિઝ શરૂ કરો",
    ctaSecondary: "પ્રાઇસિંગ જુઓ",
    featuresTitle: "ઝડપી લૉન્ચ માટે",
    features: [
      {
        icon: <BookOpen className="w-5 h-5" />,
        title: "બાયલિંગ્યુઅલ કન્ટેન્ટ",
        desc: "હિન્દી + ગુજરાતી પ્રશ્નો, વિકલ્પો, આન્સર કી.",
      },
      {
        icon: <PlayCircle className="w-5 h-5" />,
        title: "ટાઇમ્ડ પ્રેક્ટિસ",
        desc: "પરીક્ષા જેવો ફ્લો, ઇન્સ્ટન્ટ ફીડબેક, પ્રોગ્રેસ.",
      },
      {
        icon: <CreditCard className="w-5 h-5" />,
        title: "મોનેટાઇઝ પછી",
        desc: "Stripe બટન દેખાય છે પરંતુ હાલ નિષ્ક્રિય.",
      },
      {
        icon: <Smartphone className="w-5 h-5" />,
        title: "મોબાઇલ-ફર્સ્ટ",
        desc: "દરેક ફોન પર ફાસ્ટ. પ્રથમ લોડ બાદ ઑફલાઇન પણ.",
      },
      {
        icon: <Shield className="w-5 h-5" />,
        title: "સરળ ઍક્સેસ",
        desc: "હાલ લોકલ કોડ રીડીમ; પછી બૅકએન્ડ.",
      },
    ],
    pricingTitle: "સરળ પ્રાઇસિંગ",
    planFree: {
      name: "ફ્રી",
      price: "₹0",
      items: ["સેમ્પલ ક્વિઝ (10 પ્રશ્ન)", "એક વખતમાં 1 ભાષા", "ઇમેઇલ સપોર્ટ"],
      cta: "ટ્રાય કરો",
    },
    planPro: {
      name: "પ્રો",
      price: "₹1,599",
      period: "/મહિ",
      items: ["બધી ક્વિઝ + અપડેટ્સ", "હિન્દી + ગુજરાતી", "જવાબ સમજાવટ", "PDF (પછી)"],
      cta: "પ્રો લો",
    },
    faqTitle: "વારંવાર પૂછાતા પ્રશ્નો",
    faqs: [
      { q: "શું આ ઓફિશિયલ DMV કન્ટેન્ટ છે?", a: "ના, સ્વતંત્ર પ્રેપ રિસોર્સ છે." },
      { q: "કઈ ભાષાઓ?", a: "UI અંગ્રેજી; પ્રશ્નો હિન્દી/ગુજરાતી." },
      { q: "રિફંડ?", a: "હાલ નથી (Stripe બાકી)." },
    ],
    footer: `© ${new Date().getFullYear()} California+ — સ્માર્ટ સ્ટડી. સેફ ડ્રાઇવિંગ.`,
    sampleQuizTitle: "સેમ્પલ ક્વિઝ અજમાવો",
    language: "ભાષા",
    redeemTitle: "કોડ રીડીમ કરો",
    redeemPlaceholder: "કોડ લખો (જેમ કે: IND-DEMO-1234)",
    redeemBtn: "રીડીમ",
    redeemSuccess: "સફળ — આ ડિવાઇસ પર પ્રો અનલૉક.",
    redeemFail: "અમાન્ય/સમાપ્ત કોડ.",
    proLocked: "પ્રો કન્ટેન્ટ (લૉક)",
    proUnlockHint:
      "નીચે કોડ રિડીમ કરો અથવા ‘પ્રો લો’ (Stripe પછી).",
    startQuiz: "ક્વિઝ શરૂ કરો",
    finish: "સમાપ્ત",
    next: "આગળ",
    prev: "પાછળ",
    correctAnswer: "સાચો જવાબ",
    scoreTitle: "પરિણામ",
    restart: "ફરીથી",
    notConfigured: "પેમેન્ટ હજી કનેક્ટ નથી. Stripe પછી ઉમેરશો.",
  },
};

// ------------------------- Question bank (Q001–Q050) ---------------------------------
type Q = {
  id: number;
  correct: "A" | "B" | "C" | "D";
  stem: { hi: string; gu: string };
  choices: { hi: string[]; gu: string[] };
};

const QUESTION_BANK: Q[] = [
  // Q001–Q020 (from your current page, kept consistent)
  {
    id: 1,
    correct: "D",
    stem: { hi: "केवल पार्किंग लाइट्स के साथ ड्राइविंग करना है:", gu: "ફક્ત પાર્કિંગ લાઇટ્સ સાથે ડ્રાઇવિંગ કરવું છે:" },
    choices: {
      hi: ["केवल सूर्योदय और सूर्यास्त के बीच कानूनी", "अंधेरे दिनों में सलाहनीय", "सूर्यास्त और अंधेरे के बीच अच्छी प्रथा", "किसी भी समय अनुशंसित नहीं"],
      gu: ["ફક્ત સૂર્યોદય અને સૂર્યાસ્ત વચ્ચે કાયદેસર", "અંધારા દિવસોમાં સલાહનીય", "સૂર્યાસ્ત અને અંધકાર વચ્ચે સારું આચરણ", "કોઈપણ સમયે ભલામણ કરેલું નથી"],
    },
  },
  {
    id: 2,
    correct: "A",
    stem: { hi: "जब आप 400 फीट से कम दृश्यता वाले रेलमार्ग को पार करते हैं, गति सीमा है:", gu: "જ્યારે તમે 400 ફૂટથી ઓછી દૃશ્યતા ધરાવતા રેલ્વે ટ્રેક પાર કરો છો, સ્પીડ લિમિટ છે:" },
    choices: { hi: ["15 MPH", "25 MPH", "35 MPH", "45 MPH"], gu: ["15 MPH", "25 MPH", "35 MPH", "45 MPH"] },
  },
  {
    id: 3,
    correct: "C",
    stem: { hi: "फ्रीवे के ढलान वाले रैम्प से निकलते समय आपको:", gu: "ફ્રીવેની ઢાળવાળી રેમ્પ પરથી નીકળતા સમયે તમને:" },
    choices: {
      hi: ["फ्रीवे की पोस्ट की गई सीमा तक धीमा करना चाहिए", "वळाँक में प्रवेश करने के बाद ब्रेक लगाना चाहिए", "वळाँक से पहले सुरक्षित गति तक धीमा करना चाहिए", "पूरे वळाँक में ब्रेक लगाते रहना चाहिए"],
      gu: ["ફ્રીવેની પોસ્ટ કરેલી મર્યાદા સુધી ધીમા થવું", "વળાંકમાં પ્રવેશ કર્યા પછી બ્રેક લગાવવી", "વળાંક પહેલાં સુરક્ષિત ઝડપ સુધી ધીમા થવું", "આખા વળાંક દરમિયાન બ્રેક લગાવતી રહેવી"],
    },
  },
  {
    id: 4,
    correct: "C",
    stem: {
      hi: "समस्याओं या संभावित खतरों की पहचान कर सुरक्षित मार्ग चुनने की विधि को क्या कहते हैं?",
      gu: "સમસ્યાઓ અથવા જોખમો ઓળખી સુરક્ષિત માર્ગ પસંદ કરવાની પદ્ધતિને શું કહે છે?",
    },
    choices: {
      hi: ["थ्री-सेकंड नियम", "जजिंग", "स्कैनिंग", "वाहन/हाईवे उन्मुखीकरण"],
      gu: ["ત્રણ સેકન્ડનો નિયમ", "જજિંગ", "સ્કેનિંગ", "વાહન/હાઇવે ઓરિએન્ટેશન"],
    },
  },
  {
    id: 5,
    correct: "D",
    stem: {
      hi: "जब आप आपातकालीन वाहन की लाल बत्ती/सायरन देखें और चौराहे पर न हों, आपको:",
      gu: "જ્યારે ઇમરજન્સી વાહનની લાલ લાઇટ/સાયરન જુઓ અને ચોરાહે ન હો, ત્યારે તમને:",
    },
    choices: {
      hi: ["ट्रैफ़िक साफ़ करने के लिए तेज़ी से बढ़ना चाहिए", "जब तक वाहन आपकी लेन में न हो, चलना जारी रखें", "दाईं लेन में जाएँ और धीमे चलें", "सड़क के दाहिने किनारे जाकर रुकें"],
      gu: ["ટ્રાફિક સાફ કરવા માટે ઝડપથી આગળ વધવું", "જ્યાં સુધી વાહન તમારી લેનમાં ના હોય ત્યાં સુધી ચાલ્યા કરો", "જમણી લેનમાં જઈ ધીમા થવું", "રસ્તાના જમણા કિનારે જઈને રોકાવું"],
    },
  },
  {
    id: 6,
    correct: "D",
    stem: { hi: "लाल तीर (रेड एरो) का क्या अर्थ है?", gu: "લાલ તીર (રેડ એરો) નો શું અર્થ છે?" },
    choices: {
      hi: ["आप दाईं ओर मुड़ सकते हैं", "आप बाईं ओर धीरे से मुड़ सकते हैं", "जब तक तीर हरा न हो जाए, रुकें", "जब तक तीर हरा न हो जाए, रुकें (सही)"],
      gu: ["તમે જમણી તરફ વળી શકો છો", "તમે ડાબી તરફ ધીમે વળી શકો છો", "જ્યાં સુધી તીર લીલું ન થાય ત્યાં સુધી રોકાવો", "જ્યાં સુધી તીર લીલું ન થાય ત્યાં સુધી રોકાવો (સાચો)"],
    },
  },
  {
    id: 7,
    correct: "D",
    stem: { hi: "दो-पॉइंट उल्लंघन का उदाहरण क्या है?", gu: "બે પોઇન્ટ ઉલ્લંઘનનું ઉદાહરણ શું છે?" },
    choices: {
      hi: ["लापरवाह ड्राइविंग", "नशे में ड्राइविंग", "निलंबित/रद्द लाइसेंस के साथ ड्राइविंग", "उपरोक्त सभी"],
      gu: ["બેદરકાર ડ્રાઇવિંગ", "દારૂ પીધેલી હાલતમાં ડ્રાઇવિંગ", "સસ્પેન્ડ/રદ લાઇસન્સ સાથે ડ્રાઇવિંગ", "ઉપરના બધા"],
    },
  },
  {
    id: 8,
    correct: "B",
    stem: { hi: "यदि स्कूल अपना पता बदलता है, DMV को सूचित करना चाहिए:", gu: "સ્કૂલે સરનામું બદલે તો DMV ને જાણ કરવી જોઈએ:" },
    choices: { hi: ["तुरंत", "15 कार्यदिवस में", "5 कार्यदिवस में", "20 कैलेंडर दिन में"], gu: ["તરત", "15 કામકાજી દિવસમાં", "5 કામકાજી દિવસમાં", "20 કેલેન્ડર દિવસે"] },
  },
  {
    id: 9,
    correct: "C",
    stem: {
      hi: "कभी-कभी वाहन संकेतों की जगह हाथ संकेतों का उपयोग करना पड़ता है। धीमा करना हो तो:",
      gu: "ક્યારેક વાહનના સિગ્નલના બદલે હાથ સંકેતો વાપરવા પડે. ધીમા થવા હોય તો:",
    },
    choices: {
      hi: ["बायाँ हाथ बाहर निकालकर ऊपर मोड़ें", "बायाँ हाथ बाहर निकालकर नीचे मोड़ें", "बायाँ हाथ सीधा बाहर रखें", "बायाँ हाथ बाहर निकालकर आगे-पीछे करें"],
      gu: ["ડાબો હાથ બહાર કાઢીને ઉપર વાળો", "ડાબો હાથ બહાર કાઢીને નીચે વાળો", "ડાબો હાથ સીધો બહાર રાખો", "ડાબો હાથ બહાર કાઢીને આગળ-પાછળ હલાવો"],
    },
  },
  {
    id: 10,
    correct: "B",
    stem: { hi: "Kaitlyn’s Law — 6 वर्ष या कम आयु के बच्चे को वाहन में छोड़ना:", gu: "Kaitlyn’s Law — 6 વર્ષ અથવા ઓછા બાળકને વાહનમાં મૂકવું:" },
    choices: {
      hi: ["10+ वर्ष के पर्यवेक्षण में ठीक", "12+ वर्ष के पर्यवेक्षण के बिना प्रतिबंधित", "14+ वर्ष के पर्यवेक्षण के बिना ठीक", "16+ वर्ष के पर्यवेक्षण पर ठीक"],
      gu: ["10+ વર્ષના દેખરેખમાં ચાલે", "12+ વર્ષના દેખરેખ વગર પ્રતિબંધિત", "14+ વર્ષના દેખરેખ વગર ચાલે", "16+ વર્ષના દેખરેખમાં ચાલે"],
    },
  },
  {
    id: 11,
    correct: "C",
    stem: { hi: "ढलान वाली फ्रीवे रैंप से निकलते समय आपको:", gu: "ઢાળવાળી ફ્રીવે રેમ્પ પરથી નીકળતાં સમયે તમને:" },
    choices: {
      hi: ["पोस्ट सीमा तक धीमा करें", "मोड़ में घुसने के बाद ब्रेक करें", "मोड़ से पहले सुरक्षित गति तक धीमा करें", "पूरे मोड़ में ब्रेक लगाते रहें"],
      gu: ["પોસ્ટ મર્યાદા સુધી ધીમા થશો", "વળાંકમાં પ્રવેશ કર્યા પછી બ્રેક", "વળાંક પહેલાં સુરક્ષિત ઝડપ સુધી ધીમા થશો", "આખા વળાંક દરમિયાન બ્રેક લગાવો"],
    },
  },
  {
    id: 12,
    correct: "D",
    stem: { hi: "आप यू-टर्न नहीं कर सकते:", gu: "તમે યુ-ટર્ન કરી શકતા નથી:" },
    choices: {
      hi: ["डबल पीली लाइन के पार", "चौराहे पर हरी बत्ती में", "जब ट्रैफिक न हो", "रेलवे क्रॉसिंग/फायर स्टेशन सामने/वन-वे रोड पर"],
      gu: ["ડબલ પીળી લાઇન પાર", "લીલી લાઇટમાં ચોરાહે", "જ્યારે ટ્રાફિક ન હોય", "રેલ્વે ક્રોસિંગ/ફાયર સ્ટેશન સામે/વન-વે ઉપર"],
    },
  },
  {
    id: 13,
    correct: "A",
    stem: { hi: "सुरक्षित ड्राइविंग के लिए आगे कितनी दूरी तक देखना चाहिए?", gu: "સેફ ડ્રાઇવિંગ માટે કેટલું આગળ જોવું જોઈએ?" },
    choices: { hi: ["10–15 सेकंड", "3 सेकंड", "सामने कार तक", "टेल लाइट तक"], gu: ["10–15 સેકન્ડ", "3 સેકન્ડ", "આગળની કાર સુધી", "ટેલ લાઇટ સુધી"] },
  },
  {
    id: 14,
    correct: "C",
    stem: { hi: "राउंडअबाउट के पास पहुँचते समय:", gu: "રાઉન્ડઅબાઉટ પાસે પહોંચતાં:" },
    choices: {
      hi: ["घड़ी की दिशा में चलें", "दाएँ से आने वालों को रास्ता दें", "घड़ी की विपरीत दिशा में प्रवेश करें", "बीच से निकलें"],
      gu: ["ઘડિયાળની દિશામાં જશો", "જમણી બાજુથી આવનારને રસ્તો આપો", "ઘડિયાળની વિરુદ્ધ દિશામાં પ્રવેશ કરો", "વચ્ચેથી નીકળો"],
    },
  },
  {
    id: 15,
    correct: "C",
    stem: { hi: "रेड एरो दिखे तो:", gu: "રેડ એરો દેખાય તો:" },
    choices: {
      hi: ["दाईं मुड़ सकते हैं", "बाईं धीरे मुड़ें", "हरा होने तक रुकें", "पैदल यात्री न हो तो आगे बढ़ें"],
      gu: ["જમણે વળી શકો", "ડાબે ધીમે વળો", "લીલું થયા સુધી રોકાવો", "કોઈ પદયાત્રી ન હોય તો આગળ વધો"],
    },
  },
  {
    id: 16,
    correct: "D",
    stem: { hi: "ट्रैफिक वायोलेटर स्कूल —", gu: "ટ્રાફિક વાયોલેટર સ્કૂલ —" },
    choices: {
      hi: ["वर्ष में एक बार दाखिला अनिवार्य", "18- से कम को प्रवेश नहीं", "कोर्स हमेशा 8 घंटे", "कोर्ट से 500 फीट के भीतर नहीं होना चाहिए"],
      gu: ["વર્ષમાં એકવાર એડમિશન ફરજીયાત", "18થી ઓછાને પ્રવેશ નહીં", "કોર્સ હંમેશાં 8 કલાક", "કોર્ટથી 500 ફૂટની અંદર ન હોવું જોઈએ"],
    },
  },
  {
    id: 17,
    correct: "B",
    stem: { hi: "फ्रीवे में प्रवेश करते समय:", gu: "ફ્રીવેમાં પ્રવેશ કરતી વખતે:" },
    choices: {
      hi: ["पहले लेन बदलें, फिर गति बढ़ाएँ", "ट्रैफिक में उपयुक्त गैप लें और गति से मेल करें", "स्टॉप साइन पर रुकें", "तेज़ गति से कट करें"],
      gu: ["પહેલા લેન બદલો પછી ઝડપ", "ટ્રાફિકમાં ગેપ શોધો અને ઝડપ મેળવો", "સ્ટોપ સાઇન પર રોકાવો", "ઝડપથી કટ કરો"],
    },
  },
  {
    id: 18,
    correct: "B",
    stem: { hi: "किन वाहनों को हर रेलमार्ग क्रॉसिंग पर रुकना होता है?", gu: "કયા વાહનો દરેક રેલ્વે ક્રોસિંગ પર રોકાય છે?" },
    choices: { hi: ["केवल स्कूल बसें", "स्कूल बसें और पैसेंजर वाहन", "केवल ट्रक", "कोई नहीं"], gu: ["ફક્ત બસ", "બસ અને મુસાફરી વાહનો", "ફક્ત ટ્રક", "કોઈ નહીં"] },
  },
  {
    id: 19,
    correct: "A",
    stem: { hi: "बाएँ मुड़ना हो तो:", gu: "ડાબે વળવું હોય તો:" },
    choices: {
      hi: ["सामने से आती दो कारें गुजरने दें", "हरी लाइट होते ही मुड़ जाएँ", "केवल दाईं देखें", "सीधी सड़क पर मुड़ें"],
      gu: ["સામેની બે કાર પાસ થાય ત્યાં સુધી રાહ જુઓ", "લીલી લાઇટ થતા જ વળી જશો", "ફક્ત જમણી જુઓ", "સીધા માર્ગે વળી જશો"],
    },
  },
  {
    id: 20,
    correct: "B",
    stem: { hi: "नारंगी निर्माण संकेत दिखे तो:", gu: "નારંગી કન્સ્ટ્રક્શન સાઇન દેખાય તો:" },
    choices: { hi: ["तुरंत रुकें", "मज़दूर/उपकरण के लिए तैयार रहें", "उसी गति से चलें", "नज़रअंदाज करें"], gu: ["તરત રોકાવો", "મજૂરો/સાધનો માટે તૈયાર રહો", "એ જ ઝડપે ચાલો", "અવગણો"] },
  },

  // Q021–Q030 (new set to complete the 50)
  {
    id: 21,
    correct: "C",
    stem: { hi: "स्कूल बस की लाल बत्तियाँ चमक रही हों तो:", gu: "સ્કૂલ બસની લાલ લાઇટ્સ ચમકી રહી હોય ત્યારે:" },
    choices: {
      hi: ["यदि आप विपरीत दिशा में हों तो चलते रहें", "केवल हाईवे पर रुकें", "दोनों दिशाओं से रुकें जब तक लाइट बंद न हो/ड्राइवर इशारा न करे", "सिर्फ हॉर्न बजाएँ"],
      gu: ["જો તમે સામેની દિશામાં હો તો ચાલતા રહો", "ફક્ત હાઇવે પર રોકાવો", "બંને દિશાથી રોકાવો જ્યાં સુધી લાઇટ બંધ ન થાય/ડ્રાઇવર સંકેત ન કરે", "માત્ર હોર્ન વગાડો"],
    },
  },
  {
    id: 22,
    correct: "C",
    stem: { hi: "हेडलाइट कब ज़रूरी हैं?", gu: "હેડલાઇટ ક્યારે જરૂરી છે?" },
    choices: {
      hi: ["केवल हाईवे पर", "भारी ट्रैफिक में", "सूर्यास्त के 30 मिनट बाद से सूर्योदय से 30 मिनट पहले/कम दृश्यता में", "कभी नहीं"],
      gu: ["ફક્ત હાઇવે પર", "ભારે ટ્રાફિકમાં", "સૂર્યાસ્ત બાદ 30 મિનિટથી સૂર્યોદય પૂર્વે 30 મિ/ઓછી દૃશ્યતા હોય ત્યારે", "ક્યારેય નહીં"],
    },
  },
  {
    id: 23,
    correct: "B",
    stem: { hi: "अनियंत्रित चौराहे पर एक साथ पहुँचें तो किसे रास्ता?", gu: "અનિયંત્રિત ચોક પર એકસાથે પહોંચો તો કોને રસ્તો?" },
    choices: {
      hi: ["बाएँ वाले को", "दाएँ वाले वाहन को", "जो तेज़ हो उसे", "किसी को नहीं"],
      gu: ["ડાબે વાળાને", "જમણા બાજુના વાહનને", "જે તેજ હોય તેને", "કોઈને નહીં"],
    },
  },
  {
    id: 24,
    correct: "C",
    stem: { hi: "डबल सॉलिड पीली लाइन का अर्थ:", gu: "ડબલ સોલિડ પીળી લાઇનનો અર્થ:" },
    choices: {
      hi: ["धीमे चलें", "दाईं मुड़ें", "ओवरटेक/पार करना मना", "रुकना मना"],
      gu: ["ધીમે ચાલો", "જમણે વળો", "ઓવરટેક/પાસ કરવું મનાઈ", "રોકાવું મનાઈ"],
    },
  },
  {
    id: 25,
    correct: "B",
    stem: { hi: "फ्रीवे में मर्ज करते समय सबसे अच्छा क्या है?", gu: "ફ્રીવેમાં મર્જ કરતી વખતે શ્રેષ્ઠ શું છે?" },
    choices: {
      hi: ["रुककर गैप का इंतज़ार करें", "रैंप पर गति बढ़ाकर ट्रैफिक से मेल करें", "धीरे जाएँ", "हॉर्न बजाएँ"],
      gu: ["રોકાઈને ગેપ જુઓ", "રેમ્પ પર ઝડપ વધારી ટ્રાફિક જેવી ઝડપ મેળવો", "ધીમે જાવો", "હોર્ન વગાડો"],
    },
  },
  {
    id: 26,
    correct: "A",
    stem: { hi: "पैरेलल पार्किंग में कर्ब से अधिकतम दूरी:", gu: "પેરાલેલ પાર્કિંગમાં કર્બથી મહત્તમ અંતર:" },
    choices: { hi: ["18 इंच", "3 फीट", "6 इंच", "30 इंच"], gu: ["18 ઇંચ", "3 ફૂટ", "6 ઇંચ", "30 ઇંચ"] },
  },
  {
    id: 27,
    correct: "D",
    stem: { hi: "21+ उम्र के लिए कानूनी BAC सीमा:", gu: "21+ ઉંમર માટે કાયદેસર BAC મર્યાદા:" },
    choices: { hi: ["0.00%", "0.02%", "0.05%", "0.08%"], gu: ["0.00%", "0.02%", "0.05%", "0.08%"] },
  },
  {
    id: 28,
    correct: "B",
    stem: { hi: "ड्राइविंग करते समय हैंडहेल्ड फोन:", gu: "ડ્રાઇવિંગ દરમિયાન હેન્ડહેલ્ડ ફોન:" },
    choices: {
      hi: ["हमेशा अनुमति", "निषिद्ध (हैंड्स-फ़्री को छोड़कर)", "केवल हाईवे पर अनुमति", "केवल ट्रैफिक में अनुमति"],
      gu: ["હંમેશાં મંજૂર", "મનાઈ (હેન્ડ્સ-ફ્રી સિવાય)", "ફક્ત હાઇવે પર મંજૂર", "ફક્ત ટ્રાફિકમાં મંજૂર"],
    },
  },
  {
    id: 29,
    correct: "C",
    stem: { hi: "टायर फट जाए तो:", gu: "ટાયર ફાટી જાય તો:" },
    choices: {
      hi: ["तुरंत ब्रेक जमकर लगाएँ", "इग्निशन बंद करें", "स्टीयरिंग मज़बूत पकड़े, सीधा रखें, धीरे धीमे रुकें", "न्यूट्रल में डालकर तेज़ मोड़ें"],
      gu: ["તરત જ બ્રેક જોરથી લગાવો", "ઇગ્નિશન બંધ કરો", "સ્ટીયરિંગ મજબૂત પકડો, સીધું રાખો, ધીમે ધીમે રોકાવો", "ન્યુટ્રલમાં નાખીને તેજ વાળો"],
    },
  },
  {
    id: 30,
    correct: "A",
    stem: { hi: "टर्न सिग्नल कितनी दूरी पहले देना चाहिए?", gu: "ટર્ન સિગ્નલ કેટલા અંતરે પહેલાં આપવો જોઈએ?" },
    choices: { hi: ["कम से कम 100 फीट", "50 फीट", "25 फीट", "ज़रूरत नहीं"], gu: ["ઓછામાં ઓછું 100 ફૂટ", "50 ફૂટ", "25 ફૂટ", "જરૂર નથી"] },
  },

  // Q031–Q050 (matches the bilingual section we prepared with answers)
  {
    id: 31,
    correct: "A",
    stem: { hi: "“बेसिक स्पीड रूल” क्या है?", gu: "“બેસિક સ્પીડ રૂલ” શું છે?" },
    choices: {
      hi: ["परिस्थितियों के अनुसार सुरक्षित और उचित गति", "पोस्ट सीमा से 10 MPH कम", "हमेशा 55 MPH", "शहर में 25 MPH से अधिक नहीं"],
      gu: ["પરિસ્થિતિ માટે સલામત અને યોગ્ય ઝડપ", "પોસ્ટ કરેલી મર્યાદાથી 10 MPH ઓછી", "હંમેશા 55 MPH", "શહેરમાં 25 MPH થી વધુ નહીં"],
    },
  },
  {
    id: 32,
    correct: "C",
    stem: { hi: "फ्रीवे से ढलान रैम्प से निकलते समय?", gu: "ફ્રીવે પરથી ઢાળ રેમ્પ પરથી નીકળતી વખતે?" },
    choices: {
      hi: ["फ्रीवे सीमा तक धीमा करें", "मोड़ में घुसने के बाद ब्रेक करें", "मोड़ से पहले सुरक्षित गति तक धीमा करें", "पूरे मोड़ में ब्रेक लगाएँ"],
      gu: ["ફ્રીવે મર્યાદા સુધી ધીમા થાઓ", "વળાંકમાં પ્રવેશ કર્યા પછી બ્રેક", "વળાંક પહેલાં સુરક્ષિત ઝડપ સુધી ધીમા થાઓ", "આખા વળાંકમાં બ્રેક લગાવો"],
    },
  },
  {
    id: 33,
    correct: "A",
    stem: { hi: "‘इग्निशन इंटरलॉक डिवाइस’ का सही कथन:", gu: "‘ઇગ્નિશન ઇન્ટરલોક ડિવાઇસ’ વિશે સાચું શું?" },
    choices: {
      hi: ["हर बार अल्कोहल परीक्षण के लिए फूँकना पड़ता है", "केवल अदालत आदेशित कर सकती है", "यह स्वैच्छिक है", "केवल पहली DUI सजा के बाद"],
      gu: ["દરેક વખતે આલ્કોહોલ ટેસ્ટ માટે ફૂંકવું પડે", "ફક્ત કોર્ટ આદેશિત કરે", "આ સ્વૈચ્છિક છે", "ફક્ત પ્રથમ DUI પછી"],
    },
  },
  {
    id: 34,
    correct: "B",
    stem: { hi: "पीछे 4+ वाहन लग जाएँ तो:", gu: "પાછળ 4+ વાહનો લાગ્યા હોય તો:" },
    choices: {
      hi: ["दोगुनी गति रखें", "सुरक्षित किनारे होकर पास होने दें", "बीच सड़क धीमे हों", "लेन बनाए रखें"],
      gu: ["બમણી ઝડપ રાખો", "સુરક્ષિત બાજુએ થઈને તેમને પસાર થવા દો", "રસ્તાના મધ્યમાં ધીમા થાઓ", "લેન જાળવો"],
    },
  },
  {
    id: 35,
    correct: "D",
    stem: { hi: "ट्रैफिक वायोलेटर स्कूल में क्या शामिल नहीं है?", gu: "ટ્રાફિક વાયોલેટર સ્કૂલમાં શું સામેલ નથી?" },
    choices: {
      hi: ["कोर्टरूम प्रक्रियाएँ", "व्यावसायिक शिक्षा", "टिकटों को हराने की तरकीब", "वाहन प्रणाली/रखरखाव उप-प्रणालियाँ"],
      gu: ["કોર્ટરૂમ પ્રક્રિયા", "વ્યાવસાયિક શિક્ષણ", "ટિકિટ હરાવવાની તરકીબ", "વાહન સિસ્ટમ/મેંટેનન્સ ઉપ-સિસ્ટમ"],
    },
  },
  {
    id: 36,
    correct: "C",
    stem: { hi: "पीछे की ब्रेक लाइट खराब हो तो:", gu: "પાછળની બ્રેક લાઇટ ખરાબ હોય તો:" },
    choices: {
      hi: ["खुद ठीक करें", "नज़रअंदाज करें", "जल्द से जल्द मरम्मत करवाएँ", "केवल दिन में चलाएँ"],
      gu: ["પોતે જ સુધારો", "અવગણો", "શીઘ્ર સમારકામ કરાવો", "ફક્ત દિવસે જ ચલાવો"],
    },
  },
  {
    id: 37,
    correct: "B",
    stem: { hi: "बड़े ट्रक के पीछे चलते समय:", gu: "મોટા ટ્રક પાછળ ચાલતાં:" },
    choices: {
      hi: ["बहुत पास चलें", "दूरी बढ़ाएँ ताकि आगे दिखे", "बाएँ रहें और हॉर्न बजाएँ", "दाएँ से पास करें"],
      gu: ["ખૂબ નજીક ચાલો", "અંતર વધારો જેથી આગળ દેખાય", "ડાબે રહો અને હોર્ન વગાડો", "જમણી બાજુથી પસાર થાઓ"],
    },
  },
  {
    id: 38,
    correct: "D",
    stem: { hi: "ब्रेक फेल हो जाएँ तो:", gu: "બ્રેક નિષ્ફળ જાય તો:" },
    choices: {
      hi: ["तुरंत हैंडब्रेक", "इंजन बंद", "हॉर्न बजाएँ", "लोअर गियर में शिफ्ट कर धीरे-धीरे पंप करें"],
      gu: ["તરત હેન્ડબ્રેક", "એન્જિન બંધ", "હોર્ન વગાડો", "નીચા ગિયરમાં શિફ્ટ કરી ધીમે ધીમે પંપ કરો"],
    },
  },
  {
    id: 39,
    correct: "A",
    stem: { hi: "कार सीट में बैठाना अनिवार्य कब है?", gu: "કાર સીટમાં બેસાડવું ફરજિયાત ક્યારે?" },
    choices: { hi: ["8 वर्ष से कम", "10 वर्ष से कम", "12 वर्ष से कम", "6 वर्ष से कम"], gu: ["8 વર્ષથી ઓછી", "10 વર્ષથી ઓછી", "12 વર્ષથી ઓછી", "6 વર્ષથી ઓછી"] },
  },
  {
    id: 40,
    correct: "B",
    stem: { hi: "कोई ड्राइवर टेलगेट कर रहा हो तो:", gu: "કોઈ ડ્રાઇવર ટેલગેટ કરતો હોય તો:" },
    choices: {
      hi: ["गति बढ़ाएँ", "धीमे होकर दूरी बनाकर उसे पास होने दें", "अचानक ब्रेक", "हॉर्न बजाएँ"],
      gu: ["ઝડપ વધારો", "ધીમે થઈ અંતર બનાવી તેને પસાર થવા દો", "અચાનક બ્રેક", "હોર્ન વગાડો"],
    },
  },
  {
    id: 41,
    correct: "D",
    stem: { hi: "पीछे से ओवरटेक करते समय:", gu: "પાછળથી ઓવરટેક કરતી વખતે:" },
    choices: {
      hi: ["गति कम करें", "हॉर्न ज़रूर बजाएँ", "बहुत पास रहें", "ब्लाइंड स्पॉट जाँचें और संकेत दें"],
      gu: ["ઝડપ ઓછી કરો", "હોર્ન જરૂર વગાડો", "ખૂબ નજીક રહો", "બ્લાઇન્ડ સ્પોટ તપાસો અને સિગ્નલ આપો"],
    },
  },
  {
    id: 42,
    correct: "B",
    stem: { hi: "ट्रैफिक सिग्नल बंद हो तो चौराहा:", gu: "ટ્રાફિક સિગ્નલ બંધ હોય તો ચોક:" },
    choices: {
      hi: ["मुख्य सड़क को प्राथमिकता", "चार-तरफ़ा स्टॉप जैसा", "जो पहले आए वह जाए", "सबको सीधे जाने दें"],
      gu: ["મુખ્ય રસ્તાને પ્રાથમિકતા", "ચાર રસ્તાનું સ્ટોપ માનો", "જે પહેલો આવે તે જાય", "બધાને સીધા જવા દો"],
    },
  },
  {
    id: 43,
    correct: "C",
    stem: { hi: "‘नो पार्किंग’ क्षेत्र में रुकना कब अनुमति है?", gu: "‘નો પાર્કિંગ’ વિસ્તારમાં રોકાવું ક્યારે મંજૂર છે?" },
    choices: {
      hi: ["कभी नहीं", "केवल आपातकाल में", "यात्री को उतार/चढ़ाते समय", "पुलिस अनुमति दे तो"],
      gu: ["ક્યારેય નહીં", "ફક્ત ઇમરજન્સી", "મુસાફરને ઉતારતા/બેસાડતા વખતે", "પોલીસ મંજૂરી હોય તો"],
    },
  },
  {
    id: 44,
    correct: "A",
    stem: { hi: "दुर्घटना में शामिल हों तो:", gu: "અકસ્માતમાં સામેલ થાઓ તો:" },
    choices: {
      hi: ["रुकें और नाम/पता/बीमा दें", "वहाँ से चले जाएँ", "केवल घायल हो तो रुकें", "कार बीच सड़क छोड़ दें"],
      gu: ["રોકાવો અને નામ/સરનામું/ઇન્શ્યોરન્સ આપો", "ત્યાંથી ચાલી જાવ", "ફક્ત ઘાયલ હોય તો રોકાવો", "કાર રસ્તાના મધ્યમાં મૂકી દો"],
    },
  },
  {
    id: 45,
    correct: "C",
    stem: { hi: "टेलगेटिंग करना:", gu: "ટેલગેટિંગ કરવું:" },
    choices: {
      hi: ["ईंधन बचाने का तरीका", "हाईवे पर अनुमति", "खतरनाक और अवैध", "भारी ट्रैफिक में ठीक"],
      gu: ["ઈંધણ બચાવવાનો રસ્તો", "હાઇવે પર મંજૂર", "જોખમી અને ગેરકાયદેસર", "ભારે ટ્રાફિકમાં ઠીક"],
    },
  },
  {
    id: 46,
    correct: "B",
    stem: { hi: "पीछे से टक्कर में आमतौर पर दोष किसका?", gu: "પાછળથી ટક્કરમાં સામાન્ય રીતે દોષ કોનો?" },
    choices: {
      hi: ["आगे वाले का", "पीछे वाले चालक का", "दोनों का", "सड़क रखरखाव का"],
      gu: ["આગળના વાહનનો", "પાછળના ડ્રાઇવરનો", "બન્નેનો", "રસ્તા જાળવણીનો"],
    },
  },
  {
    id: 47,
    correct: "D",
    stem: { hi: "आपातकालीन वाहन को रास्ता न देने पर:", gu: "ઇમરજન્સી વાહનને રસ્તો ન આપવાથી:" },
    choices: {
      hi: ["कोई कार्रवाई नहीं", "चेतावनी", "लाइसेंस निलंबन", "जुर्माना और पॉइंट्स"],
      gu: ["કોઈ કાર્યવાહી નહીં", "ચેતવણી", "લાઇસન્સ સસ્પેન્શન", "દંડ અને પોઇન્ટ્સ"],
    },
  },
  {
    id: 48,
    correct: "C",
    stem: { hi: "एक्सेलेरेटर फँस जाए तो:", gu: "એક્સિલેરેટર ફસાઈ જાય તો:" },
    choices: {
      hi: ["इंजन बंद करें", "हैंडब्रेक लगाएँ", "न्यूट्रल में शिफ्ट करें और किनारे रोकें", "क्लच दबाकर इंजन रोकें"],
      gu: ["એન્જિન બંધ કરો", "હેન્ડબ્રેક લગાવો", "ન્યુટ્રલમાં શિફ્ટ કરો અને બાજુ રોકાવો", "ક્લચ દબાવી એન્જિન રોકો"],
    },
  },
  {
    id: 49,
    correct: "A",
    stem: { hi: "सामने से वाहन आए और कोई रास्ता न दे तो:", gu: "સામે વાહન આવે અને કોઈ રસ્તો ન આપે તો:" },
    choices: {
      hi: ["दाईं ओर जाएँ और धीमे हों", "गति बढ़ाकर पहले निकलें", "हॉर्न बजाते रहें", "बीच में रुककर इशारा करें"],
      gu: ["જમણી બાજુ જાઓ અને ધીમા થાઓ", "ઝડપ વધારી પહેલો પસાર થાઓ", "હોર્ન વગાડતા રહો", "મધ્યમાં રોકાઈ ઈશારા કરો"],
    },
  },
  {
    id: 50,
    correct: "D",
    stem: { hi: "फिसलन पर वाहन फिसले तो:", gu: "ચીકણા રસ્તા પર વાહન સ્લીપ થાય તો:" },
    choices: {
      hi: ["ब्रेक पूरी ताकत से दबाएँ", "स्टीयरिंग विपरीत दिशा में मोड़ें", "गैस छोड़ दें", "जिस दिशा में पिछला हिस्सा फिसले उसी दिशा में स्टीयरिंग घुमाएँ"],
      gu: ["બ્રેક સંપૂર્ણ દબાવો", "સ્ટીયરિંગ વિરુદ્ધ દિશામાં ફેરવો", "ગેસ છોડો", "જે દિશામાં પાછળનો ભાગ સ્લિપ થાય તે દિશામાં સ્ટીયરિંગ ફેરવો"],
    },
  },
];

// ------------------------- Components ---------------------------------

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 border border-gray-200">
      {children}
    </span>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl border bg-white shadow-sm">
      <div className="shrink-0 mt-1 text-gray-700">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-600 mt-1">{desc}</div>
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  items,
  highlight,
  cta,
  onClick,
}: {
  name: string;
  price: string;
  period?: string;
  items: string[];
  highlight?: boolean;
  cta: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 bg-white shadow-sm ${
        highlight ? "ring-2 ring-indigo-500" : ""
      }`}
    >
      <div className="text-sm text-gray-500">{name}</div>
      <div className="mt-2 text-3xl font-bold">
        {price}
        {period || ""}
      </div>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5" />
            {it}
          </li>
        ))}
      </ul>
      <button
        className="mt-6 w-full rounded-xl border bg-indigo-600 text-white py-2.5 hover:bg-indigo-700"
        onClick={onClick}
      >
        {cta}
      </button>
      <div className="text-[11px] text-gray-500 mt-2 text-center">
        Stripe checkout placeholder
      </div>
    </div>
  );
}

function RedeemBox({
  t,
  onSuccess,
}: {
  t: any;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const redeem = () => {
    // Demo only: accept 1 code locally
    if (code.trim().toUpperCase() === "IND-DEMO-1234") {
      localStorage.setItem("pro", "1");
      setMsg(t.redeemSuccess);
      onSuccess();
    } else {
      setMsg(t.redeemFail);
    }
  };

  return (
    <div className="p-4 rounded-2xl border bg-white shadow-sm">
      <div className="font-semibold">{t.redeemTitle}</div>
      <div className="mt-2 flex gap-2">
        <input
          placeholder={t.redeemPlaceholder}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        />
        <button
          className="rounded-lg bg-indigo-600 text-white px-4"
          onClick={redeem}
        >
          {t.redeemBtn}
        </button>
      </div>
      {msg && <div className="text-sm mt-2">{msg}</div>}
    </div>
  );
}

function Quiz({
  lang,
  questions,
  t,
}: {
  lang: "hi" | "gu";
  questions: Q[];
  t: any;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);

  const q = questions[index];
  const labels = ["A", "B", "C", "D"];

  const pick = (letter: string) => {
    setAnswers({ ...answers, [q.id]: letter });
  };

  const score = useMemo(
    () =>
      questions.filter((x) => answers[x.id] === x.correct).length,
    [answers, questions]
  );

  if (done) {
    return (
      <div className="p-6 rounded-2xl border bg-white shadow-sm">
        <div className="text-lg font-semibold mb-2">{t.scoreTitle}</div>
        <div className="text-gray-700">
          You scored <b>{score}</b> / {questions.length}.
        </div>
        <button
          className="mt-4 rounded-xl border px-4 py-2"
          onClick={() => {
            setIndex(0);
            setAnswers({});
            setDone(false);
          }}
        >
          {t.restart}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border bg-white shadow-sm">
      <div className="text-sm text-gray-500">
        Question {index + 1} of {questions.length}
      </div>
      <div className="mt-2 font-medium">{q.stem[lang]}</div>
      <div className="mt-4 grid gap-2">
        {q.choices[lang].map((c, i) => {
          const letter = labels[i];
          const picked = answers[q.id] === letter;
          return (
            <button
              key={i}
              className={`text-left rounded-xl border px-4 py-2 hover:bg-gray-50 ${
                picked ? "ring-2 ring-indigo-500" : ""
              }`}
              onClick={() => pick(letter)}
            >
              <span className="font-semibold mr-2">{letter}.</span>
              {c}
            </button>
          );
        })}
      </div>

      <div className="text-[12px] text-gray-500 mt-3">
        {t.correctAnswer}: <b>{q.correct}</b>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          className="rounded-lg border px-4 py-2 disabled:opacity-50"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          {t.prev}
        </button>
        {index < questions.length - 1 ? (
          <button
            className="rounded-lg bg-indigo-600 text-white px-4 py-2"
            onClick={() => setIndex((i) => i + 1)}
          >
            {t.next}
          </button>
        ) : (
          <button
            className="rounded-lg bg-green-600 text-white px-4 py-2"
            onClick={() => setDone(true)}
          >
            {t.finish}
          </button>
        )}
      </div>
    </div>
  );
}

// ------------------------- Page ---------------------------------

export default function Page() {
  const [uiLang, setUiLang] = useState<"en" | "hi" | "gu">("en");
  const [quizLang, setQuizLang] = useState<"hi" | "gu">("hi");
  const [isPro, setIsPro] = useState(false);

  const t = dict[uiLang];

  useEffect(() => {
    // read local pro unlock
    if (typeof window !== "undefined") {
      setIsPro(localStorage.getItem("pro") === "1");
    }
  }, []);

  const freeQuestions = QUESTION_BANK.slice(0, 10);
  const proQuestions = QUESTION_BANK; // all

  const onGoPro = () => {
    alert(t.notConfigured);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <header className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Car className="w-6 h-6" />
          {t.brand}
        </div>

        <div className="flex items-center gap-3">
          <Languages className="w-4 h-4" />
          <select
            value={uiLang}
            onChange={(e) => setUiLang(e.target.value as any)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
          <Pill>
            {t.language}:
            <select
              value={quizLang}
              onChange={(e) => setQuizLang(e.target.value as any)}
              className="ml-2 border rounded-md px-2 py-0.5 text-xs"
            >
              <option value="hi">हिंदी</option>
              <option value="gu">ગુજરાતી</option>
            </select>
          </Pill>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <section className="mt-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {t.heroTitle}
            </h1>
            <p className="mt-3 text-gray-700">{t.heroTag}</p>
            <div className="mt-5 flex gap-3">
              <a href="#quiz" className="rounded-xl bg-indigo-600 text-white px-5 py-3 hover:bg-indigo-700 inline-flex items-center gap-2">
                <Stars className="w-4 h-4" />
                {t.ctaPrimary}
              </a>
              <a href="#pricing" className="rounded-xl border px-5 py-3 inline-flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                {t.ctaSecondary}
              </a>
            </div>
          </div>

          <div className="p-6 border rounded-3xl bg-white shadow-sm">
            <Quiz lang={quizLang} questions={freeQuestions} t={t} />
          </div>
        </section>

        {/* Pro area */}
        <section id="quiz" className="mt-10 grid md:grid-cols-2 gap-8">
          <div className="p-6 border rounded-3xl bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <div className="font-semibold">Free Quiz</div>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              10 questions • {quizLang === "hi" ? "हिंदी" : "ગુજરાતી"}
            </div>
            <div className="mt-4">
              <Quiz lang={quizLang} questions={freeQuestions} t={t} />
            </div>
          </div>

          <div className="p-6 border rounded-3xl bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <div className="font-semibold">
                {isPro ? "Pro Quiz (unlocked)" : t.proLocked}
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {QUESTION_BANK.length} questions • {quizLang === "hi" ? "हिंदी" : "ગુજરાતી"}
            </div>

            {isPro ? (
              <div className="mt-4">
                <Quiz lang={quizLang} questions={proQuestions} t={t} />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="text-sm text-gray-600">{t.proUnlockHint}</div>
                <RedeemBox
                  t={t}
                  onSuccess={() => {
                    setIsPro(true);
                  }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-3">
            <Pill>v1 starter</Pill>
          </div>
          <h2 className="text-2xl font-bold">{t.featuresTitle}</h2>
          <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.features.map((f: any, i: number) => (
              <Feature key={i} {...f} />
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mt-12">
          <h2 className="text-2xl font-bold">{t.pricingTitle}</h2>
          <div className="mt-5 grid md:grid-cols-2 gap-6">
            <PricingCard {...t.planFree} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
            <PricingCard
              {...t.planPro}
              highlight
              onClick={onGoPro}
            />
          </div>
          <div className="text-xs text-gray-500 mt-3">
            “Go Pro” is visible but disabled — Stripe will be connected later.
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold">{t.faqTitle}</h2>
          <div className="mt-4 divide-y rounded-2xl border bg-white shadow-sm">
            {t.faqs.map((f: any, i: number) => (
              <details key={i} className="p-4">
                <summary className="cursor-pointer font-medium">
                  {f.q}
                </summary>
                <p className="text-sm text-gray-700 mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 text-center text-sm text-gray-600 mt-12">
          {t.footer}
        </footer>
      </main>
    </div>
  );
}