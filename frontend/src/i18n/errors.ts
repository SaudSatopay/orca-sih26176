import type { Language } from "../types";

/** What a sheet says when it cannot be drawn or the crew cannot be reached. */
export const ERRORS: Record<
  Language,
  {
    brokenTitle: string;
    brokenBody: string;
    reload: string;
    offlineTitle: string;
    offlineBody: string;
    retry: string;
  }
> = {
  en: {
    brokenTitle: "This sheet could not be drawn",
    brokenBody: "Something broke while drawing this part of the chart. The rest of ORCA is still working.",
    reload: "Draw it again",
    offlineTitle: "ORCA cannot reach the crew",
    offlineBody: "The last reading is still shown. Check the connection, then try again. Always follow the official warning.",
    retry: "Try again",
  },
  hi: {
    brokenTitle: "यह शीट नहीं बन सकी",
    brokenBody: "चार्ट का यह हिस्सा बनाते समय गड़बड़ी हुई। ORCA का बाक़ी हिस्सा चल रहा है।",
    reload: "फिर से बनाएँ",
    offlineTitle: "ORCA टीम तक नहीं पहुँच पा रहा",
    offlineBody: "पिछली रीडिंग अब भी दिख रही है। कनेक्शन जाँचें, फिर दोबारा कोशिश करें। आधिकारिक चेतावनी हमेशा मानें।",
    retry: "दोबारा कोशिश करें",
  },
  mr: {
    brokenTitle: "ही शीट काढता आली नाही",
    brokenBody: "चार्टचा हा भाग काढताना बिघाड झाला. ORCA चा उरलेला भाग चालू आहे.",
    reload: "पुन्हा काढा",
    offlineTitle: "ORCA टीमपर्यंत पोहोचू शकत नाही",
    offlineBody: "मागील नोंद अजून दिसत आहे. कनेक्शन तपासा, मग पुन्हा प्रयत्न करा. अधिकृत इशारा नेहमी पाळा.",
    retry: "पुन्हा प्रयत्न करा",
  },
};
