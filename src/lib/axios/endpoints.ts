export const API = {
    auth: {
      login: "/auth/login",
      register: "/auth/register",
    },
    orders: {
      list: "/orders",
      detail: (id: string) => `/orders/${id}`,
    },
    inventory: {
      list: "/inventory",
    },
    profile: {
      user: "/api/v1/users",
      updatePassword: "/api/v1/users/password",
    }
  };
  