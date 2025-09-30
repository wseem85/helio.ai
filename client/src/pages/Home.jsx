import React from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/Sidebar';
import Hero from '../components/Hero';
import OurAiTools from '../components/OurAiTools';
import { Testimonial } from '../components/Testimonial';
import Plans from '../components/Plans';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <div className="max-w-6xl mx-auto">
        <OurAiTools />
        <Testimonial />
        <Plans />
      </div>
    </div>
  );
};

export default Home;
