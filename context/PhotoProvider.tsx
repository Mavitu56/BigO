import React from 'react';
import { createContext, useContext, useState } from "react";
import { PhotoFile } from "react-native-vision-camera";

interface PhotoContextType {
  photo: PhotoFile | null;
  setPhoto: React.Dispatch<React.SetStateAction<PhotoFile | null>>;
}

const PhotoContext = createContext<PhotoContextType | null>(null);

function PhotoProvider({ children }: { children: React.ReactNode }) {
  const [photo, setPhoto] = useState<PhotoFile | null>(null);

  return (
    <PhotoContext.Provider value={{ photo, setPhoto }}>
      {children}
    </PhotoContext.Provider>
  );
}

function usePhoto() {
  const data = useContext(PhotoContext);
  return data;
}

export { PhotoProvider, usePhoto };
export type { PhotoContextType };
