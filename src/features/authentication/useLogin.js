import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      // here we are manually setting the data in react query cache.
      // as login fetches similar data which useUser hook fetches.
      queryClient.setQueryData(["user"], user?.user);
      navigate("/dashboard", { replace: true });
    },
    onError: (err) => {
      toast.error("Provided email or password are incorrect.");
    },
  });

  return { login, isLoading };
}
