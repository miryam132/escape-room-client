## link to web - https://escape-room-client.onrender.com/
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
  hooks/        חיבור ל־react-query (rooms, game, users)
  api/          קריאות לשרת (fetch + שגיאות + token)
  lib/          פונקציות טהורות: פורמט זמן, זיהוי מעגלים
```

## חיבור לשרת

הלקוח מדבר עם [escape-room-server](https://github.com/miryam132/escape-room-server).

1. מריצים את השרת (ראו ה־README שלו). ב־`CORS_ORIGINS` של השרת חייב להופיע כתובת הלקוח, למשל `http://localhost:5173`.
2. אפשר להגדיר כתובת אחרת לשרת ב־`.env` (ראו `.env.example`); ברירת המחדל היא `http://localhost:3000/api`.
3. נתוני ההדגמה של השרת (`npm run db:seed`) מפנים לתמונה `http://localhost:5173/images/detective-office.png`,
   ולכן הקובץ נמצא ב־`public/images/`.

הכל בשרת דורש התחברות (חוץ מהרשמה והתחברות), ולכן גם קטלוג החדרים דורש התחברות.
ה־token נשמר ב־`sessionStorage`. המנהל נוצר בשרת בלבד (`npm run admin:create`); הרשמה יוצרת תמיד שחקן.

### מה עדיין חסר בשרת

"שכחתי סיסמה" (דורש שירות מייל).
הלקוח כבר קורא להם – ראו [docs/SERVER-ENDPOINTS.md](docs/SERVER-ENDPOINTS.md).

## מהלך משחק

המשחק כולו מנוהל בשרת: התקדמות, בדיקת תשובות (הלקוח אף פעם לא מכיר את התשובה הנכונה), נעילת נקודות
ורמזים. הזמן נמדד מ־`startedAt` של המשחק בשרת, ולכן רענון לא מאפס אותו.
