# Mysteria – חדרי בריחה

אפליקציית React לחדרי בריחה: שחקנים פותרים חידות על גבי תמונת החדר, והמנהל בונה חדרים ונקודות (hotspots).

## הרצה

```bash
npm install
npm run dev      # שרת פיתוח
npm test         # בדיקות (vitest)
npm run lint     # ESLint
npm run format   # Prettier
npm run build    # בדיקת טיפוסים + בנייה
```

## טכנולוגיות

React 19, TypeScript, Vite, React Router, TanStack Query, React Hook Form + Zod.
האתר בעברית ו־RTL.

## מבנה

```
src/
  app/          ראוטר (עם טעינה עצלה) ו־queryClient
  components/   קומפוננטות משותפות ורכיבי משחק
  features/     admin · auth · game · home · rooms
  hooks/        useGame, וחיבור ל־react-query (rooms, users, results)
  data/         שכבת נתונים (כרגע דמה בזיכרון / localStorage)
  lib/          פונקציות טהורות: ניקוד, זיהוי מעגלים
```

## משתמשים

- יש **מנהל אחד בלבד**. הרשמה יוצרת תמיד משתמש רגיל.
- בגרסת הדמה המנהל נוצר אוטומטית: `admin@mysteria.local` / `admin1234`.
  זה זמני – כשמתחברים לשרת, תפקיד המנהל נקבע בשרת בלבד.
- הנתונים ב־`src/data/*Repository.ts` הם דמה. החיבור לשרת יחליף רק את הקבצים האלה.

## ניקוד

1000 נקודות, פחות שנייה אחת לכל שנייה, 50 לכל רמז ו־20 לכל תשובה שגויה (ראו `constants.ts`).
