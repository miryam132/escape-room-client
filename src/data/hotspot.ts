import type { Hotspot } from "../types/hotspot";

export const hotspots: Hotspot[] = [
  {
    id: "hotspot-1",
    roomId: "room-1",
    label: "הפגישה הסודית",
    xPercent: 50,
    yPercent: 50,
    type: "puzzle",
    content:
      "במעטפה שעל השולחן נמצא דף מיומנו של החוקר: " +
      "'יצאתי בשעה 16:10. ההליכה לתחנה ארכה 20 דקות. " +
      "כשהגעתי, הרכבת הייתה אמורה לצאת בעוד 15 דקות. " +
      "הפגישה נקבעה לעשר דקות לפני יציאת הרכבת.'",
    question: "קוד הארון הוא שעת הפגישה בארבע ספרות, ללא נקודתיים. מהו הקוד?",
    answerType: "text",
    answer: "1635",
    hint: "חשב תחילה מתי הגיע החוקר לתחנה, אחר כך מתי יוצאת הרכבת, ולבסוף את שעת הפגישה.",
    isFinal: false,
  },
  {
    id: "hotspot-2",
    roomId: "room-1",
    label: "הארון",
    xPercent: 20,
    yPercent: 30,
    type: "info",
    content: "הארון נפתח. בפנים נמצא תיק חקירה ובו המסמכים להמשך החקירה.",
    requiresHotspotId: "hotspot-1",
  },
  {
    id: "hotspot-3",
    roomId: "room-1",
    label: "תיק החקירה",
    xPercent: 35,
    yPercent: 62,
    type: "puzzle",
    content:
      "בתיק נמצא מסמך עם כתובת שנמחקה בחלקה: " +
      "'מספר הבית זוגי, גדול מ־20 וקטן מ־30, וסכום ספרותיו הוא 6.'",
    question: "מהו מספר הבית?",
    answerType: "number",
    answer: "24",
    hint: "בדוק איזה מספר זוגי בין 22 ל־28 מתאים לסכום הספרות.",
    isFinal: false,
    requiresHotspotId: "hotspot-1",
  },
  {
    id: "hotspot-4",
    roomId: "room-1",
    label: "הספרייה",
    xPercent: 65,
    yPercent: 35,
    type: "info",
    content:
      "בתיק החקירה נמצאה הפניה למדף השני. בין הספרים במדף נמצא פתק: " +
      "'לפתיחת הכספת, הקלד את מספר הבית בשתי ספרות, " +
      "ומיד אחריו את שעת הפגישה בארבע ספרות, ללא רווחים או נקודתיים.'",
    requiresHotspotId: "hotspot-3",
  },
  {
    id: "hotspot-5",
    roomId: "room-1",
    label: "הכספת",
    xPercent: 75,
    yPercent: 65,
    type: "puzzle",
    content: "הכספת נעולה. על הדלת מותקן לוח מקשים עם מקום לשש ספרות.",
    question: "מהו הקוד לפתיחת הכספת?",
    answerType: "text",
    answer: "241635",
    hint: "חבר את מספר הבית בשתי ספרות לשעת הפגישה בארבע ספרות.",
    isFinal: true,
    requiresHotspotId: "hotspot-3",
  },
];
