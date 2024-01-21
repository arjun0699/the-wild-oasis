import supabase from "./supabase";

export async function createGuests(guest, booking) {
  const { data, error } = await supabase
    .from("guests")
    .insert([guest])
    .select();
  if (error) {
    throw new Error("There was some error in creation of guest.");
  }

  const guestData = data.at(0);

  const { data: bookingData, error: bookingError } = await supabase
    .from("bookings")
    .insert([{ ...booking, guestId: Number(guestData.id) }])
    .select();

  if (bookingError) {
    throw new Error("There was some error in creation of booking.");
  }

  console.log(bookingData);

  return bookingData;
}
