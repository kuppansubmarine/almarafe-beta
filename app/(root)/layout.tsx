import NavBar from '@/components/NavBar'
import Loading from './loading'


const Layout = ({children}: {children: React.ReactNode}) => {
    return(
        <main className="root">
           
            <div className="root-container">
                <div className="wrapper">
                <NavBar/>
            
                {children}
           
                </div>
            </div>
        </main>
    )
}

export default Layout