import React from 'react';
import './Layout.scss';
import { Outlet } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';

function Layout() {
  return (
    <div className="layout-container">
      <Header />

      <main className="layout-main">
        <section className="layout-section">
          <Outlet />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
