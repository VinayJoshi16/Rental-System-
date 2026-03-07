const API_URL = import.meta.env.VITE_API_URL || "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => "");
  if (!res.ok) {
    const msg =
      typeof data === "object" && data
        ? ((data as any).error || (data as any).message)
        : "";
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchApi<{ user: ApiUser; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (email: string, password: string, fullName: string) =>
      fetchApi<{ user: ApiUser; token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName }),
      }),
    me: () => fetchApi<ApiUser>("/auth/me"),
    isAdmin: () => fetchApi<{ isAdmin: boolean }>("/auth/is-admin"),
  },
  plans: {
    upgrade: (plan: "pro" | "premium") =>
      fetchApi<{ success: boolean; plan: string }>("/plans/upgrade", {
        method: "POST",
        body: JSON.stringify({ plan }),
      }),
  },
  admin: {
    signup: (email: string, password: string, fullName: string, adminCode: string) =>
      fetchApi<{ user: ApiUser; token: string }>("/admin/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName, adminCode }),
      }),
    stats: () =>
      fetchApi<{ totalBikes: number; activeRentals: number; totalUsers: number }>(
        "/admin/stats"
      ),
  },
  bikes: {
    list: () => fetchApi<ApiBike[]>("/bikes"),
    create: (data: Partial<ApiBike>) =>
      fetchApi<ApiBike>("/bikes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  rentals: {
    list: () => fetchApi<ApiRental[]>("/rentals"),
    create: (bikeId: string, aadharCard?: string, licenseNumber?: string) =>
      fetchApi<ApiRental>("/rentals", {
        method: "POST",
        body: JSON.stringify({
          bike_id: bikeId,
          aadhar_card: aadharCard || undefined,
          license_number: licenseNumber || undefined,
        }),
      }),
    return: (rentalId: string) =>
      fetchApi<{ totalCost: number }>(`/rentals/${rentalId}/return`, {
        method: "PATCH",
      }),
  },
};

export interface ApiUser {
  id: string;
  email: string;
  plan?: "basic" | "pro" | "premium";
  user_metadata?: { full_name?: string | null };
}

export interface ApiBike {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  hourly_rate: number;
  image_url?: string | null;
  location?: string | null;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ApiRental {
  id: string;
  user_id: string;
  bike_id: string;
  status: string;
  start_time: string;
  end_time?: string | null;
  total_cost?: number | null;
  created_at?: string | null;
  bikes?: ApiBike;
}
