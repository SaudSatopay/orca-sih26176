import type { Language } from "../types";

/**
 * The relief sheet below the landing hero: the sea bed off Mumbai, drawn by
 * depth. The naval area, the port channel and the two track labels are the
 * hero's own words (i18n/hero.ts), because it is the hero's chart.
 */
export const RELIEF: Record<
  Language,
  {
    kicker: string;
    title: string;
    body: string;
    /** The key beside the sheet. */
    depthKey: string;
    shallow: string;
    deep: string;
    course: string;
    restricted: string;
    ground: string;
    /** Simulated values are always labelled: this line is not optional. */
    honesty: string;
    /** The drawing's accessible name and its description. */
    chartName: string;
    chartDesc: string;
    /** Words printed on the sheet. */
    place: string;
    shoal: string;
    bank: string;
    north: string;
    metres: string;
    km: string;
    /** Latin capitals are letter-spaced on the sheet; Devanagari is never tracked (it breaks the conjuncts). */
    tracked: boolean;
  }
> = {
  en: {
    kicker: "Sea bed · illustrative relief",
    title: "The answer follows the sea bed.",
    body: "ORCA reads the sea bed as well as the weather: temperature fronts and fishing grounds follow the shelf, its banks and its channels. This is the water from the chart above, drawn by depth, with the same plotted course lying over it.",
    depthKey: "Depth in metres",
    shallow: "shallow",
    deep: "deep",
    course: "Plotted course",
    restricted: "Restricted area",
    ground: "Fishing ground, by rank",
    honesty: "Illustrative relief drawn from synthetic data. Not a survey, and not for navigation.",
    chartName: "Illustrative relief chart of the sea bed off Mumbai",
    chartDesc:
      "The coast of Mumbai runs down the east side of the sheet. The sea bed deepens westward across the shelf, with contour lines at 5, 10, 20, 30, 40 and 50 metres, a shoal rising above 30 metres in the north-west, a bank in the south-west and a dredged channel off the harbour. The plotted course leaves the harbour, bends north around the hatched naval exercise area and ends at fishing ground 1 on the bank. Grounds 2 and 3 lie either side of the shoal.",
    place: "MUMBAI",
    shoal: "shoal",
    bank: "bank",
    north: "N",
    metres: "m",
    km: "km",
    tracked: true,
  },
  hi: {
    kicker: "समुद्र तल · उदाहरण के लिए बना उभार",
    title: "जवाब समुद्र तल के हिसाब से बनता है।",
    body: "ORCA मौसम के साथ समुद्र तल भी पढ़ता है: तापमान की सीमाएँ और मछली के क्षेत्र तटीय ढलान, उसके उथले टीलों और उसकी गहरी नालियों के साथ चलते हैं। यह ऊपर के चार्ट वाला ही पानी है, गहराई के हिसाब से बनाया गया, और वही तय मार्ग उस पर बिछा है।",
    depthKey: "गहराई, मीटर में",
    shallow: "उथला",
    deep: "गहरा",
    course: "तय किया गया मार्ग",
    restricted: "प्रतिबंधित क्षेत्र",
    ground: "मछली का क्षेत्र, क्रम से",
    honesty: "यह उभार केवल उदाहरण है और कृत्रिम आँकड़ों से बना है। यह सर्वेक्षण नहीं है और नौवहन के लिए नहीं है।",
    chartName: "मुंबई के पास समुद्र तल का उदाहरण उभार-चार्ट",
    chartDesc:
      "मुंबई का तट शीट के पूर्वी किनारे पर ऊपर से नीचे जाता है। समुद्र तल पश्चिम की ओर गहरा होता जाता है; 5, 10, 20, 30, 40 और 50 मीटर पर गहराई की रेखाएँ हैं, उत्तर-पश्चिम में 30 मीटर से ऊपर उठता एक उथला भाग है, दक्षिण-पश्चिम में एक टीला है और बंदरगाह के सामने खोदी हुई एक गहरी नाली है। तय मार्ग बंदरगाह से निकलता है, रेखांकित नौसेना अभ्यास क्षेत्र के उत्तर से मुड़ता है और टीले पर मछली के क्षेत्र 1 पर पहुँचता है। क्षेत्र 2 और 3 उथले भाग के दोनों ओर हैं।",
    place: "मुंबई",
    shoal: "उथला भाग",
    bank: "टीला",
    north: "उ",
    metres: "मी",
    km: "किमी",
    tracked: false,
  },
  mr: {
    kicker: "समुद्रतळ · उदाहरणादाखल उठाव",
    title: "उत्तर समुद्रतळानुसार ठरते.",
    body: "ORCA हवामानासोबत समुद्रतळही वाचते: तापमानाच्या सीमा आणि मासेमारीची क्षेत्रे किनारी उताराच्या, त्यावरील उथळ टेकाडांच्या आणि खोल वाटांच्या बरोबर असतात. वरच्या नकाशातलेच हे पाणी आहे, खोलीनुसार काढलेले, आणि तोच आखलेला मार्ग त्यावर पसरलेला आहे.",
    depthKey: "खोली, मीटरमध्ये",
    shallow: "उथळ",
    deep: "खोल",
    course: "आखलेला मार्ग",
    restricted: "प्रतिबंधित क्षेत्र",
    ground: "मासेमारी क्षेत्र, क्रमानुसार",
    honesty: "हा उठाव फक्त उदाहरणादाखल आहे आणि कृत्रिम आकड्यांवरून काढलेला आहे. हे सर्वेक्षण नाही आणि नौकानयनासाठी नाही.",
    chartName: "मुंबईजवळील समुद्रतळाचा उदाहरणादाखल उठाव-नकाशा",
    chartDesc:
      "मुंबईचा किनारा नकाशाच्या पूर्व कडेने वरून खाली जातो. समुद्रतळ पश्चिमेकडे खोल होत जातो; 5, 10, 20, 30, 40 आणि 50 मीटरवर खोलीच्या रेषा आहेत, वायव्येला 30 मीटरच्या वर येणारा एक उथळ भाग आहे, नैऋत्येला एक टेकाड आहे आणि बंदरासमोर खोदलेली एक खोल वाट आहे. आखलेला मार्ग बंदरातून निघतो, रेखांकित नौदल सराव क्षेत्राच्या उत्तरेकडून वळतो आणि टेकाडावरील मासेमारी क्षेत्र 1 पाशी संपतो. क्षेत्र 2 आणि 3 उथळ भागाच्या दोन्ही बाजूंना आहेत.",
    place: "मुंबई",
    shoal: "उथळ भाग",
    bank: "टेकाड",
    north: "उ",
    metres: "मी",
    km: "किमी",
    tracked: false,
  },
};
