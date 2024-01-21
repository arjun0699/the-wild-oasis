import { useMutation } from "@tanstack/react-query";
import { createBooking as createBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCreateBooking() {
  const navigate = useNavigate();
  const { mutate: createBooking, isLoading: isCreatingBooking } = useMutation({
    mutationFn: ({ guest, booking }) => createBookingApi(guest, booking),
    onSuccess: ([booking]) => {
      toast.success("Booking  succesfull");
      navigate(`/bookings/${booking.id}`);
    },
  });

  return { createBooking, isCreatingBooking };
}
