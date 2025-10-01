import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { HomePage } from './HomePage';
import { MemoryRouter } from 'react-router';
import { usePaginatedHero } from '@/heroes/hooks/usePaginatedHero';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoriteHeroProvider } from '@/heroes/context/FavoriteHeroContext';

vi.mock('@/heroes/hooks/usePaginatedHero');



const mockUsePaginateHero = vi.mocked(usePaginatedHero);

mockUsePaginateHero.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    isSuccess: true,
} as unknown as ReturnType<typeof usePaginatedHero>);

const queryClient = new QueryClient();

const renderHomePage = (initialEntries: string[] = ['/']) => {

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <FavoriteHeroProvider>
                <QueryClientProvider client={queryClient}>
                    <HomePage />
                </QueryClientProvider>
            </FavoriteHeroProvider>
        </MemoryRouter>
    )
}


describe('HomePage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render HomePage with default values', () => {
        const { container } = renderHomePage()
        // screen.debug();
        expect(container).toMatchSnapshot();
    });

    test('should call usePaginatedHero with default values', () => {
        renderHomePage();
        // screen.debug()
        expect(mockUsePaginateHero).toHaveBeenCalledWith(1, 6, 'all');
    });

    test('should call usePaginatedHero with custom query params', () => {
        renderHomePage(['/?page=2&limit=10&category=villains']);

        expect(mockUsePaginateHero).toHaveBeenCalledWith(2, 10, 'villains');
    });

    test('should called usePaginatedHero with default page and same limit on tab clicked', () => {
        renderHomePage(['/?tab=favorites&page=2&limit=10']);
        const [, , , villainsTab] = screen.getAllByRole('tab');
        // screen.debug(villainsTab);
        fireEvent.click(villainsTab);
        expect(mockUsePaginateHero).toHaveBeenCalledWith(1, 10, 'villain');
    });


});
