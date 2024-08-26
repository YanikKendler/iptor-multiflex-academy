package dtos;

import enums.VideoRequestEnum;
import model.User;

public record VideoRequestDetailDTO(Long requestId, String title, String text, Long videoId, User user, VideoRequestEnum status) {
}
