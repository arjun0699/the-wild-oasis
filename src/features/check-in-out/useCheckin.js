import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading: isCheckingIn, mutate: checkin } = useMutation({
    mutationFn: ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        isPaid: true,
        status: "checked-in",
        ...breakfast,
      }),
    onSuccess: (data) => {
      // data is same data returned by updateBooking api.
      toast.success(`Booking #${data.id} succesfully checked in`);
      //setting active as true , invalidates all the active quries on the current page
      queryClient.invalidateQueries({ active: true });
      navigate("/");
    },
    onError: () => {
      toast.error("There was an error while checking in");
    },
  });
  return { checkin, isCheckingIn };
}
