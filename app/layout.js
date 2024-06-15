"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from "react-redux";
import MainLayout from "@/components/MainLayout";
import { store } from "@/redux/store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body className={inter.className} >
        <Provider store= {store}>
          <MainLayout layout={children} />
        </Provider>
      </body>
    </html>
  );
}
