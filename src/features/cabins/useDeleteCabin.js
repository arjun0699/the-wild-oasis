import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: (id) => deleteCabinApi(id), // we can write deleteCabin only as well, we are inputting the same value which we are calling.
    onSuccess: () => {
      toast.success("Cabin successfully deleted");
      queryClient.invalidateQueries(["cabins"]);
    }, // this invalidates the cache on success.
    onError: (err) => toast.error(err.message), // this error is the error given by deleteCabin function
  });
  return { isDeleting, deleteCabin };
}
