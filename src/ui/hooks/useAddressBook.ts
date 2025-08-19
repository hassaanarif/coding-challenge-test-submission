import { Address } from "@/types";
import React from "react";
import { addAddress, removeAddress, selectAddress, updateAddresses } from "../../core/reducers/addressBookSlice";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";

import transformAddress, { RawAddressModel } from "../../core/models/address";
import databaseService from "../../core/services/databaseService";

export default function useAddressBook() {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddress);
  const [loading, setLoading] = React.useState(true);
  const [hasLoadedInitialData, setHasLoadedInitialData] = React.useState(false);

  // Update database whenever addresses change
  React.useEffect(() => {
    // Only update database if we've loaded initial data and we're not in loading state
    // This prevents overwriting the database with an empty array during initial load
    if (loading === false && hasLoadedInitialData) {
      const updateDB = async () => {
        try {
          await databaseService.setItem("addresses", addresses);
        } catch (error) {
          console.error("Failed to update database:", error);
        }
      };
      updateDB();
    }
  }, [addresses, loading, hasLoadedInitialData]);

  return {
    /** Add address to the redux store */
    addAddress: (address: Address) => {
      dispatch(addAddress(address));
      // Database will be updated automatically via useEffect
    },
    /** Remove address by ID from the redux store */
    removeAddress: (id: string) => {
      dispatch(removeAddress(id));
      // Database will be updated automatically via useEffect
    },
    /** Loads saved addresses from the indexedDB */
    loadSavedAddresses: async () => {
      const saved: RawAddressModel[] | null = await databaseService.getItem("addresses");
      // No saved item found, exit this function
      if (!saved || !Array.isArray(saved)) {
        setLoading(false);
        setHasLoadedInitialData(true);
        return;
      }
      dispatch(updateAddresses(saved.map((address) => transformAddress(address))));
      setLoading(false);
      setHasLoadedInitialData(true);
    },
    loading,
  };
}
