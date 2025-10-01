import { useSearchParams } from 'react-router';
import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { SearchControls } from './ui/SearchControls';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { useQuery } from '@tanstack/react-query';
import { searchHeroAction } from '@/heroes/actions/search-heros.action';


export const SearchPage = () => {

    const [searchParams] = useSearchParams()

    const name = searchParams.get('name') ?? undefined;
    const strength = searchParams.get('strength') ?? undefined;

    const { data: searchHeroes = [] } = useQuery({
        queryKey: ['search', { name, strength }],
        queryFn: () => searchHeroAction({ name, strength }),
        staleTime: 100 * 60 * 5, // 5 minutos
    })

    return (
        <>

            <CustomJumbotron
                title="Búsqueda de SuperHéroes"
                description="Descubre, explora y admibistra super héroes y villanos" />

            {/* Stats Dashboard */}
            <CustomBreadcrumbs currentPage='Buscar Héroe' breadcrumbs={[
                // { label: 'Home1', to: '/' },
                // { label: 'Home2', to: '/' },
                // { label: 'Home3', to: '/' },
            ]} />
            <HeroStats />

            {/* Filter and search */}
            <SearchControls />

            {/* */}
            <HeroGrid heroes={searchHeroes} />
        </>
    )
}

export default SearchPage