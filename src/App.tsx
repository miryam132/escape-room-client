import { AppRoutes } from "./app/router.tsx";
import Header from "./components/common/Header.tsx";

function App () {
  return (

      <div className="container">
       
        <Header/>

        <main>
        <AppRoutes />
        </main>
        

      </div>

  );
};

export default App;