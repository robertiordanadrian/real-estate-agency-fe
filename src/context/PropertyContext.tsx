import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import type { IProperty } from "../common/interfaces/property.interface";
import { useAuth } from "../auth/AuthContext";

interface PropertyContextType {
  properties: IProperty[];
  loading: boolean;
  fetchProperties: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined
);

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useProperties must be used within PropertyProvider");
  }
  return context;
};

export const PropertyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProperties = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.get<IProperty[]>("/properties");
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const value = {
    properties,
    loading,
    fetchProperties,
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};
