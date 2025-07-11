"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type NewRecommendation = {
  name: string;
  stars: number;
  message: string;
};

type RecommendationPayload = {
  name: string;
  stars: number;
  message: {
    he: string;
    en?: string;
  };
};

type Props = {
  onAdd?: (rec: RecommendationPayload) => void;
};

export default function RecommendationForm({ onAdd }: Props) {
  const t = useTranslations("recommendations");

  const [formData, setFormData] = useState<NewRecommendation>({
    name: "",
    stars: 5,
    message: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    message?: string;
    stars?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined }); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; message?: string; stars?: string } = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = t("error.validation.nameRequired");
    }

    if (!formData.message || formData.message.trim().length < 5) {
      newErrors.message = t("error.validation.messageRequired");
    }

    const starsValue = Number(formData.stars);
    if (isNaN(starsValue) || starsValue < 1 || starsValue > 5) {
      newErrors.stars = t("error.validation.starsRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: RecommendationPayload = {
      name: formData.name.trim(),
      stars: starsValue,
      message: {
        he: formData.message.trim(),
      },
    };

    onAdd?.(payload);
    setFormData({ name: "", stars: 5, message: "" });
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white p-6 rounded shadow space-y-4 max-w-xl mx-auto'
    >
      <h2 className='text-2xl font-bold text-green-700 text-center'>
        {t("secondaryTitle")}
      </h2>

      <div>
        <label className='block font-bold mb-1'>{t("name")}:</label>
        <input
          name='name'
          type='text'
          className='border p-2 w-full rounded'
          value={formData.name}
          onChange={handleChange}
          placeholder={t("form.namePlaceholder")}
        />
        {errors.name && (
          <p className='text-red-600 text-sm mt-1'>{errors.name}</p>
        )}
      </div>

      <div>
        <label className='block font-bold mb-1'>{t("stars")}:</label>
        <input
          name='stars'
          type='number'
          min={1}
          max={5}
          className='border p-2 w-full rounded'
          value={formData.stars}
          onChange={handleChange}
        />
        {errors.stars && (
          <p className='text-red-600 text-sm mt-1'>{errors.stars}</p>
        )}
      </div>

      <div>
        <label className='block font-bold mb-1'>{t("message")}:</label>
        <textarea
          name='message'
          rows={4}
          className='border p-2 w-full rounded'
          value={formData.message}
          onChange={handleChange}
          placeholder={t("form.messagePlaceholder")}
        />
        {errors.message && (
          <p className='text-red-600 text-sm mt-1'>{errors.message}</p>
        )}
      </div>

      <button
        type='submit'
        className='bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full'
      >
        {t("submit")}
      </button>
    </form>
  );
}
