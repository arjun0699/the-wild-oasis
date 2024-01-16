import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { isLoading: isCheckingOut, mutate: checkout } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),
    onSuccess: (data) => {
      // data is same data returned by updateBooking api.
      toast.success(`Booking #${data.id} succesfully checked out`);
      //setting active as true , invalidates all the active quries on the current page
      queryClient.invalidateQueries({ active: true });
    },
    onError: () => {
      toast.error("There was an error while checking out");
    },
  });
  return { checkout, isCheckingOut };
}
