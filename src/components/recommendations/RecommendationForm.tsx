"use client";

import { useState } from "react";

type NewRecommendation = {
  name: string;
  stars: number;
  message: string;
};

type Props = {
  onAdd?: (rec: NewRecommendation) => void;
};

export default function RecommendationForm({ onAdd }: Props) {
  const [formData, setFormData] = useState<NewRecommendation>({
    name: "",
    stars: 5,
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    onAdd?.({ ...formData, stars: Number(formData.stars) });
    setFormData({ name: "", stars: 5, message: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white p-6 rounded shadow space-y-4 max-w-xl mx-auto'
    >
      <h2 className='text-2xl font-bold text-green-700 text-center'>
        הוסיפו המלצה משלכם
      </h2>

      <div>
        <label className='block font-bold mb-1'>שם:</label>
        <input
          name='name'
          type='text'
          className='border p-2 w-full rounded'
          value={formData.name}
          onChange={handleChange}
          placeholder='הכניסו את שמכם'
        />
      </div>

      <div>
        <label className='block font-bold mb-1'>דירוג (כוכבים):</label>
        <input
          name='stars'
          type='number'
          min={1}
          max={5}
          className='border p-2 w-full rounded'
          value={formData.stars}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className='block font-bold mb-1'>הודעה:</label>
        <textarea
          name='message'
          rows={4}
          className='border p-2 w-full rounded'
          value={formData.message}
          onChange={handleChange}
          placeholder='כתבו את המלצתכם כאן...'
        />
      </div>

      <button
        type='submit'
        className='bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full'
      >
        שלחו המלצה
      </button>
    </form>
  );
}
