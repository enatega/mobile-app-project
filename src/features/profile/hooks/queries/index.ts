import { useQuery } from "@tanstack/react-query";
import { fetchRiderProfile } from "../../services";
import { RiderProfile } from "../../types";

export const useFetchRiderProfile = () => {
    return useQuery<RiderProfile, Error>({
        queryKey: ["profile"],
        queryFn: fetchRiderProfile,
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
    })
}