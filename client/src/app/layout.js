import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import NavBar from "@/components/NavBar";
const inter = Inter({ subsets: ["latin"] });
import  "bootstrap/dist/css/bootstrap.min.css";
import AddBootstrap from "./AddBootstrap";
import Footer from "@/components/Footer";



export const metadata = {
  title: "Auctions",
  description: "Auctions application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
  <body className={inter.className}>
    <AddBootstrap />
    
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <div 
          style={{
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            backgroundColor: "#f1f4f5"  // Ensures the container fills the entire viewport height
          }}
        >
          <NavBar />

          <main style={{ flex: 1 }}>  {/* Takes up remaining space to push the footer down */}
            {children}
          </main>

          <Footer />  {/* Footer at the bottom */}
        </div>
      </ThemeProvider>
    </AppRouterCacheProvider>
  </body>
</html>

  );
}

/* 
<html lang="en">
      <body className={inter.className}>
      <AddBootstrap/>
        
      <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
              <NavBar/>
              {children}
              <Footer />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
*/