import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  // Redirect the admin root to the products list (or dashboard)
  redirect("/admin/products");
}
