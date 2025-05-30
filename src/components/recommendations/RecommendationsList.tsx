"use client";

import { useEffect, useState } from "react";
import RecommendationCard from "./RecommendationCard";
import RecommendationForm from "./RecommendationForm";

export type Recommendation = {
  _id?: string;
  name: string;
  stars: number;
  message: string;
};

export default function RecommendationsList() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchAndSetRecommendations = () => {
    fetch("/api/recommendations")
      .then((res) => res.json())
      .then((dbRecs) => {
        setRecommendations([...defaultRecommendations, ...dbRecs]);
      })
      .catch(() => {
        setRecommendations([...defaultRecommendations]);
      });
  };

  useEffect(() => {
    fetchAndSetRecommendations();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (rec: Recommendation) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const res = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rec),
    });

    if (res.ok) {
      setShowForm(false);
      setShowSuccess(true);
      fetchAndSetRecommendations();
      setTimeout(() => setShowSuccess(false), 4000);
    } else {
      alert("שגיאה בהוספת ההמלצה");
    }

    setIsSubmitting(false);
  };


  return (
    <div className='space-y-6 relative'>
      {showSuccess && (
        <div className='fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow z-50 transition-opacity'>
          ✅ ההמלצה נשלחה בהצלחה! תודה רבה 💚
        </div>
      )}

      <div className='flex justify-center'>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className='bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold'
        >
          {showForm ? "ביטול" : "הוסיפו המלצה"}
        </button>
      </div>

      {showForm && <RecommendationForm onAdd={handleAdd} />}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {recommendations.map((rec, index) => (
          <RecommendationCard key={rec._id || index} recommendation={rec} />
        ))}
      </div>
    </div>
  );
}

const defaultRecommendations: Recommendation[] = [
  {
    name: "Menahem Adoni",
    stars: 5,
    message: `PIGADI – כפר קטן הנמצא לחוף ים יפייפה באמצע הדרך מאתונה לסלוניקי. מעבר למפרץ מהיפים ביוון, בהגיעכם ל-PIGADI אתם מרגישים חזרה בזמן ליוון של פעם.

דירת הנופש של טילדה ואמירם נמצאת על גבעה המשקיפה על המפרץ היפה והשליו במרחק של 10 דקות הליכה לחוף. הדירה חדשה, מאובזרת בכל הדרוש ובעזרת טילדה ואמירם מסבירי הפנים מבטיחה נופש ורוגע אמיתי.

יש מספר חופים לאורך המפרץ, כולם שקטים, חוליים ולא עמוסים בנופשים. אנו מגיעים בשנים האחרונות ונופשים במקום לפחות 10 ימים, ביום מבלים בים ובערב באחת מהטברנות שעל החוף.

מ-PIGADI אפשר לצאת לטיולים קצרים וארוכים בכפרים סמוכים ובאזור. חצי האי פיליון נמצא במרחק שעה נסיעה. מהכפר הסמוך מפליגה כל יום ספינת טיולים לאי סקיאטוס, לטיול יומי. במרחק חצי שעת נסיעה ניתן לעבור במעבורת לטיול באי AVIA.

מומלץ ביותר!`,
  },
  {
    name: "Shuvit Melamed",
    stars: 5,
    message: `בית חלומי במקום חלומי, מכיל כל דבר שנזקקים לו משרוך נעל ועד כלי מיטה מפונפנים.

והנוף... לא תרצו לצאת מהמרפסת! וחבל כי העיירה כיפית, המסעדות נפלאות וחוף הים מושלם.`,
  },
  {
    name: "Ora Avni",
    stars: 5,
    message: `התארחנו בדירת נופש מקסימה בפיגאדי, ממש מעל המפרץ עם נוף עוצר נשימה לאי אוויה. הדירה חדשה, מרווחת ומאובזרת בכל מה שצריך לחופשה מושלמת – שני חדרי שינה נוחים, מטבח מצויד לגמרי, וסלון רחב ונעים. מיקום מעולה, במרחק הליכה מהחוף.
החוויה שלנו הפכה למיוחדת במיוחד בזכות המארחים – אמירם וטילדה, זוג ישראלים מופלאים שמארחים מכל הלב. הם תמיד זמינים, שמחים לעזור ולתת המלצות אישיות לטיולים, חופים נסתרים, מסעדות ופעילויות באזור.
מושלם למשפחות או לזוגות חברים שמחפשים שקט, נוף ואווירה יוונית אותנטית. פשוט חוויה! מומלץ בחום ❤️`,
  },
  {
    name: "Rachel Avidor",
    stars: 5,
    message: `הבית של טילדה ואמירם בפיגדי מזמין ונעים, מאובזר עם כל מה שעלה בדעתנו.

האזור שקט, ירוק ויפהפה, מתאים לטיולים, לים או פשוט להוריד הילוך ולנוח. המארחים מסבירי פנים וארחו אותנו כמו משפחה. ממליצה בחום!`,
  },
  {
    name: "Rachel Gottlieb",
    stars: 5,
    message: `נופש שהוא בפירוש off the beaten path ביוון הפחות מתויירת. בכפר הקטן פיגדי, על ראש גבעה המשקיפה לים הכחול, נמצאת דירת נופש נוחה, נקיה ומאובזרת עד הפרטים הקטנים ביותר, של אמירם וטילדה גולדין.

פיגדי נמצא כ-שלוש שעות נסיעה צפונית מאתונה (זה נשמע הרבה אבל הנסיעה עוברת מהר על כביש טוב) ומרחק דומה מסלוניקי. הדירה מושלמת לשילוב חופשה רגועה של בטן/גב עם טיולים בסביבה הקרובה או הרחוקה.

אפשר לאכול בטברנות המקומיות או לבשל אוכל לפי טעמכם האישי במטבח המצוייד. טילדה ואמירם מארחים נפלאים, שישמחו לתת מידע וטיפים או יניחו לכם לפרטיותכם, לפי רצונכם.

הדירה נמצאת בתוך מטע זיתים ומצויידת בגינת ירק שניתן לטעום ממנה. לשבת על המרפסת, לאכול ארוחת בוקר ולהביט לים... יש כאלה שלא יצטרכו יותר מזה 😊.

המרחק מהים כ-50 מטר (15 דקות ברגל או 5 דקות עם הרכב). חופי הרחצה קרובים ונקיים, ומספקים שירותי חוף בעונת הקיץ.

יש שוק איכרים בפתליאוס (8 דקות נסיעה). אפשר לשכור סירה מנמל פיגדי, ובקיץ האזור תוסס.

מחוץ לעונת הקיץ המקום שקט מאוד אבל עדיין יפה. ניתן להצטייד בכפרים סמוכים במרחק 10-20 דקות נסיעה.

פיגדי נמצא שעה נסיעה מהעיר וולוס, ואפשר גם טיולים יומיים לאזור פיליון או מטאורה, או מעבר במעבורת לאי אוויה.

מומלץ מאוד!`,
  },
];
