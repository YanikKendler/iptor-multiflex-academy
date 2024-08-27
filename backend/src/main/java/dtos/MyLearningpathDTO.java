package dtos;

import enums.VisibilityEnum;
import model.Tag;

import java.util.List;
import java.util.Set;

public record MyLearningpathDTO(
        Long contentId,
        String title,
        int views, // This will now accept a Long and convert it to int
        VisibilityEnum visibility,
        int videoCount,
        Set<Tag> tags,
        String color,
        boolean approved
) {
    public MyLearningpathDTO(Long contentId, String title, Long views, VisibilityEnum visibility, Integer videoCount, Set<Tag> tags, String color, boolean approved) {
        this(contentId, title, views.intValue(), visibility, videoCount, tags, color, approved);
    }
}