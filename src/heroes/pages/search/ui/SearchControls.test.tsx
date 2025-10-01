import { describe, expect, test } from 'vitest';
import { MemoryRouter } from 'react-router';
import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchControls } from './SearchControls';

if (typeof window.ResizeObserver === 'undefined') {
    class ResizeObserver {
        observe() { }
        unobserve() { }
        disconnect() { }
    }
    window.ResizeObserver = ResizeObserver;
}

const queryClient = new QueryClient();
const renderSearchControl = (initialEntries: string[] = ['/']) => {

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <QueryClientProvider client={queryClient}>
                <SearchControls />
            </QueryClientProvider>
        </MemoryRouter>
    )
}

describe('SearchControls', () => {
    test('should render SearchControl with default values', () => {
        const { container } = renderSearchControl();

        expect(container).toMatchSnapshot();
        //   screen.debug()
    });

    test('should set input vale when search param name is set', () => {
        renderSearchControl(['/?name=Batman']);
        const input = screen.getByPlaceholderText('Search heroes, villains, powers, teams...');

        // screen.debug(input);
        expect(input.getAttribute('value')).toBe('Batman');
    });


    test('should change params when input is changed and enter is pressed', () => {
        renderSearchControl(['/?name=Batman']);
        const input = screen.getByPlaceholderText('Search heroes, villains, powers, teams...');
        expect(input.getAttribute('value')).toBe('Batman');

        // screen.debug(input);

        fireEvent.change(input, { target: { value: 'Superman' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(input.getAttribute('value')).toBe('Superman');
        //   screen.debug(input);
    });


    test('should change params strength when slider change', () => {

        renderSearchControl(['/?name=Batman&active-accordion=advance-filters']);

        const slider = screen.getByRole('slider');
        expect(slider.getAttribute('aria-valuenow')).toBe('0');

        // screen.debug(slider);

        fireEvent.keyDown(slider, { key: 'ArrowRight' });
        expect(slider.getAttribute('aria-valuenow')).toBe('1');
        //   screen.debug(slider);

    });


    test('should accordion be open when active-accordion param is set', () => {
        renderSearchControl(['/?name=Batman&active-accordion=advance-filters']);

        const accordion = screen.getByTestId('accordion');
        const accordionItem = accordion.querySelector('div');
        expect(accordionItem?.getAttribute('data-state')).toBe('open');
    });

    test('should accordion be close when active-accordion param is not set', () => {
        renderSearchControl(['/?name=Batman']);

        const accordion = screen.getByTestId('accordion');
        const accordionItem = accordion.querySelector('div');
        expect(accordionItem?.getAttribute('data-state')).toBe('closed');
    });
});