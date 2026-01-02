import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Try to fetch profile (handle both table names for compatibility)
  let profile = null;
  
  // First try 'profiles' table
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  
  if (profileData) {
    profile = profileData;
  } else {
    // Fallback to 'user_profiles' table
    const { data: userProfileData } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = userProfileData;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* Main content area - adjust padding for sidebar */}
      <div className="lg:pl-64 transition-all duration-300">
        <Header user={user} profile={profile} />
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
