import { Planet } from '@/types/interfaces';

export const fetchPlanet = async (planetUrl: string): Promise<Planet | null> => {
  try {
    const response = await fetch(planetUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch planet details');
    }
    const planetData = await response.json();
    return planetData; // Return the planet object
  } catch (error) {
    console.error('Error fetching planet:', error);
    return null; // Return null if there's an error
  }
};

export const fetchPlanets = async (url: string): Promise<Planet[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results; // Return the array of planets
  } catch (error) {
    console.error('Error fetching planets:', error);
    return []; // Return an empty array if there's an error
  }
}

export const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-'); // Replace spaces with hyphens
};