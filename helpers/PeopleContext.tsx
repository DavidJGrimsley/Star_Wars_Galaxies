import React, { createContext, useState, useEffect, useContext } from 'react';
import { Character } from '@/types/interfaces';

interface PeopleContextType {
  people: Character[];
  loading: boolean;
}

// Create the context
const PeopleContext = createContext<PeopleContextType>({ people: [], loading: false });

// Provider component
export const PeopleProvider = ({ children }: { children: React.ReactNode }) => {
  const [people, setPeople] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all people from Express backend
    const fetchAllPeople = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/people');
        if (!response.ok) {
          throw new Error('Failed to fetch people');
        }
        const allPeople = await response.json();
        setPeople(allPeople);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchAllPeople();
  }, []);

  return (
    <PeopleContext.Provider value={{ people, loading }}>
      {children}
    </PeopleContext.Provider>
  );
};

// Custom hook to use the PeopleContext
export const usePeople = () => useContext(PeopleContext);