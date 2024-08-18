package dtos;

import enums.VisibilityEnum;
import model.Tag;

import java.util.List;

public record MyVideoContentDTO(Long contentId, String title, int views, double rating, VisibilityEnum visibility, int questionCount, List<Tag> tags, String color) {
}
