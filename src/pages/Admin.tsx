
import { useAuth } from "@/hooks/useAuth";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const Admin = () => {
  const { user } = useAuth();
  const { canAccessAdmin } = useRoleAccess();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-authenticated users to auth
    if (!user) {
      navigate('/auth');
      return;
    }

    // Redirect non-admin users to dashboard
    if (user && !canAccessAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, canAccessAdmin, navigate]);

  // Show admin dashboard if user has admin access
  if (user && canAccessAdmin) {
    return <AdminDashboard />;
  }

  return null;
};

export default Admin;
