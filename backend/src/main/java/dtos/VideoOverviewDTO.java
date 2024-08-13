package dtos;

import model.Tag;
import model.ViewProgress;

import java.util.LinkedList;
import java.util.List;

public record VideoOverviewDTO(Long videoId, String title, String description, List<Tag> tags, String color, int durationSeconds, ViewProgress progress) {
    public VideoOverviewDTO {
        if (tags == null) {
            tags = new LinkedList<>();
        }
    }
}