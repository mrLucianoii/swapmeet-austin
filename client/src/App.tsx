import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ListingsPage } from "./pages/ListingsPage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { SellPage } from "./pages/SellPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/sell" element={<SellPage />} />
      </Route>
    </Routes>
  );
}
