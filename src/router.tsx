import { BrowserRouter, Route, Routes } from "react-router-dom";

// pages
import HomePage from "./pages/home";

const routes = [
  {
    path: "/",
    page: <HomePage />,
  },
];

const AppRouter = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Routes>
        {routes.map((route) => (
          <Route key={`${route.path}`} path={route.path} element={route.page} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
