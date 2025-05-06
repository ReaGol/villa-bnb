interface BookingParams {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
}

export function calculatePrice({
  checkIn,
  checkOut,
  adults,
  children,
}: BookingParams): { totalPrice: number; nights: number; discount: string } {
  const totalGuests = adults + children;

  if (totalGuests > 6) {
    throw new Error("תפוסה מירבית היא 6 אנשים.");
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const nights = Math.round(
    Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay)
  );

  let pricePerNight = 70; 

  if (totalGuests <= 2) {
    pricePerNight = 70;
  } else if (totalGuests <= 4) {
    pricePerNight = 140;
  } else {
    pricePerNight = 170;
  }

  let totalPrice = nights * pricePerNight;


  let discount = "ללא הנחה";

  if (nights > 30) {
    totalPrice *= 0.7;
    discount = "30% הנחה (שהייה מעל חודש)";
  } else if (nights > 14) {
    totalPrice *= 0.8;
    discount = "20% הנחה (שהייה מעל שבועיים)";
  } else if (nights > 7) {
    totalPrice *= 0.9;
    discount = "10% הנחה (שהייה מעל שבוע)";
  }


  totalPrice = Math.round(totalPrice * 100) / 100;

  return { totalPrice, nights, discount };
}
