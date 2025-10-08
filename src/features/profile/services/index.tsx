import { API, client } from "@/src/lib/axios";
import { RiderProfile } from "../types";

export const fetchRiderProfile = async (): Promise<RiderProfile> => {
  const response = await client.get(API.profile.user);
  return response.data;
};
