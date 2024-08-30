package dtos;

import java.util.List;

public record UserTreeDTO(
        Long userId,
        String username,
        int level,
        List<UserTreeDTO> subordinates
) { }
