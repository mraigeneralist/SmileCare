"use client";

import React from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Contact = {
  id: string;
  name: string;
  phone: string;
};

export default function AdminPage() {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      router.push("/login");
    } else {
      fetchContacts();
    }
  }

  async function fetchContacts() {
    const { data, error } = await supabase
        .from("contact")
        .select("*");

    if (data) {
        setContacts(data as Contact[]);
    }
  }

  return (
    <main className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Leads</h1>

      <div className="space-y-4">
        {contacts.map((item: any) => (
          <div
            key={item.id}
            className="bg-gray-900 p-4 rounded-lg flex justify-between"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-400">{item.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}