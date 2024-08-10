import NavBar from '@/components/NavBar'
import Loading from './loading'
import InputChat from '@/components/InputChat'


const Layout = ({children}: {children: React.ReactNode}) => {
    
    return(
        
        <main className="root">
          
            <div className="root-container">
        
                <div className="wrapper">
            
                {children}
                
           
                </div>
       
            </div>
        </main>
        
    )
}

export default Layout
