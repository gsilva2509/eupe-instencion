import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotificationHistory from "./pages/NotificationHistory";
import ProductsCatalog from "./pages/ProductsCatalog";
import ProductDetail from "./pages/ProductDetail";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import CancelOrder from "./pages/CancelOrder";
import AddProduct from "./pages/AddProduct";
import Chat from "./pages/Chat";
import FAQ from "./pages/FAQ";

function Router() {
  return (
    <Switch>
      <Route path={"/?from_webdev=1"} component={Home} />
      <Route path={"/"} component={Home} />
      <Route path={"/catalogo"} component={ProductsCatalog} />
      <Route path="/produto/:id" component={ProductDetail} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/perfil" component={UserProfile} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/pedidos" component={OrderHistory} />
      <Route path="/cancelar-pedido" component={CancelOrder} />
      <Route path="/add-product" component={AddProduct} />
      <Route path="/chat" component={Chat} />
      <Route path="/faq" component={FAQ} />
      <Route path="/notification-history" component={NotificationHistory} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
