"use client";
import React from "react";
export default function Home() {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  return (
    <main className="bg-black text-white min-h-screen">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Smart Gym</h1>
        
        <div className="space-x-6">
          <a href="#" className="hover:text-gray-400">Home</a>
          <a href="#" className="hover:text-gray-400">About</a>
          <a href="#" className="hover:text-gray-400">Contact</a>
        </div>
      </nav>
      {/* Hero Section */}
      <div 
        className="relative h-[80vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('/gym.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 px-4">

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Transform Your Body 💪
          </h1>

          <p className="text-gray-300 max-w-xl mx-auto mb-8">
            Join Smart Gym & Fitness Center in Avadi. Build strength, lose fat, and become your best version.
          </p>

          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition">
            Join Now
          </button>

        </div>

      </div>
      {/* Programs Section */}
      <section className="py-16 px-6 bg-black text-white">

        <h2 className="text-3xl font-bold text-center mb-12">
          Our Programs
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">Weight Training</h3>
            <p className="text-gray-400">
              Build muscle and strength with modern equipment.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">Cardio Training</h3>
            <p className="text-gray-400">
              Improve endurance and burn calories effectively.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">Personal Training</h3>
            <p className="text-gray-400">
              Get personalized workout plans from expert trainers.
            </p>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-16 px-6 bg-gray-950 text-white">

        <h2 className="text-3xl font-bold text-center mb-12">
          Membership Plans
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Basic Plan */}
          <div className="bg-black p-6 rounded-xl border border-gray-800 text-center">
            <h3 className="text-xl font-semibold mb-4">Basic</h3>
            <p className="text-3xl font-bold mb-4">₹999/month</p>
            <p className="text-gray-400 mb-6">
              Access to gym equipment and cardio section.
            </p>
            <button className="bg-white text-black px-5 py-2 rounded-full">
              Join Now
            </button>
          </div>

          {/* Standard Plan */}
          <div className="bg-white text-black p-6 rounded-xl text-center scale-105">
            <h3 className="text-xl font-semibold mb-4">Standard</h3>
            <p className="text-3xl font-bold mb-4">₹1499/month</p>
            <p className="mb-6">
              Includes weight training + cardio + group classes.
            </p>
            <button className="bg-black text-white px-5 py-2 rounded-full">
              Join Now
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-black p-6 rounded-xl border border-gray-800 text-center">
            <h3 className="text-xl font-semibold mb-4">Premium</h3>
            <p className="text-3xl font-bold mb-4">₹2499/month</p>
            <p className="text-gray-400 mb-6">
              Personal trainer + diet plan + full access.
            </p>
            <button className="bg-white text-black px-5 py-2 rounded-full">
              Join Now
            </button>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section className="py-16 px-6 bg-black text-white text-center">

        <h2 className="text-3xl font-bold mb-6">
          Contact Us
        </h2>

        <p className="text-gray-400 mb-8">
          Ready to transform your body? Reach out now!
        </p>

        <div className="flex flex-col items-center gap-4">

          <input 
            type="text" 
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full max-w-md p-3 rounded-lg bg-gray-900 border border-gray-700"
          />

          <input 
            type="text" 
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full max-w-md p-3 rounded-lg bg-gray-900 border border-gray-700"
          />

          <button 
            onClick={async () => {

              if (!name || !phone) {
                setMessage("Please fill all fields");
                return;
              }

              const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name,
                  phone,
                }),
              });

              const data = await res.json();

              if (data.success) {
                setMessage("✅ Message sent successfully!");
                setName("");
                setPhone("");

                const whatsappNumber = "917200039437"; // replace with gym number

                const whatsappMessage = `Hello, my name is ${name}. I want to join Smart Gym. My phone number is ${phone}`;

                const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

                window.open(url, "_blank");
              } else {
                setMessage("❌ Something went wrong");
              }
            }}
            className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
          >
            Send Message
          </button>

          {message && (
            <p className="mt-4 text-sm text-gray-300">
              {message}
            </p>
          )}

        </div>

      </section>
    </main>
  );
}