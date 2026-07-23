import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { fetchCategories } from "../api/categories";

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error(
      "useCategories must be used inside CategoryProvider"
    );
  }

  return context;
}