package dtos;

import enums.UserRoleEnum;

public record UserDTO(String username, String email, String password, UserRoleEnum userRole) {
}
