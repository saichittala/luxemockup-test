"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { Mockup, getMockups, saveMockups } from '@/data/mockups';

interface MockupContextType {
  mockups: Mockup[];
  addMockup: (mockup: Mockup) => void;
  updateMockup: (slug: string, mockup: Mockup) => void;
  deleteMockup: (slug: string) => void;
  loading: boolean;
}

const MockupContext = createContext<MockupContextType | undefined>(undefined);

export function MockupProvider({ children }: { children: React.ReactNode }) {
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mockups on component mount
    setLoading(true);
    const loadedMockups = getMockups();
    setMockups(loadedMockups);
    setLoading(false);
  }, []);

const addMockup = (mockup: Mockup) => {
  const updatedMockups = [...mockups, mockup];
  setMockups(updatedMockups);
  saveMockups(updatedMockups);
};

const updateMockup = (slug: string, mockup: Mockup) => {
  const updatedMockups = mockups.map(m => m.slug === slug ? mockup : m);
  setMockups(updatedMockups);
  saveMockups(updatedMockups);
};

const deleteMockup = (slug: string) => {
  const updatedMockups = mockups.filter(m => m.slug !== slug);
  setMockups(updatedMockups);
  saveMockups(updatedMockups);
};
  return (
    <MockupContext.Provider value={{ 
      mockups, 
      addMockup, 
      updateMockup, 
      deleteMockup,
      loading 
    }}>
      {children}
    </MockupContext.Provider>
  );
}

export function useMockups() {
  const context = useContext(MockupContext);
  if (context === undefined) {
    throw new Error('useMockups must be used within a MockupProvider');
  }
  return context;
}
