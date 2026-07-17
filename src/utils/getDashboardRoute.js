export const getDashboardRoute = (role) => {

    switch (role?.toLowerCase()) {

        case "admin":
            return "/admin-dashboard";

        case "manager":
            return "/manager-dashboard";

        case "cashier":
            return "/cashier-dashboard";

        case "inventory staff":
            return "/inventory-dashboard";

        default:
            return "/admin-dashboard";
    }

};