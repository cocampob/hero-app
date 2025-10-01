import { use } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FavoriteHeroContext, FavoriteHeroProvider } from './FavoriteHeroContext';
import type { Hero } from '../types/heroes.interface';


const mockHero = {
    id: '1',
    name: 'Batman',
} as Hero;

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});


const TestComponent = () => {

    const { favoriteCount, favorites, isFavorite, toggleFavorites } = use(FavoriteHeroContext);

    return (
        <div>
            <div data-testid="favorite-count">{favoriteCount}</div>

            <div data-testid="favorite-list">
                {
                    favorites.map((hero) => (
                        <div key={hero.id} data-testid={`hero-${hero.id}`} >
                            {hero.name}
                        </div>
                    ))
                }
            </div>
            <button data-testid="toggle-favorite"
                onClick={() => toggleFavorites(mockHero)}>
                Toggle Favorites
            </button>
            <div data-testid="is-favorite">
                {isFavorite(mockHero).toString()}
            </div>
        </div>
    );
};

const renderContextTest = () => {

    return render(
        <FavoriteHeroProvider>
            <TestComponent />
        </FavoriteHeroProvider>
    )
}

describe('FavoriteHeroContext', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should initialize with default values', () => {
        renderContextTest();
        // screen.debug();
        // console.log(localStorage);

        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('favorite-list').children.length).toBe(0);
    });

    test('should add hero to favorites when toggleFavorite is called when new hero is add ', () => {
        //  console.log(localStorage);
        renderContextTest()
        const button = screen.getByTestId('toggle-favorite');

        fireEvent.click(button);
        // screen.debug();

        // console.log(localStorage.getItem('favorites'));
        expect(screen.getByTestId('is-favorite').textContent).toBe('true');
        expect(screen.getByTestId('favorite-count').textContent).toBe('1')
        expect(screen.getByTestId('hero-1').textContent).toBe('Batman');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites',
            '[{"id":"1","name":"Batman"}]'
        );
        // expect(localStorage.getItem('favorites')).toBe('[{"id":"1","name":"Batman"}]');
    });

    test('should remove hero from favorites when toggleFavorite is called  ', () => {
        localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));

        // console.log(localStorage.getItem('favorites'));
        renderContextTest()
        // screen.debug();
        expect(screen.getByTestId('favorite-count').textContent).toBe('1')
        expect(screen.getByTestId('is-favorite').textContent).toBe('true');
        expect(screen.getByTestId('hero-1').textContent).toBe('Batman');

        const button = screen.getByTestId('toggle-favorite');

        fireEvent.click(button);
        // screen.debug();

        // console.log(localStorage.getItem('favorites'));
        expect(screen.getByTestId('favorite-count').textContent).toBe('0')
        expect(screen.getByTestId('is-favorite').textContent).toBe('false');
        expect(screen.queryByTestId('hero-1')).toBeNull();

        expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', '[]');
    });


})
