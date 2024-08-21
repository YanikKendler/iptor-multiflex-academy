package dtos;

import enums.UserEnum;

public record UserDTO(String username, String email, String password, UserEnum userType) {
}
