import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query';
import { backend } from "declarations/backend";

export const  useCreateCard=()=>{
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({id,content,x,y }) => {
      console.log("creating card...");
      const response = await backend.createCard(id,content,x,y);
      return response;
    },
    onSuccess: () => {
      console.log(" successfully!");
      queryClient.invalidateQueries({ queryKey: ['getAllCards'] });
    },
    onError: (error) => {
      console.error("Failed", error);
    },
  });

  return mutation;
}
export function useGetAllCards() {
   
    return useQuery({
        queryKey: ['getAllCards'],
        queryFn: async () => {
           
            return await backend.getAllCards();
        },
        refetchInterval: 5000,
    });
}
export function useUpdateCardPosition() {
 console.log("creating update...");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, x, y }) => {
      console.log("creating carttttttd...");
      return await backend.updateCardPosition(id, x, y);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllCards'] });
    },
  });
}
export function useDeleteCard() {
  const queryClient = useQueryClient();
console.log("deleting")
  return useMutation({
    mutationFn: async (id) => {
console.log("deleting",id)
      return await backend.deleteCard(id);
    },
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['getAllCards'] });
    },
     onError: (error) => {
      console.error("Failed to delete todo:", error);
    },
  });
}





