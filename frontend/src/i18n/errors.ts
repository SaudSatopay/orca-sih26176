import type { Language } from "../types";

/** What a sheet says when it cannot be drawn or the sea cannot be read. */
export const ERRORS: Record<
  Language,
  {
    brokenTitle: string;
    brokenBody: string;
    reload: string;
    offlineTitle: string;
    offlineBody: string;
    /** The same failure before anything has been answered or read. */
    offlineFirstBody: string;
    retry: string;
  }
> = {
  en: {
    brokenTitle: "This sheet could not be drawn",
    brokenBody: "Something broke while drawing this part of the chart. The rest of ORCA is still working.",
    reload: "Draw it again",
    offlineTitle: "No signal",
    offlineBody: "ORCA could not read the sea. The last reading is still shown. Check the connection and try again. Always follow the official warning.",
    offlineFirstBody: "ORCA could not read the sea. Nothing has been answered yet. Check the connection and try again. Always follow the official warning.",
    retry: "Try again",
  },
  hi: {
    brokenTitle: "यह शीट नहीं बन सकी",
    brokenBody: "चार्ट का यह हिस्सा बनाते समय गड़बड़ी हुई। ORCA का बाक़ी हिस्सा चल रहा है।",
    reload: "फिर से बनाएँ",
    offlineTitle: "सिग्नल नहीं है",
    offlineBody: "ORCA समुद्र नहीं पढ़ पाया। पिछली रीडिंग अब भी दिख रही है। कनेक्शन जाँचें और दोबारा कोशिश करें। आधिकारिक चेतावनी हमेशा मानें।",
    offlineFirstBody: "ORCA समुद्र नहीं पढ़ पाया। अभी तक कोई जवाब नहीं मिला है। कनेक्शन जाँचें और दोबारा कोशिश करें। आधिकारिक चेतावनी हमेशा मानें।",
    retry: "दोबारा कोशिश करें",
  },
  mr: {
    brokenTitle: "ही शीट काढता आली नाही",
    brokenBody: "चार्टचा हा भाग काढताना बिघाड झाला. ORCA चा उरलेला भाग चालू आहे.",
    reload: "पुन्हा काढा",
    offlineTitle: "सिग्नल नाही",
    offlineBody: "ORCA ला समुद्र वाचता आला नाही. मागील नोंद अजून दिसत आहे. कनेक्शन तपासा आणि पुन्हा प्रयत्न करा. अधिकृत इशारा नेहमी पाळा.",
    offlineFirstBody: "ORCA ला समुद्र वाचता आला नाही. अजून कोणतेही उत्तर मिळालेले नाही. कनेक्शन तपासा आणि पुन्हा प्रयत्न करा. अधिकृत इशारा नेहमी पाळा.",
    retry: "पुन्हा प्रयत्न करा",
  },
};
