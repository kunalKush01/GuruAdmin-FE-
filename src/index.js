// ** React Imports
import { Suspense, lazy } from "react";
import ReactDOM from "react-dom";

// ** Redux Imports
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";

// ** Intl & ThemeColors Context
import { ToastContainer } from "react-toastify";
import { ThemeContext } from "./utility/context/ThemeColors";

// ** Spinner (Splash Screen)
import Spinner from "./@core/components/spinner/Fallback-spinner";

// ** Ripple Button
import "./@core/components/ripple-button";

// ** PrismJS
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx.min";

// ** React Perfect Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";

// ** React Toastify
import "@styles/react/libs/toastify/toastify.scss";

// ** Core styles
import "./@core/assets/fonts/feather/iconfont.css";
import "./@core/scss/core.scss";
import "./assets/scss/style.scss";
import { PersistGate } from "redux-persist/integration/react";
// ** Service Worker
import * as serviceWorker from "./serviceWorker";
import "./configs/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// ** Lazy load app
const LazyApp = lazy(() => import("./App"));
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Suspense fallback={<Spinner />}>
        <ThemeContext>
          <QueryClientProvider client={queryClient}>
            <LazyApp />
            <ReactQueryDevtools />
          </QueryClientProvider>
          <ToastContainer newestOnTop />
        </ThemeContext>
      </Suspense>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
