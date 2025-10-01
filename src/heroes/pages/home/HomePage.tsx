import { use, useMemo } from 'react';
import { useSearchParams } from 'react-router';


import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';
import { useHeroSummary } from '@/heroes/hooks/useHeroSummary';
import { usePaginatedHero } from '@/heroes/hooks/usePaginatedHero';
import { FavoriteHeroContext } from '@/heroes/context/FavoriteHeroContext';
// import { HeroesResponse } from '../../types/get-heroes.response';


export const HomePage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { favoriteCount, favorites } = use(FavoriteHeroContext)


    const activeTab = searchParams.get('tab') ?? 'all';
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '6';
    const category = searchParams.get('category') ?? 'all';

    const selectedTab = useMemo(() => {
        const validTabs = ['all', 'favorites', 'heroes', 'villains'];
        return validTabs.includes(activeTab) ? activeTab : 'all'
    }, [activeTab]);

    const { data: heroesResponse } = usePaginatedHero(+page, +limit, category)



    // const { data: heroesResponse } = useQuery({ // se utiliza siempre para realizar peticiones http
    //     queryKey: ['heroes', { page, limit }],
    //     queryFn: () => getHeroesByPageAction(+page, +limit),
    //     staleTime: 1000 * 60 * 5, // 5 minutos
    // });

    // const { data: summary } = useQuery({
    //     queryKey: ['summary-information'],
    //     queryFn: getSummaryAction,
    //     staleTime: 1000 * 60 * 5, // 5 minutos
    // });

    const { data: summary } = useHeroSummary();

    return (
        <>
            <>

                {/* Header */}
                <CustomJumbotron
                    title="Universo de SuperHéroes"
                    description="Descubre, explora y admibistra super héroes y villanos" />
                {/* Stats Dashboard */}
                <CustomBreadcrumbs currentPage="Super Héroes" />
                <HeroStats />




                {/* Tabs */}
                <Tabs value={selectedTab} className="mb-8">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger
                            value="all"
                            onClick={() =>
                                setSearchParams((prev) => {
                                    prev.set('tab', 'all');
                                    prev.set('category', 'all');
                                    prev.set('page', '1');
                                    return prev;
                                })
                            }
                        >All Characters ({summary?.totalHeroes})</TabsTrigger>
                        <TabsTrigger value="favorites" onClick={() =>
                            setSearchParams((prev) => {
                                prev.set('tab', 'favorites');
                                return prev;
                            })} className="flex items-center gap-2">
                            Favorites ({favoriteCount})
                        </TabsTrigger>
                        <TabsTrigger value="heroes" onClick={() =>
                            setSearchParams((prev) => {
                                prev.set('tab', 'heroes');
                                prev.set('category', 'hero');
                                prev.set('page', '1');
                                return prev;
                            })}>Heroes ({summary?.heroCount})</TabsTrigger>
                        <TabsTrigger value="villains" onClick={() =>
                            setSearchParams((prev) => {
                                prev.set('tab', 'villains');
                                prev.set('category', 'villain');
                                prev.set('page', '1');
                                return prev;
                            })}>Villains ({summary?.villainCount})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        {/*monstrar todos los personajes */}
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                    <TabsContent value="favorites">
                        <HeroGrid heroes={favorites} />
                    </TabsContent>
                    <TabsContent value="heroes">
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                    <TabsContent value="villains">
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                </Tabs>


                {/* Character Grid */}


                {/* Pagination */}
                {selectedTab !== 'favorites' && (
                    <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
                )}
            </>
        </>
    )
}
