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
    // Fetch all pages of data from SWAPI
    const fetchAllPeople = async () => {
      setLoading(true);
      let allPeople: Character[] = [];
      let nextUrl: string | null = 'https://swapi.dev/api/people/';

      try {
        while (nextUrl) {
          const response: Response = await fetch(nextUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch people');
          }
          const data = await response.json();
          allPeople = [...allPeople, ...data.results];
          nextUrl = data.next; // Update the next URL for pagination
        }
        setPeople(allPeople);
      } catch (error) {
        console.error('Error fetching people:', error);
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