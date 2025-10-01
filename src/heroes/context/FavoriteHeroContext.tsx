import { createContext, useEffect, useState, type PropsWithChildren } from 'react';
import type { Hero } from '../types/heroes.interface';

interface FavoriteHeroContext {
    // State
    favorites: Hero[];
    favoriteCount: number;

    //Method
    isFavorite: (hero: Hero) => boolean;
    toggleFavorites: (hero: Hero) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FavoriteHeroContext = createContext({} as FavoriteHeroContext);


const getFavoritesFromLocalStorage = (): Hero[] => {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

export const FavoriteHeroProvider = ({ children }: PropsWithChildren) => {

    const [favorites, setFavorites] = useState<Hero[]>(getFavoritesFromLocalStorage());


    const toggleFavorites = (hero: Hero) => {
        const heroExist = favorites.find((h) => h.id === hero.id);

        if (heroExist) {
            const newFavorite = favorites.filter((h) => h.id !== hero.id);
            setFavorites(newFavorite);
            return;
        }
        setFavorites([...favorites, hero]);
    };

    const IsFavorite = (hero: Hero) => {
        return favorites.some((h) => h.id === hero.id);
    }

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites])

    return (
        <FavoriteHeroContext
            value={{
                //State
                favorites: favorites,
                favoriteCount: favorites.length,
                // Method
                isFavorite: IsFavorite,
                toggleFavorites: toggleFavorites,
            }}
        >
            {children}
        </FavoriteHeroContext>
    )
}
