class UserRoleDTO {
    constructor(role, user) {
        this.id = role._id;
        this.user_id = user.id;
        this.role_id = role.id;
        
    }
}


module.exports = UserRoleDTO;