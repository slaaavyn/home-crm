import userRoles from "./constants/userRoles";


export function capitalize (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
}

export function roleFilter (role = '') {
    switch (role) {
        case userRoles.ROLE_ADMIN:
            return 'Administrator';
        case userRoles.ROLE_USER:
            return 'User';
        case userRoles.ROLE_DEVICE:
            return 'Device';
        default:
            return '';
    }
}