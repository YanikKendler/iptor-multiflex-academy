package dtos;

import enums.VisibilityEnum;
import model.Tag;

import java.util.List;
import java.util.Set;

public record MyVideoDTO(Long contentId, String title, int views, double rating, VisibilityEnum visibility, int questionCount, Set<Tag> tags, String color) {
}
