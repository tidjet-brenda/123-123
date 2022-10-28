export class StorageUtils {
    static setItem(item: any) {
        localStorage.setItem('item-name', JSON.stringify(item));
    }

    static getItem(): any {
        const itemString = localStorage.getItem('item-name');
        if (itemString) {
            return JSON.parse(itemString);
        } else {
            return null;
        }
    }

    static removeItem() {
        localStorage.removeItem('item-name');
    }

    static setAuthToken(item: any) {
        localStorage.setItem('access_token', JSON.stringify(item));
    }

    static getAuthToken(): any {
        const itemString = localStorage.getItem('access_token');
        if (itemString) {
            return JSON.parse(itemString);
        } else {
            return null;
        }
    }

    static removeAuthToken() {
        localStorage.removeItem('access_token');
    }

    static setUser(item) {
        localStorage.setItem('user', JSON.stringify(item));
    }

    static getUser() {
        const itemString = localStorage.getItem('user');
        if (itemString) {
            return JSON.parse(itemString);
        } else {
            return null;
        }
    }

    static removeUser() {
        localStorage.removeItem('user');
    }

    static setEmployeeCompanyId(id) {
        localStorage.setItem('compagnyId', id);
    }

    static getEmployeeCompanyId() {
        return localStorage.getItem('compagnyId');
    }

    static setWilayas(Userwilayas) {
        localStorage.setItem('Userwilayas', JSON.stringify(Userwilayas));
    }

    static getEmployeeWilaya() {
        return JSON.parse(localStorage.getItem('Userwilayas'));
    }
    static setUserCommunes(UserCommunes) {
        localStorage.setItem('UserCommunes', JSON.stringify(UserCommunes));
    }
    static getEmployeeCommune() {
        return JSON.parse(localStorage.getItem('UserCommunes'));
    }

    static setMonthPay(monthPay) {
        localStorage.setItem('monthPay', JSON.stringify(monthPay));
    }

    static getMonthPay() {
        const itemString = localStorage.getItem('monthPay');
        if (itemString) {
            return JSON.parse(itemString);
        } else {
            return null;
        }
    }

    static setMonthYear(monthYear) {
        localStorage.setItem('monthYear', monthYear);
    }

    static getMonthYear() {
        return localStorage.getItem('monthYear');
    }

    static removeMonthYear() {
        localStorage.removeItem('monthYear');
    }
}
