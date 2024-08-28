package dtos;

import enums.ContentEditType;
import model.User;

import java.time.LocalDateTime;

public record ContentEditHistoryDTO(User user, ContentEditType type, LocalDateTime timestamp) {
}
