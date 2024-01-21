import { useMutation } from "@tanstack/react-query";
import { createGuests } from "../../services/apiGuests";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCreateGuest() {
  const navigate = useNavigate();
  const { mutate: createGuest, isLoading: isGuestCreating } = useMutation({
    mutationFn: ({ guest, booking }) => createGuests(guest, booking),
    onSuccess: ([booking]) => {
      toast.success("Booking  succesfull");
      navigate(`/bookings/${booking.id}`);
    },
  });

  return { createGuest, isGuestCreating };
}
