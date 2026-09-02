import Banner from '../components/Banner'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'

function Home() {
    const { isLoggedIn } = useContext(AppContext);
    return (
        <div className="space-y-8 sm:space-y-12">
            <Header />
            <SpecialityMenu />
            <TopDoctors />
            {!isLoggedIn && <Banner />}
        </div>
    )
}

export default Home
