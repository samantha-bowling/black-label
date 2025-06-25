
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const Admin = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-authenticated users to auth
    if (!user) {
      navigate('/auth');
      return;
    }

    // Redirect non-admin users to dashboard
    if (user && !isAdmin()) {
      navigate('/dashboard');
      return;
    }
  }, [user, isAdmin, navigate]);

  // Show admin dashboard if user is admin
  if (user && isAdmin()) {
    return <AdminDashboard />;
  }

  return null;
};

export default Admin;
