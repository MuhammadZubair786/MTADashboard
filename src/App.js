import { Toaster } from "react-hot-toast";
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import { Provider, useDispatch } from "react-redux";
import { useEffect } from 'react';

import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import './style.css';
import store from './store/store';

import { getUsers } from './service/user.service';
import { setusersList } from './store/reducers/userReducer';

// ----------------------------------------------------------------------

export default function App() {
  // const user = useSelector((state) => state.userListState);
  // const dispatch = useDispatch()
  // const getdata = async () => {
  //   const resp = await getUsers();
  //   dispatch(setusersList(resp.data))
  // }
  // useEffect(()=>{
  //   getdata()
  // },[])
  return (
    <Provider store={store}>
    
      <HelmetProvider>
      <Toaster />
        <BrowserRouter>
    
          <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <Router />
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}
