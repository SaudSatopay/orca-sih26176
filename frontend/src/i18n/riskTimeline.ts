import type { Language } from "../types";

export const L: Record<Language, Record<string, string>> = {
  en: {
    title: "When is it safe to go?",
    sub: "Risk hour by hour for the next 24 hours",
    best: "Best window",
    none: "No low-risk window in the next 24 hours",
    now: "now",
    loading: "Reading the next 24 hours…",
  },
  hi: {
    title: "कब जाना सुरक्षित है?",
    sub: "अगले 24 घंटों का घंटेवार जोखिम",
    best: "सर्वोत्तम समय",
    none: "अगले 24 घंटों में कोई सुरक्षित समय नहीं",
    now: "अभी",
    loading: "अगले 24 घंटे पढ़ रहे हैं…",
  },
  mr: {
    title: "कधी जाणे सुरक्षित आहे?",
    sub: "पुढील २४ तासांचा तासागणिक धोका",
    best: "सर्वोत्तम वेळ",
    none: "पुढील २४ तासांत सुरक्षित वेळ नाही",
    now: "आत्ता",
    loading: "पुढील २४ तास वाचत आहे…",
  },
};
