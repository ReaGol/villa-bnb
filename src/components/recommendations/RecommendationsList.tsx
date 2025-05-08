type Recommendation = {
  name: string;
  message: string;
};

const recommendations: Recommendation[] = [
  {
    name: "משפחת כהן",
    message: "חוויה מדהימה! נהנינו מכל רגע והבית היה נוח ומזמין.",
  },
  {
    name: "איילת ושי",
    message: "הנוף פשוט מושלם והשירות היה מצוין. נחזור שוב!",
  },
  {
    name: "משפחת לוי",
    message: "חופשה נהדרת, הילדים לא רצו לעזוב 😊 תודה על הכול!",
  },
  {
    name: "תמר ויואב",
    message: "בית נעים מאוד, קרוב לים ושקט מסביב. מומלץ בחום!",
  },
];

export default function RecommendationsList() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
      {recommendations.map((rec, index) => (
        <div key={index} className='bg-white p-6 rounded shadow text-right'>
          <p className='text-gray-700 mb-4 text-lg'>"{rec.message}"</p>
          <p className='font-bold text-green-700'>- {rec.name}</p>
        </div>
      ))}
    </div>
  );
}
