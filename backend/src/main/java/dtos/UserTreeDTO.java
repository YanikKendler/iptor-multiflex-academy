package dtos;

import enums.UserRoleEnum;

import java.util.List;

public record UserTreeDTO(
        Long userId,
        String username,
        String email,
        UserRoleEnum role,
        int level,
        List<UserTreeDTO> subordinates
) { }
