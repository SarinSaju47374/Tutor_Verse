import { RouterProvider } from 'react-router-dom';

import router from "./Routes/router.jsx"

function App() {
  return (
    <>

      <RouterProvider router={router} />

    </>
  )
}

export default App
